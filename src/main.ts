import * as core from '@actions/core'
import {run} from './run.js'

async function main(): Promise<void> {
  try {
    await run()
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

main()
