import TLReportsEmailCore from "../../../core/process/tasks/ABProcessTaskServiceTLReportsEmailCore.js";

export default class TLReportsEmail extends TLReportsEmailCore {
   ////
   //// Process Instance Methods
   ////

   /**
    * do()
    * this method actually performs the action for this task.
    * Find the fiscal period's name ("FY Per", ex "FY25 M06") and hand the
    * work to custom_reports, the same way the Email task hands its work to
    * notification_email. custom_reports answers right away and sends the
    * emails in the background.
    * @param {obj} instance  the instance data of the running process
    * @param {Knex.Transaction?} trx - [optional]
    * @param {ABUtil.reqService} req
    *        an instance of the current request object for performing tenant
    *        based operations.
    * @return {Promise}
    *      resolve(true/false) : true if the task is completed.
    *                            false if task is still waiting
    */
   async do(instance, trx, req) {
      try {
         const values = this.hashProcessDataValues(instance);
         const fpID = values[this.processFPValue];
         if (!fpID) {
            throw new Error(
               "TLReportsEmail.do(): unable to find relevant Fiscal Period ID",
            );
         }

         const fpObject = this.AB.objectByID(this.objectFP);
         if (!fpObject) {
            throw new Error("TLReportsEmail.do(): no Fiscal Period object");
         }

         const rows = await req.retry(() =>
            fpObject.model().find({
               where: { [fpObject.PK()]: fpID },
               populate: false,
            }),
         );
         const fyPeriod = rows?.[0]?.["FY Per"];
         if (!fyPeriod) {
            throw new Error(
               `TLReportsEmail.do(): no "FY Per" for Fiscal Period [${fpID}]`,
            );
         }

         const jobData = { fyPeriod };
         if (this.sendTo) jobData.sendTo = this.sendTo;
         if (this.from) jobData.from = this.from;

         const result = await new Promise((resolve, reject) => {
            req.serviceRequest(
               "custom_reports.tl-reports-email-all",
               jobData,
               // custom_reports loads every Team Leader before it replies
               { longRequest: true },
               (err, results) => (err ? reject(err) : resolve(results)),
            );
         });

         this.log(
            instance,
            `Sending ${fyPeriod} reports to ${result?.teamLeaders ?? "?"} Team Leaders`,
         );
         this.stateCompleted(instance);
         return true;
      } catch (err) {
         this.log(instance, `Error TL Reports Email: ${err?.message ?? err}`);
         this.onError(instance, err);
         throw err;
      }
   }
}
