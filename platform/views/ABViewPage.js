// prettier-ignore
import ABViewPageCore from "../../core/views/ABViewPageCore.js";
// prettier-ignore
// import ABMLClass from "../ABMLClass.js";
// import ABView from "./ABView.js";

/**
 * ABViewPage (service / MCP)
 *
 * Minimal server-side parity with {@link ABViewPageCore}: child pages, `pageInsert` /
 * `pageRemove`, and `save()` wiring so root and nested pages persist on the parent.
 */
export default class ABViewPage extends ABViewPageCore {
   // constructor(attributes, application, parent) {
   //    super(attributes, application, parent);
   // }

   /**
    * @method pages()
    */
   /*
   pages(filter = () => true, deep = false) {
      const list = this._pages || [];
      if (filter && deep) {
         let result = list.filter(filter);
         if (result.length < 1) {
            for (const p of list) {
               const subPages = p.pages ? p.pages(filter, true) : [];
               if (subPages && subPages.length > 0) {
                  result = subPages;
               }
            }
         }
         return result;
      }
      return list.filter(filter);
   }
   */

   /**
    * @method pageNew()
    * @return {ABViewPage}
    */
   // pageNew(values) {
   //    values = { ...values };
   //    values.key = "page";
   //    const page = this.application.viewNew(values, null);
   //    page.parent = this;
   //    return page;
   // }

   /**
    * @method pageInsert()
    * @param {ABViewPage} page
    * @return {Promise}
    */
   // pageInsert(page) {
   //    this._pages = this._pages || [];
   //    const isIncluded = this.pages((p) => p.id === page.id).length > 0;
   //    if (!isIncluded) {
   //       this._pages.push(page);
   //       return this.save();
   //    }
   //    return Promise.resolve();
   // }

   /**
    * @method pageRemove()
    * @param {ABViewPage} page
    * @return {Promise}
    */
   // pageRemove(page) {
   //    const origLen = (this._pages || []).length;
   //    this._pages = this.pages(function (p) {
   //       return p.id != page.id;
   //    });
   //    if (this._pages.length < origLen) {
   //       return this.save();
   //    }
   //    return Promise.resolve();
   // }

   /**
    * @method save()
    */
   // save() {
   //    return Promise.resolve()
   //       .then(() => {
   //          return super.save();
   //       })
   //       .then(() => {
   //          const parent = this.parent || this.application;
   //          return parent.pageInsert(this);
   //       })
   //       .then(() => {
   //          return this;
   //       });
   // }

   /**
    * @method destroy()
    */
   // destroy() {
   //    this.eventClear(true);

   //    return Promise.resolve()
   //       .then(() => {
   //          const allPageDeletes = [];
   //          const allPages = this.pages();
   //          this._pages = [];
   //          allPages.forEach((p) => {
   //             allPageDeletes.push(p.destroy());
   //          });
   //          return Promise.all(allPageDeletes);
   //       })
   //       .then(() => {
   //          const parent = this.parent || this.application;
   //          return parent.pageRemove(this);
   //       })
   //       .then(() => {
   //          const allViewDeletes = [];
   //          const allViews = ABViewCore.prototype.views.call(this, () => true, false);
   //          this._views = [];
   //          allViews.forEach((v) => {
   //             allViewDeletes.push(v.destroy());
   //          });
   //          return Promise.all(allViewDeletes);
   //       })
   //       .then(() => {
   //          return ABMLClass.prototype.destroy.call(this);
   //       })
   //       .then(() => {
   //          this.emit("destroyed");
   //       });
   // }
}
