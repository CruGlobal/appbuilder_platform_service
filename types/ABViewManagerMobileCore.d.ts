/**
 * Type declarations for the mobile/PWA view manager registry.
 *
 * @see ../core/ABViewManagerMobileCore.js
 */

import type { ABViewClass } from "./ABViewManagerCore.js";

export type { ABViewClass };

/** @see ../core/ABViewManagerMobileCore.js */
export default class ABViewManagerMobileCore {
  static allViews(fn?: (v: ABViewClass) => boolean): ABViewClass[];

  static newView(
    values: Record<string, unknown> & { key?: string },
    application: unknown,
    parent?: unknown | null,
  ): unknown | null;

  static viewClass(key: string): ABViewClass | undefined;
}
