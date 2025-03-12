import Cookies from "js-cookie";

// Cookie名称
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// Cookie配置
const cookieOptions = {
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  expires: 1, // 1天
};

// 获取访问令牌
export const getAccessToken = (): string | undefined => {
  // 尝试从Cookie中获取
  const token = Cookies.get(ACCESS_TOKEN_KEY);
  if (token) return token;

  // 如果Cookie中没有，尝试从localStorage中获取（兼容性处理）
  // if (typeof window !== "undefined") {
  //   return localStorage.getItem(ACCESS_TOKEN_KEY) || undefined;
  // }

  return undefined;
};

// 获取刷新令牌
export const getRefreshToken = (): string | undefined => {
  // 尝试从Cookie中获取
  const token = Cookies.get(REFRESH_TOKEN_KEY);
  if (token) return token;

  // 如果Cookie中没有，尝试从localStorage中获取（兼容性处理）
  // if (typeof window !== "undefined") {
  //   return localStorage.getItem(REFRESH_TOKEN_KEY) || undefined;
  // }

  return undefined;
};

// 设置访问令牌
export const setAccessToken = (token: string): void => {
  // 设置到Cookie
  Cookies.set(ACCESS_TOKEN_KEY, token, cookieOptions);

  // 同时设置到localStorage（兼容性处理）
  // if (typeof window !== "undefined") {
  //   localStorage.setItem(ACCESS_TOKEN_KEY, token);
  // }
};

// 设置刷新令牌
export const setRefreshToken = (token: string): void => {
  // 设置到Cookie
  Cookies.set(REFRESH_TOKEN_KEY, token, cookieOptions);

  // 同时设置到localStorage（兼容性处理）
  // if (typeof window !== "undefined") {
  //   localStorage.setItem(REFRESH_TOKEN_KEY, token);
  // }
};

// 移除令牌
export const removeTokens = (): void => {
  // 从Cookie中移除
  Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
  Cookies.remove(REFRESH_TOKEN_KEY, { path: "/" });

  // 从localStorage中移除（兼容性处理）
  // if (typeof window !== "undefined") {
  //   localStorage.removeItem(ACCESS_TOKEN_KEY);
  //   localStorage.removeItem(REFRESH_TOKEN_KEY);
  // }
};

// 检查是否已认证
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};
