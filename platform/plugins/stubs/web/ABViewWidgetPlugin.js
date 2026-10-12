import ABViewWidget from "../../../views/ABViewWidget.js";

/**
 * Base class web view plugins extend when they expect ABViewWidgetPlugin
 * on the plugin API. Matches the web platform ClassManager contract.
 */
export default class ABViewWidgetPlugin extends ABViewWidget {
   constructor(...params) {
      super(...params);
   }

   static getPluginKey() {
      return "ab-view-plugin";
   }

   static getPluginType() {
      return "view";
   }

   static getPluginPlatform() {
      return "web";
   }

   toObj() {
      const result = super.toObj();
      result.plugin_key = this.constructor.getPluginKey();
      return result;
   }

   static newInstance(application, parent) {
      return application.viewNew(
         { key: this.common().key, plugin_key: this.getPluginKey() },
         parent,
      );
   }
}
