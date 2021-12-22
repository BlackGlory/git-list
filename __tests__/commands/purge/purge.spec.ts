import { getPathnamesShouldBeDeleted } from '@commands/purge'
import * as path from 'path'

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
