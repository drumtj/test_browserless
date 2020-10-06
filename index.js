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

(async () => {

  let count = 1;
  let roomNum;
  // let url = 'https://ip.pe.kr/';
  // let url = 'http://lumtest.com/myip.json';
  // let url = 'http://educraft.kr/';
  let url = 'https://stage.tkbell.kr';
  // let url = 'http://luminati.io';
  //

  prompt.start();
  await new Promise(resolve=>{
    prompt.get(['RoomNumber', 'Count'], (err, result)=>{
      if(err){
        console.log(err);
        return;
      }

      roomNum = result.RoomNumber;
      count = result.Count;
      resolve();
    })
  })


  const clients = [];
  const taskPs = [];
  for(let i=0; i<count; i++){
    let client = new Client({width: 500, height: 700});
    clients.push(client);
    // await client.goto(url);
    taskPs.push(client.test({url, i:i+1, roomNum}));
  }
  await Promise.all(taskPs);
  console.error("complete");
})();
