/**
 * Table-backed {@link ABObjectCore} / {@link ABClassObject} shapes and models.
 *
 * Use {@link ABObjectLike} for any AppBuilder object tied to a database table
 * (`objectByID`, `objectRole`, `objectUser`, …). Use {@link ABRole} for the
 * SITE_ROLE object specifically.
 *
 * @see AppBuilder/core/ABObjectCore.js
 * @see AppBuilder/platform/ABObject.js
 * @see AppBuilder/core/ABModelCore.js
 */
import type ABField from "../platform/dataFields/ABField.js";
import { ABMLClass } from "./abPlatformStack.js";

/** Field on an {@link ABObjectLike} (see `AppBuilder/platform/dataFields/ABField.js`). */
export type ABFieldInstance = ABField;

/** Row payload for {@link ABModelLike.create} / {@link ABModelLike.update}. */
export type ABModelRowValues = Record<string, unknown>;

/**
 * `.find()` / `.findAll()` condition (`where`, `sort`, `offset`, `limit`, `populate`, …).
 * @see AppBuilder/platform/ABModel.js `find`, `findAll`
 */
export type ABModelFindCondition = Record<string, unknown>;

/**
 * Data access layer for an {@link ABObjectLike} (`ABObjectCore#model()`).
 * @see AppBuilder/platform/ABModel.js
 * @see AppBuilder/core/ABModelCore.js
 */
export interface ABModelLike {
  readonly object: ABObjectLike;
  normalizeData(data: unknown): void;
  create(
    values: ABModelRowValues,
    trx?: unknown,
    condDefaults?: unknown,
    req?: unknown,
  ): Promise<unknown>;
  update(
    id: string | ABModelRowValues,
    values: ABModelRowValues,
    userData?: unknown,
    trx?: unknown,
    req?: unknown,
  ): Promise<unknown>;
  delete(id: string, trx?: unknown): Promise<unknown>;
  find(cond: ABModelFindCondition | unknown, req?: unknown): Promise<unknown>;
  findAll(
    cond?: ABModelFindCondition,
    conditionDefaults?: unknown,
    req?: unknown,
  ): Promise<unknown>;
}

/**
 * AppBuilder object definition backed by a database table.
 * Runtime class: {@link ABClassObject} (`AppBuilder/platform/ABObject.js`).
 */
export interface ABObjectLike extends Pick<ABMLClass, "fromValues"> {
  id: string;
  name?: string;
  label?: string;
  tableName?: string;
  connName?: string;
  /** Primary key column name; {@link PK} falls back to `"uuid"` when unset. */
  primaryColumnName?: string;
  /**
   * Primary key column name for this object's table.
   * @see ABObjectCore.js `PK()`
   */
  PK(): string;
  /**
   * Model for reading/writing rows in this object's table.
   * @see ABObjectCore.js `model()`
   */
  model(): ABModelLike;
  fields(filter?: (f: ABFieldInstance | null | undefined) => boolean): ABFieldInstance[];
  fieldByID(id: string): ABFieldInstance | undefined;
  toObj(): object;
}

/**
 * SITE_ROLE system object (`ABFactoryCore#objectRole`).
 * @see AppBuilder/core/ABFactoryCore.js
 */
export type ABRole = ABObjectLike;

/** Other fixed-id system table objects (same runtime class as {@link ABRole}). */
export type ABSystemTableObject = ABObjectLike;
