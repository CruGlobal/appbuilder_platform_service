import ClassUI from "../../plugins/stubs/web/ClassUI.js";

/**
 * Minimal ABViewComponent for server-side view plugin components (no webix).
 */
export default class ABViewComponent extends ClassUI {
   constructor(baseView, idBase, ids) {
      super(idBase || `ABView_${baseView?.id}`, ids);

      this.view = baseView;
      this.settings = baseView?.settings;
      this.AB = baseView?.AB ?? baseView?.application?.AB;

      this.CurrentObjectID = null;
      this.CurrentDatacollectionID = null;
   }

   get CurrentObject() {
      return this.AB?.objectByID(this.CurrentObjectID);
   }

   get CurrentDatacollection() {
      return this.AB?.datacollectionByID(this.CurrentDatacollectionID);
   }

   ui(uiComponents = []) {
      return {
         id: this.ids.component,
         rows: uiComponents,
      };
   }

   async init() {
      return;
   }

   onShow() {}

   onHide() {}

   detatch() {}
}
