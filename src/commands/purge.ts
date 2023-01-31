import { findAllFilenames, isSubPathOf, remove } from 'extra-filesystem'
import { readURLsFromList } from '@utils/read-list.js'
import { getListFilename } from '@utils/get-list-filename.js'
import { getRelativeDirname } from '@utils/get-relative-dirname.js'
import { toArrayAsync } from 'iterable-operator'
import { each } from 'extra-promise'
import { oneline } from 'extra-tags'
import * as fs from 'fs/promises'
import * as path from 'path'

export async function purge({ dryRun, concurrency }: {
  dryRun: boolean
  concurrency: number
}): Promise<void> {
  const pathnamesShouldBeDeleted = await getPathnamesShouldBeDeleted()
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
}

export async function getPathnamesShouldBeDeleted(
  cwd: string = '.'
): Promise<string[]> {
  const urls = await readURLsFromList(getListFilename(cwd))
  const repoDirnames = urls.map(x => path.join(cwd, getRelativeDirname(x)))

  const dirnamesShouldBeDeleted = await toArrayAsync(
    findAllDirnamesShouldBeDeleted(cwd)
  )
  const nonRepoFilenames = await toArrayAsync(
    findAllFilenames(
      cwd
    , dirname => isntHidden(dirname)
              && notInDirnamesShouldBeDeleted(dirname)
              && isntRepo(dirname)
    )
  )
  const filenamesShouldBeDeleted = nonRepoFilenames.filter(
    x => isntHidden(x) && isntListFile(x)
  )

  return [
    ...dirnamesShouldBeDeleted
  , ...filenamesShouldBeDeleted
  ]

  async function* findAllDirnamesShouldBeDeleted(
    dirname: string
  ): AsyncIterable<string> {
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
    return dirnamesShouldBeDeleted.some(
      x => path.resolve(dirname) === path.resolve(x)
    )
  }

  function isntRepo(dirname: string) {
    return !isRepo(dirname)
  }

  function isRepo(dirname: string) {
    for (const repoDir of repoDirnames) {
      if (path.resolve(dirname) === path.resolve(repoDir)) return true
    }
    return false
  }

  function isAncestorOfRepo(dirname: string) {
    for (const repoDir of repoDirnames) {
      if (isSubPathOf(repoDir, dirname)) return true
    }
    return false
  }

  function isntListFile(filename: string): boolean {
    return !isListFile(filename)
  }

  function isListFile(filename: string): boolean {
    return filename === getListFilename(cwd)
  }
}

function isntHidden(dirname: string): boolean {
  return !isHidden(dirname)
}

function isHidden(dirname: string): boolean {
  const basename = path.basename(dirname)
  return basename.startsWith('.')
}

async function getSubDirnames(dirname: string): Promise<string[]> {
  const dirents = await fs.readdir(dirname, { withFileTypes: true })
  return dirents
    .filter(x => x.isDirectory())
    .map(x => path.join(dirname, x.name))
}
