import { NextRequest, NextResponse } from "next/server";
import { LoginResponse } from "@/lib/types";
import serverApi from "@/lib/api/server";
import { cookies } from "next/headers";

// 刷新令牌处理程序
export async function POST(req: NextRequest) {
  try {
    // 从请求中获取刷新令牌
    const body = await req.json();

    // 转发请求到SpringBoot后端
    const response = await serverApi.post<LoginResponse>("/auth/refresh", body);

    // 如果刷新成功，设置新的令牌到Cookie
    if (response.success && response.data) {
      const { accessToken, refreshToken } = response.data;
      const cookieStore = cookies();

      // 设置访问令牌
      cookieStore.set("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 15, // 15分钟
        path: "/",
      });

      // 设置刷新令牌
      cookieStore.set("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7天
        path: "/",
      });
    }

    // 返回响应
    return NextResponse.json(response);
  } catch (error: any) {
    console.error("刷新令牌失败", error);
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
