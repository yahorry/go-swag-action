import * as core from '@actions/core'
import {compareGoFiles} from './compare-go-files'
import {execTool} from './command'
import {extractTool} from './extract'

export async function run(): Promise<void> {
  const swagVersion = core.getInput('swagVersion', {required: true})
  const toolPath = await extractTool(swagVersion)

  const command = core.getInput('command')
  if (command !== '') {
    const returnCode = await execTool(toolPath, command)
    if (returnCode !== 0) {
      throw new Error(`swag tool is failed to exec your command`)
    }
  }

  const equalToGoPath = core.getInput('equalToGoPath')
  if (equalToGoPath !== '') {
    await compareGoFiles(equalToGoPath)
  }
}
