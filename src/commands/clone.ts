import { simpleGit } from 'simple-git'
import { readURLsFromList } from '@utils/read-list.js'
import { getListFilename } from '@utils/get-list-filename.js'
import { getRelativeDirname } from '@utils/get-relative-dirname.js'
import { oneline } from 'extra-tags'
import { each } from 'extra-promise'
import { pathExists } from 'extra-filesystem'
import { withRetry } from '@utils/with-retry.js'

export async function clone({ concurrency }: {
  concurrency: number
}): Promise<void> {
  const git = simpleGit()
  const urls = await readURLsFromList(getListFilename())

  const total = urls.length
  let done = 0
  await each(urls, async url => {
    const dirname = getRelativeDirname(url)

    if (await pathExists(dirname)) {
      done++
      console.log(oneline`
        [${done}/${total}]
        ${dirname}: already exists
      `)
    } else {
      try {
        await withRetry(() => git.clone(url, dirname))
      } catch (e) {
        console.error(`There was an error in ${dirname}`)
        throw e
      }

      done++
      console.log(oneline`
        [${done}/${total}]
        ${dirname}: cloned
      `)
    }
  }, concurrency)
}
