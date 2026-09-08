import {expect, test} from '@jest/globals'
import {getCandidateDownloadPaths} from '../src/extract.js'

const originalPlatform = process.platform
const originalArch = process.arch

function mockProcess(platform: NodeJS.Platform, arch: string): void {
  Object.defineProperty(process, 'platform', {value: platform})
  Object.defineProperty(process, 'arch', {value: arch})
}

function restoreProcess(): void {
  Object.defineProperty(process, 'platform', {value: originalPlatform})
  Object.defineProperty(process, 'arch', {value: originalArch})
}

test('linux x64 prefers x86_64 then falls back to amd64', () => {
  mockProcess('linux', 'x64')
  try {
    expect(getCandidateDownloadPaths('1.16.3')).toEqual([
      'https://github.com/swaggo/swag/releases/download/v1.16.3/swag_1.16.3_Linux_x86_64.tar.gz',
      'https://github.com/swaggo/swag/releases/download/v1.16.3/swag_1.16.3_Linux_amd64.tar.gz'
    ])
  } finally {
    restoreProcess()
  }
})

test('darwin x64 uses Darwin_x86_64 with amd64 fallback', () => {
  mockProcess('darwin', 'x64')
  try {
    expect(getCandidateDownloadPaths('1.16.4')).toEqual([
      'https://github.com/swaggo/swag/releases/download/v1.16.4/swag_1.16.4_Darwin_x86_64.tar.gz',
      'https://github.com/swaggo/swag/releases/download/v1.16.4/swag_1.16.4_Darwin_amd64.tar.gz'
    ])
  } finally {
    restoreProcess()
  }
})

test('linux arm64 uses arm64 only', () => {
  mockProcess('linux', 'arm64')
  try {
    expect(getCandidateDownloadPaths('1.16.6')).toEqual([
      'https://github.com/swaggo/swag/releases/download/v1.16.6/swag_1.16.6_Linux_arm64.tar.gz'
    ])
  } finally {
    restoreProcess()
  }
})

test('unsupported platform throws', () => {
  mockProcess('win32', 'x64')
  try {
    expect(() => getCandidateDownloadPaths('1.16.4')).toThrow(
      'Platform win32 is not supported'
    )
  } finally {
    restoreProcess()
  }
})
