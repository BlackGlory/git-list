import { simpleGit } from 'simple-git'
import { readList } from '@utils/read-list.js'
import { createListFilename } from '@utils/create-list-filename.js'
import { createDirectoryName } from '@utils/create-directory-name.js'
import { oneline } from 'extra-tags'
import { each } from 'extra-promise'

export async function status({ concurrency }: {
  concurrency: number
}): Promise<void> {
  const list = await readList(createListFilename())

  const total = list.length
  let done = 0
  await each(list, async remote => {
    const local = createDirectoryName(remote)
    const git = simpleGit({ baseDir: local })

    try {
      const status = await git.status()

      done++
      console.log(oneline`
        [${done}/${total}]
        ${local}: ${status.isClean() ? 'clean' : 'not clean'}
      `)
    } catch (e) {
      console.error(`There was an error in ${local}`)
      throw e
    }
  }, concurrency)
}
