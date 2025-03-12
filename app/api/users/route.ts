import { NextRequest, NextResponse } from "next/server";
import { UserInfo } from "@/lib/types";
import serverApi from "@/lib/api/server";

// 获取用户列表
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

    // 获取查询参数
    const url = new URL(req.url);
    const page = url.searchParams.get("page") || "0";
    const size = url.searchParams.get("size") || "10";
    const sort = url.searchParams.get("sort");
    const order = url.searchParams.get("order");

    // 构建查询字符串
    let queryString = `?page=${page}&size=${size}`;
    if (sort) queryString += `&sort=${sort}`;
    if (order) queryString += `&order=${order}`;

    // 转发请求到SpringBoot后端
    const response = await serverApi.get<UserInfo[]>(`/users${queryString}`, token);

    // 返回响应
    return NextResponse.json(response);
  } catch (error: any) {
    console.error("获取用户列表失败", error);
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
