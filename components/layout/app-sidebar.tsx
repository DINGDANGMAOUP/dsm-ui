"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useCurrentLocale } from "@/lib/i18n-utils";
import { useAuth } from "@/hooks/useAuth";
import { LocaleLink } from "@/components/locale-link";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/lib/types";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import { PackageIcon } from "lucide-react";
import { NavUser } from "./nav-user";
import CustomIcon from "../custom-icon";

// 获取图标
function getIcon(iconName: string): React.ReactNode {
  return <CustomIcon name={iconName} />;
}

// 递归渲染菜单项
function renderMenuItems(
  items: MenuItem[],
  parentId: number | null,
  pathname: string,
  locale: string
) {
  const menuItems = items.filter((item) => item.parentId === parentId);

  if (menuItems.length === 0) return null;

  return menuItems.map((item) => {
    const hasChildren = items.some((child) => child.parentId === item.id);
    const isActive = pathname === `/${locale}${item.path}`;

    if (hasChildren) {
      return (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton isActive={isActive}>
            {getIcon(item.icon)}
            <span>{item.menuName}</span>
          </SidebarMenuButton>
          <SidebarMenuSub>{renderMenuItems(items, item.id, pathname, locale)}</SidebarMenuSub>
        </SidebarMenuItem>
      );
    }

    return (
      <SidebarMenuItem key={item.id}>
        <LocaleLink href={item.path}>
          <SidebarMenuButton isActive={isActive}>
            {getIcon(item.icon)}
            <span>{item.menuName}</span>
          </SidebarMenuButton>
        </LocaleLink>
      </SidebarMenuItem>
    );
  });
}

export function AppSidebar() {
  const locale = useCurrentLocale();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const handleLogout = async () => {
    try {
      await logout();
      // 重定向到首页
      window.location.href = `/${locale}`;
    } catch (error) {
      console.error("登出失败:", error);
    }
  };
  // 如果用户未登录或没有菜单数据，显示基本菜单
  const defaultMenuItems: MenuItem[] = [
    {
      id: 1,
      parentId: null,
      menuName: "首页",
      orderNum: 1,
      path: "",
      frame: false,
      cache: false,
      icon: "home",
    },
    {
      id: 2,
      parentId: null,
      menuName: "仪表盘",
      orderNum: 2,
      path: "/dashboard",
      frame: false,
      cache: false,
      icon: "dashboard",
    },
  ];

  const menuItems = user?.menus || defaultMenuItems;

  return (
    <Sidebar variant="floating">
      <SidebarHeader className="flex h-14 items-center px-4">
        <LocaleLink href="/" className="flex items-center gap-2 font-semibold">
          <PackageIcon className="h-6 w-6" />
          <span>DSM Admin</span>
        </LocaleLink>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>{renderMenuItems(menuItems, null, pathname, locale)}</SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between">
          <NavUser user={user} onLogout={handleLogout} />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
