"use client";
import type { dynamicIconImports } from "lucide-react/dynamic";
import { dynamicIconImports as Icons } from "lucide-react/dynamic";
import { DynamicIcon } from "lucide-react/dynamic";
const IconNames = Object.keys(Icons);
const CustomIcon = ({ name, className }: { name: string; className?: string }) => {
  //过滤掉不存在的图标
  const iconName = IconNames.find((key) => key === name);
  if (!iconName) {
    return null;
  }
  return <DynamicIcon name={iconName as keyof typeof dynamicIconImports} className={className} />;
};

export default CustomIcon;
