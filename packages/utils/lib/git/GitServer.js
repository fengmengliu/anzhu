import { homedir } from "node:os";
import path from "node:path";
import fs from "node:fs";
import { pathExistsSync } from "path-exists";
import fse from "fs-extra";
import { execa } from "execa";
import { makePassword } from "../inquirer.js";
import log from "../log.js";

const TEMP_HOME = ".anzhu"; // 缓存目录
const TEMP_TOKEN = ".token";
const TEMP_PLATEFORM = ".git_platform";

function createTokenPath() {
  return path.resolve(homedir(), TEMP_HOME, TEMP_TOKEN);
}

function createPlatformPath() {
  return path.resolve(homedir(), TEMP_HOME, TEMP_PLATEFORM);
}

function getGitPlatform() {
  if (pathExistsSync(createPlatformPath())) {
    return fs.readFileSync(createPlatformPath()).toString();
  }
  return null;
}

/**
 * 获取项目路径
 */
function getProjectPath(cwd, fullName){
  const projectName = fullName.split('/')[1];
  return path.resolve(cwd, projectName)
}

/**
 * 获取package.json文件内容
 */
function getPackageJson(cwd, fullName) {
  const projectPath = getProjectPath(cwd, fullName);
  const pkgPath = path.resolve(projectPath, 'package.json');
  if(pkgPath){
    return fse.readJsonSync(pkgPath)
  }
  return null
}

class GitServer {
  constructor() {}

  async init() {
    // 判断token是否录入
    const tokenPath = createTokenPath();
    // console.log("tokenTath:", tokenPath);
    if (pathExistsSync(tokenPath)) {
      this.token = fse.readFileSync(tokenPath).toString();
    } else {
      // 手动输入token
      this.token = await this.getToken();
      fs.writeFileSync(tokenPath, this.token);
    }
    log.verbose("token", this.token);
    log.verbose("token path", tokenPath, pathExistsSync(tokenPath));
  }

  getToken() {
    return makePassword({
      message: "请输入token信息",
    });
  }

  savePlatform(platform) {
    this.platform = platform;
    fs.writeFileSync(createPlatformPath(), platform);
  }

  getPlatform() {
    return this.platform;
  }

  /**
   * 命令行执行git clone操作
   */
  cloneRepo(fullName, tag) {
    if (tag) {
      return execa("git", ["clone", this.getRepoUrl(fullName), "-b", tag]);
    } else {
      return execa("git", ["clone", this.getRepoUrl(fullName)]);
    }
  }

  installDependencies(cwd, fullName) {
    const projectPath = getProjectPath(cwd, fullName)
    if(pathExistsSync(projectPath)){
      return execa('npm', ['install', '--registry=https://registry.npmmirror.com'], { cwd: projectPath }) // 指定下载依赖目录为projectPath目录
    }
  }

  async startProject(cwd, fullName) {
    const projectPath = getProjectPath(cwd, fullName)
    const pkg = getPackageJson(cwd, fullName)
    if(pkg){
      const { scripts, bin, name } = pkg;
      // 自动安装bin文件
      if(bin){
        await execa('npm', ['install', '-g', name, '--registry=https://registry.npmmirror.com'], { cwd: projectPath })
      }
      if(scripts && scripts.dev){
        return execa('npm', ['run', 'dev'], { cwd: projectPath, stdout: 'inherit' })
      } else if(scripts && scripts.start){
        return execa('npm', ['run', 'start'], { cwd: projectPath, stdout: 'inherit' })
      } else {
        log.warn('未找到启动命令')
      }
    }
  }
}

export { getGitPlatform, GitServer };
