/**
 * TypeScript sidecar for `./ABObject.js`: anything that imports this module path gets
 * the same types as `AppBuilder/types/appBuilderPlatform.d.ts` (emitter → ML class →
 * object core → ABClassObject, ABFactory, etc.).
 */
export type * from "../types/appBuilderPlatform.js";
