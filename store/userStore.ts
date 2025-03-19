import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UserInfo, LoginRequest, LoginResponse } from "@/lib/types";
import api from "@/lib/api/client";
import { getAccessToken, setAccessToken, setRefreshToken } from "@/lib/auth/token";

interface UserState {
  user: UserInfo | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // 用户操作方法
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserInfo: () => Promise<void>;

  // 内部方法
  setUser: (user: UserInfo | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

// 获取用户信息
const fetchUserInfo = async (): Promise<UserInfo | null> => {
  try {
    console.log("开始获取用户信息...");
    // 发起API请求获取用户信息
    const response = await api.get<UserInfo>("/users/me");
    if (response.success && response.data) {
      console.log("获取用户信息成功:", response.data);
      return response.data;
    }
    console.error("获取用户信息失败:", response.message);
    return null;
  } catch (error: any) {
    console.error("获取用户信息失败:", error);
    return null;
  }
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,

      // 设置用户信息
      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user && !!getAccessToken(),
        });
      },

      // 设置加载状态
      setIsLoading: (isLoading) => set({ isLoading }),

      // 设置错误信息
      setError: (error) => set({ error }),

      // 登录
      login: async (data) => {
        try {
          set({ isLoading: true, error: null });

          console.log("开始登录请求...");
          const response = await api.post<LoginResponse>("/auth/login", data);
          console.log("登录响应:", response);

          if (!response) {
            throw new Error("登录请求失败，未收到响应");
          }

          if (response.success && response.data) {
            console.log("登录成功，保存令牌...");
            // 保存令牌
            if (response.data.accessToken && response.data.refreshToken) {
              setAccessToken(response.data.accessToken);
              setRefreshToken(response.data.refreshToken);
              console.log("令牌已保存");
            }

            // 登录成功后，获取用户信息
            console.log("登录成功，开始获取用户信息...");
            const userInfo = await fetchUserInfo();
            if (userInfo) {
              console.log("用户信息获取成功:", userInfo);
              set({
                user: userInfo,
                isAuthenticated: true,
                isLoading: false,
              });
            } else {
              console.error("用户信息获取失败");
              throw new Error("获取用户信息失败");
            }
          } else {
            console.error("登录失败:", response.message);
            throw new Error(response.message || "登录失败");
          }
        } catch (error: any) {
          console.error("登录过程中发生错误:", error);
          set({
            error: error.message || "登录失败",
            isLoading: false,
          });
          throw error;
        }
      },

      // 登出
      logout: async () => {
        try {
          set({ isLoading: true });

          // 调用登出API
          await api.post("/auth/logout");

          // 清除用户信息
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error: any) {
          console.error("登出失败:", error);
          set({ isLoading: false });
        }
      },

      // 刷新用户信息
      refreshUserInfo: async () => {
        try {
          set({ isLoading: true });
          const userData = await fetchUserInfo();
          set({
            user: userData,
            isAuthenticated: !!userData && !!getAccessToken(),
            isLoading: false,
          });
        } catch (error: any) {
          console.error("刷新用户信息失败:", error);
          set({
            error: "刷新用户信息失败",
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "user-storage", // 持久化存储的键名
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }), // 只持久化用户信息
    }
  )
);
