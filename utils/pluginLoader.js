import https from "http";
import vm from "vm";
import { createRequire } from "module";

const nodeRequire = createRequire(import.meta.url);

/**
 * Webpack ESM output uses import.meta and export syntax that vm.Script cannot parse.
 * Rewrite to classic script assignments for the existing vm sandbox loader.
 * @param {string} source
 * @param {string} url
 * @return {string}
 */
function preparePluginSourceForVm(source, url) {
   let s = source;
   s = s.replace(/\/\/# sourceMappingURL=.*$/gm, "");
   s = s.replace(/import\.meta\.url/g, JSON.stringify(url));
   s = s.replace(/import\.meta/g, `({url:${JSON.stringify(url)}})`);
   s = s.replace(
      /export\s*\{\s*(\w+)\s+as\s+default\s*\}\s*;?/g,
      "module.exports.default=$1;",
   );
   return s;
}

/** Minimal DOM stubs so browser-targeted plugin bundles can register in Node vm. */
function createBrowserVmGlobals(nodeRequire) {
   const document = {
      createElement: () => ({
         style: {},
         appendChild: () => {},
         setAttribute: () => {},
      }),
      createElementNS: () => ({
         style: {},
         appendChild: () => {},
      }),
      head: { appendChild: () => {} },
      body: { appendChild: () => {} },
      documentElement: { style: {} },
   };
   const window = { document, require: nodeRequire };
   return { document, window };
}

/**
 * Load a plugin module from a URL into a vm sandbox.
 * @param {string} url
 * @return {Promise<function|object>}
 */
export function requireFromURL(url) {
   return new Promise((resolve, reject) => {
      https.get(url, (res) => {
         let data = "";
         res.on("data", (chunk) => {
            data += chunk;
         });
         res.on("end", () => {
            const vmSource = preparePluginSourceForVm(data, url);
            try {
               const script = new vm.Script(vmSource);
               const exports = {};
               const module = { exports };
               const browserGlobals = createBrowserVmGlobals(nodeRequire);
               const context = vm.createContext({
                  Buffer,
                  console,
                  exports,
                  global: { require: nodeRequire, ...browserGlobals },
                  module,
                  process,
                  require: nodeRequire,
                  setTimeout,
                  clearTimeout,
                  setInterval,
                  clearInterval,
                  fetch,
                  https,
                  URL,
                  ...browserGlobals,
               });
               script.runInContext(context);

               resolve(
                  module.exports.Plugin ||
                     module.exports.default ||
                     module.exports,
               );
            } catch (error) {
               console.error(data);
               reject(error);
            }
         });
         res.on("error", (error) => {
            reject(error);
         });
      });
   });
}

/**
 * @param {{ url: string }} link
 * @param {ABFactory} factory
 */
export async function loadPluginFromURL(link, factory) {
   const plgn = await requireFromURL(link.url);
   factory.pluginRegister(plgn);
}
