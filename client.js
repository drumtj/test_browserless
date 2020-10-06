const { Worker } = require('worker_threads');

class Client {
  ready;
  worker;
  sendResolve = {};
  constructor(opt){
    this.ready = new Promise(resolve=>{
      this.worker = new Worker(require.resolve("./worker.js"), {
        workerData: opt
      });
      this.worker.on('message', this.onMessage.bind(this));
    })
  }

  async onMessage(message){
    let {com, data, key} = message;

    if(key){
      if(this.sendResolve[key]){
        this.sendResolve[key](data);
        delete this.sendResolve[key];
      }
      return;
    }

    switch(com){

    }
  }

  genKey(){
    return 'k' + Math.floor(Date.now()%100000) + Math.round(Math.random()*100000);
  }

  send(com, data, promise=true){
    let key;
    if(promise){
      key = this.genKey();
    }
    return new Promise(resolve=>{
      if(promise){
        this.sendResolve[key] = resolve;
      }
      this.worker.postMessage({com, data, key});
    })
  }

  goto(url){
    return this.send('goto', url);
  }

  test(url){
    return this.send('test', url);
  }
}

module.exports = Client;
