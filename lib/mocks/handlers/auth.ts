import { http, HttpResponse, delay } from "msw";
import { ApiResponse, LoginResponse, UserInfo, MenuItem } from "@/lib/types";
import { verify, sign } from "jsonwebtoken";
import { BASE_URL } from "@/lib/api/server";
// JWT密钥（仅用于开发环境）
const JWT_SECRET = "mock-jwt-secret-key";
const JWT_REFRESH_SECRET = "mock-jwt-refresh-secret-key";

// 模拟菜单数据
const menuItems: MenuItem[] = [
  {
    id: 1,
    parentId: null,
    menuName: "workplace",
    orderNum: 0,
    path: "/workplace",
    frame: false,
    cache: true,
    icon: "monitor-cog",
  },
  {
    id: 2,
    parentId: 1,
    menuName: "home",
    orderNum: 0,
    path: "/workplace/home",
    frame: false,
    cache: true,
    icon: "house",
  },
  {
    id: 3,
    parentId: 1,
    menuName: "about",
    orderNum: 1,
    path: "/workplace/about",
    frame: false,
    cache: true,
    icon: "badge-info",
  },
  {
    id: 8,
    parentId: null,
    menuName: "profile",
    orderNum: 2,
    path: "/profile",
    frame: false,
    cache: true,
    icon: "user",
  },
  {
    id: 4,
    parentId: null,
    menuName: "system",
    orderNum: 0,
    path: "/system",
    frame: false,
    cache: true,
    icon: "file-sliders",
  },
  {
    id: 5,
    parentId: 4,
    menuName: "user",
    orderNum: 1,
    path: "/system/user",
    frame: false,
    cache: true,
    icon: "user",
  },
  {
    id: 6,
    parentId: 4,
    menuName: "dept",
    orderNum: 1,
    path: "/system/dept",
    frame: false,
    cache: true,
    icon: "ruler",
  },
  {
    id: 7,
    parentId: 4,
    menuName: "menu",
    orderNum: 0,
    path: "/system/menu",
    frame: false,
    cache: true,
    icon: "menu",
  },
];

// 模拟用户数据
const userInfos: UserInfo[] = [
  {
    id: 0,
    username: "admin",
    nickname: "超级管理员",
    email: "dingdangmaoup@gmail.com",
    phone: "17607003598",
    sex: "1",
    avatar: "https://uchat.cn-bj.ufileos.com/rw_93484f18-7b8c-4cb2-b47c-24d8f5afefdd_unnamed.gif",
    authorities: ["admin"],
    permissions: [
      "dashboard:view",
      "home:view",
      "user:view",
      "dept:view",
      "about:view",
      "menu:view",
      "system:view",
      "profile:view",
    ],
    menus: menuItems,
  },
  {
    id: 1,
    username: "manager",
    nickname: "管理员",
    email: "manager@example.com",
    phone: "13800138000",
    sex: "1",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=manager",
    authorities: ["manager"],
    permissions: ["dashboard:view", "home:view", "user:view", "dept:view", "profile:view"],
    menus: menuItems.filter((item) => item.id !== 7), // 管理员没有菜单管理权限
  },
  {
    id: 2,
    username: "user",
    nickname: "普通用户",
    email: "user@example.com",
    phone: "13900139000",
    sex: "0",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
    authorities: ["user"],
    permissions: ["dashboard:view", "home:view", "profile:view"],
    menus: menuItems.filter((item) => ![5, 6, 7].includes(item.id)), // 普通用户只有工作台权限
  },
];

// 存储刷新令牌
const refreshTokens: Record<string, string> = {};

// 生成访问令牌
const generateAccessToken = (userInfo: UserInfo) => {
  return sign(
    {
      sub: userInfo.id.toString(),
      username: userInfo.username,
      authorities: userInfo.authorities,
      permissions: userInfo.permissions,
    },
    JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

// 生成刷新令牌
const generateRefreshToken = (userInfo: UserInfo) => {
  const refreshToken = sign({ sub: userInfo.id.toString() }, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
  refreshTokens[userInfo.id.toString()] = refreshToken;
  return refreshToken;
};

// 创建成功响应
const createSuccessResponse = <T>(data: T): ApiResponse<T> => {
  return {
    code: 200,
    message: "操作成功",
    data,
    success: true,
  };
};

// 创建错误响应
const createErrorResponse = (message: string, code = 400): ApiResponse => {
  return {
    code,
    message,
    success: false,
  };
};

// API请求处理程序 - 拦截对SpringBoot API的请求
export default [
  // 登录接口
  http.post(`${BASE_URL}/auth/login`, async ({ request }) => {
    console.log("🔑 处理登录请求");
    await delay(500); // 模拟网络延迟

    const body = (await request.json()) as { username: string; password: string };
    const { username, password } = body;

    console.log(`👤 登录用户: ${username}`);

    // 简单的用户验证（在实际应用中应使用更安全的方式）
    if (password !== "password") {
      console.log("❌ 密码错误");
      return HttpResponse.json(createErrorResponse("用户名或密码错误", 401), { status: 401 });
    }

    // 查找用户信息
    const userInfo = userInfos.find((u) => u.username === username);
    if (!userInfo) {
      console.log("❌ 用户不存在");
      return HttpResponse.json(createErrorResponse("用户不存在", 401), { status: 401 });
    }

    // 生成令牌
    const accessToken = generateAccessToken(userInfo);
    const refreshToken = generateRefreshToken(userInfo);

    // 只返回token信息
    const response: LoginResponse = {
      accessToken,
      refreshToken,
    };

    console.log("✅ 登录成功");
    return HttpResponse.json(createSuccessResponse(response));
  }),

  // 刷新令牌接口
  http.post(`${BASE_URL}/auth/refresh`, async ({ request }) => {
    console.log("🔄 处理刷新令牌请求");
    await delay(300);

    const body = (await request.json()) as { refreshToken: string };
    const { refreshToken } = body;

    // 验证刷新令牌
    try {
      const decoded = verify(refreshToken, JWT_REFRESH_SECRET) as { sub: string };
      const userId = decoded.sub;

      console.log(`👤 刷新用户ID: ${userId}`);

      // 检查刷新令牌是否有效
      if (refreshTokens[userId] !== refreshToken) {
        console.log("❌ 无效的刷新令牌");
        return HttpResponse.json(createErrorResponse("无效的刷新令牌", 401), { status: 401 });
      }

      // 查找用户
      const userInfo = userInfos.find((u) => u.id.toString() === userId);
      if (!userInfo) {
        console.log("❌ 用户不存在");
        return HttpResponse.json(createErrorResponse("用户不存在", 401), { status: 401 });
      }

      // 生成新的访问令牌和刷新令牌
      const newAccessToken = generateAccessToken(userInfo);
      const newRefreshToken = generateRefreshToken(userInfo);

      // 只返回token信息
      const response: LoginResponse = {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };

      console.log("✅ 刷新令牌成功");
      return HttpResponse.json(createSuccessResponse(response));
    } catch (error) {
      console.log("❌ 刷新令牌失败", error);
      return HttpResponse.json(createErrorResponse("无效的刷新令牌", 401), { status: 401 });
    }
  }),

  // 获取当前用户信息
  http.get(`${BASE_URL}/users/me`, ({ request }) => {
    console.log("👤 获取当前用户信息");
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ 未授权");
      return HttpResponse.json(createErrorResponse("未授权", 401), { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = verify(token, JWT_SECRET) as { sub: string; authorities?: string[] };

      // 查找用户
      const userInfo = userInfos.find((u) => u.id.toString() === decoded.sub);
      if (!userInfo) {
        console.log("❌ 用户不存在");
        return HttpResponse.json(createErrorResponse("用户不存在", 404), { status: 404 });
      }

      console.log(`✅ 获取当前用户信息成功: ${userInfo.username}`);
      return HttpResponse.json(createSuccessResponse(userInfo));
    } catch (error) {
      console.log("❌ 无效的令牌");
      return HttpResponse.json(createErrorResponse("无效的令牌", 401), { status: 401 });
    }
  }),

  // 更新当前用户信息 - 新接口路径
  http.put(`${BASE_URL}/users/me`, async ({ request }) => {
    console.log("✏️ 更新当前用户信息 - /users/me");
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ 未授权");
      return HttpResponse.json(createErrorResponse("未授权", 401), { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = verify(token, JWT_SECRET) as { sub: string; authorities?: string[] };
      const userId = decoded.sub;

      // 查找用户
      const userIndex = userInfos.findIndex((u) => u.id.toString() === userId);
      if (userIndex === -1) {
        console.log("❌ 用户不存在");
        return HttpResponse.json(createErrorResponse("用户不存在", 404), { status: 404 });
      }

      // 获取请求体
      const body = (await request.json()) as Record<string, any>;

      // 只允许更新特定字段
      const allowedFields = ["nickname", "email", "phone", "sex", "avatar"];
      const userToUpdate = userInfos[userIndex];

      allowedFields.forEach((field) => {
        if (body[field] !== undefined) {
          (userToUpdate as any)[field] = body[field];
        }
      });

      // 更新用户信息
      userInfos[userIndex] = userToUpdate;

      console.log(`✅ 更新用户信息成功: ${userToUpdate.username}`);
      return HttpResponse.json(createSuccessResponse(userToUpdate));
    } catch (error) {
      console.log("❌ 无效的令牌");
      return HttpResponse.json(createErrorResponse("无效的令牌", 401), { status: 401 });
    }
  }),

  // 登出接口
  http.post(`${BASE_URL}/auth/logout`, ({ request }) => {
    console.log("🚪 处理登出请求");
    const authHeader = request.headers.get("Authorization");

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];

      try {
        const decoded = verify(token, JWT_SECRET) as { sub: string };
        const userId = decoded.sub;

        // 删除刷新令牌
        if (refreshTokens[userId]) {
          delete refreshTokens[userId];
          console.log(`✅ 删除用户ID: ${userId}的刷新令牌`);
        }
      } catch (error) {
        // 令牌无效，忽略错误
        console.log("⚠️ 无效的令牌，忽略");
      }
    }

    console.log("✅ 登出成功");
    return HttpResponse.json(createSuccessResponse(null));
  }),

  // 获取用户列表（需要管理员权限）
  http.get(`${BASE_URL}/users`, ({ request }) => {
    console.log("👥 获取用户列表");
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ 未授权");
      return HttpResponse.json(createErrorResponse("未授权", 401), { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = verify(token, JWT_SECRET) as { sub: string; authorities?: string[] };

      // 检查权限
      if (decoded.authorities && decoded.authorities.includes("admin")) {
        console.log("✅ 获取用户列表成功");
        return HttpResponse.json(createSuccessResponse(userInfos));
      }

      console.log("❌ 没有权限");
      return HttpResponse.json(createErrorResponse("没有权限访问此资源", 403), { status: 403 });
    } catch (error) {
      console.log("❌ 无效的令牌");
      return HttpResponse.json(createErrorResponse("无效的令牌", 401), { status: 401 });
    }
  }),

  // 获取用户菜单
  http.get(`${BASE_URL}/users/menus`, ({ request }) => {
    console.log("📋 获取用户菜单");
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ 未授权");
      return HttpResponse.json(createErrorResponse("未授权", 401), { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = verify(token, JWT_SECRET) as { sub: string; authorities?: string[] };

      // 查找用户
      const userInfo = userInfos.find((u) => u.id.toString() === decoded.sub);
      if (!userInfo) {
        console.log("❌ 用户不存在");
        return HttpResponse.json(createErrorResponse("用户不存在", 404), { status: 404 });
      }

      console.log(`✅ 获取用户菜单成功: ${userInfo.username}`);
      return HttpResponse.json(createSuccessResponse(userInfo.menus));
    } catch (error) {
      console.log("❌ 无效的令牌");
      return HttpResponse.json(createErrorResponse("无效的令牌", 401), { status: 401 });
    }
  }),

  // 获取用户权限
  http.get(`${BASE_URL}/users/permissions`, ({ request }) => {
    console.log("🔒 获取用户权限");
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ 未授权");
      return HttpResponse.json(createErrorResponse("未授权", 401), { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = verify(token, JWT_SECRET) as { sub: string; authorities?: string[] };

      // 查找用户
      const userInfo = userInfos.find((u) => u.id.toString() === decoded.sub);
      if (!userInfo) {
        console.log("❌ 用户不存在");
        return HttpResponse.json(createErrorResponse("用户不存在", 404), { status: 404 });
      }

      console.log(`✅ 获取用户权限成功: ${userInfo.username}`);
      return HttpResponse.json(createSuccessResponse(userInfo.permissions));
    } catch (error) {
      console.log("❌ 无效的令牌");
      return HttpResponse.json(createErrorResponse("无效的令牌", 401), { status: 401 });
    }
  }),
];
