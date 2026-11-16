import { cookies } from "next/headers";
import { URL } from "@/config/app.config";
import { cleanQueryParams } from "./Fetch";

export interface ServerFetchOptions extends RequestInit {
  params?: Record<string, any>;
}

export interface ServerFetchResponse<T> {
  data: T | null;
  error?: string;
  status: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Universal Server-Side Fetcher for Next.js Server Components.
 * Automatically extracts cookies from request headers.
 * Automatically formats and cleans query parameters.
 */
export async function serverFetch<T = any>(
  endpoint: string,
  options: ServerFetchOptions = {}
): Promise<ServerFetchResponse<T>> {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get("token")?.value ||
      cookieStore.get("accessToken")?.value;

    let path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

    // Clean and append params as query string
    if (options.params) {
      const cleaned = cleanQueryParams(options.params);
      const query = new URLSearchParams();
      Object.entries(cleaned).forEach(([key, val]) => {
        query.append(key, String(val));
      });
      const qs = query.toString();
      if (qs) {
        path += (path.includes("?") ? "&" : "?") + qs;
      }
    }

    const res = await fetch(`${URL}/api${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      cache: options.cache || "no-store",
    });

    if (!res.ok) {
      return {
        data: null,
        error: `Server error status: ${res.status}`,
        status: res.status,
      };
    }

    const json = await res.json();
    return {
      data: (json.data !== undefined ? json.data : json) as T,
      pagination: json.pagination,
      status: res.status,
    };
  } catch (err: any) {
    return {
      data: null,
      error: err.message || "Server network connection error",
      status: 500,
    };
  }
}
