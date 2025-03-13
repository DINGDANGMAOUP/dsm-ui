import { ModeToggle } from "@/components/mode-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getDictionary } from "@/lib/dictionaries";
import DashboardClient from "@/app/[locale]/(root)/dashboard/dashboard-client";
import DashboardProtected from "@/app/[locale]/(root)/dashboard/DashboardProtected";

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  // 获取当前语言
  const { locale } = await params;
  console.log(`DashboardPage: 当前语言: ${locale}`);

  // 获取当前语言的字典
  const dict = await getDictionary(locale);
  console.log(`DashboardPage: 加载字典成功`);

  return (
    <DashboardProtected locale={locale}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <header className="bg-white shadow dark:bg-gray-800">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {dict.dashboard.title}
            </h1>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <ModeToggle />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <DashboardClient
            locale={locale}
            translations={{
              welcome: dict.dashboard.welcome,
              statsTitle: dict.dashboard.stats.title,
              users: dict.dashboard.stats.users,
              orders: dict.dashboard.stats.orders,
              revenue: dict.dashboard.stats.revenue,
              growth: dict.dashboard.stats.growth,
              recentActivityTitle: dict.dashboard.recentActivity.title,
              noActivity: dict.dashboard.recentActivity.noActivity,
              back: dict.common.back,
              logout: dict.common.logout,
            }}
          />
        </main>
      </div>
    </DashboardProtected>
  );
}
