export default function isAuthenticated() {
  // During SSR, browser auth storage is unavailable, so defer auth gating to the client.
  if (typeof window === "undefined") {
    return true;
  }

  const isAuthenticated = true; // todo: implement real auth check

  return isAuthenticated;
}
