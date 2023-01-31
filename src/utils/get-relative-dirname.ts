import parse from 'git-url-parse'
import * as path from 'path'

export function getRelativeDirname(url: string): string {
  const result = parse(url)
  return path.normalize(`${result.resource}/${result.owner}/${result.name}`)
}
