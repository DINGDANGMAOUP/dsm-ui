import { cookies, headers } from "next/headers";
import { locales, defaultLocale } from "./dictionaries";

// 从请求中获取当前语言
export function getLocaleFromRequest(): string {
  try {
    // 尝试从 cookie 中获取语言设置
    const cookieStore = cookies();
    const nextLocaleCookie = cookieStore.get("NEXT_LOCALE");

    if (nextLocaleCookie?.value && locales.includes(nextLocaleCookie.value)) {
      return nextLocaleCookie.value;
    }

    // 尝试从 Accept-Language 头部获取语言设置
    const headersList = headers();
    const acceptLanguage = headersList.get("accept-language") || "";

    // 解析 Accept-Language 头部
    const parsedLocales = acceptLanguage.split(",").map((locale: string) => {
      const [lang, q = "1"] = locale.split(";q=");
      return { lang: lang.trim(), q: parseFloat(q) };
    });

    // 按照 q 值排序
    parsedLocales.sort((a: { q: number }, b: { q: number }) => b.q - a.q);

    // 查找匹配的语言
    for (const { lang } of parsedLocales) {
      const locale = locales.find(
        (l) => lang === l || lang.startsWith(`${l}-`) || l.startsWith(`${lang}-`)
      );
      if (locale) return locale;
    }
  } catch (error) {
    console.error("Error getting locale from request:", error);
  }

  return defaultLocale;
}

// 从路径中提取语言
export function getLocaleFromPath(path: string): string {
  const segments = path.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && locales.includes(firstSegment)) {
    return firstSegment;
  }

  return defaultLocale;
}
