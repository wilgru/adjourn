import { useMutation } from "@tanstack/react-query";

const useLogin = () => {
  const mutationFn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<void> => {
    console.log("Login data:", { email, password }); // todo: implement real auth
  };

  const { mutateAsync, isPending, isError } = useMutation({
    mutationKey: ["authentication.login"],
    mutationFn,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  const logout = () => {
    // todo: implement real logout
  };

  return {
    login: mutateAsync,
    logout,
    loginLoading: isPending,
    loginError: isError,
  };
};

export { useLogin };
