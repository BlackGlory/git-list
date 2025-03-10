import { test, expect } from 'vitest'
import { getPathnamesShouldBeDeleted } from '@commands/purge.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

test('getPathnamesShouldBeDeleted', async () => {
  const fixtures = path.join(__dirname, 'fixtures')

  const result = await getPathnamesShouldBeDeleted(fixtures)

  expect(result).toStrictEqual([
    path.join(fixtures, 'example.com/host-directory')
  , path.join(fixtures, 'example.com/owner/owner-directory')
  , path.join(fixtures, 'top-directory')
  , path.join(fixtures, 'example.com/host-file')
  , path.join(fixtures, 'example.com/owner/owner-file')
  , path.join(fixtures, 'top-file')
  ])
})
