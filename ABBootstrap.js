import queryAllDefinitions from "./queries/allDefinitions.js";
import Create from "./queries/definitionCreate.js";
import Destroy from "./queries/definitionDestroy.js";
import Find from "./queries/definitionFind.js";
import Update from "./queries/definitionUpdate.js";
import ABFactory from "./ABFactory.js";

/*
 * ABBootstrap
 * This object manages preparing an ABFactory for a Specific Tenant.
 */

var Factories = {
   /* tenantID : { ABFactory }} */
};
// {hash}
// Sort out all known tenant aware factories by tenantID.

var DefinitionManager = {
   Create,
   Destroy,
   Find,
   Update,
};

var Listener = null;
// {abServiceSubscriber}
// A Subscriber for the definition.* published messages.

/**
 * @function staleHandler()
 * handles resetting the ABFactory for the Tenant that just had their
 * definitions updated.
 * Definitions will be reloaded the next time a relevant request needs
 * that tenant's data.
 */
function staleHandler(req) {
   var tenantID = req.tenantID();
   Factories[tenantID]?.emit("bootstrap.stale.reset");

   const knexConn = Factories[tenantID]?.Knex.connection();
   if (knexConn) KnexPool[tenantID] = knexConn;

   delete Factories[tenantID];
   req.log(`:: Definitions reset for tenant[${tenantID}]`);
}

var PendingFactory = {
   /* tenantID : Promise */
};
// {hash}
// A lookup of Pending Factory builds.  This prevents the SAME factory from
// being built at the same time.

var KnexPool = {
   /* tenantID : AB.Knex.connection() */
};

async function setupFactory(req, tenantID, platformDefinitionMgr = null) {
   let defs = await queryAllDefinitions(req);
   if (defs && Array.isArray(defs) && defs.length) {
      var hashDefs = {};
      defs.forEach((d) => {
         hashDefs[d.id] = d;
      });

      req.log(`Tenant[${tenantID}] Knex pool exists: ${!!KnexPool[tenantID]}`);

      var newFactory = new ABFactory(
         hashDefs,
         platformDefinitionMgr || DefinitionManager,
         req.toABFactoryReq(),
         KnexPool[tenantID],
      );

      newFactory.id = tenantID;

      // Reload our ABFactory whenever we detect any changes in
      // our definitions.  This should result in correct operation
      // even though changing definitions become an "expensive"
      // operation. (but only for designers)
      var resetOnEvents = [
         "definition.created",
         "definition.destroyed",
         "definition.updated",
      ];
      resetOnEvents.forEach((event) => {
         newFactory.on(event, () => {
            Factories[tenantID]?.emit("bootstrap.stale.reset");

            const knexConn = Factories[tenantID]?.Knex.connection();
            if (knexConn) KnexPool[tenantID] = knexConn;

            delete Factories[tenantID];
         });
      });

      await newFactory.importPlugins(newFactory.platform);

      await newFactory.init();

      Factories[tenantID] = newFactory;
      delete PendingFactory[tenantID];
      return;
   }
   // if we get here, we had no definitions for this tenant
   let errorNoDefinitions = new Error(
      `No Definitions returned for tenant[${tenantID}]`,
   );
   req.notify.developer(errorNoDefinitions, {
      context: "ABBootstrap.queryAllDefinitions()",
      tenantID,
   });
   throw errorNoDefinitions;
}

export default {
   init: async (req, platformDefinitionMgr = null) => {
      var tenantID = req.tenantID();
      if (!tenantID) {
         var errorNoTenantID = new Error(
            "ABBootstrap.init(): could not resolve tenantID for request",
         );
         throw errorNoTenantID;
      }

      if (typeof Factories[tenantID] == "undefined") {
         req.log(`:: Loading Definitions for tenant[${tenantID}]`);
         if (!PendingFactory[tenantID]) {
            PendingFactory[tenantID] = new Promise((resolve, reject) => {
               setupFactory(req, tenantID, platformDefinitionMgr)
                  .then(resolve)
                  .catch(reject);
            });
         }

         await PendingFactory[tenantID];
      }

      // initialize Listener if not initialized
      if (!Listener) {
         // record our stale handler
         Listener = req.serviceSubscribe("definition.stale", staleHandler);

         // attach staleHandler() to our other Events:
         [
            "definition.created",
            "definition.destroyed",
            "definition.updated",
         ].forEach((e) => {
            req.serviceSubscribe(e, staleHandler);
         });
      }

      // return the ABFactory for this tenantID
      return Factories[tenantID];
   },
   resetDefinitions: (req) => {
      staleHandler(req);
   },
};
