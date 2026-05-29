/**
 * TypeScript sidecar for `./ABField.js`.
 *
 * @see ../../core/dataFields/ABFieldCore.js
 */
import type ABFieldCore from "../../core/dataFields/ABFieldCore.js";
import type { ABFieldParentObject } from "../../core/dataFields/ABFieldCore.js";

/** @see ./ABField.js */
export default class ABField extends ABFieldCore {
  constructor(
    values: Record<string, unknown>,
    object: ABFieldParentObject,
    fieldDefaults?: Record<string, unknown>,
  );

  dbPrefix(): string;
  exportData(data: { ids: string[] }): void;
  exportIDs(ids: string[]): void;
  migrateCreate(req: { logError(e: Error): void }, knex?: unknown): Promise<unknown>;
  migrateUpdate(req: { logError(e: Error): void }, knex?: unknown): Promise<unknown>;
  migrateDrop(req: unknown, knex?: unknown): Promise<unknown>;
  jsonSchemaProperties(obj?: unknown): void;
  requestParam(allParameters: Record<string, unknown>): Record<string, unknown> | undefined;
  requestRelationParam(
    allParameters: Record<string, unknown>,
  ): Record<string, unknown> | undefined;
  isValidData(allParameters?: Record<string, unknown>): unknown[];
  postGet(data?: unknown): Promise<void>;
  conditionKey(): string;
}
