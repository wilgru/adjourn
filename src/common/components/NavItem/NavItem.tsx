import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { colours } from "src/colours/colours.constant";
import { cn } from "src/common/utils/cn";
import { Icon } from "src/icons/components/Icon/Icon";
import type { Colour } from "src/colours/Colour.type";

type NavItemProps = {
  iconName?: string;
  colour?: Colour;
  ghost?: boolean;
  title: string;
  preview?: string | number;
  to: string;
};

export const NavItem = ({
  iconName,
  colour = colours.orange,
  ghost = false,
  title,
  preview,
  to,
}: NavItemProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <Link
      to={to}
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      activeProps={{
        className: cn(colour.textPill, colour.backgroundPill),
      }}
      className={cn(
        "flex justify-between items-center gap-2 px-2 py-1 rounded-full text-sm transition-colors min-w-0",
        isHovered && colour.textPill,
        isHovered && colour.backgroundPill,
      )}
    >
      {({ isActive }: { isActive: boolean }) => (
        <>
          <div
            className={cn(
              "flex items-center gap-2 min-w-0",
              (isHovered || isActive) && colour.textPill,
            )}
          >
            {iconName && (
              <Icon
                iconName={iconName}
                className={cn(
                  "flex-shrink-0",
                  isHovered || isActive || (colour && !ghost)
                    ? colour.textPill
                    : "text-slate-500",
                )}
                size="sm"
                weight={isHovered || isActive ? "fill" : "regular"}
              />
            )}

            <span className="truncate">{title}</span>
          </div>

          <p
            className={cn(
              "text-xs text-start font-medium mr-1",
              isHovered || isActive ? colour.textPill : "text-slate-400",
            )}
          >
            {preview}
          </p>
        </>
      )}
    </Link>
  );
};
