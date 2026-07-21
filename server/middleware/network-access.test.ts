import { describe, expect, it } from "vitest";
import { authorizeNetworkRequest, isLoopbackAddress } from "./network-access.js";

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

describe("authorizeNetworkRequest", () => {
  it("allows local requests without a token", () => {
    expect(authorizeNetworkRequest("127.0.0.1", undefined, {})).toEqual({ allowed: true });
  });

  it("denies remote requests unless remote access is explicitly enabled", () => {
    expect(authorizeNetworkRequest("192.168.1.10", undefined, {})).toMatchObject({
      allowed: false,
      status: 403,
      code: "REMOTE_ACCESS_DISABLED",
    });
  });

  it("fails closed when remote access has no configured token", () => {
    expect(
      authorizeNetworkRequest("192.168.1.10", undefined, { ALLOW_REMOTE_ACCESS: "true" })
    ).toMatchObject({ allowed: false, status: 503, code: "REMOTE_AUTH_NOT_CONFIGURED" });
  });

  it("rejects an invalid remote bearer token", () => {
    expect(
      authorizeNetworkRequest("192.168.1.10", "Bearer wrong-token", {
        ALLOW_REMOTE_ACCESS: "true",
        GAIA_API_TOKEN: "correct-token",
      })
    ).toMatchObject({ allowed: false, status: 401, code: "INVALID_API_TOKEN" });
  });

  it("allows a remote request with the configured bearer token", () => {
    expect(
      authorizeNetworkRequest("192.168.1.10", "Bearer correct-token", {
        ALLOW_REMOTE_ACCESS: "true",
        GAIA_API_TOKEN: "correct-token",
      })
    ).toEqual({ allowed: true });
  });
});
