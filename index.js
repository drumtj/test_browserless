// const { Worker } = require('worker_threads');
//
// async function createPage(){
//   return new Promise(resolve=>{
//     const worker = new Worker(require.resolve("./worker.js"));
//     worker.once('message', page=>{
//       console.error('receive', page);
//       resolve(page)
//     });
//     worker.postMessage("get");
//   })
// }
//
const prompt = require('prompt');
const Client = require("./client.js");

function delay(time){
  return new Promise(resolve=>setTimeout(resolve, time));
}

(async () => {

  let count = 1;
  let roomNum;
  // let url = 'https://ip.pe.kr/';
  // let url = 'http://lumtest.com/myip.json';
  // let url = 'http://educraft.kr/';
  let urls = [
    'https://stage-q.tkbell.co.kr/student/index.do',
    "https://q.tkbell.co.kr/student/index.do"
  ]
  let url;
  // let url = 'http://luminati.io';
  //

  prompt.start();
  let schema = {
    properties: {
      Count: {
        description: '열릴 창 수를 입력하세요(기본값=20) [1 ~ 30]',
        default: 20,
        required: true
      },
      Server: {
        description: '테스트할 서버 번호를 입력하세요(기본값=0) [0=stage, 1=real]',
        default: 0,
        required: true
      },
      RoomNumber: {
        description: '방번호를 입력하세요',
        pattern: /^[0-9]{6}$/,
        message: '6자리 숫자만 입력해주세요',
        required: true
      }
    }
  };
  await new Promise(resolve=>{
    prompt.get(schema, (err, result)=>{
      if(err){
        console.log(err);
        return;
      }

      let sn = Math.max(0, Math.min(1, result.Server));
      url = urls[sn];
      roomNum = result.RoomNumber;
      count = Math.max(1, Math.min(30, result.Count));
      resolve();
    })
  })


  const clients = [];
  const screen = {
    width: 1920,
    height: 1020
  }
  const browserSize = {
    width: 500,
    height: 700
  }

  let culumnSize = 10;
  let rowSize = 3;

  let gapX = Math.min((screen.width-browserSize.width) / Math.min(count, culumnSize), browserSize.width);
  let gapY = Math.min((screen.height-browserSize.height) / (Math.min(Math.ceil(count/culumnSize), rowSize)-1), browserSize.height);
  // console.log(Math.min(Math.ceil(count/culumnSize), rowSize), gapY);
  const taskPs = [];
  for(let i=0; i<count; i++){
    let position;
    let x,y;
    x = Math.floor((i%culumnSize) * gapX);
    y = Math.floor(i/culumnSize) * gapY;
    position = `${x},${y}`;
    // console.log(position);
    let client = new Client({width: browserSize.width, height: browserSize.height, position:position, index:i});
    client.onClickBroadcast = function(data){
      clients.forEach(c=>{
        // console.error(c.option.index, data.id);
        if(c.option.index != data.id){
          c.click(data);
        }
      })
    }
    client.onInputBroadcast = function(data){
      clients.forEach(c=>{
        // console.error(c.option.index, data.id);
        if(c.option.index != data.id){
          c.char(data.value);
        }
      })
    }
    // client.onChangeBroadcast = function(data){
    //   clients.forEach(c=>{
    //     // console.error(c.option.index, data.id);
    //     if(c.option.index != data.id){
    //       c.type(data.selector, data.value);
    //     }
    //   })
    // }
    clients.push(client);
    // await client.goto(url);
    // await client.test({url, roomNum});
    taskPs.push(client.test({url, roomNum}));
    // // await delay(300);
    if(taskPs.length == 5 || i == count-1){
      await Promise.all(taskPs);
      taskPs.length = 0;
    }
  }
  // console.error("complete");
  // await new Promise(resolve=>{
    prompt.get({
      properties: {
        exit:{
          description: '종료하려면 0',
          pattern: /^[0]$/,
          message: '종료하려면 0',
          required: true
        }
      }
    }, async (err, result)=>{
      if(err){
        console.log(err);
        return;
      }

      await Promise.all(clients.map(client=>client.dispose()));
      process.exit();
      // resolve();
    })
  // })
})();
