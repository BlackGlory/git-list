import * as path from 'path'

export function getListFilename(cwd: string = '.'): string {
  return path.join(cwd, 'git-list.yaml')
}
