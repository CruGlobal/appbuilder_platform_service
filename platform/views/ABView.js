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
}
