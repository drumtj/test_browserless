const puppeteer = require('puppeteer');
const { parentPort, workerData } = require("worker_threads");
const PROXY_ZONE_NAME = 'lum-customer-hl_939c0d45-zone-zone1-country-jp';
const PROXY_ZONE_PASSWORD = 'zf885lt195ss';

// let page;
//
(async ()=>{
  const puppeteerOptions = {
    headless: false,
    devtools: false,
    // ignoreHTTPSErrors: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-features=site-per-process'
      // '--proxy-server=zproxy.lum-superproxy.io:22225',
      // `--disable-extensions-except=${pathToExtension}`,
      // `--load-extension=${pathToExtension}`
    ]
  }

  if(workerData.width){
    puppeteerOptions.args.push(`--window-size=${workerData.width},${workerData.height}`);
  }

  const browser = await puppeteer.launch(puppeteerOptions);
  var page = (await browser.pages())[0];
  if(workerData.width){
    page.setViewport({width: workerData.width, height: workerData.height});
  }
  // const page = await browser.newPage();
  // const page = await browser.pages(0);

  parentPort.on('message', onMessage);
  // parentPort.once('message', (message) => {
  //   console.error('send', page);
  //   parentPort.postMessage(page);
  // });


  async function onMessage(message){
    let {com, data, key} = message;
    let resultData;
    switch(com){
      case "goto":
        await page.goto(data);
      break;

      case "test":

        await page.goto(data.url);
        // await page.waitForSelector("#usernameInput", {visible:true});
        // await page.type("#usernameInput", "tj"+Math.round(Math.random()*1000));
        // await page.tap("#btn_play");
        //
        await page.waitForSelector("#pinNumber", {visible:true});
        await page.type("#pinNumber", data.roomNum);
        await page.type("#sender", "tj"+data.i);
        await page.tap("#openpincheck");
      break;
    }

    if(key){
      parentPort.postMessage({data:resultData, key});
    }
  }
})()

// if(!page){
//   page = await browser.newPage();
// }
// const page = await browser.newPage();

////////////////////////////////////////////////////////////
////////////////// luminati proxy
////////////////////////////////////////////////////////////
// 프록시 사용법
// https://luminati.io/integration/puppeteer?hl=ko
//
// await page.authenticate({
//     username: PROXY_ZONE_NAME,
//     password: PROXY_ZONE_PASSWORD
// });



// const handle = await page.evaluateHandle(() => ({window, document}));
// const properties = await handle.getProperties();
// const windowHandle = properties.get('window');
// const documentHandle = properties.get('document');
// await handle.dispose();



////////////////////////////////////////////////////////////
////////////// chrome extension background page
////////////////////////////////////////////////////////////
// const targets = await browser.targets();
// const backgroundPageTarget = targets.find(target => target.type() === 'background_page');
// const backgroundPage = await backgroundPageTarget.page();


////////////////////////////////////////////////////////////
/////////////// interceptedRequest /////////////////////////
////////////////////////////////////////////////////////////
// await page.setRequestInterception(true);
// page.on('request', interceptedRequest => {
//   if (interceptedRequest.url().endsWith('.png') || interceptedRequest.url().endsWith('.jpg'))
//     interceptedRequest.abort();
//   else
//     interceptedRequest.continue();
// });

// page.on('console', msg => console.log(msg.text()));
//
//
// await page.goto(url);
// await page.goto('http://lumtest.com/myip.json');

/////////////////////////////////////////////////////////////
//////////////// handling
/////////////////////////////////////////////////////////////
// const resultHandle = await page.evaluateHandle(() => document.body.innerHTML);
// console.log(await resultHandle.jsonValue());
// await resultHandle.dispose();

///////////////////////////////////////////////////////////////
///////////////// element click
///////////////////////////////////////////////////////////////
// // const button = await page.evaluateHandle(() => document.querySelector('a.gb_g[data-pid="23"]'));
// const button = await page.$('a.gb_g[data-pid="23"]');
// console.error("find button");
// // button is an ElementHandle, so you can call methods such as click:
// await button.click();
// await page.waitForNavigation();
// console.error("click complete");

// await page.$$()
// //await frame.type('#mytextarea', 'World', {delay: 100});
// console.error()
///////////////////////////////////////////////////////////////
// await page.type('#realbox', 'browserless', {delay: 100});
// console.log(await page.url());

//////////////////////////////////////////////////////////////
// await page.exposeFunction('test', text =>{
//   console.log(text);
// });
// await page.evaluate(async () => {
//   // use window.md5 to compute hashes
//   const myString = 'PUPPETEER';
//   window.test(myString);
// });


///////////////////////////////////////////////////////////
// await page.emulateVisionDeficiency('achromatopsia');
// await page.screenshot({ path: 'achromatopsia.png' });
//
// await page.emulateVisionDeficiency('deuteranopia');
// await page.screenshot({ path: 'deuteranopia.png' });
//
// await page.emulateVisionDeficiency('blurredVision');
// await page.screenshot({ path: 'blurred-vision.png' });

// await page.screenshot({ path: `screenshot_${name}.png` });
// await pause();
//////////////
// await page.emulateMediaType('screen');
// await page.pdf({path: 'page.pdf'});
// pages.push(page);
// await pause();
// await page.close();
