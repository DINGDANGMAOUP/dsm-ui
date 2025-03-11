import "../../styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/lib/auth/AuthContext";
import initMocks from "@/lib/mocks";
import { locales } from "@/lib/dictionaries";

// 初始化模拟数据
initMocks().catch(console.error);

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // 获取当前语言
  const { locale } = await params;
  console.log(`LocaleLayout: 当前语言: ${locale}`);

  // 验证语言是否受支持
  if (!locales.includes(locale)) {
    // 如果不支持，可以在这里处理，例如重定向到默认语言
    console.error(`LocaleLayout: 不支持的语言: ${locale}`);
  }

  return (
    <div lang={locale} className="contents">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}
