// import { TanStackDevtools } from "@tanstack/react-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import {
  createRootRoute,
  HeadContent,
  Navigate,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
// import { TanStackRouterDevtoolsPanel } from "@tanstack/router-devtools";
import { useState } from "react";
import requireClientAuth from "src/Users/utils/requireClientAuth";
import appCss from "src/index.css?url";
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
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
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
        <Scripts />
      </body>
    </html>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { title: "Adjourn" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "stylesheet",
        href: "https://cdn.quilljs.com/1.3.7/quill.core.css",
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});
