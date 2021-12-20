#!/usr/bin/env node
import { program } from 'commander'
import { clone } from '@commands/clone'
import { pull } from '@commands/pull'
import { push } from '@commands/push'
import { status } from '@commands/status'
import { purge } from '@commands/purge'

program
  .name(require('../package.json').name)
  .version(require('../package.json').version)
  .description(require('../package.json').description)

program
  .command('clone')
  .description('execute `git clone` on all of repositories in the list')
  .action(() => clone())

program
  .command('pull',)
  .description('execute `git pull` on all of repositories in the list')
  .action(() => pull())

program
  .command('push')
  .description('execute `git push` on all of repositories in the list')
  .action(() => push())

program
  .command('status')
  .description('execute `git status` on all of repositories in the list')
  .action(() => status())

program
  .command('purge')
  .description('delete all non-hidden directories and files that are not in the list')
  .action(() => purge())

program.parse()
