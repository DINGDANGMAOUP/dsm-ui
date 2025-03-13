"use client";

import * as React from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { LocaleBreadcrumb } from "@/components/layout/breadcrumb";
import { ProtectedLayout } from "@/components/layout/protected-layout";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useCurrentLocale } from "@/lib/i18n-utils";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = useCurrentLocale();

  // 面包屑翻译
  const breadcrumbTranslations = {
    home: "首页",
    dashboard: "仪表盘",
    settings: "设置",
    users: "用户管理",
    products: "产品管理",
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
          <header className="bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <LocaleBreadcrumb translations={breadcrumbTranslations} />
          </header>
          <div className="flex flex-1 flex-col p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedLayout>
  );
}
