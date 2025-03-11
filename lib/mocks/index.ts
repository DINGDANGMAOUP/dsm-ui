// 根据环境初始化mock服务
async function initMocks() {
  console.log("Mock模块: 开始初始化Mock服务...");
  console.log(`Mock模块: 环境: ${process.env.NODE_ENV}`);
  console.log(`Mock模块: 是否启用Mock: ${process.env.ENABLE_MOCKS}`);
  if (process.env.ENABLE_MOCKS === "true") {
    try {
      console.log("Mock模块: 正在导入服务器端Mock...");
      const { server } = await import("./server");
      console.log("Mock模块: 正在启动服务器端Mock...");
      server.listen({ onUnhandledRequest: "bypass" });
      console.log("Mock模块: 🔶 服务器端Mock服务已启动");

      // 添加关闭处理
      if (typeof process !== "undefined") {
        process.on("SIGTERM", () => {
          console.log("Mock模块: 关闭Mock服务...");
          server.close();
        });
      }

      return true;
    } catch (error) {
      console.error("Mock模块: 启动Mock服务失败:", error);
      return false;
    }
  } else {
    console.log("Mock模块: 跳过初始化");
    return false;
  }
}

export default initMocks;
