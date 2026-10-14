import ClassUI from "./ClassUI.js";

export default class ABUIPlugin extends ClassUI {
   constructor(...params) {
      super(...params);

      this.AB = this.AB ?? null;
      this.CurrentApplicationID = null;
      this.CurrentDatacollectionID = null;
      this.CurrentObjectID = null;
      this.CurrentProcessID = null;
      this.CurrentQueryID = null;
      this.CurrentViewID = null;
      this.CurrentVersionID = null;
   }

   static getPluginKey() {
      return "ab-ui-plugin";
   }

   L() {
      const _self = this;
      return function (...params) {
         return (
            _self.AB?.Multilingual?.labelPlugin?.(
               _self.constructor.getPluginKey(),
               ...params,
            ) ?? params[0]
         );
      };
   }

   async init(AB) {
      this.AB = AB;
   }

   applicationLoad(app) {
      this.CurrentApplicationID = app?.id;
   }

   datacollectionLoad(dc) {
      this.CurrentDatacollectionID = dc?.id;
   }

   objectLoad(obj) {
      this.CurrentObjectID = obj?.id;
   }

   processLoad(process) {
      this.CurrentProcessID = process?.id;
   }

   queryLoad(query) {
      this.CurrentQueryID = query?.id;
   }

   versionLoad(version) {
      this.CurrentVersionID = version?.id;
   }

   viewLoad(view) {
      this.CurrentViewID = view?.id;
      if (view?.application) {
         this.applicationLoad(view.application);
      }
   }

   get CurrentApplication() {
      return this.AB?.applicationByID(this.CurrentApplicationID);
   }

   get CurrentDatacollection() {
      return this.AB?.datacollectionByID(this.CurrentDatacollectionID);
   }

   get CurrentObject() {
      let obj = this.AB?.objectByID(this.CurrentObjectID);
      if (!obj) {
         obj = this.AB?.queryByID(this.CurrentObjectID);
      }
      return obj;
   }

   get CurrentProcess() {
      return this.AB?.processByID(this.CurrentProcessID);
   }

   get CurrentQuery() {
      return this.AB?.queryByID(this.CurrentQueryID);
   }

   get CurrentView() {
      return this.CurrentApplication?.views(
         (v) => v.id == this.CurrentViewID,
      )[0];
   }

   datacollectionsIncluded() {
      return [];
   }

   uniqueIDs() {}

   warningsRefresh() {
      this.emit("warnings");
   }

   warningsPropogate() {}
}
