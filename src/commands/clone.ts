import { simpleGit } from 'simple-git'
import { readList } from '@utils/read-list.js'
import { createListFilename } from '@utils/create-list-filename.js'
import { createDirectoryName } from '@utils/create-directory-name.js'
import { oneline } from 'extra-tags'
import { each } from 'extra-promise'
import { pathExists } from 'extra-filesystem'
import { withRetry } from '@utils/with-retry.js'

export async function clone({ concurrency }: {
  concurrency: number
}): Promise<void> {
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
      try {
        await withRetry(() => git.clone(remote, local))
      } catch (e) {
        console.error(`There was an error in ${local}`)
        throw e
      }

      done++
      console.log(oneline`
        [${done}/${total}]
        ${local}: cloned
      `)
    }
  }, concurrency)
}
