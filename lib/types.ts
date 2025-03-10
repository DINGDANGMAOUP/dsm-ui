// 用户角色定义
export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  USER = "USER",
}

// 权限定义
export enum Permission {
  READ = "READ",
  WRITE = "WRITE",
  DELETE = "DELETE",
  ADMIN = "ADMIN",
}

// 用户信息
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  avatar?: string;
}

// 登录请求
export interface LoginRequest {
  username: string;
  password: string;
}

// 登录响应
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}

// 刷新Token请求
export interface RefreshTokenRequest {
  refreshToken: string;
}

// API响应基础结构
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
  success: boolean;
}

// 分页请求参数
export interface PaginationParams {
  page: number;
  size: number;
  sort?: string;
  order?: "asc" | "desc";
}

// 分页响应
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
