"use client";

import { useParams } from "next/navigation";
import { createContext, useContext } from "react";
import { locales, defaultLocale } from "./dictionaries";

// 创建国际化上下文
export const LocaleContext = createContext<string>(defaultLocale);

// 使用国际化上下文的钩子
export function useLocale() {
  return useContext(LocaleContext);
}

// 从路由参数中获取当前语言的钩子
export function useCurrentLocale() {
  const params = useParams();
  const locale = params?.locale as string;

  console.log(`useCurrentLocale: 从路由参数获取语言: ${locale}`);

  // 验证语言是否受支持
  if (locale && locales.includes(locale)) {
    return locale;
  }

  console.log(`useCurrentLocale: 使用默认语言: ${defaultLocale}`);
  return defaultLocale;
}

// 格式化带有语言前缀的路径
export function formatLocalePath(path: string, locale: string) {
  // 如果路径已经以 / 开头，则移除
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  const formattedPath = `/${locale}/${cleanPath}`;
  console.log(`formatLocalePath: ${path} -> ${formattedPath}`);

  return formattedPath;
}
