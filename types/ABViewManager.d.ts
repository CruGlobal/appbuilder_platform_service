/**
 * Service-platform view manager (minimal `ABView` + `ABViewPage` registry).
 *
 * @see ../platform/ABViewManager.js
 */

import ABViewManagerCore from "./ABViewManagerCore.js";
import type { ABViewClass } from "./ABViewManagerCore.js";

export type { ABViewClass };

/** @see ../platform/ABViewManager.js */
export default class ABViewManager extends ABViewManagerCore {
  /**
   * Returns `ABView` and `ABViewPage` classes (service platform subset).
   */
  static allViews(fn?: (v: ABViewClass) => boolean): ABViewClass[];

  static newView(
    values: Record<string, unknown> & { key?: string },
    application: unknown,
    parent?: unknown | null,
  ): unknown;
}
