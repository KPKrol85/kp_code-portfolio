import { afterEach, describe, expect, it, vi } from "vitest";

import { store } from "../js/store/store.js";

const initialState = { ...store.getState() };

afterEach(() => {
  store.setState(initialState);
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
});
