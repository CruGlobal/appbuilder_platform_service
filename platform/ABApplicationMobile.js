import ABApplicationMobileCore from "../core/ABApplicationMobileCore.js";
import ABViewPageMobile from "./mobile/ABMobilePage.js";
// import ABViewManager from "./ABViewManager.js";

export default class ABClassApplicationMobile extends ABApplicationMobileCore {
   constructor(attributes, AB) {
      super(attributes, AB);
   }

   ///
   /// Definition
   ///

   /**
    * @method pageNew()
    * return a new instance of an ABViewPageMobile
    * @param values
    *        The initial settings for the page.
    * @return {ABViewPageMobile}
    */
   pageNew(values) {
      return new ABViewPageMobile(values, this);
   }
}
