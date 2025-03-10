import { useContext } from "react";
import { AuthContext } from "@/lib/auth/AuthContext";

/**
 * 认证Hook
 * 用于在组件中使用认证上下文
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
