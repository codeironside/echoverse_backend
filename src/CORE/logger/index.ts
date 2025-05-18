import {
  createLogger,
  format,
  config,
  transports,
  Logger as WinstonLogger,
} from "winston";
import "winston-daily-rotate-file";
import * as path from "path";

const { combine, timestamp, printf, colorize, errors } = format;

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    verbose: "cyan",
    debug: "blue",
    silly: "gray",
  },
};
config.addColors(customLevels.colors);

const dailyTransport = new transports.DailyRotateFile({
  dirname: path.join(__dirname, "../../../logs"),
  filename: "application-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  level: "info",
  format: combine(
    timestamp(),
    printf((info) => `${info.timestamp} [${info.level}]: ${info.message}`)
  ),
});
dailyTransport.on("error", (err) => {
  console.error(`[Logger Transport Error] ${err.message}`);
});
class Logger {
  private logger: WinstonLogger;

  constructor() {
    this.logger = createLogger({
      levels: customLevels.levels,
      level: "debug",
      format: combine(
        errors({ stack: true }),
        timestamp(),
        printf(
          ({ timestamp, level, message, stack }) =>
            `${timestamp} [${level}]: ${stack ?? message}`
        )
      ),
      transports: [
        new transports.Console({
          level: "debug",
          format: combine(
            colorize({ all: true }),
            timestamp(),
            printf(
              ({ timestamp, level, message }) =>
                `${timestamp} [${level}]: ${message}`
            )
          ),
        }),
        dailyTransport,
      ],
      exceptionHandlers: [
        new transports.File({ filename: path.join("logs", "exceptions.log") }),
      ],
      rejectionHandlers: [
        new transports.File({ filename: path.join("logs", "rejections.log") }),
      ],
      exitOnError: false,
    });
  }

  public error(msg: string) {
    this.logger.error(msg);
  }
  public warn(msg: string) {
    this.logger.warn(msg);
  }
  public info(msg: string) {
    this.logger.info(msg);
  }
  public debug(msg: string) {
    this.logger.debug(msg);
  }
  public silly(msg: string) {
    this.logger.silly(msg);
  }
  public http(msg: string) {
    this.logger.http(msg);
  }
}

export default new Logger();
