import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useNavigate } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { useLogin } from "src/Users/hooks/useLogin";
import { colours } from "src/colours/colours.constant";
import { isSideBarVisibleAtom } from "src/common/atoms/isSidebarVisibleAtom";
import { Button } from "src/common/components/Button/Button";
import { cn } from "src/common/utils/cn";
import { Icon } from "src/icons/components/Icon/Icon";
import type { Colour } from "src/colours/Colour.type";

type ToolbarProps = {
  iconName?: string;
  title: string;
  colour?: Colour;
  children?: JSX.Element;
};

export const Toolbar = ({
  iconName,
  title,
  colour = colours.orange,
  children,
}: ToolbarProps) => {
  const navigate = useNavigate();
  const { logout } = useLogin();

  const [isSideBarVisible, setValue] = useAtom(isSideBarVisibleAtom);

  //TODO: remove h-16 when scrolling issue is fixed
  return (
    <div className="bg-white w-full h-16 flex items-center justify-between p-3">
      <div className="flex gap-2">
        {!isSideBarVisible && (
          <Button
            variant="ghost"
            size="sm"
            colour={colour}
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

      <div className="flex items-center gap-2">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <div>
              <Button
                variant="block"
                size="sm"
                colour={colour}
                iconName="user"
              />
            </div>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="flex flex-col gap-2 bg-white border border-slate-200 text-sm rounded-2xl p-2 w-40 drop-shadow"
              sideOffset={2}
              align="start"
            >
              <DropdownMenu.Item
                className="leading-none text-sm p-2 outline-none rounded-xl cursor-pointer data-[highlighted]:bg-orange-100 data-[highlighted]:text-orange-500 transition-colors"
                onClick={() => {
                  logout();
                  navigate({ to: "/login" });
                }}
              >
                Account Settings
              </DropdownMenu.Item>

              <DropdownMenu.Separator className="h-[1px] rounded-full bg-slate-200" />

              <DropdownMenu.Item
                className="leading-none text-red-400 text-sm p-2 outline-none rounded-xl cursor-pointer data-[highlighted]:bg-red-100 data-[highlighted]:text-red-500 transition-colors"
                onClick={() => {
                  logout();
                  navigate({ to: "/login" });
                }}
              >
                Log out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );
};
