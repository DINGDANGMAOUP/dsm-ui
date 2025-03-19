"use client";

import React from "react";
import { useUser } from "@/hooks/useUser";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export interface UserProfileProps {
  className?: string;
  locale?: string;
}

export function UserProfile({ className, locale = "zh" }: UserProfileProps) {
  const router = useRouter();
  const { user, logout, isLoading } = useUser();

  // 用户头像的首字母缩写
  const getInitials = () => {
    if (!user?.nickname) return "U";
    return user.nickname.charAt(0).toUpperCase();
  };

  // 处理登出
  const handleLogout = async () => {
    try {
      await logout();
      router.push(`/${locale}/login`);
    } catch (error) {
      console.error("登出失败:", error);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">加载中...</div>;
  }

  if (!user) {
    return (
      <div className="p-4 text-center">
        <p>未登录</p>
        <Button className="mt-2" onClick={() => router.push(`/${locale}/login`)}>
          登录
        </Button>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle>用户信息</CardTitle>
        <CardDescription>您的个人资料</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar} alt={user.nickname} />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="text-lg font-medium">{user.nickname}</h3>
            <p className="text-muted-foreground text-sm">{user.username}</p>
          </div>
          <div className="bg-muted w-full space-y-2 rounded-md p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">邮箱:</span>
              <span>{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">手机:</span>
              <span>{user.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">角色:</span>
              <span>{user.authorities.join(", ")}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleLogout} className="w-full" variant="outline">
          登出
        </Button>
      </CardFooter>
    </Card>
  );
}
