#!/usr/bin/env node
import { program } from 'commander'
import { clone } from '@commands/clone.js'
import { pull } from '@commands/pull.js'
import { push } from '@commands/push.js'
import { status } from '@commands/status.js'
import { purge } from '@commands/purge.js'
import { showCurrentBranch } from '@commands/show-current-branch.js'
import { isString } from '@blackglory/prelude'
import { assert } from '@blackglory/errors'
import { version, description } from '@utils/package.js'

interface IGlobalOptions {
  concurrency?: string 
}

const name = 'git-list'
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

program
  .command('show-current-branch')
  .description('execute `git branch --show-current` on all of repositories in the list')
  .action(() => {
    const globalOptions = program.opts<IGlobalOptions>()
    const concurrency = getConcurrency(globalOptions)

    showCurrentBranch({ concurrency })
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
