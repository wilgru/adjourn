import { colours } from "src/colours/colours.constant";
import { cn } from "src/common/utils/cn";
import { Icon } from "src/icons/components/Icon/Icon";
import type { Colour } from "src/colours/Colour.type";
import { getDisplayUrl } from "src/tags/utils/getDisplayUrl";
import type { TagLink } from "src/tags/Tag.type";

type PageHeaderProps = {
  children: React.ReactNode;
  colour?: Colour;
  primaryBadges?: TagLink[];
  secondaryBadges?: string[];
  description?: string;
};

export const PageHeader = ({
  children,
  colour = colours.orange,
  primaryBadges,
  secondaryBadges,
  description,
}: PageHeaderProps) => {
  return (
    <div className="flex flex-col gap-1">
      {children}

      {description && <section className="px-2 pb-2">{description}</section>}

      <div className="flex gap-2">
        {primaryBadges?.map((primaryBadge, index) => (
          <a
            key={index}
            href={primaryBadge.link}
            target="_blank"
            className={cn(
              "flex flex-row items-center gap-2 px-2 py-0.5 text-sm rounded-full hover:underline max-w-xs",
              colour.backgroundPill,
              colour.textPill,
            )}
          >
            <span className="truncate">
              {primaryBadge.title || getDisplayUrl(primaryBadge.link)}
            </span>

            <Icon iconName="link" size="sm" />
          </a>
        ))}

        {secondaryBadges?.map((secondaryBadge, index) => (
          <h3
            key={index}
            className={
              "px-2 py-0.5 text-sm rounded-full bg-slate-100 text-slate-500"
            }
          >
            {secondaryBadge}
          </h3>
        ))}
      </div>
    </div>
  );
};
