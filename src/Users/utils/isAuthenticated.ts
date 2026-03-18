import { pb } from "src/pocketbase/utils/connection";

export default function isAuthenticated() {
  // During SSR, browser auth storage is unavailable, so defer auth gating to the client.
  if (typeof window === "undefined") {
    return true;
  }

  const isAuthenticated = pb.authStore?.isValid; // currently valid for 2 weeks

  if (!isAuthenticated) {
    pb.authStore.clear();
  }

  return isAuthenticated;
}
