const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getErrorMessage(data: unknown): string {
  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data
  ) {
    const msg = (data as Record<string, unknown>).message;
    if (typeof msg === "string") return msg;
  }
  return "Request failed";
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const controller = new AbortController();
  const timeout    = setTimeout(() => controller.abort(), 15000);

  // ✅ get token from localStorage for cross-domain requests
  const token = typeof window !== "undefined"
    ? localStorage.getItem("token")
    : null;

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      signal:      controller.signal,
      headers: {
        "Content-Type": "application/json",
        // ✅ send token in Authorization header as fallback for cross-domain
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });

    const data: unknown = await res.json().catch(() => null);
    if (!res.ok) throw new Error(getErrorMessage(data));
    return data as T;
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    if (err instanceof Error) throw new Error(err.message);
    throw new Error("Network error");
  } finally {
    clearTimeout(timeout);
  }
}