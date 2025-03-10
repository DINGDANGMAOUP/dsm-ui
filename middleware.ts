import { NextRequest, NextResponse } from "next/server";

// 需要认证的路径
const AUTH_PATHS = ["/dashboard", "/profile", "/admin"];
// 不需要认证的API路径
const PUBLIC_API_PATHS = ["/api/auth/login", "/api/auth/refresh"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 调试信息
  console.log(`中间件: 处理路径: ${pathname}`);
  console.log(`中间件: Cookie: ${request.cookies.toString()}`);

  // 如果是API请求
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

  // 如果是页面请求
  if (AUTH_PATHS.some((path) => pathname.startsWith(path))) {
    // 获取访问令牌
    const accessToken = request.cookies.get("access_token")?.value;
    console.log(`中间件: 页面请求 ${pathname}，令牌: ${accessToken ? "存在" : "不存在"}`);

    // 如果没有访问令牌，重定向到登录页
    if (!accessToken) {
      console.log(`中间件: 重定向到登录页，原路径: ${pathname}`);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 继续处理请求
  return NextResponse.next();
}

// 配置中间件匹配的路径
export const config = {
  matcher: [
    // 匹配所有API路径
    "/api/:path*",
    // 匹配需要认证的页面路径
    "/dashboard/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|mockServiceWorker.js).*)",
  ],
};
