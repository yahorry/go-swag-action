import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import fs from 'fs'
import {ok} from 'assert'
import path from 'path'

const downloadPath = 'https://github.com/swaggo/swag/releases/download/'

export async function extractTool(version: string): Promise<string> {
  const fullDownloadPath = getFullDownloadPath(version)
  core.debug(`Download path is ${fullDownloadPath}`)

  core.info(`Installing swag tool ${version} ...`)
  const toolPathZip = await tc.downloadTool(fullDownloadPath)

  const toolPathDirectory = await tc.extractTar(toolPathZip)
  const swagToolPath = path.join(toolPathDirectory, 'swag')

  const newSwagToolPath = path.join(_getHOMEDirectory(), 'swag')
  fs.copyFileSync(swagToolPath, newSwagToolPath)
  core.debug(`New swag tool path is ${newSwagToolPath}`)

  core.addPath(newSwagToolPath)

  return newSwagToolPath
}

function getFullDownloadPath(version: string): string {
  let platform: string
  if (process.platform === 'linux') {
    platform = 'Linux'
  } else if (process.platform === 'darwin') {
    platform = 'Darwin'
  } else {
    throw new Error(`Platform ${process.platform} is not supported`)
  }

  return `${downloadPath}v${version}/swag_${version}_${platform}_x86_64.tar.gz`
}

function _getHOMEDirectory(): string {
  const homeDirectory = process.env.HOME || ''
  ok(homeDirectory, 'Expected HOME to be defined')
  return homeDirectory
}
