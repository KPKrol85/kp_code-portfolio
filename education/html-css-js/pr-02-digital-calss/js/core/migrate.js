import { SCHEMA_VERSION } from "./constants.js";

export const migrateState = (state) => {
  if (!state) return null;
  const current = state.schemaVersion || 0;
  if (current === SCHEMA_VERSION) return state;
  return {
    ...state,
    schemaVersion: SCHEMA_VERSION,
  };
};
