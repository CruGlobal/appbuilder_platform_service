import assert from "assert";
import sinon from "sinon";
import hash from "object-hash";
import convert from "xml-js";
import ABProcess from "../../platform/ABProcess.js";

// ABProcess is an ES module, so its imports (object-hash, xml-js) can not be
// swapped out. The tests use the real libraries and stub only the models.

const xmlDefinition = "<test>test</test>";
const parsedDefinition = convert.xml2js(xmlDefinition, { compact: true });
const defHash = hash(parsedDefinition);

const definitionRecord = {
   uuid: "uuid",
   hash: defHash,
   definition: parsedDefinition,
};

describe("ABProcess", function () {
   let defModel, instanceModel, mockAB, process, req;

   beforeEach(function () {
      defModel = { find: sinon.stub(), create: sinon.stub() };
      instanceModel = {
         create: sinon.stub(),
         update: sinon.stub().resolves({}),
      };
      mockAB = {
         objectProcessDefinition: () => ({ model: () => defModel }),
         objectProcessInstance: () => ({ model: () => instanceModel }),
         notify: { developer: sinon.fake() },
      };
      req = {
         jobID: "jobID",
         username: () => "tester",
         userDefaults: () => ({}),
         retry: (fn) => fn(),
      };
      process = new ABProcess({ id: "processID" }, mockAB);
      process.xmlDefinition = xmlDefinition;
   });

   afterEach(function () {
      sinon.restore();
   });

   describe("instanceDefinition", function () {
      it("returns the saved definition when one has the same hash", async function () {
         defModel.find.resolves([definitionRecord]);

         const result = await process.instanceDefinition(req);

         assert(defModel.find.calledOnce);
         assert.deepEqual(defModel.find.firstCall.args, [
            { hash: defHash },
            req,
         ]);
         assert(defModel.create.notCalled);
         assert.deepEqual(result, definitionRecord);
      });

      it("saves a new definition when none has the same hash", async function () {
         defModel.find.resolves([]);
         defModel.create.resolves(definitionRecord);

         const result = await process.instanceDefinition(req);

         assert(defModel.create.calledOnce);
         assert.deepEqual(defModel.create.firstCall.firstArg, {
            hash: defHash,
            definition: parsedDefinition,
         });
         assert.deepEqual(result, definitionRecord);
      });

      it("looks again when a parallel call saved it first (ER_DUP_ENTRY)", async function () {
         defModel.find.onFirstCall().resolves([]);
         defModel.find.onSecondCall().resolves([definitionRecord]);
         defModel.create.rejects(new Error("ER_DUP_ENTRY: Duplicate entry"));

         const result = await process.instanceDefinition(req);

         assert(defModel.find.calledTwice);
         assert.deepEqual(result, definitionRecord);
         assert(mockAB.notify.developer.notCalled);
      });

      it("reports and throws other errors", async function () {
         const error = new Error("database down");
         defModel.find.rejects(error);

         await assert.rejects(process.instanceDefinition(req), error);
         assert(mockAB.notify.developer.calledOnce);
      });
   });

   describe("instanceNew", function () {
      it("saves a new instance that points to the definition, then runs it", async function () {
         const newInstance = { id: 1, status: "created" };
         defModel.find.resolves([definitionRecord]);
         instanceModel.create.resolves(newInstance);
         const run = sinon.stub(process, "run").resolves("ran");

         const result = await process.instanceNew(
            { input: "data" },
            null,
            null,
            req,
            "instanceKey",
         );

         assert(instanceModel.create.calledOnce);
         const values = instanceModel.create.firstCall.firstArg;
         assert.equal(values.processID, "processID");
         assert.equal(values.definition, "uuid");
         assert.equal(values.instanceKey, "instanceKey");
         assert.equal(values.triggeredBy, "tester");
         assert(run.calledOnce);
         assert.equal(run.firstCall.args[0], newInstance);
         assert.deepEqual(newInstance.jsonDefinition, definitionRecord);
         assert.equal(result, "ran");
      });
   });

   describe("run", function () {
      let instanceClose;
      beforeEach(function () {
         instanceClose = sinon.stub(process, "instanceClose").resolves();
      });

      it("loads a missing jsonDefinition", async function () {
         defModel.find.resolves([definitionRecord]);
         const instance = {
            definition: "uuid",
            status: "created",
            context: { startTaskID: "start" },
         };

         await process.run(instance, null, req);

         assert(defModel.find.calledOnce);
         assert.deepEqual(defModel.find.firstCall.args, [
            { uuid: "uuid" },
            req,
         ]);
         assert.deepEqual(instance.jsonDefinition, definitionRecord);
      });

      it("does not load the definition when the instance has it", async function () {
         const instance = {
            definition: "uuid",
            status: "created",
            context: { startTaskID: "start" },
            jsonDefinition: definitionRecord,
         };

         await process.run(instance, null, req);

         assert(defModel.find.notCalled);
      });

      it("closes an instance with no pending tasks", async function () {
         const instance = {
            definition: "uuid",
            status: "created",
            context: { startTaskID: "start" },
            jsonDefinition: definitionRecord,
         };

         await process.run(instance, null, req);

         assert(instanceClose.calledOnce);
      });

      it("does nothing for a completed instance", async function () {
         const instance = { definition: "uuid", status: "completed" };

         await process.run(instance, null, req);

         assert(defModel.find.notCalled);
         assert(instanceClose.notCalled);
      });
   });
});
