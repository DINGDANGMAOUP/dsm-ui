"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LocaleLink } from "@/components/locale-link";
import { setAccessToken } from "@/lib/auth/token";

type LoginFormProps = {
  locale: string;
  translations: {
    username: string;
    password: string;
    rememberMe: string;
    forgotPassword: string;
    submit: string;
    back: string;
  };
};

// 用户数据类型
type UserData = {
  username: string;
  role: string;
  loginTime: number;
};

export default function LoginForm({ locale, translations }: LoginFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log("提交登录表单:", formData);

      // 模拟登录成功
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 根据用户名设置不同的角色
      let role = "User";
      if (formData.username.toLowerCase() === "admin") {
        role = "Administrator";
      } else if (formData.username.toLowerCase() === "manager") {
        role = "Manager";
      }

      // 创建用户数据
      const userData: UserData = {
        username: formData.username,
        role: role,
        loginTime: Date.now(),
      };

      // 保存用户数据到 localStorage
      localStorage.setItem("userData", JSON.stringify(userData));
      console.log("用户数据已保存到 localStorage:", userData);

      // 使用 setAccessToken 函数设置令牌
      setAccessToken("mock_token");
      console.log("访问令牌已设置");

      console.log("登录成功，准备跳转到仪表盘");
      router.push(`/${locale}/dashboard`);
    } catch (err: any) {
      console.error("登录失败:", err);
      setError(err.message || "登录失败，请稍后再试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {translations.username}
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {translations.password}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
          >
            {translations.rememberMe}
          </label>
        </div>

        <div className="text-sm">
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
            {translations.forgotPassword}
          </a>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
        >
          {isLoading ? "Loading..." : translations.submit}
        </button>
      </div>

      <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>测试账号：</p>
        <p>用户名: admin, manager, user</p>
        <p>密码: password</p>
      </div>
    </form>
  );
}
