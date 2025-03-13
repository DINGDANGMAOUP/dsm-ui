import { redirect } from "next/navigation";

export default function Workplace({ params }: { params: { locale: string } }) {
  // 自动重定向到about路由
  redirect(`/${params.locale}/workplace/about`);
}
