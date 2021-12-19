#!/usr/bin/env node
import { program } from 'commander'
import { clone } from '@commands/clone'
import { pull } from '@commands/pull'
import { push } from '@commands/push'
import { status } from '@commands/status'

program
  .name(require('../package.json').name)
  .version(require('../package.json').version)
  .description(require('../package.json').description)

program
  .command('clone')
  .action(() => clone())

program
  .command('pull')
  .action(() => pull())

program
  .command('push')
  .action(() => push())

program
  .command('status')
  .action(() => status())

program.parse()
