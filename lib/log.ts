import { Log, LogFunction, LogLevel, LogLevels } from "@/types/log";

export function createLogCollector() {
  const logs: Log[] = [];
  const getAll = () => logs;

  const logFunctions = {} as Record<LogLevel, LogFunction>;
  LogLevels.forEach(
    (level) =>
      (logFunctions[level] = (message: string) => {
        logs.push({
          level,
          message,
          timestamp: new Date(),
        });
      })
  );

  return {
    getAll,
    ...logFunctions,
    // info: (message: string) => logs.push({
    //   level: "info",
    //   message: message,
    //   timestamp: new Date(),
    // }),
    // error: (message: string) => logs.push({
    //   level: "error",
    //   message: message,
    //   timestamp: new Date(),
    // }),
  };
}
