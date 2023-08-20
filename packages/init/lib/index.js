import Command from "@anzhu.com/command"
import { log } from "@anzhu.com/utils"

import creatTemplate from "./creatTemplate.js";
import downloadTemplate from "./downloadTemplate.js";
import installTemplate from "./installTemplate.js";

/**
 * 
 * examples:
 * anzhu init
 * anzhu init test -t project -tp template-vue3 --force
 */

class InitCommand extends Command {
  get command() {
    return "init [name]";
  }
  get description() {
    return "init project";
  }
  get options() {
    // 为了方便自动化测试，提供的命令行交互选项功能，需要在此处定义好有哪些option，这样可以不用通过交互的方式去选，直接命令行一次性传递值给过去
    return [
      ["-f, --force", "是否强制更新", false],
      ["-t, --type <type>", "项目类型(project/page)"], // 没有<type>只有true和false两个值，默认为false
      ["-tp, --template <template>", "模板名称"]
    ];
  }
  async action([name, opts]) {
    // log("init:", name, opts);
    log.verbose("init:", name, opts) // 调试模式-- 需要将log.level设置为verbose，默认是info(即其上面的warn， error都能打印出来)
    // 1.选择项目模板，生成项目信息
    const selectedTemplate = await creatTemplate(name, opts)
    log.verbose('template:', selectedTemplate)
    // 2.下载项目模板至缓存目录
    await downloadTemplate(selectedTemplate)
    // 3.安装项目模板至项目目录
    await installTemplate(selectedTemplate, opts)

  }
  preAction(){
    // console.log('pre');
  }
  postAction(){
    // console.log('post');
  }
}

function Init(instance) {
  return new InitCommand(instance);
}

export default Init;
