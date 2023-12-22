// this is exported so custom loggers
// can be made
export class Logger {
  prefix = "Logger";

  constructor(prefix?: string) {
    if (prefix) this.prefix = prefix;
  }

  info(...message: any[]) {
    console.log(`${this.prefix}::[Info]=>${message}`);
  }

  success(...message: any[]) {
    console.log(`${this.prefix}::[Success]=>${message}`);
  }

  error(...message: any) {
    console.log(`${this.prefix}::[Error]=>${message}`);
  }
}

export const logger = new Logger("VisiLog");
