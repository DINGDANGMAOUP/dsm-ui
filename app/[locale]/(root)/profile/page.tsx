"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import { UserInfo } from "@/lib/types";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<Partial<UserInfo> | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    phone: "",
    sex: "",
    avatar: "",
  });

  // 获取用户信息
  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const response = await api.get<Partial<UserInfo>>("/users/current");
        if (response.success && response.data) {
          setUser(response.data);
          setFormData({
            nickname: response.data.nickname || "",
            email: response.data.email || "",
            phone: response.data.phone || "",
            sex: response.data.sex || "",
            avatar: response.data.avatar || "",
          });
        } else {
          toast.error("获取用户信息失败");
        }
      } catch (error) {
        console.error("获取用户信息失败:", error);
        toast.error("获取用户信息失败");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  // 处理表单变更
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 处理性别选择变更
  const handleSexChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      sex: value,
    }));
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await api.put<Partial<UserInfo>>("/users/current", formData);
      if (response.success && response.data) {
        setUser(response.data);
        toast.success("个人信息更新成功");
      } else {
        toast.error(response.message || "更新失败");
      }
    } catch (error) {
      console.error("更新用户信息失败:", error);
      toast.error("更新用户信息失败");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="mt-2">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-2xl font-bold">个人中心</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* 左侧用户信息卡片 */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>用户信息</CardTitle>
            <CardDescription>您的基本账户信息</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="mb-4 h-24 w-24">
              <AvatarImage src={user?.avatar} alt={user?.nickname} />
              <AvatarFallback>
                {user?.nickname?.slice(0, 2) || user?.username?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-medium">{user?.nickname}</h3>
            <p className="text-muted-foreground mt-1 text-sm">@{user?.username}</p>
            <div className="mt-4 w-full">
              <div className="flex justify-between border-b py-2">
                <span className="text-muted-foreground">账号</span>
                <span>{user?.username}</span>
              </div>
              <div className="flex justify-between border-b py-2">
                <span className="text-muted-foreground">角色</span>
                <span>{user?.authorities?.join(", ")}</span>
              </div>
              <div className="flex justify-between border-b py-2">
                <span className="text-muted-foreground">邮箱</span>
                <span>{user?.email}</span>
              </div>
              <div className="flex justify-between border-b py-2">
                <span className="text-muted-foreground">手机</span>
                <span>{user?.phone}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">性别</span>
                <span>{user?.sex === "1" ? "男" : user?.sex === "0" ? "女" : "未设置"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 右侧编辑表单 */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>编辑个人资料</CardTitle>
            <CardDescription>更新您的个人信息</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">基本信息</TabsTrigger>
                <TabsTrigger value="avatar">头像设置</TabsTrigger>
              </TabsList>
              <TabsContent value="profile">
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nickname">昵称</Label>
                      <Input
                        id="nickname"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleChange}
                        placeholder="请输入昵称"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">邮箱</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="请输入邮箱"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">手机号</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="请输入手机号"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sex">性别</Label>
                      <Select value={formData.sex} onValueChange={handleSexChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择性别" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">男</SelectItem>
                          <SelectItem value="0">女</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={updating}>
                    {updating ? "保存中..." : "保存修改"}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="avatar">
                <div className="mt-4 space-y-4">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={formData.avatar} />
                      <AvatarFallback>
                        {user?.nickname?.slice(0, 2) || user?.username?.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="w-full space-y-2">
                      <Label htmlFor="avatar">头像URL</Label>
                      <Input
                        id="avatar"
                        name="avatar"
                        value={formData.avatar}
                        onChange={handleChange}
                        placeholder="请输入头像URL"
                      />
                      <p className="text-muted-foreground text-sm">
                        输入有效的图片URL地址，推荐使用HTTPS链接
                      </p>
                    </div>
                    <Button onClick={handleSubmit} className="w-full" disabled={updating}>
                      {updating ? "保存中..." : "更新头像"}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.back()}>
              返回
            </Button>
            <Button variant="destructive" onClick={() => router.push("/logout")}>
              退出登录
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
