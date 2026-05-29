/**
 * Emitter + ML class stack (no object/field types) so core modules like
 * `ABFieldCore.js` can extend `ABMLClass` without importing `appBuilderPlatform.d.ts`.
 */
import type ABDefinition from "../platform/ABDefinition.js";
import { EventEmitter } from "events";

/** @see AppBuilder/platform/ABEmitter.js */
export declare class ABEmitter extends EventEmitter {
  constructor();
}

/** @see AppBuilder/core/ABMLClassCore.js */
export declare class ABMLClassCore extends ABEmitter {
  mlFields: string[];
  AB: unknown;
  translations?: unknown;
  id?: string;
  name?: string;
  type?: string;
  constructor(fieldList?: string | string[], AB?: unknown);
  fromValues(attributes: Record<string, unknown>): void;
  toDefinition(): ABDefinition;
}

/** @see AppBuilder/platform/ABMLClass.js */
export declare class ABMLClass extends ABMLClassCore {
  constructor(fieldList?: string | string[], AB?: unknown);
  save(): Promise<unknown>;
  destroy(): Promise<unknown>;
}
