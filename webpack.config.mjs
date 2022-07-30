import { fileURLToPath } from 'url'

export default {
  target: 'node'
, mode: 'none'
, node: {
    global: true,
    __filename: true,
    __dirname: true,
  }
, entry: './lib/cli.js'
, output: {
    path: fileURLToPath(new URL('dist', import.meta.url))
  , filename: 'cli.cjs'
  }
, externals: {
    'fsevents': 'commonjs fsevents'
  }
}
