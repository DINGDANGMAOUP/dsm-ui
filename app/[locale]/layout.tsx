import "../../styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/lib/auth/AuthContext";
import initMocks from "@/lib/mocks";

// 支持的语言列表
const locales = ["en", "zh"];

// 初始化模拟数据
initMocks().catch(console.error);

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // 验证语言是否受支持
  if (!locales.includes(locale)) {
    // 如果不支持，可以在这里处理，例如重定向到默认语言
    console.error(`不支持的语言: ${locale}`);
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
