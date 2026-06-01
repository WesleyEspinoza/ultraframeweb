import Image from "next/image";

/** Same asset as the browser tab icon (`src/app/favicon.ico`). */
export const BRAND_ICON_SRC = "/favicon.ico";

type BrandIconProps = {
  size?: number;
  className?: string;
  priority?: boolean;
};

export default function BrandIcon({
  size = 32,
  className = "",
  priority = false,
}: BrandIconProps) {
  return (
    <Image
      src={BRAND_ICON_SRC}
      alt=""
      width={size}
      height={size}
      priority={priority}
      unoptimized
      className={className}
      aria-hidden
    />
  );
}
