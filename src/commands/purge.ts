import { findAllFilenames, isSubPathOf, remove } from 'extra-filesystem'
import { readList } from '@utils/read-list'
import { createListFilename } from '@utils/create-list-filename'
import { createDirectoryName } from '@utils/create-directory-name'
import { toArrayAsync } from 'iterable-operator'
import { each } from 'extra-promise'
import { oneline } from 'extra-tags'
import * as fs from 'fs/promises'
import * as path from 'path'

export async function purge({ dryRun, concurrency }: {
  dryRun: boolean
  concurrency: number
}): Promise<void> {
  const list = await readList(createListFilename())
  const repositoryDirnames = list.map(createDirectoryName)

  const dirnamesShouldBeDeleted = await toArrayAsync(findAllDirnamesShouldBeDeleted('.'))
  const nonRepoFilenames = await toArrayAsync(findAllFilenames('.',
    dirname => isntHidden(dirname) && notInDirnamesShouldBeDeleted(dirname)
  ))
  const FilenamesShouldBeDeleted = nonRepoFilenames.filter(
    x => isntHidden(x) && isntListFile(x)
  )

  const pathnamesShouldBeDeleted = [
    ...dirnamesShouldBeDeleted
  , ...FilenamesShouldBeDeleted
  ]

  if (dryRun) {
    console.log(pathnamesShouldBeDeleted.join('\n'))
  } else {
    const total = pathnamesShouldBeDeleted.length
    let done = 0
    await each(pathnamesShouldBeDeleted, async local => {
      try {
        await remove(local)
      } catch (e) {
        console.error(`There was an error in ${local}`)
        throw e
      }

      done++
      console.log(oneline`
        [${done}/${total}]
        ${local}: deleted
      `)
    }, concurrency)
  }

  function isRepo(dirname: string) {
    for (const repoDir of repositoryDirnames) {
      if (dirname === repoDir) {
        return true
      }
    }
    return false
  }

  function isAncestorOfRepo(dirname: string) {
    for (const repoDir of repositoryDirnames) {
      if (isSubPathOf(repoDir, dirname)) {
        return true
      }
    }
    return false
  }

  async function* findAllDirnamesShouldBeDeleted(dirname: string): AsyncIterable<string> {
    const subDirnames = await getSubDirnames(dirname)
    for (const dirname of subDirnames) {
      if (isHidden(dirname)) continue
      if (isRepo(dirname)) continue

      if (isAncestorOfRepo(dirname)) {
        yield* findAllDirnamesShouldBeDeleted(dirname)
      } else {
        yield dirname
      }
    }
  }

  function notInDirnamesShouldBeDeleted(dirname: string): boolean {
    return !inDirnamesShouldBeDeleted(dirname)
  }

  function inDirnamesShouldBeDeleted(dirname: string): boolean {
    return dirnamesShouldBeDeleted.some(x => dirname === x)
  }
}

function isntHidden(dirname: string): boolean {
  return isHidden(dirname)
}

function isHidden(dirname: string): boolean {
  const basename = path.basename(dirname)
  return basename.startsWith('.')
}

function isntListFile(filename: string): boolean {
  return !isListFile(filename)
}

function isListFile(filename: string): boolean {
  return filename === createListFilename()
}

async function getSubDirnames(dirname: string): Promise<string[]> {
  const dirents = await fs.readdir(dirname, { withFileTypes: true })
  return dirents
    .filter(x => x.isDirectory())
    .map(x => path.join(dirname, x.name))
}
