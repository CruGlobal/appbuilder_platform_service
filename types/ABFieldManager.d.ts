/**
 * Type declarations for {@link ABFieldManager} and registered field classes.
 *
 * @see ../core/ABFieldManager.js
 * @see ../core/dataFields/*Core.js — each field's `static defaults()`
 */
import type ABField from "../platform/dataFields/ABField.js";
import type { ABFieldParentObject } from "../core/dataFields/ABFieldCore.d.ts";

/**
 * Static metadata returned by each field class's `defaults()` (see `ABFieldStringCore.js`).
 * Additional keys are allowed for field-specific settings.
 */
export interface ABFieldDefaults {
  /** Registry key used by {@link ABFieldManager.fieldByKey} and `fieldNew(values.key)`. */
  key: string;
  description?: string;
  menuName?: string;
  icon?: string;
  isFilterable?: boolean | ((field: ABField) => boolean);
  isSortable?: boolean | ((field: ABField) => boolean);
  supportRequire?: boolean;
  supportUnique?: boolean;
  useAsLabel?: boolean | ((field: ABField) => boolean);
  compatibleOrmTypes?: string | string[];
  [key: string]: unknown;
}

/** Constructor registered in {@link ABFieldManager}'s internal `Fields` map. */
export interface ABFieldClass {
  defaults(): ABFieldDefaults;
  new (
    values: Record<string, unknown>,
    object: ABFieldParentObject,
    fieldDefaults?: Record<string, unknown>,
  ): ABField;
}

/** @see ../core/ABFieldManager.js */
export default class ABFieldManager {
  /**
   * All registered field classes (one per `defaults().key`).
   * @see ABFieldManager.js `AllFieldClasses`
   */
  static allFields(): ABFieldClass[];

  /**
   * Lookup a field class by registry key (e.g. `"string"`, `"LongText"`).
   */
  static fieldByKey(key: string): ABFieldClass | undefined;

  /**
   * Instantiate a field on `object` using `values.key`.
   * Throws when `values.key` is missing; returns undefined if construction fails.
   */
  static newField(
    values: Record<string, unknown>,
    object: ABFieldParentObject,
  ): ABField | undefined;
}
