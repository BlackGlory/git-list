import * as path from 'path'

export function createListFilename(): string {
  return path.normalize('git-list.yaml')
}
