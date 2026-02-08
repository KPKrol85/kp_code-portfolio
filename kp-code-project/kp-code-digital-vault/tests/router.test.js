import { describe, expect, it } from "vitest";

import { parseHash } from "../js/utils/navigation.js";

describe("router hash parsing", () => {
  it("normalizes pathname and parses query params", () => {
    const result = parseHash("#/products?category=books&category=audio");

    expect(result).toEqual({
      pathname: "/products",
      queryString: "category=books&category=audio",
      queryParams: {
        category: ["books", "audio"],
      },
    });
  });

  it("adds leading slash when missing", () => {
    const result = parseHash("#account");

    expect(result.pathname).toBe("/account");
  });
});
