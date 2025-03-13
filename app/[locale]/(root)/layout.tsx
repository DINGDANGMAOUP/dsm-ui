"use client";

import * as React from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { LocaleBreadcrumb } from "@/components/layout/breadcrumb";
import { ProtectedLayout } from "@/components/layout/protected-layout";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useCurrentLocale } from "@/lib/i18n-utils";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = useCurrentLocale();
  const { user, logout } = useAuth();

  // 面包屑翻译
  const breadcrumbTranslations = {
    home: "首页",
    dashboard: "仪表盘",
    settings: "设置",
    users: "用户管理",
    products: "产品管理",
  };

  // 处理登出
  const handleLogout = async () => {
    await logout();
  };

  return (
    <ProtectedLayout>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "19rem",
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset>
          <header className="bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <LocaleBreadcrumb translations={breadcrumbTranslations} />
            </div>

            {/* 用户菜单 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ring-offset-background focus-visible:ring-ring flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2">
                  <Avatar>
                    <AvatarImage src={user?.avatar} alt={user?.nickname || user?.username} />
                    <AvatarFallback>
                      {user?.nickname?.[0] || user?.username?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user?.nickname || user?.username}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>我的账户</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>个人资料</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>设置</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>退出登录</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <div className="flex flex-1 flex-col p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedLayout>
  );
}
