// 用户角色定义
export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  USER = "USER",
}

// 新的权限类型定义
export type Authority = string;

// 菜单项定义
export interface MenuItem {
  id: number;
  parentId: number | null;
  menuName: string;
  orderNum: number;
  path: string;
  frame: boolean;
  cache: boolean;
  icon: string;
}

// 新的用户信息定义
export interface UserInfo {
  id: number;
  username: string;
  nickname: string;
  email: string;
  phone: string;
  sex: string;
  avatar: string;
  authorities: Authority[];
  permissions: string[];
  menus: MenuItem[];
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
