import { describe, expect, it } from "vitest";
import { getOpsSessionValue, isOpsTokenValid } from "@/lib/server/ops-auth";

describe("ops auth helpers", () => {
  it("accepts only the exact configured token", async () => {
    await expect(
      isOpsTokenValid("secret-token-123", "secret-token-123"),
    ).resolves.toBe(true);
    await expect(
      isOpsTokenValid("secret-token-123", "secret-token-456"),
    ).resolves.toBe(false);
    await expect(isOpsTokenValid("", "secret-token-123")).resolves.toBe(false);
  });

  it("derives a stable session hash from the token", async () => {
    await expect(getOpsSessionValue("secret-token-123")).resolves.toBe(
      await getOpsSessionValue("secret-token-123"),
    );
    await expect(getOpsSessionValue("secret-token-123")).resolves.not.toBe(
      await getOpsSessionValue("secret-token-456"),
    );
  });
});