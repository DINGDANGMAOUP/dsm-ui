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

  // 切换语言
  const switchLanguage = useCallback(
    (locale: string) => {
      // 保存语言偏好到 cookie
      Cookies.set("NEXT_LOCALE", locale, { expires: 365 });

      // 从当前路径中提取语言代码后的部分
      const segments = pathname.split("/");
      segments[1] = locale;

      // 构建新路径并导航
      const newPath = segments.join("/");
      router.push(newPath);
    },
    [pathname, router]
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
