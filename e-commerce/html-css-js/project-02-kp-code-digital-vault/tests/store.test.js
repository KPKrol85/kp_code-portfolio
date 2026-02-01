import { afterEach, describe, expect, it, vi } from "vitest";

import { actions } from "../js/store/actions.js";
import { store } from "../js/store/store.js";

const initialState = (() => {
  const snapshot = store.getState();
  return {
    ...snapshot,
    ui: { ...(snapshot.ui || {}) },
  };
})();

afterEach(() => {
  store.setState({ ...initialState, ui: { ...initialState.ui } });
});

describe("store", () => {
  it("notifies subscribers on state updates", () => {
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    store.setState({ cart: [{ id: 1 }] });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ cart: [{ id: 1 }] })
    );

    unsubscribe();
  });

  it("stops notifying after unsubscribe", () => {
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    unsubscribe();
    store.setState({ cart: [] });

    expect(listener).not.toHaveBeenCalled();
  });

  it("preserves existing ui fields when updating theme", () => {
    store.setState({ ui: { theme: "light", density: "compact" } });

    actions.ui.setTheme("dark");

    expect(store.getState().ui).toMatchObject({ theme: "dark", density: "compact" });
  });
});
