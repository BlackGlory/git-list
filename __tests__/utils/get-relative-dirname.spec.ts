import { describe, test, expect } from 'vitest'
import { getRelativeDirname } from '@utils/get-relative-dirname.js'
import path from 'path'

describe('getRelativeDirname', () => {
  describe('ssh protocol', () => {
    test('standard url', () => {
      const url = 'ssh://git@git.example.com:22/user/repo.git'

      const result = getRelativeDirname(url)

      expect(result).toBe(path.normalize('git.example.com/user/repo'))
    })

    test('non-standard url', () => {
        const url = 'git@git.example.com:user/repo.git'

      const result = getRelativeDirname(url)

      expect(result).toBe(path.normalize('git.example.com/user/repo'))
    })
  })

  test('http protocol', () => {
    const url = 'https://git.example.com/user/repo.git'

    const result = getRelativeDirname(url)

    expect(result).toBe(path.normalize('git.example.com/user/repo'))
  })
})
