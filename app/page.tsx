import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white">欢迎使用 DSM-UI</h1>
      <p className="mb-8 text-center text-lg text-gray-600 dark:text-gray-400">
        这是一个使用 Next.js 构建的企业级应用，包含认证和权限控制。
      </p>
      <div className="flex space-x-4">
        <Link
          href="/login"
          className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
        >
          登录
        </Link>
        <Link
          href="/dashboard"
          className="rounded-md bg-gray-600 px-6 py-3 text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
        >
          仪表盘
        </Link>
      </div>
      <div className="mt-8">
        <ModeToggle />
      </div>
    </div>
  );
}
