import { findAllDirnames, findAllFilenames, isSubPathOf, remove } from 'extra-filesystem'
import { readList } from '@utils/read-list'
import { createListFilename } from '@utils/create-list-filename'
import { createDirectoryName } from '@utils/create-directory-name'
import { toArrayAsync } from 'iterable-operator'
import { each } from 'extra-promise'
import { oneline } from 'extra-tags'
import * as path from 'path'

export async function purge({
  dryRun = false
, concurrency = Infinity
}: Partial<{
  dryRun: boolean
  concurrency: number
}> = {}): Promise<void> {
  const list = await readList(createListFilename())
  const repositoryDirnames = list.map(createDirectoryName)

  const nonRepoDirnames = await toArrayAsync(findAllDirnames('.', dirname => {
    return !isHidden(dirname)
        && !isRepoDirname(dirname)
  }))
  const shouldBeDeletedDirnames = nonRepoDirnames.filter(x => {
    return !nonRepoDirnames.some(dirname => isSubPathOf(x, dirname))
  })

  const nonRepoFilenames = await toArrayAsync(findAllFilenames('.', dirname => {
    return !isHidden(dirname)
        && !isRepoDirname(dirname)
        && !shouldBeDeletedDirnames.some(x => isSubPathOf(dirname, x))
  }))
  const shouldBeDeletedFilenames = nonRepoFilenames.filter(x => {
    return !isHidden(x)
        && !isListFilename(x)
  })

  const shouldBeDeletedPathnames = [
    ...shouldBeDeletedDirnames
  , ...shouldBeDeletedFilenames
  ]

  if (dryRun) {
    console.log(shouldBeDeletedPathnames.join('\n'))
  } else {
    const total = shouldBeDeletedPathnames.length
    let done = 0
    each(shouldBeDeletedPathnames, async x => {
      await remove(x)
      done++
      console.log(oneline`
        [${done}/${total}]
        ${x}: deleted
      `)
    }, concurrency)
  }

  function isRepoDirname(dirname: string) {
    for (const repoDir of repositoryDirnames) {
      if (isSubPathOf(repoDir, dirname) || isSubPathOf(dirname, repoDir)) {
        return true
      }
    }
    return false
  }
}

function isHidden(dirname: string): boolean {
  const basename = path.basename(dirname)
  return basename.startsWith('.')
}

function isListFilename(filename: string) {
  return filename === createListFilename()
}
