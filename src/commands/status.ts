import { simpleGit } from 'simple-git'
import { readURLsFromList } from '@utils/read-list.js'
import { getListFilename } from '@utils/get-list-filename.js'
import { getRelativeDirname } from '@utils/get-relative-dirname.js'
import { oneline } from 'extra-tags'
import { each } from 'extra-promise'

export async function status({ concurrency }: {
  concurrency: number
}): Promise<void> {
  const urls = await readURLsFromList(getListFilename())

  const total = urls.length
  let done = 0
  await each(urls, async url => {
    const dirname = getRelativeDirname(url)
    const git = simpleGit({ baseDir: dirname })

    try {
      const status = await git.status()

      done++
      console.log(oneline`
        [${done}/${total}]
        ${dirname}: ${status.isClean() ? 'clean' : 'not clean'}
      `)
    } catch (e) {
      console.error(`There was an error in ${dirname}`)
      throw e
    }
  }, concurrency)
}
