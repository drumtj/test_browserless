const puppeteer = require('puppeteer');
const { Cluster } = require('puppeteer-cluster');
// https://github.com/puppeteer/puppeteer/blob/main/docs/api.md

function pause(){
  return new Promise((r)=>{});
}

async function task({page, data:{name,url}}){
  console.log(name, url);
  // const page = await browser.newPage();

  ////////////////////////////////////////////////////////////
  ////////////////// luminati proxy
  ////////////////////////////////////////////////////////////
  // 프록시 사용법
  // https://luminati.io/integration/puppeteer?hl=ko
  //
  // await page.authenticate({
  //     // username: 'lum-customer-USERNAME-zone-YOURZONE',
  //     username: 'lum-customer-hl_939c0d45-zone-static-country-ar',
  //     password: 'zf885lt195ss'
  // });


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
  await page.goto(url);
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

  await page.screenshot({ path: `screenshot_${name}.png` });
  await pause();
  //////////////
  // await page.emulateMediaType('screen');
  // await page.pdf({path: 'page.pdf'});

  // await page.close();
}

(async () => {
  const puppeteerOptions = {
    headless: false,
    devtools: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-features=site-per-process',
      // '--proxy-server=zproxy.lum-superproxy.io:22225',
      // `--disable-extensions-except=${pathToExtension}`,
      // `--load-extension=${pathToExtension}`
    ]
  }
  const testList = [
    'https://ip.pe.kr/',
    'https://www.google.com'
  ]
  let url = 'https://ip.pe.kr/';
  const count = testList.length;
  
  // const count = 3;
  const launchOption = {
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: count,
    puppeteerOptions,
    // perBrowserOptions[]
  }

  // https://github.com/thomasdondorf/puppeteer-cluster
  const cluster = await Cluster.launch(launchOption);
  await cluster.task(task);

  cluster.on('taskerror', (err, data, willRetry) => {
      if (willRetry) {
        console.warn(`Encountered an error while crawling ${data}. ${err.message}\nThis job will be retried`);
      } else {
        console.error(`Failed to crawl ${data}: ${err.message}`);
      }
  });

  for(let i=0; i<count; i++){
    cluster.queue({name: i, url:testList[i]});
    // cluster.queue(url);
  }
  // cluster.queue('https://www.google.com');
  // many more pages

  await cluster.idle();
  await cluster.close();

  // const pathToExtension = require('path').join(__dirname, 'my-extension');
  // const browser = await puppeteer.launch(puppeteerOptions);
  //
})();
