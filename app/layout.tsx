import "../styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/lib/auth/AuthContext";
// 初始化mock服务（仅在开发环境和服务器端）
if (process.env.NODE_ENV === "development" && process.env.NEXT_RUNTIME === "nodejs") {
  import("@/lib/mocks")
    .then(({ default: initMocks }) => {
      initMocks().catch(console.error);
    })
    .catch(console.error);
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
