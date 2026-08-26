import assert from "node:assert/strict";
import test from "node:test";
import { apply, normalizeBalancePayload, requestBalance } from "../lib/index.js";

test("normalizes the official DeepSeek balance response", () => {
  const result = normalizeBalancePayload({
    is_available: true,
    balance_infos: [{
      currency: "cny",
      total_balance: "12.50",
      granted_balance: "2.50",
      topped_up_balance: "10.00",
    }],
  });
  assert.equal(result.isAvailable, true);
  assert.deepEqual(result.balances, [{
    currency: "CNY",
    totalBalance: "12.50",
    grantedBalance: "2.50",
    toppedUpBalance: "10.00",
    numericTotal: 12.5,
  }]);
  assert.match(result.checkedAt, /^\d{4}-\d{2}-\d{2}T/);
});

test("does not call the provider without a configured credential", async () => {
  let fetched = false;
  const result = await requestBalance({
    credentials: { resolve: async () => undefined },
    fetchImpl: async () => { fetched = true; throw new Error("unexpected"); },
  });
  assert.equal(fetched, false);
  assert.deepEqual(result, {
    ok: false,
    code: "missing-credential",
    message: "DSH has no configured DEEPSEEK_API_KEY",
  });
});

test("keeps the API key on the host request boundary", async () => {
  let receivedAuthorization = "";
  const result = await requestBalance({
    credentials: { resolve: async () => ({ value: "sk-test-secret", source: "file" }) },
    fetchImpl: async (_url, init) => {
      receivedAuthorization = init.headers.authorization;
      return new Response(JSON.stringify({
        is_available: true,
        balance_infos: [{ currency: "USD", total_balance: "3.25" }],
      }), { status: 200, headers: { "content-type": "application/json" } });
    },
  });
  assert.equal(receivedAuthorization, "Bearer sk-test-secret");
  assert.equal(result.ok, true);
  assert.equal(result.balances[0].numericTotal, 3.25);
  assert.equal(JSON.stringify(result).includes("sk-test-secret"), false);
});

test("redacts provider authentication failures", async () => {
  const result = await requestBalance({
    credentials: { resolve: async () => ({ value: "sk-test-secret", source: "file" }) },
    fetchImpl: async () => new Response("key sk-test-secret is invalid", { status: 401 }),
  });
  assert.deepEqual(result, {
    ok: false,
    code: "authentication-failed",
    message: "DeepSeek rejected the configured API key",
  });
});

test("registers a loopback-only balance channel", async () => {
  let registration;
  const disposer = async () => {};
  const connection = {
    rpc: {
      handle(channel, handler, options) {
        registration = { channel, handler, options };
        return disposer;
      },
    },
  };
  const credentials = { resolve: async () => ({ value: "sk-host-only", source: "file" }) };
  const effects = [];
  const ctx = {
    get(name) { return name === "connection" ? connection : name === "credentials" ? credentials : undefined; },
    effect(factory) { effects.push(factory()); },
  };
  apply(ctx);
  assert.equal(registration.channel, "/shiroko-balance");
  assert.deepEqual(registration.options, { authority: "loopback" });

  const previousFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({
    is_available: true,
    balance_infos: [{ currency: "CNY", total_balance: "88.00" }],
  }), { status: 200 });
  try {
    const result = await registration.handler("query", {}, new AbortController().signal);
    assert.equal(result.ok, true);
    assert.equal(result.value.ok, true);
    assert.equal(result.value.balances[0].numericTotal, 88);
  } finally {
    globalThis.fetch = previousFetch;
  }
  assert.equal(effects[0], disposer);
});
