import parse from 'git-url-parse'

export function createDirectoryName(url: string): string {
  const result = parse(url)
  return `${result.resource}/${result.owner}/${result.name}`
}
