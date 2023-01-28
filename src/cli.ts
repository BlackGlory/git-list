#!/usr/bin/env node
import { program } from 'commander'
import { clone } from '@commands/clone'
import { pull } from '@commands/pull'
import { push } from '@commands/push'
import { status } from '@commands/status'
import { purge } from '@commands/purge'
import { isString } from '@blackglory/types'
import { assert } from '@blackglory/errors'

interface IGlobalOptions {
  concurrency?: string 
}

const name = 'git-list'
const { version, description } = require('../package.json')
process.title = name

program
  .name(name)
  .version(version)
  .description(description)
  .option('--concurrency <concurrency>', 'concurrency', '1')

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

interface IPurgeOptions {
  dryRun: boolean
}

program
  .command('purge')
  .description('delete all non-hidden directories and files that are not in the list')
  .option('--dry-run', 'dry run')
  .action((options: IPurgeOptions) => {
    const globalOptions = program.opts<IGlobalOptions>()
    const concurrency = getConcurrency(globalOptions)
    const dryRun = getDryRun(options)

    purge({
      concurrency
    , dryRun
    })
  })

program.parse()

function getConcurrency(options: IGlobalOptions): number {
  assert(
    isString(options.concurrency) && isNumberString(options.concurrency)
  , 'The parameter concurrency must be a number'
  )

  const concurrency = Number.parseInt(options.concurrency, 10)
  assert(concurrency > 0, 'The parameter concurrency must be a positive number')

  return concurrency
}

function getDryRun(options: IPurgeOptions): boolean {
  return options.dryRun
}

function isNumberString(str: string): boolean {
  return /^\d+$/.test(str)
}
