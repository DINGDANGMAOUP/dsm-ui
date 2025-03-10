import Cookies from "js-cookie";

// Cookie名称
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// Cookie配置
const cookieOptions = {
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
};

// 获取访问令牌
export const getAccessToken = (): string | undefined => {
  return Cookies.get(ACCESS_TOKEN_KEY);
};

// 获取刷新令牌
export const getRefreshToken = (): string | undefined => {
  return Cookies.get(REFRESH_TOKEN_KEY);
};

// 移除令牌
export const removeTokens = (): void => {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
};

// 检查是否已认证
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};
