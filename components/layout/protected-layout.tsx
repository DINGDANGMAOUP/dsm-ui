"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentLocale } from "@/lib/i18n-utils";

interface ProtectedLayoutProps {
  children: React.ReactNode;
  requiredAuthorities?: string[];
}

export function ProtectedLayout({ children, requiredAuthorities = [] }: ProtectedLayoutProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const locale = useCurrentLocale();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = React.useState(false);

  React.useEffect(() => {
    // 如果用户未登录且加载完成，重定向到登录页面
    if (!isLoading && !isAuthenticated) {
      router.push(`/${locale}/login`);
      return;
    }

    // 如果需要特定权限
    if (requiredAuthorities.length > 0 && user) {
      const hasRequiredAuthorities = requiredAuthorities.every((authority) =>
        user.authorities?.includes(authority)
      );

      setIsAuthorized(hasRequiredAuthorities);

      // 如果用户没有所需权限，重定向到首页
      if (!hasRequiredAuthorities) {
        router.push(`/${locale}`);
      }
    } else {
      setIsAuthorized(true);
    }
  }, [isLoading, isAuthenticated, user, requiredAuthorities, router, locale]);

  // 显示加载状态
  if (isLoading || !isAuthorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full"></div>
          <p className="text-muted-foreground text-sm">加载中...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
