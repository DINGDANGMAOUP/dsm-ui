import { NextRequest, NextResponse } from "next/server";
import serverApi from "@/lib/api/server";
import { cookies } from "next/headers";

// 登出处理程序
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();

  try {
    // 获取认证令牌
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    // 转发请求到SpringBoot后端
    const response = await serverApi.post("/auth/logout", null, token || undefined);
    // 清除Cookie中的令牌
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

    // 返回响应
    return NextResponse.json(response);
  } catch (error: any) {
    console.error("登出失败", error);

    // 即使出错，也清除Cookie中的令牌
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
