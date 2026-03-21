import { useAtom } from "jotai";
import { colours } from "src/colours/colours.constant";
import { isSideBarVisibleAtom } from "src/common/atoms/isSidebarVisibleAtom";
import { Button } from "src/common/components/Button/Button";
import { useElectronEnvironment } from "src/common/hooks/useElectronEnvironment";
import { cn } from "src/common/utils/cn";
import { Icon } from "src/icons/components/Icon/Icon";
import { NoteSearchBar } from "src/notes/components/NoteSearchBar/NoteSearchBar";
import type { Colour } from "src/colours/Colour.type";

type ToolbarProps = {
  iconName?: string;
  title: string;
  colour?: Colour;
  journalColour?: Colour;
  children?: JSX.Element;
};

export const Toolbar = ({
  iconName,
  title,
  colour = colours.orange,
  journalColour,
  children,
}: ToolbarProps) => {
  const { isMacElectrobun } = useElectronEnvironment();

  const [isSideBarVisible, setValue] = useAtom(isSideBarVisibleAtom);
  const shouldReserveWindowButtonSpace = isMacElectrobun && !isSideBarVisible;

  //TODO: remove h-16 when scrolling issue is fixed
  return (
    <div
      className={cn(
        "bg-white w-full h-16 flex items-center justify-between p-3",
        isMacElectrobun ? "electrobun-webkit-app-region-drag" : "",
      )}
    >
      <div className="flex items-center gap-2">
        {shouldReserveWindowButtonSpace && <div className="h-8 w-[4.5rem]" />}

        <div
          className={cn(
            "flex gap-2",
            isMacElectrobun && "electrobun-webkit-app-region-no-drag",
          )}
        >
          {!isSideBarVisible && (
            <Button
              variant="ghost"
              size="sm"
              colour={journalColour ?? colour}
              iconName="arrowLineRight"
              onClick={() => setValue(true)}
            />
          )}

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              {iconName && (
                <Icon
                  className={cn("pb-1", colour.text)}
                  iconName={iconName}
                  size="md"
                />
              )}
              <h1 className="font-title text-xl">{title}</h1>
            </div>

            {children}
          </div>
        </div>
      </div>

      <div
        className={cn(
          "flex items-center gap-2",
          isMacElectrobun ? "electrobun-webkit-app-region-no-drag" : "",
        )}
      >
        <NoteSearchBar />
      </div>
    </div>
  );
};
