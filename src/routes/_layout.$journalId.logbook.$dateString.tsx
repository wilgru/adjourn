import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useSetAtom } from "jotai";
import isAuthenticated from "src/Users/utils/isAuthenticated";
import { colours } from "src/colours/colours.constant";
import { Button } from "src/common/components/Button/Button";
import { Calendar } from "src/common/components/Calendar/Calendar";
import { Toolbar } from "src/common/components/Toolbar/Toolbar";
import { getNavigationDay } from "src/common/utils/getNavigationDay";
import { useCurrentJournal } from "src/journals/hooks/useCurrentJournal";
import { jumpToDateAtom } from "src/tableOfContents/atoms/jumpToDateAtom";

export const Route = createFileRoute("/_layout/$journalId/logbook/$dateString")(
  {
    component: LogbookComponent,
    beforeLoad: async ({ location }) => {
      if (!isAuthenticated()) {
        throw redirect({
          to: "/login",
          search: {
            // (Do not use `router.state.resolvedLocation` as it can potentially lag behind the actual current location)
            redirect: location.href,
          },
        });
      }
    },
  },
);

function LogbookComponent() {
  const { journalId, dateString } = Route.useParams();
  const { currentJournal } = useCurrentJournal();
  const colour = currentJournal?.colour ?? colours.orange;

  const navigate = useNavigate();
  const setJumpToAtom = useSetAtom(jumpToDateAtom);

  const date = dayjs(dateString, "YYYY-MM-DD");
  const today = dayjs();
  const yesterday = date.subtract(1, "day");
  const tomorrow = date.add(1, "day");

  const title = date.format("ddd MMM D, YYYY");

  return (
    <div className="h-full w-full flex flex-col items-center">
      <Toolbar iconName="notebook" title={title} colour={colour}>
        <>
          <div>
            <Button
              variant="ghost"
              size="sm"
              iconName="arrowArcLeft"
              onClick={() => {
                setJumpToAtom(yesterday);
                navigate({
                  to: `/${journalId}/logbook/${getNavigationDay(yesterday)}`,
                });
              }}
            />
          </div>
          <div>
            <Button
              variant="ghost"
              size="sm"
              iconName="calendarDot"
              onClick={() => {
                setJumpToAtom(today);
                navigate({
                  to: `/${journalId}/logbook/${getNavigationDay(today)}`,
                });
              }}
            />
          </div>
          <div>
            <Button
              variant="ghost"
              size="sm"
              iconName="arrowArcRight"
              onClick={() => {
                setJumpToAtom(tomorrow);
                navigate({
                  to: `/${journalId}/logbook/${getNavigationDay(tomorrow)}`,
                });
              }}
            />
          </div>
        </>
      </Toolbar>

      <Calendar journalId={journalId} colour={colour} />
    </div>
  );
}
