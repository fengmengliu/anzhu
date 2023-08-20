import path from "node:path";
import { pathExistsSync } from "path-exists"; // 判断目录是否存在
import fse from "fs-extra";
import { execa } from 'execa';
import ora from "ora";

import { printErrorMessage, log } from '@anzhu.com/utils'

function getCacheDir(targetPath) {
  // return path.resolve(targetPath, "node_modules"); // 必须得有node_modules目录，否则无法安装项目 -- 老师上课是这么说的，实际上没有node_modules也能安装成功
  return path.resolve(targetPath);
}

// 创建缓存目录
function makeCacheDir(targetPath) {
  const cacheDir = getCacheDir(targetPath);
  if (!pathExistsSync(cacheDir)) {
    fse.mkdirpSync(cacheDir); // mkdirpSync目录中某个目录没有都会被创建
  }
}

// 下载项目模板
async function downloadAddTemplate(targetPath, selectedTemplate){
    log.verbose('targetPath, selectedTemplate', targetPath, selectedTemplate)
    const { npmName, version } = selectedTemplate;
    const installCommand = 'npm';
    const installArgs = ['install', `${npmName}@${version}`]
    const cwd = targetPath;
    log.verbose('cwd:', cwd)
    log.verbose('installArgs', installArgs, cwd)
    await execa(installCommand, installArgs, {cwd})
}

export default async function downloadTemplate(selectedTemplate) {
  const { template, targetPath } = selectedTemplate;
  makeCacheDir(targetPath);
  const spinner = ora("正在下载模板...").start();
  try {
      await downloadAddTemplate(targetPath, template)
      spinner.stop();
      log.success('下载模板成功')
  } catch (e) {
    spinner.stop();
    printErrorMessage(e)
  }
}
