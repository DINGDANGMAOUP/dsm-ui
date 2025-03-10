import { setupServer } from "msw/node";
import { handlers } from "./handlers";

console.log("Mock服务器: 创建MSW服务器实例");

// 创建一个MSW服务器实例，并配置请求处理程序
export const server = setupServer(...handlers);

// 添加监听器
server.events.on("request:start", ({ request }) => {
  console.log(`Mock服务器: 🔹 拦截请求: ${request.method} ${request.url}`);
});

server.events.on("response:mocked", ({ request, response }) => {
  console.log(`Mock服务器: ✅ 响应请求: ${request.method} ${request.url} - ${response.status}`);
});

server.events.on("response:bypass", ({ request }) => {
  console.log(`Mock服务器: ⏭️ 跳过请求: ${request.method} ${request.url}`);
});

server.events.on("request:unhandled", ({ request }) => {
  console.warn(`Mock服务器: ⚠️ 未处理的请求: ${request.method} ${request.url}`);
});
