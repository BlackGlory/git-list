import simpleGit from 'simple-git'
import { readList } from '@utils/read-list'
import { createListFilename } from '@utils/create-list-filename'
import { createDirectoryName } from '@utils/create-directory-name'
import { oneline } from 'extra-tags'
import { each } from 'extra-promise'
import { withRetry } from '@utils/with-retry'

export async function push({ concurrency }: {
  concurrency: number
}): Promise<void> {
  const list = await readList(createListFilename())

  const total = list.length
  let done = 0
  await each(list, async remote => {
    const local = createDirectoryName(remote)
    const git = simpleGit({ baseDir: local })

    try {
      await withRetry(() => git.push(['--follow-tags']))
    } catch (e) {
      console.error(`There was an error in ${local}`)
      throw e
    }

    done++
    console.log(oneline`
      [${done}/${total}]
      ${local}: pushed
    `)
  }, concurrency)
}
