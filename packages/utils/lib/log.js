import log from "npmlog";
import isDebug from './isDebug.js'

// log.http('http', 'http ququest to https://baidu.com') // 还有类似http的其他日志类型可供选择

if (isDebug()) {
  log.level = "verbose"; // 用来设置打印调试日志
} else {
  log.level = "info";
}

// 添加自定义级别样式
log.addLevel('success', 2000, {fg: 'green', bg: 'red',bold: true})

log.heading = 'anzhu' // 会在日志前面添加标识，比如是vue还是react等

export default log;

// 安装方式： npm i @anzhu.com/utils -w packages/cli
