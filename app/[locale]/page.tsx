import { ModeToggle } from "@/components/mode-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LocaleLink } from "@/components/locale-link";
import { getDictionary } from "@/lib/dictionaries";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }> | { locale: string };
}) {
  // 等待并解析参数
  const { locale } = await params;

  // 获取当前语言的字典
  const dict = await getDictionary(locale);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <LanguageSwitcher />
        <ModeToggle />
      </div>

      <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white">{dict.home.welcome}</h1>
      <p className="mb-8 text-center text-lg text-gray-600 dark:text-gray-400">
        {dict.home.description}
      </p>

      {/* 功能特点 */}
      <div className="mb-8">
        <h2 className="mb-4 text-center text-2xl font-semibold text-gray-800 dark:text-gray-200">
          {dict.home.features.title}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            <h3 className="font-medium">{dict.home.features.authentication}</h3>
          </div>
          <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            <h3 className="font-medium">{dict.home.features.authorization}</h3>
          </div>
          <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            <h3 className="font-medium">{dict.home.features.i18n}</h3>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <LocaleLink
          href="/login"
          className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
        >
          {dict.common.login}
        </LocaleLink>
        <LocaleLink
          href="/dashboard"
          className="rounded-md bg-gray-600 px-6 py-3 text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
        >
          {dict.common.dashboard}
        </LocaleLink>
      </div>
    </div>
  );
}
