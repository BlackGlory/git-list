#!/usr/bin/env node
import { program } from 'commander'
import { clone } from '@commands/clone'
import { pull } from '@commands/pull'
import { push } from '@commands/push'
import { status } from '@commands/status'
import { purge } from '@commands/purge'
import { isUndefined, isString } from '@blackglory/types'
import { assert } from '@blackglory/errors'

interface IGlobalOptions {
  concurrency?: string 
}

program
  .name('git-list')
  .version(require('../package.json').version)
  .description(require('../package.json').description)
  .option('--concurrency <n>', 'concurrency')

program
  .command('clone')
  .description('execute `git clone` on all of repositories in the list')
  .action(() => {
    const globalOptions = program.opts<IGlobalOptions>()
    const concurrency = getConcurrency(globalOptions)
    clone({ concurrency })
  })

program
  .command('pull',)
  .description('execute `git pull` on all of repositories in the list')
  .action(() => {
    const globalOptions = program.opts<IGlobalOptions>()
    const concurrency = getConcurrency(globalOptions)
    pull({ concurrency })
  })

program
  .command('push')
  .description('execute `git push` on all of repositories in the list')
  .action(() => {
    const globalOptions = program.opts<IGlobalOptions>()
    const concurrency = getConcurrency(globalOptions)
    push({ concurrency })
  })

program
  .command('status')
  .description('execute `git status` on all of repositories in the list')
  .action(() => {
    const globalOptions = program.opts<IGlobalOptions>()
    const concurrency = getConcurrency(globalOptions)
    status({ concurrency })
  })

program
  .command('purge')
  .description('delete all non-hidden directories and files that are not in the list')
  .option('--dry-run', 'dry run')
  .action((options: { dryRun: boolean }) => {
    const globalOptions = program.opts<IGlobalOptions>()
    const concurrency = getConcurrency(globalOptions)
    const dryRun = options.dryRun
    purge({ dryRun, concurrency })
  })

program.parse()

function getConcurrency(options: { concurrency?: string }): number {
  if (isUndefined(options.concurrency)) return Infinity

  assert(
    isString(options.concurrency) && isNumberString(options.concurrency)
  , 'The parameter concurrency must be a number'
  )
  const concurrency = Number.parseInt(options.concurrency, 10)
  assert(concurrency >= 0, 'The parameter concurrency must be a positive number')

  return concurrency
}

function isNumberString(str: string): boolean {
  return /^\d+$/.test(str)
}
