import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "./lib/dictionaries";

// 需要认证的路径
const AUTH_PATHS = ["/dashboard", "/profile", "/admin"];
// 不需要认证的API路径
const PUBLIC_API_PATHS = ["/api/auth/login", "/api/auth/refresh"];

// 获取请求的首选语言
function getLocale(request: NextRequest): string {
  // 从 cookie 中获取语言设置
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // 从 Accept-Language 头部获取语言设置
  const acceptLanguage = request.headers.get("accept-language") || "";
  const parsedLocales = acceptLanguage.split(",").map((locale) => {
    const [lang, q = "1"] = locale.split(";q=");
    return { lang: lang.trim(), q: parseFloat(q) };
  });

  // 按照 q 值排序
  parsedLocales.sort((a, b) => b.q - a.q);

  // 查找匹配的语言
  for (const { lang } of parsedLocales) {
    const locale = locales.find(
      (l) => lang === l || lang.startsWith(`${l}-`) || l.startsWith(`${lang}-`)
    );
    if (locale) return locale;
  }

  return defaultLocale;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 检查路径中是否已包含语言前缀
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // 调试信息
  console.log(`中间件: 处理路径: ${pathname}`);
  console.log(`中间件: Cookie: ${request.cookies.toString()}`);

  // 如果是API请求，不进行语言重定向
  if (pathname.startsWith("/api/")) {
    // 如果是公共API，直接放行
    if (PUBLIC_API_PATHS.some((path) => pathname.startsWith(path))) {
      console.log("中间件: 公共API，放行");
      return NextResponse.next();
    }

    // 获取访问令牌
    const accessToken = request.cookies.get("access_token")?.value;
    console.log(`中间件: API请求，令牌: ${accessToken ? "存在" : "不存在"}`);

    // 如果没有访问令牌，返回401
    if (!accessToken) {
      console.log("中间件: API请求未授权，返回401");
      return NextResponse.json(
        {
          code: 401,
          message: "未授权",
          success: false,
        },
        { status: 401 }
      );
    }

    // 将访问令牌添加到请求头
    const headers = new Headers(request.headers);
    headers.set("Authorization", `Bearer ${accessToken}`);
    console.log("中间件: 添加Authorization头");

    // 继续处理请求
    return NextResponse.next({
      request: {
        headers,
      },
    });
  }

  // 如果路径中已包含语言前缀，则不进行重定向
  if (pathnameHasLocale) {
    // 检查是否需要认证
    const locale = pathname.split("/")[1];
    const pathWithoutLocale = pathname.replace(`/${locale}`, "");

    if (AUTH_PATHS.some((path) => pathWithoutLocale.startsWith(path))) {
      // 获取访问令牌
      const accessToken = request.cookies.get("access_token")?.value;
      console.log(`中间件: 页面请求 ${pathname}，令牌: ${accessToken ? "存在" : "不存在"}`);

      // 如果没有访问令牌，重定向到登录页
      if (!accessToken) {
        console.log(`中间件: 重定向到登录页，原路径: ${pathname}`);
        return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
      }
    }

    return NextResponse.next();
  }

  // 获取用户首选语言
  const locale = getLocale(request);

  // 构建新的URL，添加语言前缀
  request.nextUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  // 重定向到带有语言前缀的URL
  return NextResponse.redirect(request.nextUrl);
}

// 配置中间件匹配的路径
export const config = {
  matcher: [
    // 匹配所有API路径
    "/api/:path*",
    // 匹配所有非静态资源路径
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|mockServiceWorker.js).*)",
  ],
};
