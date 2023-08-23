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
}

export { getGitPlatform, GitServer };
