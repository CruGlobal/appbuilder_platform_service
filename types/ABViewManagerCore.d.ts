/**
 * Type declarations for the web view manager registry.
 *
 * @see ../core/ABViewManagerCore.js
 */

export interface ABViewClass {
  common(): {
    key: string;
    icon?: string;
    labelKey?: string;
    [key: string]: unknown;
  };
  new (
    values: Record<string, unknown>,
    application: unknown,
    parent?: unknown | null,
  ): unknown;
}

/** @see ../core/ABViewManagerCore.js */
export default class ABViewManagerCore {
  static allViews(fn?: (v: ABViewClass) => boolean): ABViewClass[];

  static newView(
    values: Record<string, unknown> & { key?: string },
    application: unknown,
    parent?: unknown | null,
  ): unknown | null;

  static viewClass(key: string): ABViewClass | undefined;

  static addViewClass(View: ABViewClass): void;
}
