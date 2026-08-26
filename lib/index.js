export const name = "dsh-blue-archive-shiroko";
export const inject = ["connection", "credentials"];

const DEFAULT_BALANCE_ENDPOINT = "https://api.deepseek.com/user/balance";
const DEFAULT_CREDENTIAL_REF = "DEEPSEEK_API_KEY";
const DEFAULT_TIMEOUT_MS = 10000;

function applicationResult(value) {
  return { ok: true, value };
}

function failure(code, message) {
  return { ok: false, code, message };
}

function safeEndpoint(value) {
  const endpoint = new URL(value || DEFAULT_BALANCE_ENDPOINT);
  if (endpoint.protocol !== "https:" && endpoint.protocol !== "http:") {
    throw new TypeError("balanceEndpoint must use HTTP or HTTPS");
  }
  return endpoint.toString();
}

export function normalizeBalancePayload(payload) {
  if (!payload || typeof payload !== "object") {
    throw new TypeError("balance response must be an object");
  }
  const source = Array.isArray(payload.balance_infos) ? payload.balance_infos : [];
  const balances = source.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const totalBalance = String(entry.total_balance ?? "").trim();
    const numericTotal = Number(totalBalance);
    if (!totalBalance || !Number.isFinite(numericTotal) || numericTotal < 0) return [];
    return [{
      currency: String(entry.currency || "").trim().toUpperCase() || "CNY",
      totalBalance,
      grantedBalance: String(entry.granted_balance ?? "").trim(),
      toppedUpBalance: String(entry.topped_up_balance ?? "").trim(),
      numericTotal,
    }];
  });
  if (balances.length === 0) throw new TypeError("balance response contained no valid balances");
  return {
    isAvailable: payload.is_available !== false,
    balances,
    checkedAt: new Date().toISOString(),
  };
}

export async function requestBalance(options) {
  const {
    credentials,
    credentialRef = DEFAULT_CREDENTIAL_REF,
    balanceEndpoint = DEFAULT_BALANCE_ENDPOINT,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    fetchImpl = globalThis.fetch,
    signal,
  } = options;
  let resolved;
  try {
    resolved = await credentials.resolve(credentialRef);
  } catch {
    return failure("credential-error", `DSH could not resolve ${credentialRef}`);
  }
  if (!resolved?.value) {
    return failure("missing-credential", `DSH has no configured ${credentialRef}`);
  }
  if (typeof fetchImpl !== "function") {
    return failure("unsupported-runtime", "This DSH runtime does not provide fetch");
  }

  const controller = new AbortController();
  const abortFromCaller = () => controller.abort(signal?.reason);
  if (signal?.aborted) abortFromCaller();
  else signal?.addEventListener("abort", abortFromCaller, { once: true });
  const timeout = setTimeout(() => controller.abort(new Error("balance request timed out")), timeoutMs);
  try {
    const response = await fetchImpl(safeEndpoint(balanceEndpoint), {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${resolved.value}`,
      },
      signal: controller.signal,
    });
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return failure("authentication-failed", "DeepSeek rejected the configured API key");
      }
      return failure("provider-error", `DeepSeek balance API returned HTTP ${response.status}`);
    }
    try {
      return { ok: true, ...normalizeBalancePayload(await response.json()) };
    } catch {
      return failure("invalid-response", "DeepSeek returned an invalid balance response");
    }
  } catch {
    if (controller.signal.aborted) {
      return failure("request-cancelled", signal?.aborted ? "Balance query was cancelled" : "Balance query timed out");
    }
    return failure("network-error", "Could not reach the DeepSeek balance API");
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", abortFromCaller);
  }
}

export function apply(ctx, config = {}) {
  const connection = ctx.get("connection");
  const credentials = ctx.get("credentials");
  if (!connection?.rpc || !credentials) return;
  const options = {
    credentials,
    credentialRef: config.credentialRef || DEFAULT_CREDENTIAL_REF,
    balanceEndpoint: config.balanceEndpoint || DEFAULT_BALANCE_ENDPOINT,
    timeoutMs: Number.isFinite(config.timeoutMs) ? Math.max(1000, config.timeoutMs) : DEFAULT_TIMEOUT_MS,
  };
  ctx.effect(() => connection.rpc.handle(
    "/shiroko-balance",
    async (endpoint, _payload, signal) => {
      if (endpoint !== "query") {
        return applicationResult(failure("unknown-endpoint", "Unknown Shiroko balance endpoint"));
      }
      return applicationResult(await requestBalance({ ...options, signal }));
    },
    { authority: "loopback" },
  ), `${name}: balance RPC`);
}
