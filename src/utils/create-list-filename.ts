import * as path from 'path'

export function createListFilename(cwd: string = '.'): string {
  return path.join(cwd, 'git-list.yaml')
}
