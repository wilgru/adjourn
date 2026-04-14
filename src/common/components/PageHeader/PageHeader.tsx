import { colours } from "src/colours/colours.constant";
import { cn } from "src/common/utils/cn";
import type { Colour } from "src/colours/Colour.type";

export type ActionBadge = {
  label: string;
  onClick: () => void;
};

type PageHeaderProps = {
  children: React.ReactNode;
  colour?: Colour;
  badges?: string[];
  actionBadges?: ActionBadge[];
  description?: string;
};

export const PageHeader = ({
  children,
  colour = colours.orange,
  badges,
  actionBadges,
  description,
}: PageHeaderProps) => {
  return (
    <div className="flex flex-col gap-1">
      {children}

      {description && <section className="px-2 pb-2">{description}</section>}

      <div className="flex gap-2">
        {badges?.map((badge, index) => (
          <h3
            key={index}
            className={
              "px-2 py-0.5 text-sm rounded-full bg-slate-100 text-slate-500"
            }
          >
            {badge}
          </h3>
        ))}

        {actionBadges?.map((actionBadge) => (
          <button
            key={actionBadge.label}
            type="button"
            onClick={actionBadge.onClick}
            className={cn(
              "px-2 py-0.5 text-sm rounded-full transition-colors hover:opacity-80",
              colour.backgroundPill,
              colour.textPill,
            )}
          >
            {actionBadge.label}
          </button>
        ))}
      </div>
    </div>
  );
};
