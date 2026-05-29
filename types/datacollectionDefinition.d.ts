/**
 * Row-filter and persisted-definition shapes for datacollections, plus declarations for
 * {@link ABDataCollectionCore} / {@link ABDataCollection}.
 *
 * @see AppBuilder/core/ABDataCollectionCore.js
 * @see AppBuilder/platform/ABDataCollection.js
 */
import type ABDefinition from "../platform/ABDefinition.js";
import type { ABConditionFilter } from "./filterConditions.js";
import { ABMLClass } from "./abPlatformStack.js";

export type ABDatacollectionSettings = {
  datasourceID: string;
  linkDatacollectionID?: string;
  linkFieldID?: string;
  followDatacollectionID?: string;
  objectWorkspace?: {
    filterConditions?: ABConditionFilter;
    sortFields?: unknown[];
  };
  loadAll?: boolean | string;
  populate?: boolean | unknown[] | string;
  isQuery?: boolean | string;
  fixSelect?: string;
  syncType?: number | string;
  skipPack?: boolean;
  select?: unknown;
  [key: string]: unknown;
};

/**
 * Persisted datacollection row shape (`ABDataCollection.toObj()`), suitable for
 * MCP tool responses and update payloads.
 */
export type ABDatacollection = {
  id: string;
  name: string;
  type: "datacollection";
  settings: ABDatacollectionSettings;
  translations?: { language_code: string; label?: string; description?: string }[];
};

export type DatacollectionListItem = {
  uuid: string;
  name: string;
  objectId: string;
};

/**
 * @see AppBuilder/core/ABDataCollectionCore.js
 */
export declare class ABDataCollectionCore extends ABMLClass {
  constructor(attributes?: Record<string, unknown> | null, AB?: unknown);
  id: string;
  name?: string | null;
  label?: string;
  type?: string;
  settings: Record<string, unknown>;
  fromValues(attributes: Record<string, unknown>): void;
  toObj(): object;
  toDefinition(): ABDefinition;
  save(): Promise<unknown>;
  destroy(): Promise<unknown>;
}

/**
 * @see AppBuilder/platform/ABDataCollection.js
 */
export declare class ABDataCollection extends ABDataCollectionCore {
  _dataCollectionNew(): unknown;
}

export default ABDataCollection;

/** Factory / MCP surface for instances returned by {@link ABFactory#datacollectionByID}. */
export type ABDatacollectionLike = ABDataCollectionCore;
