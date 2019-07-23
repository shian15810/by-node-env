import { Command } from 'commander';

module 'commander' {
  interface CommanderStatic extends Command {
    envFile?: string;
    packageManager?: string;
  }
}
