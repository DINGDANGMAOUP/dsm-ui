"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";
import { useCallback } from "react";
import Cookies from "js-cookie";

// 支持的语言列表
const locales = [
  { code: "zh", name: "中文" },
  { code: "en", name: "English" },
];

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  // 获取当前语言
  const getCurrentLocale = useCallback(() => {
    // 从路径中提取语言代码
    const segments = pathname.split("/");
    const currentLocale = segments[1];

    // 检查是否是有效的语言代码
    return locales.find((locale) => locale.code === currentLocale)?.code || "zh";
  }, [pathname]);

  // 获取当前路径（不含语言前缀）
  const getCurrentPath = useCallback(() => {
    const segments = pathname.split("/");
    // 移除语言前缀
    segments.splice(1, 1);
    return segments.join("/") || "/";
  }, [pathname]);

  // 切换语言
  const switchLanguage = useCallback(
    (locale: string) => {
      // 保存语言偏好到 cookie
      Cookies.set("NEXT_LOCALE", locale, { expires: 365 });

      // 获取当前路径（不含语言前缀）
      const currentPath = getCurrentPath();

      // 构建新路径
      const newPath = `/${locale}${currentPath === "/" ? "" : currentPath}`;

      console.log(`切换语言: ${getCurrentLocale()} -> ${locale}, 路径: ${pathname} -> ${newPath}`);

      // 导航到新路径
      router.push(newPath);
    },
    [pathname, router, getCurrentPath, getCurrentLocale]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Languages className="h-5 w-5" />
          <span className="sr-only">切换语言</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale.code}
            onClick={() => switchLanguage(locale.code)}
            className={getCurrentLocale() === locale.code ? "font-bold" : ""}
          >
            {locale.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
