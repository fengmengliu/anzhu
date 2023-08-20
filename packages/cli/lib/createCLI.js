import path from "node:path"; // path的esm形式包：node:path
import { program } from "commander";
import { dirname } from "dirname-filename-esm";
import fse from "fs-extra";
import semver from "semver";
import chalk from "chalk";
import { log } from "@anzhu.com/utils";

const __dirname = dirname(import.meta); // 当前js文件所在的目录
const pkgPath = path.resolve(__dirname, "../package.json"); // 是在当前js所在目录的上层package.json文件
const pkg = fse.readJSONSync(pkgPath); // 读取package.json文件

const LOWEST_NODE_VERSION = "18.0.0";

// 检查node版本
function checkNodeVersion() {
  if (!semver.gte(process.version, LOWEST_NODE_VERSION)) {
    throw new Error(
      chalk.red(`anzhu 脚手架需要安装 ${LOWEST_NODE_VERSION} 以上版本的node.js`)
    );
  }
}
function preAction() {
  // 检查node版本
  checkNodeVersion();
}

export default function () {
  program
    .name(Object.keys(pkg.bin)[0])
    .usage("<command> [options]")
    .version(pkg.version)
    .option("-d, --debug", "是否开启调试模式", false)
    .hook("preAction", preAction);

  // 监听属性
  program.on("option:debug", function () {
    // 此处program.opts()获取到的属性是在上面program
    if (program.opts().debug) {
      log.verbose("debug", "launch debug mode");
    }
  });

  // 监听未注册的命令: command:*为未注册的命令
  program.on("command:*", function (obj) {
    log.error("未知的命令：" + obj[0]);
  });

  return program;
}
