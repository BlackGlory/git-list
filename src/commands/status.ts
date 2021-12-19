import simpleGit from 'simple-git'
import { readList } from '@utils/read-list'
import { createListFilename } from '@utils/create-list-filename'
import { createDirectoryName } from '@utils/create-directory-name'
import { oneline } from 'extra-tags'
import { each } from 'extra-promise'

export async function status(concurrency: number = Infinity): Promise<void> {
  const list = await readList(createListFilename())

  const total = list.length
  let done = 0
  await each(list, async remote => {
    const local = createDirectoryName(remote)
    const git = simpleGit({ baseDir: local })
    const status = await git.status()

    done++
    console.log(oneline`
      [${done}/${total}]
      ${local}: ${status.isClean() ? 'clean' : 'not clean'}
    `)
  }, concurrency)
}
