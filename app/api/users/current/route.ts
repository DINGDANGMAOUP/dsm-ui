import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/lib/api/server";

// 获取当前用户信息
export async function GET(request: NextRequest) {
  try {
    // 从请求中获取授权头
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ success: false, message: "未授权", code: 401 }, { status: 401 });
    }

    // 转发请求到后端API
    const response = await fetch(`${BASE_URL}/users/current`, {
      headers: {
        Authorization: authHeader,
      },
    });

    // 解析响应
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("获取当前用户信息失败:", error);
    return NextResponse.json({ success: false, message: "服务器错误", code: 500 }, { status: 500 });
  }
}

// 更新当前用户信息
export async function PUT(request: NextRequest) {
  try {
    // 从请求中获取授权头
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ success: false, message: "未授权", code: 401 }, { status: 401 });
    }

    // 获取请求体
    const body = await request.json();

    // 转发请求到后端API
    const response = await fetch(`${BASE_URL}/users/current`, {
      method: "PUT",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // 解析响应
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("更新当前用户信息失败:", error);
    return NextResponse.json({ success: false, message: "服务器错误", code: 500 }, { status: 500 });
  }
}
