import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// 创建一个MSW服务器实例，并配置请求处理程序
export const server = setupServer(...handlers);
