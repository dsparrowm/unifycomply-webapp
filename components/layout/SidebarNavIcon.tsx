import Image from "next/image";
import type { SidebarIconKey } from "@/lib/constants/sidebar-icons";
import { sidebarIcons } from "@/lib/constants/sidebar-icons";
import { cn } from "@/lib/utils";

type SidebarNavIconProps = {
  icon: SidebarIconKey;
  className?: string;
  size?: number;
};

export function SidebarNavIcon({ icon, className, size = 18 }: SidebarNavIconProps) {
  return (
    <Image
      src={sidebarIcons[icon]}
      alt=""
      width={size}
      height={size}
      unoptimized
      aria-hidden
      className={cn("shrink-0", className)}
    />
  );
}
