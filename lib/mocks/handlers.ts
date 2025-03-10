import { http, HttpResponse, delay } from "msw";
import { ApiResponse, LoginResponse, Permission, User, UserRole } from "../types";
import { verify, sign } from "jsonwebtoken";

// 定义SpringBoot API基础URL
const SPRING_BOOT_API_URL = process.env.SPRING_BOOT_API_URL || "http://localhost:8080/api";

// 打印配置信息
console.log(`🔧 Mock配置: SPRING_BOOT_API_URL = ${SPRING_BOOT_API_URL}`);

// JWT密钥（仅用于开发环境）
const JWT_SECRET = "mock-jwt-secret-key";
const JWT_REFRESH_SECRET = "mock-jwt-refresh-secret-key";

// 模拟用户数据
const users: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@example.com",
    role: UserRole.ADMIN,
    permissions: [Permission.READ, Permission.WRITE, Permission.DELETE, Permission.ADMIN],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
  },
  {
    id: "2",
    username: "manager",
    email: "manager@example.com",
    role: UserRole.MANAGER,
    permissions: [Permission.READ, Permission.WRITE],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=manager",
  },
  {
    id: "3",
    username: "user",
    email: "user@example.com",
    role: UserRole.USER,
    permissions: [Permission.READ],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
  },
];

// 存储刷新令牌
const refreshTokens: Record<string, string> = {};

// 生成访问令牌
const generateAccessToken = (user: User) => {
  return sign(
    { sub: user.id, username: user.username, role: user.role, permissions: user.permissions },
    JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

// 生成刷新令牌
const generateRefreshToken = (user: User) => {
  const refreshToken = sign({ sub: user.id }, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
  refreshTokens[user.id] = refreshToken;
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
export const handlers = [
  // 登录接口
  http.post(`${SPRING_BOOT_API_URL}/auth/login`, async ({ request }) => {
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

    const user = users.find((u) => u.username === username);
    if (!user) {
      console.log("❌ 用户不存在");
      return HttpResponse.json(createErrorResponse("用户不存在", 401), { status: 401 });
    }

    // 生成令牌
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const response: LoginResponse = {
      accessToken,
      refreshToken,
      user,
      expiresIn: 15 * 60, // 15分钟，单位秒
    };

    console.log("✅ 登录成功");
    return HttpResponse.json(createSuccessResponse(response));
  }),

  // 刷新令牌接口
  http.post(`${SPRING_BOOT_API_URL}/auth/refresh`, async ({ request }) => {
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

      const user = users.find((u) => u.id === userId);
      if (!user) {
        console.log("❌ 用户不存在");
        return HttpResponse.json(createErrorResponse("用户不存在", 401), { status: 401 });
      }

      // 生成新的访问令牌和刷新令牌
      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);

      const response: LoginResponse = {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user,
        expiresIn: 15 * 60,
      };

      console.log("✅ 刷新令牌成功");
      return HttpResponse.json(createSuccessResponse(response));
    } catch (error) {
      console.log("❌ 刷新令牌失败", error);
      return HttpResponse.json(createErrorResponse("无效的刷新令牌", 401), { status: 401 });
    }
  }),

  // 获取当前用户信息
  http.get(`${SPRING_BOOT_API_URL}/users/me`, ({ request }) => {
    console.log("👤 获取当前用户信息");
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ 未授权");
      return HttpResponse.json(createErrorResponse("未授权", 401), { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = verify(token, JWT_SECRET) as { sub: string };
      const user = users.find((u) => u.id === decoded.sub);

      if (!user) {
        console.log("❌ 用户不存在");
        return HttpResponse.json(createErrorResponse("用户不存在", 404), { status: 404 });
      }

      console.log(`✅ 获取用户成功: ${user.username}`);
      return HttpResponse.json(createSuccessResponse(user));
    } catch (error) {
      console.log("❌ 无效的令牌");
      return HttpResponse.json(createErrorResponse("无效的令牌", 401), { status: 401 });
    }
  }),

  // 登出接口
  http.post(`${SPRING_BOOT_API_URL}/auth/logout`, ({ request }) => {
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
  http.get(`${SPRING_BOOT_API_URL}/users`, ({ request }) => {
    console.log("👥 获取用户列表");
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ 未授权");
      return HttpResponse.json(createErrorResponse("未授权", 401), { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = verify(token, JWT_SECRET) as { sub: string; role: UserRole };

      // 检查权限
      if (decoded.role !== UserRole.ADMIN) {
        console.log("❌ 没有权限");
        return HttpResponse.json(createErrorResponse("没有权限访问此资源", 403), { status: 403 });
      }

      console.log("✅ 获取用户列表成功");
      return HttpResponse.json(createSuccessResponse(users));
    } catch (error) {
      console.log("❌ 无效的令牌");
      return HttpResponse.json(createErrorResponse("无效的令牌", 401), { status: 401 });
    }
  }),
];
