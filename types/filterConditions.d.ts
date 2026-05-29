/**
 * Row / query condition trees (`glue` + `rules`, or leaf `key` + `rule` + optional `value`).
 * Used by datacollection `settings.objectWorkspace.filterConditions`, object workspace
 * filters, and related UI (`FilterComplex`, `RowFilter`).
 *
 * @see AppBuilder/platform/FilterComplex.js
 * @see AppBuilder/core/RowFilterCore.js
 */

/** Leaf rule: field key, operator, optional compare value. */
export type ABConditionRuleLeaf = {
  key: string;
  rule: string;
  value?: unknown;
};

/** Nested boolean group over rules and sub-groups. */
export type ABConditionRuleGroup = {
  glue: "and" | "or";
  rules: ABConditionFilter[];
};

export type ABConditionFilter = ABConditionRuleLeaf | ABConditionRuleGroup;
