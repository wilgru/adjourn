// import { TanStackDevtools } from "@tanstack/react-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { createRootRoute, Navigate, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtoolsPanel } from "@tanstack/router-devtools";
import { useState } from "react";
import requireClientAuth from "src/Users/utils/requireClientAuth";
import { useNavigateToLastUsedJournal } from "src/journals/hooks/useGetLastUsedJournal";

const NotFoundComponent = () => {
  const { lastUsedJournal, isFetching } = useNavigateToLastUsedJournal();

  requireClientAuth();

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

function RootComponent() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      {/* <TanStackDevtools
            plugins={[
              {
                name: "TanStack Query",
                render: <ReactQueryDevtoolsPanel />,
              },
              {
                name: "TanStack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          /> */}
    </QueryClientProvider>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});
