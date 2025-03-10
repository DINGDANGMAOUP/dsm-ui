// 根据环境初始化mock服务
async function initMocks() {
  // 只在服务器端和开发环境中启动mock
  try {
    const { server } = await import("./server");
    server.listen();
    console.log("🔶 服务器端Mock服务已启动");
  } catch (error) {
    console.error("启动Mock服务失败:", error);
  }
}

export default initMocks;
