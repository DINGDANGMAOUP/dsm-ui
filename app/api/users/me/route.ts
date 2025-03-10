import { NextRequest, NextResponse } from "next/server";
import { User } from "@/lib/types";
import serverApi from "@/lib/api/server";

// 获取当前用户信息
export async function GET(req: NextRequest) {
  try {
    // 获取认证令牌
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
      return NextResponse.json(
        {
          code: 401,
          message: "未授权",
          success: false,
        },
        { status: 401 }
      );
    }

    // 转发请求到SpringBoot后端
    const response = await serverApi.get<User>("/users/me", token);

    // 返回响应
    return NextResponse.json(response);
  } catch (error: any) {
    console.error("获取用户信息失败", error);
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
