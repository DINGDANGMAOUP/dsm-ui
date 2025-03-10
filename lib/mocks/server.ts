import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// 创建一个MSW服务器实例，并配置请求处理程序
export const server = setupServer(...handlers);

// 添加监听器
server.events.on("request:start", ({ request }) => {
  console.log(`🔹 拦截请求: ${request.method} ${request.url}`);
});

server.events.on("request:end", ({ request }) => {
  console.log(`🔸 响应请求: ${request.method} ${request.url}`);
});

server.events.on("request:unhandled", ({ request }) => {
  console.warn(`⚠️ 未处理的请求: ${request.method} ${request.url}`);
});
