import { Command } from 'commander';

declare module 'commander' {
  interface CommanderStatic extends Command {
    envFile?: string;
    packageManager?: string;
  }
}
