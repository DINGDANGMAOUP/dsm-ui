"use client";
import { Moon, Sun, Laptop } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 如果未挂载，不渲染任何内容
  if (!mounted) {
    return null;
  }

  const handleThemeChange = async (nextTheme: "light" | "dark" | "system") => {
    // 检查是否支持视图过渡动画
    if (
      !buttonRef.current ||
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTheme(nextTheme);
      return;
    }

    // 获取按钮位置信息用于动画
    const { top, left, width, height } = buttonRef.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const right = window.innerWidth - left;
    const bottom = window.innerHeight - top;
    const maxRadius = Math.hypot(Math.max(left, right), Math.max(top, bottom));

    // 检查当前是浅色还是深色
    const currentIsDark =
      theme === "dark" ||
      (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    // 检查切换后是浅色还是深色
    const nextIsDark =
      nextTheme === "dark" ||
      (nextTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    // 只有在深浅模式确实变化时才应用过渡动画
    const modeChanged = currentIsDark !== nextIsDark;

    // 为动画准备一个类，稍后会添加到根元素上
    const transitionClassName = nextIsDark ? "to-dark" : "to-light";
    document.documentElement.classList.add(transitionClassName);

    // 开始视图过渡
    const transition = document.startViewTransition(async () => {
      flushSync(() => {
        setTheme(nextTheme);
      });
    });

    // 等待过渡准备就绪
    await transition.ready;

    // 只有在模式确实改变时才应用动画
    if (modeChanged) {
      // 如果是从深色到浅色模式（白色圆点扩散动画）
      if (currentIsDark && !nextIsDark) {
        document.documentElement.animate(
          {
            clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRadius}px at ${x}px ${y}px)`],
          },
          {
            duration: 500,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      }
      // 如果是从浅色到深色模式（白色区域收缩动画）
      else if (!currentIsDark && nextIsDark) {
        document.documentElement.animate(
          {
            clipPath: [`circle(${maxRadius}px at ${x}px ${y}px)`, `circle(0px at ${x}px ${y}px)`],
          },
          {
            duration: 500,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-old(root)",
          }
        );
      }
    }

    // 过渡完成后移除类
    transition.finished.then(() => {
      document.documentElement.classList.remove(transitionClassName);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button ref={buttonRef} variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">切换主题</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleThemeChange("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>浅色</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>深色</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("system")}>
          <Laptop className="mr-2 h-4 w-4" />
          <span>系统</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
