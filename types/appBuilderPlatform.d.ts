/**
 * Type declarations for the AppBuilder object stack (`ABObject.js` → `ABObjectCore` →
 * `ABMLClass` → `ABMLClassCore` → `ABEmitter`) plus {@link ABFactory} / {@link ABDefinition}
 * shapes used by the MCP server (`src/services/appBuilderService.ts`).
 *
 * Runtime implementations live under `AppBuilder/` (see each `@see` tag).
 */
import type ABDefinition from "../platform/ABDefinition.js";
import type { ABDatacollectionLike } from "./datacollectionDefinition.js";
import type {
  ABFieldInstance,
  ABModelLike,
  ABObjectLike,
  ABRole,
  ABSystemTableObject,
} from "./objectDefinition.js";
import { ABMLClass } from "./abPlatformStack.js";

export { ABEmitter, ABMLClassCore, ABMLClass } from "./abPlatformStack.js";
export type {
  ABConditionFilter,
  ABConditionRuleGroup,
  ABConditionRuleLeaf,
} from "./filterConditions.js";
export type {
  ABDatacollection,
  ABDatacollectionSettings,
  ABDataCollection,
  ABDataCollectionCore,
  DatacollectionListItem,
  ABDatacollectionLike,
} from "./datacollectionDefinition.js";
export type { ABViewToObj, ABViewPageToObj, ViewListItem } from "./viewDefinition.js";
export type {
  ABFieldClass,
  ABFieldDefaults,
  default as ABFieldManager,
} from "./ABFieldManager.js";
export type {
  ABViewClass,
  default as ABViewManagerCore,
} from "./ABViewManagerCore.js";
export type {
  default as ABViewManager,
} from "./ABViewManager.js";
export type {
  default as ABViewManagerMobileCore,
} from "./ABViewManagerMobileCore.js";
export type {
  default as ABViewManagerMobile,
} from "./ABViewManagerMobile.js";
export type {
  ABFieldInstance,
  ABModelFindCondition,
  ABModelLike,
  ABModelRowValues,
  ABObjectLike,
  ABRole,
  ABSystemTableObject,
} from "./objectDefinition.js";

/** @see AppBuilder/core/ABObjectCore.js */
export declare class ABObjectCore extends ABMLClass implements ABObjectLike {
  constructor(attributes?: Record<string, unknown>, AB?: unknown);
  id: string;
  name?: string;
  label?: string;
  tableName?: string;
  connName?: string;
  primaryColumnName?: string;
  isImported?: number;
  isExternal?: number;
  createdInAppID?: string;
  isSystemObject?: boolean | string;
  objectWorkspace: Record<string, unknown>;
  importedFieldIDs?: string[];
  fromValues(attributes: Record<string, unknown>): void;
  toObj(): object;
  PK(): string;
  model(): ABModelLike;
  fields(filter?: (f: ABFieldInstance | null | undefined) => boolean): ABFieldInstance[];
  fieldByID(id: string): ABFieldInstance | undefined;
  fieldNew(values: unknown): ABFieldInstance;
  fieldAdd(field: ABFieldInstance): Promise<void>;
  fieldSave(field: ABFieldInstance): Promise<unknown>;
  fieldRemove(field: ABFieldInstance): Promise<unknown>;
  connectFields(
    filter?: (f: ABFieldInstance | null | undefined) => boolean,
  ): ABFieldInstance[];
}

/** @see AppBuilder/platform/ABObject.js (default export class name `ABClassObject`) */
export declare class ABClassObject extends ABObjectCore implements ABObjectLike {
  constructor(attributes?: Record<string, unknown>, AB?: unknown);
  fromValues(attributes: Record<string, unknown>): void;
  currentView(): Record<string, unknown>;
}

/**
 * Mutable row from {@link ABApplicationLike#toDefinition} / `toObj()` used when creating
 * or updating application definitions in the MCP service.
 */
export type ApplicationDefinitionToObj = Record<string, unknown> & {
  id?: unknown;
  name?: unknown;
  type?: unknown;
  json: Record<string, unknown> & {
    id?: unknown;
    icon?: string;
    json?: Record<string, unknown> & {
      versionData?: Record<string, unknown>;
    };
  };
};

/**
 * Application instance surface used by MCP tools.
 * Runtime implementations extend `ABApplicationCore` and {@link ABMLClass}
 * (`AppBuilder/core/ABApplicationCore.js`, `AppBuilder/platform/ABApplication.js`), which
 * provides {@link ABMLClass#save} for persisting definition changes.
 */
export interface ABApplicationLike extends Pick<ABMLClass, "save" | "fromValues"> {
  id: string;
  /** Platform kind: `web` or `mobile` (PWA). */
  appType?: string;
  name?: string;
  objectIDs?: string[];
  datacollectionIDs?: string[];
  roleAccess?: string[];
  objects(): { uuid: string }[];
  objectsIncluded(
    filter?: (o: ABClassObject) => boolean,
    sort?: (a: ABClassObject, b: ABClassObject) => number,
  ): ABClassObject[];
  /** Root and nested pages when `deep` is true (see `ABApplicationCore#pages`). */
  pages(filter?: (p: unknown) => boolean, deep?: boolean): unknown[];
  /** Find a page by id; when `deep` is true, searches the page tree. */
  pageByID(id: string, deep?: boolean): unknown | undefined;
  /** Create a non-page view under an optional parent view/page. */
  viewNew(values: Record<string, unknown>, parent?: unknown): unknown;
  /** Create a new unsaved page (`key: "page"`). */
  pageNew(values: Record<string, unknown>): unknown;
  /** Attach a root page after it has been saved (AppBuilder platform hook). */
  pageInsert?(page: unknown): Promise<unknown>;
  /** Detach a root page reference (AppBuilder platform hook). */
  pageRemove?(page: unknown): Promise<unknown>;
  toObj(): object;
  toDefinition(): ABDefinition;
}

/** {@link ABBootstrap.init} factory instance. */
export interface ABFactory {
  readonly req: {
    log: (...args: unknown[]) => void;
    serviceRequest?: (key: string, payload: unknown) => Promise<unknown>;
  };
  readonly rules: {
    nameFilter(name: string): string;
    toObjectNameFormat(name: string): string;
  };
  definitionNew(params: {
    id?: string;
    name?: string;
    type?: string;
    json: unknown;
  }): ABDefinition;
  objectByID(id: string): ABClassObject | undefined;
  objectNew(attributes: Record<string, unknown>): ABClassObject;
  objects(filter?: (o: ABClassObject) => boolean): ABClassObject[];
  applicationByID(id: string): ABApplicationLike | undefined;
  applicationNew(json: Record<string, unknown>): ABApplicationLike;
  applications(): ABApplicationLike[];
  datacollections(
    filter?: (dc: ABDatacollectionLike) => boolean,
  ): ABDatacollectionLike[];
  datacollectionByID(id: string): ABDatacollectionLike | undefined;
  datacollectionNew(values: Record<string, unknown>): ABDatacollectionLike;
  definitionDestroy(req, id: string): Promise<unknown>;
  fieldNew(values: unknown, parent: ABClassObject): ABFieldInstance;
  /** SITE_ROLE table object. @see ABFactoryCore#objectRole */
  objectRole(): ABRole;
  /** @see ABFactoryCore#objectUser */
  objectUser(): ABSystemTableObject;
  /** @see ABFactoryCore#objectScope */
  objectScope(): ABSystemTableObject;
  /** @see ABFactoryCore#objectToken */
  objectToken(): ABSystemTableObject;
  /** Load plugins from SITE_PLUGIN_LINK for a platform (e.g. "web"). */
  importPlugins(platform: string): Promise<void>;
  /** Registered view plugin classes for a platform. */
  viewsForPlatform(platform: string): unknown[];
  [key: string]: unknown;
}

export type { default as ABDefinition } from "../platform/ABDefinition.js";
