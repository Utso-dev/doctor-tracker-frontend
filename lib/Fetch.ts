import axios, { AxiosRequestConfig } from "axios";
import { AppConfig } from "../config/app.config";
import { CookieHelper } from "../helper/cookie.helper";

export interface FetchConfig extends AxiosRequestConfig {
  params?: Record<string, any>;
  headers?: any;
}

/**
 * Filter out undefined, null, or empty string values from query params
 */
export const cleanQueryParams = (
  params?: Record<string, any>
): Record<string, any> => {
  if (!params) return {};
  const cleaned: Record<string, any> = {};

  Object.entries(params).forEach(([key, val]) => {
    if (
      val !== undefined &&
      val !== null &&
      val !== "" &&
      val !== "all" &&
      val !== "All Specializations" &&
      val !== "All Conditions" &&
      val !== "All Doctors"
    ) {
      cleaned[key] = val;
    }
  });

  return cleaned;
};

/**
 * Centralized, clean Fetch client
 * Automatically attaches authentication token from cookies for all requests.
 * Automatically cleans and formats query parameters.
 */
export class Fetch {
  private static _baseUrl = `${AppConfig().app.apiUrl}`;

  /**
   * Helper to build default headers with Bearer token
   */
  private static _getHeaders(customHeaders?: any) {
    const token =
      typeof window !== "undefined"
        ? CookieHelper.get({ key: "token" }) ||
          CookieHelper.get({ key: "accessToken" })
        : null;

    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(customHeaders || {}),
    };
  }

  /**
   * GET request with auto-attached token and cleaned query params
   */
  static async get(url: string, config?: FetchConfig) {
    const headers = this._getHeaders(config?.headers);
    const cleanedParams = cleanQueryParams(config?.params);

    return await axios.get(`${this._baseUrl}${url}`, {
      ...config,
      headers,
      params: cleanedParams,
    });
  }

  /**
   * POST request with auto-attached token
   */
  static async post(url: string, data?: any, config?: FetchConfig) {
    const headers = this._getHeaders(config?.headers);
    return await axios.post(`${this._baseUrl}${url}`, data, {
      ...config,
      headers,
    });
  }

  /**
   * PUT request with auto-attached token
   */
  static async put(url: string, data?: any, config?: FetchConfig) {
    const headers = this._getHeaders(config?.headers);
    return await axios.put(`${this._baseUrl}${url}`, data, {
      ...config,
      headers,
    });
  }

  /**
   * PATCH request with auto-attached token
   */
  static async patch(url: string, data?: any, config?: FetchConfig) {
    const headers = this._getHeaders(config?.headers);
    return await axios.patch(`${this._baseUrl}${url}`, data, {
      ...config,
      headers,
    });
  }

  /**
   * DELETE request with auto-attached token
   */
  static async delete(url: string, config?: FetchConfig) {
    const headers = this._getHeaders(config?.headers);
    const cleanedParams = cleanQueryParams(config?.params);

    return await axios.delete(`${this._baseUrl}${url}`, {
      ...config,
      headers,
      params: cleanedParams,
    });
  }
}
