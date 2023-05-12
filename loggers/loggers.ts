import winston, { LoggerOptions } from 'winston';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

const format = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({
    format: 'MMM-DD-YYYY HH:mm:ss'
  }),
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

const transports = [new winston.transports.Console()];

const logConfiguration: LoggerOptions = {
  levels,
  transports,
  format,
  level: 'debug'
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'blue',
  debug: 'cyan'
};

winston.addColors(colors);

export const logger = winston.createLogger(logConfiguration);
