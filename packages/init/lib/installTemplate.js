import fse from "fs-extra";
import path from "node:path";
import { pathExistsSync } from "path-exists";
import { log } from "@anzhu.com/utils";
import ora from "ora";

function getCacheFilePath(targetPath, template) {
  return path.resolve(targetPath, "node_modules", template.npmName, "template");
}

function copyFile(targetPath, template, installDir) {
  const originFile = getCacheFilePath(targetPath, template);
  const fileList = fse.readdirSync(originFile);
  const spinner = ora("正在安装模板文件...").start();
  fileList.map((file) => {
    fse.copySync(`${originFile}/${file}`, `${installDir}/${file}`); //此处拷贝的时候，拷贝地址和目的地址的文件夹和文件都要一一对应
  });
  spinner.stop();
  log.success("模板拷贝成功");
}

export default function installTemplate(selectedTemplate, opts) {
  const { force = false } = opts;
  const { targetPath, name, template } = selectedTemplate;
  const rootDir = process.cwd(); // 当前执行目录 -- 命令行里查看的话是用：pwd而不是cwd
  fse.ensureDirSync(targetPath);
  const installDir = path.resolve(`${rootDir}/${name}`);
  // 创建安装文件夹
  if (pathExistsSync(installDir)) {
    if (!force) {
      log.error(`当前目录下存在 ${installDir} 文件夹`);
      return;
    } else {
      fse.removeSync(installDir);
      fse.ensureDirSync(installDir);
    }
  } else {
    fse.ensureDirSync(installDir);
  }

  copyFile(targetPath, template, installDir);
}
