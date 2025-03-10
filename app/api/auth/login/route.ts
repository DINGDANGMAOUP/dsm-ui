import { NextRequest, NextResponse } from "next/server";
import { LoginResponse } from "@/lib/types";
import serverApi from "@/lib/api/server";
import { cookies } from "next/headers";

// 登录处理程序
export async function POST(req: NextRequest) {
  try {
    // 从请求中获取登录信息
    const body = await req.json();

    // 转发请求到SpringBoot后端
    const response = await serverApi.post<LoginResponse>("/auth/login", body);
    // 如果登录成功，设置令牌到Cookie
    if (response.success && response.data) {
      const { accessToken, refreshToken } = response.data;
      const cookieStore = await cookies();
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
    }

    // 返回响应
    return NextResponse.json(response);
  } catch (error: any) {
    console.error("登录失败", error);
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
