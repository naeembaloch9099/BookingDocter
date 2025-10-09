const fallbackBase = "http://localhost:5000";

const isBrowser = typeof window !== "undefined";

export const getApiBase = () => {
  const windowBase = isBrowser ? window.__API_BASE__ : undefined;
  const envBase =
    typeof import.meta !== "undefined"
      ? import.meta.env?.VITE_API_BASE_URL
      : undefined;
  const base = windowBase || envBase || fallbackBase;

  if (isBrowser) {
    // Helpful runtime diagnostics for deployed apps (Vercel)
    try {
      console.log("[API] Resolved API base:", base);

      if (
        base.startsWith("http://localhost") ||
        base.startsWith("http://127.0.0.1")
      ) {
        console.warn(
          "[API] Warning: API base is localhost. This will not work from the deployed site. Set VITE_API_BASE_URL in your host (Vercel) to the public backend URL and redeploy."
        );
      }

      if (
        window.location &&
        window.location.protocol === "https:" &&
        base.startsWith("http:")
      ) {
        console.error(
          "[API] Mixed content: page is served over HTTPS but API base is HTTP. Browsers will block these requests. Use an HTTPS API endpoint."
        );
      }
    } catch {
      /* ignore diagnostics errors */
    }
  }

  // Fail fast in production if the base resolves to localhost to avoid shipping bad builds
  try {
    const mode =
      typeof import.meta !== "undefined" ? import.meta.env?.MODE : undefined;
    const isProd = mode === "production";
    if (
      isProd &&
      (base.startsWith("http://localhost") ||
        base.startsWith("http://127.0.0.1"))
    ) {
      // Throw an explicit error so it gets caught during runtime and is visible in logs
      throw new Error(
        "Invalid API base in production: resolved to localhost. Set VITE_API_BASE_URL in your host (Vercel) or use the runtime meta tag to point to a public backend."
      );
    }
  } catch (err) {
    if (isBrowser) console.error("[API] Guard error:", err?.message || err);
  }

  return base;
};

export const getAuthToken = () => {
  if (!isBrowser) return undefined;
  return (
    window.__APP_TOKEN__ ||
    window.localStorage?.getItem("app_token") ||
    undefined
  );
};

export const buildAuthHeaders = () => {
  const token = getAuthToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
};

const normalizeBody = (body) => {
  if (!body) return undefined;
  if (typeof body === "string") return body;
  try {
    return JSON.stringify(body);
  } catch (error) {
    console.error("[API] Failed to stringify body", error);
    throw error;
  }
};

export const jsonFetch = async (path, options = {}) => {
  const { method = "GET", headers: customHeaders = {}, body } = options;
  const base = getApiBase();
  const url = path.startsWith("http") ? path : `${base}${path}`;
  const normalizedBody = normalizeBody(body);

  const headers = {
    Accept: "application/json",
    ...(normalizedBody ? { "Content-Type": "application/json" } : {}),
    ...buildAuthHeaders(),
    ...customHeaders,
  };

  const fetchConfig = {
    method,
    ...options,
    headers,
    ...(normalizedBody ? { body: normalizedBody } : {}),
  };

  let logBody;
  if (normalizedBody) {
    try {
      logBody = JSON.parse(normalizedBody);
    } catch {
      logBody = normalizedBody;
    }
  }

  console.log(`[API] ${method} ${url}`, logBody);
  let response;
  try {
    response = await fetch(url, fetchConfig);
  } catch (err) {
    console.error(`[API] Network error fetching ${url}`, err);
    // Provide a clearer error to the caller so it's easier to debug in deployed apps
    const e = new Error(`Network error fetching ${url}: ${err.message}`);
    e.original = err;
    throw e;
  }
  const text = await response.text();
  let payload = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  console.log(`[API] Response ${response.status} ${url}`, payload);

  if (!response.ok) {
    const error = new Error(
      payload?.message || `Request failed with status ${response.status}`
    );
    error.status = response.status;
    error.data = payload;
    throw error;
  }

  return payload;
};
