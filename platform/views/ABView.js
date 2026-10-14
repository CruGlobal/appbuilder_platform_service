// import path from "path";

// prettier-ignore
import ABViewCore from "../../core/views/ABViewCore.js";

export default class ABView extends ABViewCore {
   // constructor(attributes, application, parent) {
   //    super(attributes, application, parent);
   //    this.fromValues(attributes);
   // }
   /**
    * @method fromValues()
    *
    * initialze this object with the given set of values.
    * @param {obj} values
    */
   // fromValues(values) {
   //    super.fromValues(values);
   //    // now properly handle our sub pages.
   //    let pages = [];
   //    (values.pages || []).forEach((child) => {
   //       pages.push(this.viewNew(child));
   //    });
   //    this._pages = pages;
   // }
   /**
    * @method toObj()
    *
    * properly compile the current state of this ABView instance
    * into the values needed for saving to the DB.
    *
    * @return {json}
    */
   // toObj() {
   //    let result = super.toObj();
   //    // Root / nested pages persist as `pageIDs` on page definitions (matches ABViewPageCore).
   //    if (this.key === "page" && this._pages && this._pages.length) {
   //       result.pageIDs = this._pages.map((p) => p.id).filter((id) => id);
   //    }
   //    delete result.pages;
   //    return result;
   // }
   /**
    * @method viewNew()
    *
    *
    * @return {ABView}
    */
   // viewNew(values) {
   //    return new ABView(values, this.application, this);
   // }

   /**
    * @method componentList
    * return the list of components available on this view to display in the editor.
    * Mirrors ab_platform_web ABView.componentList so MCP tools can validate children.
    * @param {bool} [_isEdited]  unused; kept for designer API parity
    * @return {array} of ABView classes
    */
   componentList(_isEdited) {
      // views not allowed to drop onto this View:
      const viewsToIgnore = [
         "view",
         "page",
         "formpanel",
         "viewcontainer",
         "viewwidget",
         // not allowed Detail's widgets
         "detailcheckbox",
         "detailcustom",
         "detailconnect",
         "detailimage",
         "detailselectivity",
         "detailtext",
         "detailtree",
         // not allowed Form's widgets
         "button",
         "checkbox",
         "connect",
         "datepicker",
         "fieldcustom",
         "textbox",
         "numberbox",
         "selectsingle",
         "selectmultiple",
         "formtree",
         "fieldreadonly",
         "json",
         // not allowed Chart's Widgets
         "pie",
         "bar",
         "line",
         "area",
         // not allowed Report page
         "report",
         "reportPage",
         "reportPanel",
      ];

      const allComponents = this.application.viewAll();
      return allComponents.filter((c) => {
         const key = c.common?.()?.key;
         return key && viewsToIgnore.indexOf(key) === -1;
      });
   }
}
