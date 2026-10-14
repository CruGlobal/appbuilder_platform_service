/**
 * TypeScript sidecar for `./ABDefinition.js` (extends `ABDefinitionCore`).
 *
 * @see ../core/ABDefinitionCore.js
 */

/** @see ../core/ABDefinitionCore.js */
declare class ABDefinitionCore {
  constructor(attributes: Record<string, unknown>, AB: unknown);
  AB: unknown;
  id?: string;
  name: string;
  type: string;
  json: unknown | null;
  fromValues(attributes: Record<string, unknown>): void;
  toObj(): { id?: string; name: string; type: string; json: unknown };
  destroy(): Promise<unknown>;
  save(): Promise<unknown>;
}

/** @see ./ABDefinition.js */
export default class ABDefinition extends ABDefinitionCore {}
