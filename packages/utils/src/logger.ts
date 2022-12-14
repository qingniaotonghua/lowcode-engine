/* eslint-disable no-param-reassign */
export type Level = 'debug' | 'log' | 'info' | 'warn' | 'error';
interface Options {
  level: Level;
  bizName: string;
}

const levels = { debug: -1, log: 0, info: 0, warn: 1, error: 2 };
const colors = [
  '#b0e0e6',
  '#4169e1',
  '#6a5acd',
  '#87ceeb',
  '#ffff00',
  '#e3cf57',
  '#ff9912',
  '#eb8e55',
  '#ffe384',
  '#daa569',
  '#00ffff',
  '#385e0f',
  '#7fffd4',
  '#00c957',
  '#40e0d0',
  '#a39480',
  '#d2691e',
  '#ff7d40',
  '#f0e68c',
  '#bc8f8f',
  '#c76114',
  '#734a12',
  '#5e2612',
  '#0000ff',
  '#3d59ab',
  '#1e90ff',
  '#03a89e',
  '#33a1c9',
  '#a020f0',
  '#a066d3',
  '#da70d6',
  '#dda0dd',
  '#688e23',
  '#2e8b57',
];
const allBizNames: Record<string, string> = {};
const output = (logLevel: string, targetLevel: string, bizName: string, targetBizName: string) => {
  return (...args: any[]) => {
    const isLevelFit = targetLevel && (levels as any)[targetLevel] <= (levels as any)[logLevel];
    const isBizNameFit = targetBizName === '*' || bizName.indexOf(targetBizName) > -1;
    if (isLevelFit && isBizNameFit) {
      return (console as any)[logLevel].apply(console, getLogArgs(args, bizName));
    }
  };
};
const getColor = (bizName: string) => {
  if (!allBizNames[bizName]) {
    allBizNames[bizName] = colors[Object.keys(allBizNames).length % colors.length];
  }
  return allBizNames[bizName];
};

function getLogArgs(args: any, bizName: string) {
  const color = getColor(bizName);

  if (bizName !== '*') {
    if (typeof args[0] === 'string') {
      args[0] = `[${bizName}] ${args[0]}`;
    } else {
      args = [`[${bizName}]`].concat(args);
    }
  }
  return [`%c${args}`, `color: ${color}`];
}

function parseLogConf(logConf: string, options: Options): { level: string; bizName: string} {
  if (!logConf) {
    return {
      level: options.level,
      bizName: options.bizName,
    };
  }
  if (logConf.indexOf(':') > -1) {
    const pair = logConf.split(':');
    return {
      level: pair[0],
      bizName: pair[1] || '*',
    };
  }
  return {
    level: logConf,
    bizName: '*',
  };
}

const defaultOptions: Options = {
  level: 'warn',
  bizName: '*',
};


class Logger {
  bizName: string;
  targetBizName: string;
  targetLevel: string;
  constructor(options: Options) {
    options = { ...defaultOptions, ...options };
    const _location = location || {} as any;
    // __logConf__ 格式为 logLevel[:bizName]
    //   1. log|warn|debug|error
    //   2. log|warn|debug|error:*
    //   3. log|warn|debug|error:bizName
    const logConf = (((/__(?:logConf|logLevel)__=([^#/&]*)/.exec(_location.href)) || [])[1]);
    const targetOptions = parseLogConf(logConf, options);
    this.bizName = options.bizName;
    this.targetBizName = targetOptions.bizName;
    this.targetLevel = targetOptions.level;
  }
  debug(...args: string[]): void {
    return output('debug', this.targetLevel, this.bizName, this.targetBizName)(args);
  }
  log(...args: string[]): void {
    return output('log', this.targetLevel, this.bizName, this.targetBizName)(args);
  }
  info(...args: string[]): void {
    return output('info', this.targetLevel, this.bizName, this.targetBizName)(args);
  }
  warn(...args: string[]): void {
    return output('warn', this.targetLevel, this.bizName, this.targetBizName)(args);
  }
  error(...args: string[]): void {
    return output('error', this.targetLevel, this.bizName, this.targetBizName)(args);
  }
}


export { Logger };

export function getLogger(config: { level: Level; bizName: string }): Logger {
  return new Logger(config);
}
