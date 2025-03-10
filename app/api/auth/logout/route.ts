import { NextRequest, NextResponse } from "next/server";
import serverApi from "@/lib/api/server";
import { cookies } from "next/headers";

// 登出处理程序
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();

  try {
    console.log("API路由: 处理登出请求");
    // 获取认证令牌
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    // 转发请求到SpringBoot后端
    console.log("API路由: 转发登出请求到SpringBoot");
    const response = await serverApi.post("/auth/logout", null, token || undefined);

    // 清除Cookie中的令牌
    console.log("API路由: 清除Cookie");
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

    // 返回响应
    return NextResponse.json(response);
  } catch (error: any) {
    console.error("API路由: 登出处理失败", error);

    // 即使出错，也清除Cookie中的令牌
    console.log("API路由: 尽管出错，仍清除Cookie");
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

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
