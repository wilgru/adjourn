import { createRootRoute, Navigate, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import isAuthenticated from "src/Users/utils/isAuthenticated";
import { useNavigateToLastUsedJournal } from "src/journals/hooks/useGetLastUsedJournal";

const NotFoundComponent = () => {
  const { lastUsedJournal, isFetching } = useNavigateToLastUsedJournal();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace={true} />;
  }

  if (isFetching) {
    return <div>Loading journals...</div>; // TODO: handle this better, use a spinner/loading component?
  }

  if (!lastUsedJournal) {
    return <Navigate to="/create-journal" replace={true} />;
  }

  return (
    <Navigate
      to="/$journalId/notes"
      params={{ journalId: lastUsedJournal.id }}
      search={{ noteId: null }}
      replace={true}
    />
  );
};

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  ),
  notFoundComponent: NotFoundComponent,
});
