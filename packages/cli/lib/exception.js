// 异常捕获处理
import { log, isDebug } from "@anzhu.com/utils";

function printErrorMessage(type, e) {
  if (isDebug()) {
    log.error(type,e);
  } else {
    log.error(type, e.message);
  }
}

// 异常捕获
process.on("uncaughtException", (e) => printErrorMessage('error', e));

process.on("unhandledRejection", (e) => printErrorMessage('promise', e));
