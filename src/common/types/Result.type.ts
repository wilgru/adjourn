type SuccessResult<T> = { success: true; data: T };
type ErrorResult = { success: false; error: string };

export type Result<T> = SuccessResult<T> | ErrorResult;
