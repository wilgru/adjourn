import type { Result } from "./Result.type";

export type IpcApiMethod<Input, Output> = (
  input: Input,
) => Promise<Result<Output>>;
