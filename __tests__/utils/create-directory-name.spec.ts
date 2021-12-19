import { createDirectoryName } from '@utils/create-directory-name'

describe('ssh protocol', () => {
  test('standard url', () => {
    const url = 'ssh://git@git.example.com:22/user/repo.git'

    const result = createDirectoryName(url)

    expect(result).toBe('git.example.com/user/repo')
  })

  test('non-standard url', () => {
      const url = 'git@git.example.com:user/repo.git'

    const result = createDirectoryName(url)

    expect(result).toBe('git.example.com/user/repo')
  })
})

test('http protocol', () => {
  const url = 'https://git.example.com/user/repo.git'

  const result = createDirectoryName(url)

  expect(result).toBe('git.example.com/user/repo')
})
