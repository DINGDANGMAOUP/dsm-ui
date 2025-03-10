import { NextRequest, NextResponse } from "next/server";
import { LoginResponse } from "@/lib/types";
import serverApi from "@/lib/api/server";
import { cookies } from "next/headers";

// 刷新令牌处理程序
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    console.log("API路由: 处理刷新令牌请求");
    // 从请求中获取刷新令牌
    const body = await req.json();

    // 转发请求到SpringBoot后端
    console.log("API路由: 转发刷新令牌请求到SpringBoot");
    const response = await serverApi.post<LoginResponse>("/auth/refresh", body);

    // 如果刷新成功，设置新的令牌到Cookie
    if (response.success && response.data) {
      console.log("API路由: 刷新令牌成功，设置新Cookie");
      const { accessToken, refreshToken } = response.data;

      // 设置访问令牌
      cookieStore.set("access_token", accessToken, {
        httpOnly: false, // 允许JavaScript访问，便于客户端获取
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax", // 允许跨站点请求
        maxAge: 60 * 60 * 24, // 24小时
        path: "/",
      });

      // 设置刷新令牌
      cookieStore.set("refresh_token", refreshToken, {
        httpOnly: true, // 不允许JavaScript访问，提高安全性
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax", // 允许跨站点请求
        maxAge: 60 * 60 * 24 * 7, // 7天
        path: "/",
      });
    } else {
      console.log("API路由: 刷新令牌失败", response);
    }

    // 返回响应
    return NextResponse.json(response);
  } catch (error: any) {
    console.error("API路由: 刷新令牌处理失败", error);
    return NextResponse.json(
      {
        code: 500,
        message: error.message || "服务器错误",
        success: false,
      },
      { status: 500 }
    );
  }
}
