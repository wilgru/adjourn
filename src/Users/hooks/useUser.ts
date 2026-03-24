import { useQuery } from "@tanstack/react-query";
import type { User } from "src/Users/User.type";

export const useUser = () => {
  const queryFn = async (): Promise<User | null> => {
    return null; // todo: implement real auth
  };

  const { data, isPending, isError } = useQuery({
    queryKey: ["authentication.user"],
    queryFn,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return {
    user: data ?? null,
    userLoading: isPending,
    userError: isError,
  };
};
