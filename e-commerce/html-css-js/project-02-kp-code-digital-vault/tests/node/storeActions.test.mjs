import assert from "node:assert/strict";

import { actions } from "../../js/store/actions.js";
import { store } from "../../js/store/store.js";

export const tests = [
  {
    name: "actions.ui.setTheme preserves existing ui fields",
    run() {
      store.setState({ ui: { theme: "light", density: "compact" } });

      actions.ui.setTheme("dark");

      assert.equal(store.getState().ui.theme, "dark");
      assert.equal(store.getState().ui.density, "compact");
    },
  },
];
