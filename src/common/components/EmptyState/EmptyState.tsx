import { colours } from "src/colours/colours.constant";
import { Button } from "src/common/components/Button/Button";
import { cn } from "src/common/utils/cn";
import { Icon } from "src/icons/components/Icon/Icon";
import type { Colour } from "src/colours/Colour.type";

type EmptyStateProps = {
  title: string;
  description?: string;
  colour?: Colour;
  size?: "sm" | "md";
  iconName?: string;
  createFirstButtonText?: string;
  onCreateFirst?: () => void;
  className?: string;
};

export const EmptyState = ({
  title,
  description,
  colour = colours.orange,
  size = "md",
  iconName,
  createFirstButtonText,
  onCreateFirst,
  className,
}: EmptyStateProps) => {
  const isSmall = size === "sm";

  return (
    <div
      className={cn(
        "h-fit w-full flex flex-col items-center text-center",
        isSmall ? "p-4 gap-3 rounded-xl" : "p-6 gap-4 rounded-2xl",
        colour.backgroundPill,
        className,
      )}
    >
      {iconName && (
        <div
          className={cn(
            "rounded-full flex items-center justify-center text-white",
            isSmall ? "h-10 w-10" : "h-12 w-12",
            colour.background,
          )}
        >
          <Icon
            iconName={iconName}
            size={isSmall ? "sm" : "md"}
            className="text-white"
          />
        </div>
      )}

      <div className="flex flex-col gap-1 items-center">
        <p
          className={cn(
            isSmall ? "text-sm font-medium" : "text-base font-semibold",
            colour.textPill,
          )}
        >
          {title}
        </p>

        {description && (
          <p
            className={cn(
              "text-slate-500 text-center",
              isSmall ? "text-xs" : "text-sm",
            )}
          >
            {description}
          </p>
        )}
      </div>

      {createFirstButtonText && (
        <Button
          variant="ghost"
          size="sm"
          colour={colour}
          className="justify-center bg-white"
          iconName="plusSquare"
          onClick={onCreateFirst}
        >
          {createFirstButtonText}
        </Button>
      )}
    </div>
  );
};
