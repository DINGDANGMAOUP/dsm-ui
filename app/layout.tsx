import "../styles/globals.css";
import initMocks from "@lib/mocks";
import { defaultLocale } from "@lib/dictionaries";
import { ThemeProvider } from "@/components/theme-provider";

initMocks().catch(console.error);

export const metadata = {
  title: "DSM-UI",
  description: "企业级应用，包含认证和权限控制",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={defaultLocale} suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
