import { describe, expect, it } from "vitest";

import { formatCurrency } from "../js/utils/format.js";
import { sanitizeText } from "../js/utils/sanitize.js";

describe("utils", () => {
  it("sanitizes unsafe characters", () => {
    expect(sanitizeText("<script>test</script>")).toBe("scripttest/script");
  });

  it("formats currency for PLN", () => {
    const formatted = formatCurrency(1200);

    expect(formatted).toContain("zł");
    expect(formatted).toMatch(/\d/);
  });
});
