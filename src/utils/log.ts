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

  public debug(message: string): void {
    this.logger.debug(message);
  }

  public info(message: string): void {
    this.logger.info(message);
  }

  public warn(message: string): void {
    this.logger.warn(message);
  }

  public error(message: string | Error): void {
    this.logger.error(message);
  }
}

export const logger = Logger.getInstance();
