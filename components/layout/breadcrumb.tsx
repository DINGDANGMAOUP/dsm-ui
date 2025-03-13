"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useCurrentLocale } from "@/lib/i18n-utils";
import { LocaleLink } from "@/components/locale-link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface LocaleBreadcrumbProps {
  items?: BreadcrumbItem[];
  translations?: Record<string, string>;
}

export function LocaleBreadcrumb({ items, translations = {} }: LocaleBreadcrumbProps) {
  const locale = useCurrentLocale();
  const pathname = usePathname();

  // 如果没有提供面包屑项，则根据路径自动生成
  if (!items) {
    const paths = pathname.split("/").filter(Boolean);
    // 移除locale部分
    if (paths[0] === locale) {
      paths.shift();
    }

    items = paths.map((path, index) => {
      const isLast = index === paths.length - 1;
      const fullPath = `/${paths.slice(0, index + 1).join("/")}`;

      return {
        label: translations[path] || path,
        path: isLast ? undefined : fullPath,
      };
    });

    // 添加首页
    items.unshift({
      label: translations.home || "首页",
      path: "/",
    });
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {item.path ? (
                <LocaleLink href={item.path}>
                  <BreadcrumbLink>{item.label}</BreadcrumbLink>
                </LocaleLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
