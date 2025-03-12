import { ModeToggle } from "@components/mode-toggle";
import { LanguageSwitcher } from "@components/language-switcher";
import { LocaleLink } from "@components/locale-link";
import { getDictionary } from "@lib/dictionaries";
import LoginForm from "./login-form";

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  // 获取当前语言
  const { locale } = await params;
  console.log(`LoginPage: 当前语言: ${locale}`);

  // 获取当前语言的字典
  const dict = await getDictionary(locale);
  console.log(`LoginPage: 加载字典成功`);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <LanguageSwitcher />
        <ModeToggle />
      </div>

      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
          {dict.login.title}
        </h1>

        <LoginForm
          locale={locale}
          translations={{
            username: dict.login.username,
            password: dict.login.password,
            rememberMe: dict.login.rememberMe,
            forgotPassword: dict.login.forgotPassword,
            submit: dict.login.submit,
            back: dict.common.back,
          }}
        />

        <div className="mt-6 text-center">
          <LocaleLink
            href="/"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            {dict.common.back}
          </LocaleLink>
        </div>
      </div>
    </div>
  );
}
