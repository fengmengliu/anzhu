import path from 'node:path'
import Command from "@anzhu.com/command";
import { log, printErrorMessage } from "@anzhu.com/utils";
import { ESLint } from "eslint";
import { execa } from 'execa';
import ora from "ora";
import jest from "jest";
import Mocha from 'mocha';
import vueConfig from "./eslint/vueConfig.js";

class LintCommand extends Command {
  get command() {
    return "lint";
  }
  get description() {
    return "lint project";
  }
  get options() {
    return [];
  }

  extractESLint(resultText, type) {
    const problemsPattern = /[0-9]+ problems/;
    const errorsPattern = /[0-9]+ errors/;
    const warningsPattern = /[0-9]+ warnings/;
    switch(type) {
      case 'problems':
        return resultText.match(problemsPattern)[0].match(/[0-9]+/)[0];
      case 'errors':
        return resultText.match(errorsPattern)[0].match(/[0-9]+/)[0];
      case 'warnings':
        return resultText.match(warningsPattern)[0].match(/[0-9]+/)[0];
      default:
        return null;
    }
  }

  parseESLintResult(resultText){
    const problems = this.extractESLint(resultText, 'problems')
    const errors = this.extractESLint(resultText, 'errors')
    const warnings = this.extractESLint(resultText, 'warnings')
    return {
      problems: +problems || 0,
      errors: +errors || 0,
      warnings: +warnings || 0
    }
  }

  async action([name, opts]) {
    log.verbose("lint");
    // 1.eslint校验 --- 对指定文件进行lint操作
    // (1)准备工作
    const spinner = ora("安装依赖中...").start()
    try {
      await execa('npm', ['install', '-D', 'eslint-config-airbnb-base'])
      await execa('npm', ['install', '-D', 'eslint-plugin-vue'])
    } catch (error) {
      printErrorMessage(error)
    } finally {
      spinner.stop()
    }
    log.info('正在执行eslint检查')
    // (2)执行工作
    const cwd = process.cwd();
    const eslint = new ESLint({ 
      cwd, 
      baseConfig: vueConfig
    }); // overrideConfig: 项目里有eslintconfig的话，会覆盖，没有的话，则使用自己的
    const results = await eslint.lintFiles(["**/*.js", "**/*.vue"]);
    const formatter = await eslint.loadFormatter("stylish");
    const resultText = formatter.format(results);
    // console.log('resultText', resultText);
    const eslintResult = this.parseESLintResult(resultText)
    log.verbose('eslintResult', eslintResult)
    log.success('eslint检查完毕', '错误：' + eslintResult.errors, '警告：' + eslintResult.warnings)
    // 2.jest/mocha
    log.info('自动执行jest测试');
    await jest.run('test')
    log.info('jest测试执行完毕');
    // 3.mocha
    log.info('自动执行mocha测试')
    const mochaInstance = new Mocha()
    mochaInstance.addFile(path.resolve(cwd, '__tests__/mocha_test.js')) // 需要扩展，可以测试整个测试目录
    mochaInstance.run(() => {
      log.info('mocha测试执行完毕');
    });
  }
  preAction() {
    // console.log('pre');
  }
  postAction() {
    // console.log('post');
  }
}

function Lint(instance) {
  return new LintCommand(instance);
}

export default Lint;
