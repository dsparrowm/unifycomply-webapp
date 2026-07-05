import Image from "next/image";
import {
  LOGO_AUTH_DIMENSIONS,
  LOGO_DIMENSIONS,
  LOGO_SIDEBAR_DIMENSIONS,
  LOGO_SRC,
  LOGO_WHITE_SRC,
} from "@/lib/constants/brand";

type UnifycomplyLogoProps = {
  className?: string;
  variant?: "dark" | "light";
  size?: "default" | "sidebar" | "auth";
};

export function UnifycomplyLogo({
  className = "",
  variant = "dark",
  size = "default",
}: UnifycomplyLogoProps) {
  const dimensions =
    size === "sidebar"
      ? LOGO_SIDEBAR_DIMENSIONS
      : size === "auth"
        ? LOGO_AUTH_DIMENSIONS
        : LOGO_DIMENSIONS;
  const src = variant === "light" ? LOGO_WHITE_SRC : LOGO_SRC;
  const style = { width: dimensions.width, height: dimensions.height };

  if (src.endsWith(".svg")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt="UNIFYCOMPLY"
        width={dimensions.width}
        height={dimensions.height}
        className={className}
        style={style}
      />
    );
  }

  return (
    <Image
      src={src}
      alt="UNIFYCOMPLY"
      width={dimensions.width}
      height={dimensions.height}
      priority
      className={className}
      style={style}
    />
  );
}
