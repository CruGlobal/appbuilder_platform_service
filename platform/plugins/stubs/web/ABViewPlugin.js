import ABView from "../../../views/ABView.js";

export default class ABViewPlugin extends ABView {
   constructor(...params) {
      super(...params);
   }

   static getPluginKey() {
      console.error("ABViewPlugin.getPluginKey() not overwritten!");
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
