// import log from "./log.js";
// import isDebug from "./isDebug.js";
import log from "./log.js";
import { getLatestVersion } from "./npm.js";
import isDebug from "./isDebug.js";
import { makeList, makeInput, makePassword } from "./inquirer.js";
import Github from './git/Github.js'
import Gitee from './git/Gitee.js'
import { getGitPlatform } from './git/GitServer.js'

function printErrorMessage(type, e) {
  if (isDebug()) {
    log.error(type, e);
  } else {
    log.error(type, e.message);
  }
}

export {
  log,
  isDebug,
  makeList,
  makeInput,
  makePassword,
  getLatestVersion,
  printErrorMessage,
  Github,
  Gitee,
  getGitPlatform
};
