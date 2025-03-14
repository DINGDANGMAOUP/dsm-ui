"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LocaleLink } from "@/components/locale-link";

type LoginFormProps = {
  locale: string;
  translations: {
    title: string;
    username: string;
    password: string;
    rememberMe: string;
    forgotPassword: string;
    submit: string;
    back: string;
  };
  className?: string;
};

export function LoginForm({ locale, translations, className }: LoginFormProps) {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, rememberMe: checked }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log("提交登录表单:", formData);

      // 使用AuthContext中的login方法进行登录
      await login({
        username: formData.username,
        password: formData.password,
      });

      console.log("登录成功，准备跳转到仪表盘");
      router.push(`/${locale}/dashboard`);
    } catch (err: any) {
      console.error("登录失败:", err);
      setError(err.message || "登录失败，请稍后再试");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className={cn("grid w-full overflow-hidden rounded-lg shadow-lg md:grid-cols-2", className)}
    >
      <div className="relative hidden h-full flex-col bg-gradient-to-br from-blue-600 to-indigo-800 p-10 text-white md:flex md:rounded-l-lg dark:from-blue-800 dark:to-indigo-950">
        <div className="absolute inset-0 bg-black/20" />
        <div
          className="bg-grid-white/10 absolute inset-0"
          style={{ backgroundSize: "30px 30px" }}
        />
        <div className="absolute -top-6 -left-6 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-20 flex items-center text-xl font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-8 w-8"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          <span className="text-2xl font-bold tracking-tight">DSM-UI</span>
        </div>

        <div className="relative z-20 mt-auto">
          <div className="mb-6 flex flex-col space-y-2">
            <div className="h-1.5 w-12 rounded-full bg-white/50" />
            <div className="h-1.5 w-20 rounded-full bg-white/30" />
          </div>
          <blockquote className="space-y-2">
            <p className="text-xl leading-relaxed">
              &ldquo;勇气是人类最伟大的品质之一，它让我们敢于面对未知，敢于追求梦想。&rdquo;
            </p>
            <footer className="mt-4 flex items-center space-x-4">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-white/20">
                <div className="h-full w-full bg-gradient-to-br from-pink-500 to-violet-500" />
              </div>
              <div>
                <div className="font-medium">Dingdnamgoaup</div>
                <div className="text-sm text-white/70">full stack developer</div>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>

      <Card className="border-none shadow-none md:rounded-none md:rounded-r-lg md:border-0 md:shadow-none">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-center text-2xl font-bold tracking-tight">
            {translations.title}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-center">
            输入您的凭据以访问您的账户
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            </div>
          )}
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  {translations.username}
                </Label>
                <Input
                  id="username"
                  name="username"
                  placeholder={translations.username}
                  type="text"
                  autoCapitalize="none"
                  autoComplete="username"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="border-input/50 bg-background focus-visible:border-primary h-11 rounded-md px-4 py-3 text-sm transition-colors"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    {translations.password}
                  </Label>
                  <a
                    href="#"
                    className="text-primary hover:text-primary/80 text-sm font-medium underline-offset-4 transition-colors hover:underline"
                  >
                    {translations.forgotPassword}
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  placeholder={translations.password}
                  type="password"
                  autoCapitalize="none"
                  autoComplete="current-password"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="border-input/50 bg-background focus-visible:border-primary h-11 rounded-md px-4 py-3 text-sm transition-colors"
                />
              </div>
              <div className="flex items-center space-x-2 pt-1">
                <Checkbox
                  id="remember-me"
                  checked={formData.rememberMe}
                  onCheckedChange={handleCheckboxChange}
                  className="border-muted-foreground/30 data-[state=checked]:border-primary data-[state=checked]:bg-primary h-4 w-4 rounded-sm"
                />
                <Label
                  htmlFor="remember-me"
                  className="text-muted-foreground text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {translations.rememberMe}
                </Label>
              </div>
            </div>
            <Button
              disabled={isLoading}
              type="submit"
              className="h-11 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white transition-all hover:from-blue-700 hover:to-indigo-700 dark:from-blue-700 dark:to-indigo-700 dark:hover:from-blue-800 dark:hover:to-indigo-800"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  登录中...
                </div>
              ) : (
                translations.submit
              )}
            </Button>
          </form>
          <div className="border-muted-foreground/10 bg-muted/30 text-muted-foreground mt-6 rounded-lg border p-4 text-center text-sm">
            <p className="font-medium">测试账号</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-muted/50 rounded-md p-2">
                <span className="font-semibold">用户名:</span> admin, manager, user
              </div>
              <div className="bg-muted/50 rounded-md p-2">
                <span className="font-semibold">密码:</span> password
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pb-6">
          <LocaleLink
            href="/"
            className="group text-muted-foreground hover:text-primary flex items-center text-sm font-medium transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            {translations.back}
          </LocaleLink>
        </CardFooter>
      </Card>
    </div>
  );
}
