// 根据环境初始化mock服务
async function initMocks() {
  console.log("开始初始化Mock服务...");
  console.log(`环境: ${process.env.NODE_ENV}`);
  console.log(`是否服务器端: ${typeof window === "undefined"}`);

  // 只在服务器端和开发环境中启动mock
  if (process.env.NODE_ENV === "development" && process.env.NEXT_RUNTIME === "nodejs") {
    try {
      console.log("正在导入服务器端Mock...");
      const { server } = await import("./server");
      console.log("正在启动服务器端Mock...");
      server.listen();
      console.log("🔶 服务器端Mock服务已启动");
    } catch (error) {
      console.error("启动Mock服务失败:", error);
    }
  } else {
    console.log("不满足启动Mock服务的条件,跳过初始化");
  }
}

export default initMocks;
