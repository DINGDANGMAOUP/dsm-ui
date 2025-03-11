"use client";

import Link from "next/link";
import { useCurrentLocale, formatLocalePath } from "@/lib/i18n-utils";
import { ComponentProps } from "react";

type LocaleLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  locale?: string;
};

export function LocaleLink({ href, locale, ...props }: LocaleLinkProps) {
  // 获取当前语言
  const currentLocale = useCurrentLocale();

  // 使用指定的语言或当前语言
  const targetLocale = locale || currentLocale;

  // 如果链接已经是绝对URL或以#开头，则不添加语言前缀
  if (href.startsWith("http") || href.startsWith("#")) {
    console.log(`LocaleLink: 绝对URL或锚点链接,不添加前缀: ${href}`);
    return <Link href={href} {...props} />;
  }

  // 如果链接已经包含语言前缀，则不再添加
  if (href.startsWith(`/${targetLocale}/`) || href === `/${targetLocale}`) {
    console.log(`LocaleLink: 链接已包含语言前缀: ${href}`);
    return <Link href={href} {...props} />;
  }

  // 格式化带有语言前缀的路径
  const localizedHref = formatLocalePath(href, targetLocale);
  console.log(`LocaleLink: 添加语言前缀: ${href} -> ${localizedHref}`);

  return <Link href={localizedHref} {...props} />;
}
