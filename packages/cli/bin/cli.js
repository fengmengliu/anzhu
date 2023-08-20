#!/usr/bin/env node

import importLocal from 'import-local'
import { filename } from 'dirname-filename-esm'
import { log } from '@anzhu.com/utils'
import entry from '../lib/index.js'

const __filename = filename(import.meta)

if(importLocal(__filename)){ // 作用：判断bin/cli.js能否加载到本地版本
  log.info('cli', '使用本地anzhu版本')
} else {
  entry(process.argv.slice(2))
}