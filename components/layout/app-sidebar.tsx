"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useCurrentLocale } from "@/lib/i18n-utils";
import { useAuth } from "@/hooks/useAuth";
import { LocaleLink } from "@/components/locale-link";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/lib/types";
import { ChevronRight } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
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
  locale: string,
  expandedMenuId: number | null,
  handleExpandMenu: (id: number | null | ((prevId: number | null) => number | null)) => void
) {
  const menuItems = items.filter((item) => item.parentId === parentId);

  if (menuItems.length === 0) return null;

  return menuItems.map((item) => {
    const hasChildren = items.some((child) => child.parentId === item.id);
    const isActive = pathname === `/${locale}${item.path}`;
    // 检查子菜单中是否有活动项
    const hasActiveChild =
      hasChildren &&
      items.some((child) => child.parentId === item.id && pathname === `/${locale}${child.path}`);

    if (hasChildren) {
      return (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton
            isActive={isActive || hasActiveChild}
            className="w-full justify-between"
            onClick={(e) => {
              // 阻止事件冒泡，确保点击事件不会被父元素捕获
              e.stopPropagation();
              // 如果当前菜单已展开，则关闭它；否则展开它
              handleExpandMenu((prevId) => (prevId === item.id ? null : item.id));
            }}
          >
            {getIcon(item.icon)}
            <span>{item.menuName}</span>
            <ChevronRight
              className={cn(
                "ml-auto transition-transform duration-200",
                expandedMenuId === item.id && "rotate-90"
              )}
            />
          </SidebarMenuButton>
          {expandedMenuId === item.id && (
            <SidebarMenuSub>
              {renderMenuItems(items, item.id, pathname, locale, expandedMenuId, handleExpandMenu)}
            </SidebarMenuSub>
          )}
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

  // 添加状态来跟踪当前展开的菜单ID
  const [expandedMenuId, setExpandedMenuId] = React.useState<number | null>(null);

  // 添加状态来跟踪用户是否手动操作过菜单
  const [userInteracted, setUserInteracted] = React.useState(false);

  // 包装 setExpandedMenuId 函数，在用户手动操作时设置 userInteracted 标志
  const handleExpandMenu = React.useCallback(
    (id: number | null | ((prevId: number | null) => number | null)) => {
      setUserInteracted(true);
      setExpandedMenuId(id);
    },
    []
  );

  // 当路由变化时，如果用户没有手动操作过菜单，则自动展开对应的菜单
  React.useEffect(() => {
    // 如果用户已经手动操作过菜单，则不自动展开
    if (userInteracted) return;

    const menuItems = user?.menus || defaultMenuItems;

    // 查找当前路径对应的菜单项
    const currentMenuItem = menuItems.find((item) => pathname === `/${locale}${item.path}`);

    // 如果找到了当前菜单项，并且它有父菜单，则设置父菜单为展开状态
    if (currentMenuItem && currentMenuItem.parentId) {
      setExpandedMenuId(currentMenuItem.parentId);
    }
  }, [pathname, locale, user, defaultMenuItems, userInteracted]);

  // 当路由变化时，重置用户交互标志，允许自动展开菜单
  React.useEffect(() => {
    setUserInteracted(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      // 重定向到首页
      window.location.href = `/${locale}`;
    } catch (error) {
      console.error("登出失败:", error);
    }
  };

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
        <SidebarMenu>
          {renderMenuItems(menuItems, null, pathname, locale, expandedMenuId, handleExpandMenu)}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between">
          <NavUser user={user} onLogout={handleLogout} />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
