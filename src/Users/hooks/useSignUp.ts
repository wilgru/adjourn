import { useMutation } from "@tanstack/react-query";

const useSignUp = () => {
  const mutationFn = async ({
    name,
    email,
    password,
    passwordConfirm,
  }: {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
  }): Promise<void> => {
    console.log("Sign up data:", { name, email, password, passwordConfirm }); // todo: implement real auth
  };

  const { mutateAsync, isPending, isError } = useMutation({
    mutationKey: ["authentication.signup"],
    mutationFn,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return {
    signUp: mutateAsync,
    signUpLoading: isPending,
    signUpError: isError,
  };
};

export { useSignUp };
