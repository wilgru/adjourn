import { ipcMain } from "electron";
import log from "electron-log";

export const createIpcHandler = <Input, Output>(
  channel: string,
  handler: (input: Input) => Output,
) => {
  ipcMain.handle(channel, (_event, ...args) => {
    try {
      const result = handler(...(args as [Input]));

      log.info(
        `Handled IPC channel "${channel}" with input:`,
        args,
        "and result:",
        result,
      );
      return { success: true, data: result };
    } catch (error) {
      log.error(`Error in IPC handler for channel "${channel}":`, error);

      return {
        success: false,
        error: (error as Error).message || "An unknown error occurred",
      };
    }
  });
};
