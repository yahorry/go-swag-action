import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as esbuild from 'esbuild'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = join(root, 'dist')

mkdirSync(distDir, { recursive: true })

await esbuild.build({
  entryPoints: [join(root, 'src/main.ts')],
  bundle: true,
  platform: 'node',
  target: 'node24',
  format: 'cjs',
  outfile: join(distDir, 'index.js'),
  sourcemap: true,
  legalComments: 'none',
  // undici's main entry eagerly loads WebSocket. This action only needs HTTP
  // (ProxyAgent). Stub WebSocket so RFC-mandated SHA-1 handshake code is not
  // shipped in dist/ (and does not trip weak-crypto scanners).
  plugins: [
    {
      name: 'stub-undici-websocket',
      setup(build) {
        build.onResolve({ filter: /\/web\/websocket\// }, args => ({
          path: args.path,
          namespace: 'undici-websocket-stub'
        }))
        build.onLoad({ filter: /.*/, namespace: 'undici-websocket-stub' }, () => ({
          contents: 'module.exports = {}',
          loader: 'js'
        }))
      }
    }
  ]
})

writeFileSync(join(distDir, 'package.json'), `${JSON.stringify({ type: 'commonjs' })}\n`)
