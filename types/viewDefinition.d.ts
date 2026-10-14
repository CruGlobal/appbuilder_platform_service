/**
 * Serialized view and page shapes aligned with `ABViewCore#toObj()` and `ABViewPageCore#toObj()`.
 *
 * @see AppBuilder/core/views/ABViewCore.js
 * @see AppBuilder/core/views/ABViewPageCore.js
 */

/** Row returned by `viewList` / `applicationPageList` MCP tools (see `src/services/appBuilderService.ts`). */
export type ViewListItem = {
  id: string;
  name: string;
  key: string;
};

/**
 * Persisted ABView definition (`ABView.toObj()`), suitable for MCP tool payloads.
 * Child view ids are stored on parents as `viewIDs`.
 */
export type ABViewToObj = Record<string, unknown> & {
  id: string;
  type?: string;
  key: string;
  name?: string;
  icon?: string;
  tabicon?: string;
  settings?: Record<string, unknown>;
  viewIDs?: string[];
  accessLevels?: Record<string, unknown>;
  translations?: unknown[];
  position?: Record<string, unknown>;
  isRoot?: boolean;
};

/**
 * Persisted ABViewPage definition (root or nested). Sub-pages are referenced by `pageIDs`.
 */
export type ABViewPageToObj = ABViewToObj & {
  pageIDs?: string[];
  myAppID?: string;
  label?: string;
};
