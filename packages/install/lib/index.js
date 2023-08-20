import Command from "@anzhu.com/command";
import { Github, Gitee, makeInput, makeList, getGitPlatform, log } from "@anzhu.com/utils";

class InstallCommand extends Command {
  get command() {
    return "install";
  }

  get description() {
    return "install project";
  }

  get options() {}

  async action() {
    this.generateGitAPI()
  }

  async generateGitAPI() {
    let platform = getGitPlatform();
    if(!platform){
      platform = await makeList({
        message: "请选择Git平台",
        choices: [
          {
            name: "GitHub",
            value: "github",
          },
          {
            name: "Gitee",
            value: "gitee",
          },
        ],
      });
    }
    log.verbose('platform:', platform)
    let gitAPI;
    if(platform === 'github'){
      gitAPI = new Github();
    } else {
      gitAPI = new Gitee();
    }
    gitAPI.savePlatform(platform)
    await gitAPI.init()
    this.gitAPI = gitAPI;
    // const searchResult = await gitAPI.searchRepositories({
    //   q: 'vue+language:vue',
    //   // language: 'JavaScript',
    //   order: 'desc',
    //   // sort: 'stars_count',
    //   sort: 'stars',
    //   per_page: 5,
    //   page: 1
    // })
  }

  async searchGitAPI(){
    // 1. 收集搜索关键词和开发语言
    const q = await makeInput({
      message: '请输入搜索关键词',
      validate(value) {
        if(value.length > 0){
          return true;
        } else {
          return '请输入搜索关键词'
        }
      }
    })
    const language = await makeInput({
      message: '请输入开发语言'
    })
    // 2.生成搜索参数
    const params = {

    }

    // const searchResult = await this.gitAPI.searchRepositories({
    //   q: 'vue+language:vue',
    //   // language: 'JavaScript',
    //   order: 'desc',
    //   // sort: 'stars_count',
    //   sort: 'stars',
    //   per_page: 5,
    //   page: 1
    // })
  }

  preAction() {
    // console.log('pre');
  }
  postAction() {
    // console.log('post');
  }
}

function Install(instance) {
  return new InstallCommand(instance);
}

export default Install;
