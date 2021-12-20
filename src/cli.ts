#!/usr/bin/env node
import { program } from 'commander'
import { clone } from '@commands/clone'
import { pull } from '@commands/pull'
import { push } from '@commands/push'
import { status } from '@commands/status'
import { purge } from '@commands/purge'
import { isUndefined, isString } from '@blackglory/types'
import { assert } from '@blackglory/errors'

program
  .name('git-list')
  .version(require('../package.json').version)
  .description(require('../package.json').description)
  .option('--concurrency <n>', 'concurrency')

program
  .command('clone')
  .description('execute `git clone` on all of repositories in the list')
  .action(() => {
    const options = program.opts<{ concurrency?: string }>()
    const concurrency = getConcurrency(options)
    clone({ concurrency })
  })

program
  .command('pull',)
  .description('execute `git pull` on all of repositories in the list')
  .action(() => {
    const options = program.opts<{ concurrency?: string }>()
    const concurrency = getConcurrency(options)
    pull({ concurrency })
  })

program
  .command('push')
  .description('execute `git push` on all of repositories in the list')
  .action(() => {
    const options = program.opts<{ concurrency?: string }>()
    const concurrency = getConcurrency(options)
    push({ concurrency })
  })

program
  .command('status')
  .description('execute `git status` on all of repositories in the list')
  .action(() => {
    const options = program.opts<{ concurrency?: string }>()
    const concurrency = getConcurrency(options)

    status({ concurrency })
  })

program
  .command('purge')
  .description('delete all non-hidden directories and files that are not in the list')
  .option('--dry-run', 'dry run')
  .action(() => {
    const options = program.opts<{ concurrency?: string; dryRun: boolean }>()
    const dryRun = options.dryRun
    const concurrency = getConcurrency(options)

    purge({ dryRun, concurrency })
  })

program.parse()

function getConcurrency(options: Record<string, string | boolean>): number {
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
