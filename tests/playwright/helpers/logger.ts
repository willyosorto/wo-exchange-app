const colors = {
  reset: '\x1b[0m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
}

const Step = (device: string, message: string) => {
  console.log(`${colors.cyan} [STEP] [${device}]:${colors.reset} ${message}`)
}

const Verification = (device: string, message: string) => {
  console.log(`${colors.green} [VERIFICATION] [${device}]:${colors.reset} ${message}`)
}

const Log = (message: string) => {
  console.log(`${colors.blue} [LOG]:${colors.reset} ${message}`)
}

const Error = (device: string, message: string) => {
  console.log(`${colors.red} [ERROR] [${device}]:${colors.reset} ${message}`)
}

const Warning = (device: string, message: string) => {
  console.log(`${colors.yellow} [WARNING] [${device}]:${colors.reset} ${message}`)
}

export { Step, Verification, Log, Error, Warning }
