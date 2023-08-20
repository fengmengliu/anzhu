import path from "node:path";
import { homedir } from "node:os";
import { makeList, makeInput, log, getLatestVersion } from "@anzhu.com/utils";
const ADD_TYPE_PROJECT = "project";
const ADD_TYPE_PAGE = "page";
const ADD_TYPE_COMPONENT = "component";
const TEMP_HOME = ".anzhu"; // 缓存目录
const ADD_TEMPLATE = [
  {
    name: "vue3项目模板",
    value: "template-vue3",
    npmName: "@anzhu.com/template-vue3",
    version: "1.0.1",
  },
  {
    name: "react18项目模板",
    value: "template-react18",
    npmName: "@anzhu.com/template-react18",
    version: "1.0.0",
  },
];

const ADD_TYPE = [
  {
    name: "项目",
    value: ADD_TYPE_PROJECT,
  },
  {
    name: "页面",
    value: ADD_TYPE_PAGE,
  },
  {
    name: "组件",
    value: ADD_TYPE_COMPONENT,
  },
];

// 获取创建类型
function getAddType() {
  return makeList({
    choices: ADD_TYPE,
    message: "请选择初始化类型",
    defaultValue: ADD_TYPE_PROJECT,
  });
}

// 获取项目名称
function getAddName() {
  return makeInput({
    message: "请输入项目名称",
    defaultValue: "",
    validate(v) {
      if (v.length > 0) {
        return true;
      }
      return "项目名称必须输入";
    },
  });
}

// 选择项目模版
function getAddTemplate() {
  return makeList({
    choices: ADD_TEMPLATE,
    message: "请选择项目模板",
  });
}

// 安装缓存目录
function makeTargetPath() {
  // log.verbose("homedir", homedir()); // homedir()用来拿到用户主目录
  return path.resolve(`${homedir()}/${TEMP_HOME}`, "addTemplate");
}

export default async function creatTemplate(name, opts) {
  const { type = null, template = null } = opts;
  let addType; // 创建项目类型
  let addName; // 项目名称
  let selectedTemplate; // 创建的项目模板
  // 命令行里如果已经填写了选项，则不再弹出选项
  if (type) {
    addType = type;
  } else {
    addType = await getAddType();
  }
  log.verbose("addType:", addType);
  if (addType === ADD_TYPE_PROJECT) {
    if (name) {
      addName = name;
    } else {
      addName = await getAddName();
    }
    log.verbose("addName:", addName);
    if (template) {
      selectedTemplate = ADD_TEMPLATE.find((tpl) => tpl.value === template);
      if(!selectedTemplate){
        throw new Error(`项目模板 ${template} 不存在！`)
      }
    } else {
      const addTemplate = await getAddTemplate();
      selectedTemplate = ADD_TEMPLATE.find(
        (item) => item.value === addTemplate
      );
      log.verbose("addTemplate", addTemplate);
    }
    log.verbose("selectedTemplate", selectedTemplate);

    // 获取最新的npm版本号
    const latestVersion = await getLatestVersion(selectedTemplate.npmName);
    log.verbose("latestVersion", latestVersion);
    selectedTemplate.version = latestVersion;
    const targetPath = makeTargetPath();

    return {
      type: addType,
      name: addName,
      template: selectedTemplate,
      targetPath,
    };
  } else {
    throw new Error(`创建的项目类型 ${addType} 不支持`)
  }
}
