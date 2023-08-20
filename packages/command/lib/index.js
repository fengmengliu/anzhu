class Command {
  constructor(instance) {
    if (!instance) {
      throw new Error("command instance must not be null!");
    }

    this.program = instance;
    // 注册命令

    const cmd = this.program.command(this.command);

    cmd.description(this.description);
    cmd.hook('preAction', () =>{
      this.preAction()
    })
    cmd.hook('postAction', () => {
      this.postAction()
    })
    if(this.options?.length > 0){
      // console.log('this.options:', this.options)
      this.options.forEach(option => {
        cmd.option(...option)
      });
    }

    // cmd.option("-f, --force", "是否强制更新", false);
    cmd.action((...params) => {
      this.action(params)
    });

    // 下方改写成上面封装好的架子
    //   program
    //     .command("init [name]")
    //     .description("init project")
    //     .option("-f, --force", "是否强制更新", false)
    //     .action((name, opts) => {
    //       console.log("init", name, opts);
    //     });
  }

  get command() {
    throw new Error("command must be implement");
  }

  get description() {
    throw new Error("description must be implement");
  }

  get options(){
    return []
  }

  get action(){
    throw new Errow('action must be implement')
  }
}

export default Command
