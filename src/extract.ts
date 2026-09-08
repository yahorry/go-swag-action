import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import fs from 'fs'
import {ok} from 'assert'
import path from 'path'

const downloadPath = 'https://github.com/swaggo/swag/releases/download/'

export async function extractTool(version: string): Promise<string> {
  const candidates = getCandidateDownloadPaths(version)

  core.info(`Installing swag tool ${version} ...`)

  let toolPathZip: string | undefined
  let lastError: unknown

  for (const fullDownloadPath of candidates) {
    core.debug(`Download path is ${fullDownloadPath}`)
    try {
      toolPathZip = await tc.downloadTool(fullDownloadPath)
      break
    } catch (error) {
      lastError = error
      core.debug(
        `Failed to download from "${fullDownloadPath}": ${String(error)}`
      )
    }
  }

  if (!toolPathZip) {
    throw lastError instanceof Error
      ? lastError
      : new Error(`Failed to download swag ${version}`)
  }

  const toolPathDirectory = await tc.extractTar(toolPathZip)
  const swagToolPath = path.join(toolPathDirectory, 'swag')

  const newSwagToolPath = path.join(_getHOMEDirectory(), 'swag')
  fs.copyFileSync(swagToolPath, newSwagToolPath)
  core.debug(`New swag tool path is ${newSwagToolPath}`)

  core.addPath(newSwagToolPath)

  return newSwagToolPath
}

export function getCandidateDownloadPaths(version: string): string[] {
  const platform = getPlatform()
  return getArchCandidates().map(
    arch =>
      `${downloadPath}v${version}/swag_${version}_${platform}_${arch}.tar.gz`
  )
}

function getPlatform(): string {
  if (process.platform === 'linux') {
    return 'Linux'
  }
  if (process.platform === 'darwin') {
    return 'Darwin'
  }
  throw new Error(`Platform ${process.platform} is not supported`)
}

function getArchCandidates(): string[] {
  if (process.arch === 'arm64') {
    return ['arm64']
  }
  if (process.arch === 'x64') {
    // Most releases use x86_64; some (e.g. 1.16.3) publish amd64 instead.
    return ['x86_64', 'amd64']
  }
  throw new Error(`Arch ${process.arch} is not supported`)
}

function _getHOMEDirectory(): string {
  const homeDirectory = process.env.HOME || ''
  ok(homeDirectory, 'Expected HOME to be defined')
  return homeDirectory
}
