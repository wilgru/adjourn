import { redirect } from "@tanstack/react-router";
import isAuthenticated from "src/Users/utils/isAuthenticated";
import type { ParsedLocation } from "@tanstack/react-router";

export default function requireClientAuth(location?: ParsedLocation) {
  if (!isAuthenticated()) {
    throw redirect({
      to: "/login",
      search: {
        redirect: location?.href ?? "/notes",
      },
    });
  }
}
