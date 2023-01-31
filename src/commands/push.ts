import { simpleGit } from 'simple-git'
import { readURLsFromList } from '@utils/read-list.js'
import { getListFilename } from '@utils/get-list-filename.js'
import { getRelativeDirname } from '@utils/get-relative-dirname.js'
import { oneline } from 'extra-tags'
import { each } from 'extra-promise'
import { withRetry } from '@utils/with-retry.js'

export async function push({ concurrency }: {
  concurrency: number
}): Promise<void> {
  const urls = await readURLsFromList(getListFilename())

  const total = urls.length
  let done = 0
  await each(urls, async url => {
    const dirname = getRelativeDirname(url)
    try {
      const git = simpleGit({ baseDir: dirname })
      await withRetry(() => git.push(['--follow-tags']))
    } catch (e) {
      console.error(`There was an error in ${dirname}`)
      throw e
    }

    done++
    console.log(oneline`
      [${done}/${total}]
      ${dirname}: pushed
    `)
  }, concurrency)
}
