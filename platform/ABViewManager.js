import ABView from "./views/ABView.js";
import ABViewPage from "./views/ABViewPage.js";
import ABClassManager from "./ABClassManager.js";

/**
 * Server-side view manager: plugin views via ClassManager, built-ins as fallback.
 */
export default class ABViewManager {
   static allViews(fn = () => true, platform = "web") {
      const pluginViews = ABClassManager.viewAll(platform);
      const builtins = [ABView, ABViewPage];
      return [...builtins, ...pluginViews].filter(fn);
   }

   static newView(values, application, parent) {
      parent = parent || null;

      const platform = application?.appType || "web";
      const key = values?.plugin_key || values?.key;

      try {
         return ABClassManager.viewCreate(
            platform,
            key,
            values,
            application,
            parent,
         );
      } catch {
         if (key === "page") {
            return new ABViewPage(values, application, parent);
         }
         return new ABView(values, application, parent);
      }
   }

   static viewClass(key, platform = "web") {
      try {
         return ABClassManager.viewClass(platform, key);
      } catch {
         if (key === "page") return ABViewPage;
         if (key === "view") return ABView;
         console.error(`Unknown View Key[${key}]`);
         return null;
      }
   }
}
