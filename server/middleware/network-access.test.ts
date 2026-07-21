import { describe, expect, it } from "vitest";
import { isLoopbackAddress } from "./network-access.js";

describe("isLoopbackAddress", () => {
  it.each(["127.0.0.1", "127.12.34.56", "::1", "::ffff:127.0.0.1", "localhost"])(
    "allows the local address %s",
    (address) => {
      expect(isLoopbackAddress(address)).toBe(true);
    }
  );

  it.each([undefined, "", "0.0.0.0", "192.168.1.10", "8.8.8.8", "::ffff:192.168.1.10"])(
    "rejects the non-local address %s",
    (address) => {
      expect(isLoopbackAddress(address)).toBe(false);
    }
  );
});
