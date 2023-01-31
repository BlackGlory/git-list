import * as fs from 'fs/promises'
import * as YAML from 'js-yaml'
import { validateList } from '@utils/validate-list.js'

export async function readURLsFromList(filename: string): Promise<string[]> {
  const text = await fs.readFile(filename, 'utf-8')
  const data = YAML.load(text)
  validateList(data)
  return data as string[]
}
