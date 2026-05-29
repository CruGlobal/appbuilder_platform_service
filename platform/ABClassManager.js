import ABObjectPlugin from "./plugins/ABObjectPlugin.js";
import ABModelPlugin from "./plugins/ABModelPlugin.js";
import * as webStubs from "./plugins/stubs/web/index.js";
const viewStubSets = {
   web: webStubs,
};

const classRegistry = {
   ObjectTypes: new Map(),
   ObjectPropertiesTypes: new Map(),
   FieldTypes: new Map(),
   // platform -> Map(pluginKey -> ViewClass)
   ViewTypes: new Map(),
   ViewPropertiesTypes: new Map(),
   ViewEditorTypes: new Map(),
};

function registerObjectTypes(name, ctor) {
   classRegistry.ObjectTypes.set(name, ctor);
}

function registerObjectPropertiesTypes(name, ctor) {
   classRegistry.ObjectPropertiesTypes.set(name, ctor);
}

function registerViewType(platform, key, ctor) {
   if (!classRegistry.ViewTypes.has(platform)) {
      classRegistry.ViewTypes.set(platform, new Map());
   }
   classRegistry.ViewTypes.get(platform).set(key, ctor);
}

function registerViewPropertiesTypes(name, ctor) {
   classRegistry.ViewPropertiesTypes.set(name, ctor);
}

function registerViewEditorTypes(name, ctor) {
   classRegistry.ViewEditorTypes.set(name, ctor);
}

/**
 * @method getPluginAPI(platform)
 * Stubs and bases provided to plugin factory functions.
 * @param {string} platform  e.g. "web", "pwa"
 * @returns {Object}
 */
function getPluginAPI(platform = "web") {
   const base = {
      ABObjectPlugin,
      ABModelPlugin,
   };
   const stubs = viewStubSets[platform];
   if (!stubs) {
      // service and other non-view platforms (object plugins only)
      return base;
   }
   return {
      ABUIPlugin: stubs.ABUIPlugin,
      ABViewPlugin: stubs.ABViewPlugin,
      ABViewComponentPlugin: stubs.ABViewComponentPlugin,
      ...base,
   };
}

function createObject(key, config, AB) {
   const ObjectClass = classRegistry.ObjectTypes.get(key);
   if (!ObjectClass) throw new Error(`Unknown object type: ${key}`);
   return new ObjectClass(config, AB);
}

function createPropertiesObject(key, config, AB) {
   const ObjectClass = classRegistry.ObjectPropertiesTypes.get(key);
   if (!ObjectClass) throw new Error(`Unknown object type: ${key}`);
   return new ObjectClass(config, AB);
}

function allObjectProperties() {
   return Array.from(classRegistry.ObjectPropertiesTypes.values());
}

function viewClass(platform, key) {
   const ViewClass = classRegistry.ViewTypes.get(platform)?.get(key);
   if (!ViewClass) {
      throw new Error(`Unknown View type: ${key} for platform: ${platform}`);
   }
   return ViewClass;
}

function viewCreate(platform, key, config, application, parent) {
   const ViewClass = classRegistry.ViewTypes.get(platform)?.get(key);
   if (!ViewClass) {
      throw new Error(`Unknown View type: ${key} for platform: ${platform}`);
   }
   return new ViewClass(config, application, parent);
}

function viewAll(platform, fn = () => true) {
   const byPlatform = classRegistry.ViewTypes.get(platform);
   if (!byPlatform) return [];
   return Array.from(byPlatform.values()).filter(fn);
}

function viewKeys(platform) {
   const byPlatform = classRegistry.ViewTypes.get(platform);
   if (!byPlatform) return [];
   return [...byPlatform.keys()];
}

function viewPropertiesAll(fn = () => true) {
   return Array.from(classRegistry.ViewPropertiesTypes.values()).filter(fn);
}

function viewEditorCreate(key, view, base, ids) {
   const EditorClass = classRegistry.ViewEditorTypes.get(key);
   if (!EditorClass) throw new Error(`Unknown View Editor type: ${key}`);
   return new EditorClass(view, base, ids);
}

function viewEditorAll(fn = () => true) {
   return Array.from(classRegistry.ViewEditorTypes.values()).filter(fn);
}

function pluginRegister(pluginClass, platform = "web") {
   let type = pluginClass.getPluginType();
   const pluginPlatform =
      platform || pluginClass.getPluginPlatform?.() || "web";

   switch (type) {
      case "object":
         registerObjectTypes(pluginClass.getPluginKey(), pluginClass);
         break;
      case "properties-object":
         registerObjectPropertiesTypes(pluginClass.getPluginKey(), pluginClass);
         break;
      case "view":
         registerViewType(
            pluginPlatform,
            pluginClass.getPluginKey(),
            pluginClass,
         );
         break;
      case "properties-view":
         registerViewPropertiesTypes(pluginClass.getPluginKey(), pluginClass);
         break;
      case "editor-view":
         registerViewEditorTypes(pluginClass.getPluginKey(), pluginClass);
         break;
      default:
         throw new Error(
            `ABClassManager.pluginRegister():: Unknown plugin type: ${type}`,
         );
   }
}

let devPlugins = [];

function registerLocalPlugins(API) {
   devPlugins.forEach((p) => {
      let pluginClass = p(API);
      pluginRegister(pluginClass, API.platform ?? "web");
   });
}

export default {
   getPluginAPI,
   createObject,
   createPropertiesObject,
   allObjectProperties,
   viewClass,
   viewCreate,
   viewAll,
   viewKeys,
   viewPropertiesAll,
   viewEditorCreate,
   viewEditorAll,
   registerLocalPlugins,
   pluginRegister,
};
