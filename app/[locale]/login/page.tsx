import { ModeToggle } from "@components/mode-toggle";
import { LanguageSwitcher } from "@components/language-switcher";
import { getDictionary } from "@lib/dictionaries";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  // 获取当前语言
  const { locale } = await params;
  console.log(`LoginPage: 当前语言: ${locale}`);

  // 获取当前语言的字典
  const dict = await getDictionary(locale);
  console.log(`LoginPage: 加载字典成功`);

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-10 dark:from-gray-900 dark:to-gray-950">
      {/* 背景装饰 */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-blue-100/30 blur-3xl dark:bg-blue-900/10" />
        <div className="absolute -right-[10%] -bottom-[10%] h-[500px] w-[500px] rounded-full bg-indigo-100/30 blur-3xl dark:bg-indigo-900/10" />
        <div className="absolute top-[20%] left-[40%] h-[300px] w-[300px] rounded-full bg-pink-100/20 blur-3xl dark:bg-pink-900/10" />
      </div>

      <div className="absolute top-4 right-4 z-50 flex items-center space-x-2">
        <LanguageSwitcher />
        <ModeToggle />
      </div>

      <div className="relative z-10 w-full max-w-sm md:max-w-3xl">
        <div className="overflow-hidden rounded-lg bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-950/80">
          <LoginForm
            locale={locale}
            translations={{
              title: dict.login.title,
              username: dict.login.username,
              password: dict.login.password,
              rememberMe: dict.login.rememberMe,
              forgotPassword: dict.login.forgotPassword,
              submit: dict.login.submit,
              back: dict.common.back,
            }}
          />
        </div>
      </div>
    </div>
  );
}
