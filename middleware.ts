import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "./lib/dictionaries";

// 需要认证的路径
const AUTH_PATHS = ["/dashboard", "/profile", "/admin"];
// 不需要认证的API路径
const PUBLIC_API_PATHS = ["/api/auth/login", "/api/auth/refresh"];
// 刷新令牌API路径
const REFRESH_TOKEN_PATH = "/api/auth/refresh";

// 获取请求的首选语言
function getLocale(request: NextRequest): string {
  // 从 cookie 中获取语言设置
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    console.log(`中间件: 从 cookie 获取语言: ${cookieLocale}`);
    return cookieLocale;
  }

  // 从 Accept-Language 头部获取语言设置
  const acceptLanguage = request.headers.get("accept-language") || "";
  console.log(`中间件: Accept-Language: ${acceptLanguage}`);

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
    if (locale) {
      console.log(`中间件: 从 Accept-Language 获取语言: ${locale}`);
      return locale;
    }
  }

  console.log(`中间件: 使用默认语言: ${defaultLocale}`);
  return defaultLocale;
}

// 刷新访问令牌
async function refreshAccessToken(refreshToken: string) {
  try {
    console.log("中间件: 开始刷新访问令牌");
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${REFRESH_TOKEN_PATH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      console.log(`中间件: 刷新令牌失败，状态码: ${response.status}`);
      return null;
    }

    const data = await response.json();
    if (!data.success || !data.data) {
      console.log("中间件: 刷新令牌失败，响应不成功");
      return null;
    }

    console.log("中间件: 刷新令牌成功");
    return {
      accessToken: data.data.accessToken,
      refreshToken: data.data.refreshToken,
    };
  } catch (error) {
    console.error("中间件: 刷新令牌出错", error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const fullPath = `${pathname}${search}`;

  // 调试信息
  console.log(`中间件: 处理路径: ${fullPath}`);
  console.log(`中间件: Cookie: ${request.cookies.toString()}`);

  // 检查路径中是否已包含语言前缀
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  console.log(`中间件: 路径是否包含语言前缀: ${pathnameHasLocale}`);

  // 如果是静态资源，直接放行
  if (
    pathname.startsWith("/_next") ||
    pathname.includes("/favicon.ico") ||
    pathname.includes("/robots.txt") ||
    pathname.includes("/mockServiceWorker.js")
  ) {
    console.log(`中间件: 静态资源，放行: ${pathname}`);
    return NextResponse.next();
  }

  // 如果是API请求，不进行语言重定向
  if (pathname.startsWith("/api/")) {
    // 如果是公共API，直接放行
    if (PUBLIC_API_PATHS.some((path) => pathname.startsWith(path))) {
      console.log("中间件: 公共API,放行");
      return NextResponse.next();
    }

    // 获取访问令牌
    const accessToken = request.cookies.get("access_token")?.value;
    console.log(`中间件: API请求,令牌: ${accessToken ? "存在" : "不存在"}`);

    // 如果没有访问令牌，尝试使用刷新令牌
    if (!accessToken) {
      const refreshToken = request.cookies.get("refresh_token")?.value;

      // 如果没有刷新令牌，返回401
      if (!refreshToken) {
        console.log("中间件: API请求未授权,没有刷新令牌,返回401");
        return NextResponse.json(
          {
            code: 401,
            message: "未授权",
            success: false,
          },
          { status: 401 }
        );
      }

      // 尝试刷新访问令牌
      const tokens = await refreshAccessToken(refreshToken);
      if (!tokens) {
        console.log("中间件: 刷新令牌失败,返回401");
        return NextResponse.json(
          {
            code: 401,
            message: "未授权",
            success: false,
          },
          { status: 401 }
        );
      }

      // 创建新的响应
      const response = NextResponse.next({
        request: {
          headers: new Headers({
            ...Object.fromEntries(request.headers),
            Authorization: `Bearer ${tokens.accessToken}`,
          }),
        },
      });

      // 设置新的令牌到Cookie
      response.cookies.set("access_token", tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      response.cookies.set("refresh_token", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      console.log("中间件: 令牌已刷新,继续处理请求");
      return response;
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
    console.log(`中间件: 当前语言: ${locale}, 不含语言的路径: ${pathWithoutLocale}`);

    if (AUTH_PATHS.some((path) => pathWithoutLocale.startsWith(path))) {
      // 获取访问令牌
      const accessToken = request.cookies.get("access_token")?.value;
      console.log(`中间件: 页面请求 ${pathname}，令牌: ${accessToken ? "存在" : "不存在"}`);

      // 如果没有访问令牌，尝试使用刷新令牌
      if (!accessToken) {
        const refreshToken = request.cookies.get("refresh_token")?.value;

        // 如果没有刷新令牌，重定向到登录页
        if (!refreshToken) {
          console.log(`中间件: 重定向到登录页，原路径: ${pathname}`);
          return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
        }

        // 尝试刷新访问令牌
        const tokens = await refreshAccessToken(refreshToken);
        if (!tokens) {
          console.log(`中间件: 刷新令牌失败，重定向到登录页，原路径: ${pathname}`);
          return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
        }

        // 创建新的响应
        const response = NextResponse.next();

        // 设置新的令牌到Cookie
        response.cookies.set("access_token", tokens.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
        });

        response.cookies.set("refresh_token", tokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
        });

        console.log("中间件: 令牌已刷新,继续处理请求");
        return response;
      }
    }

    console.log(`中间件: 路径已包含语言前缀，放行: ${pathname}`);
    return NextResponse.next();
  }

  // 获取用户首选语言
  const locale = getLocale(request);

  // 构建新的URL，添加语言前缀
  const newPathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  const newUrl = new URL(newPathname, request.url);
  newUrl.search = search;

  console.log(`中间件: 重定向到带有语言前缀的URL: ${newUrl.pathname}${newUrl.search}`);

  // 重定向到带有语言前缀的URL
  return NextResponse.redirect(newUrl);
}

// 配置中间件匹配的路径
export const config = {
  matcher: [
    // 匹配所有路径，除了静态资源
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|mockServiceWorker.js).*)",
  ],
};
