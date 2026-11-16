import { CookieHelper } from "../../helper/cookie.helper";
import { Fetch } from "../../lib/Fetch";

export const UserService = {
  login: async ({ email, password }: { email: string; password: string }) => {
    return await Fetch.post("/auth/login", { email, password });
  },

  register: async ({
    username,
    name,
    email,
    password,
  }: {
    username?: string;
    name?: string;
    email: string;
    password: string;
  }) => {
    return await Fetch.post("/auth/register", {
      name: name || username,
      username: username || name,
      email,
      password,
    });
  },

  logout: (context = null) => {
    CookieHelper.destroy({ key: "token", context });
    CookieHelper.destroy({ key: "accessToken", context });
  },

  // Get current user details (token is automatically attached by Fetch)
  getUserDetails: async (options?: { token?: string; context?: any }) => {
    return await Fetch.get("/auth/me");
  },
};
