import bunyan from "bunyan";
import BunyanFormat from "bunyan-format";

class Logger {
  private static instance: Logger;

  private logger: bunyan;

  private constructor() {
    this.logger = bunyan.createLogger({
      name: "BOT",
      streams: [
        {
          level: "debug",
          stream: BunyanFormat({ outputMode: "short" }),
        },
      ],
    });
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public debug(message: string, ...args: any[]): void {
    this.logger.debug(message, ...args);
  }

  public info(message: string, ...args: any[]): void {
    this.logger.info(message, ...args);
  }

  public warn(message: string, ...args: any[]): void {
    this.logger.warn(message, ...args);
  }

  public error(message: string | Error, ...args: any[]): void {
    this.logger.error(message, ...args);
  }
}

export const logger = Logger.getInstance();
