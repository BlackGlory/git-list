import simpleGit from 'simple-git'
import { readList } from '@utils/read-list'
import { createListFilename } from '@utils/create-list-filename'
import { createDirectoryName } from '@utils/create-directory-name'
import { oneline } from 'extra-tags'
import { each } from 'extra-promise'
import { pathExists } from 'extra-filesystem'
import { withRetry } from '@utils/with-retry'

export async function clone(concurrency: number = Infinity): Promise<void> {
  const git = simpleGit()
  const list = await readList(createListFilename())

  const total = list.length
  let done = 0
  await each(list, async remote => {
    const local = createDirectoryName(remote)
    if (await pathExists(local)) {
      done++
      console.log(oneline`
        [${done}/${total}]
        ${local}: already exists
      `)
    } else {
      await withRetry(() => git.clone(remote, local))

      done++
      console.log(oneline`
        [${done}/${total}]
        ${local}: cloned
      `)
    }
  }, concurrency)
}
