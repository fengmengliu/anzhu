import createInitCommand from "@anzhu.com/init";
import createInstallCommand from '@anzhu.com/install'
import createLintCommand from '@anzhu.com/lint'
import createCLI from "./createCLI.js"; 

import './exception.js'

export default function (args) {
  const program = createCLI()
  // 注册命令
  //   program
  //     .command("init [name]")
  //     .description("init project")
  //     .option("-f, --force", "是否强制更新", false)
  //     .action((name, opts) => {
  //       console.log("init", name, opts);
  //     });
  createInitCommand(program); 
  createInstallCommand(program);
  createLintCommand(program)

  program.parse(process.argv);
}
