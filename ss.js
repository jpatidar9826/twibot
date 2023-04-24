const puppeteer = require('puppeteer');
const id = "1606174472247005184";
var link = 'https://twitter.com/TheRealNooshu/status/'.concat(id);
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(link,{ waitUntil: ["load", "domcontentloaded", "networkidle0", "networkidle2"],waitNetworkIdle: true,timeout : 60000 });
  page.setViewport({width: 3600,height: 2400});
  await page.waitForSelector('#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div.css-1dbjc4n.r-14lw9ot.r-jxzhtn.r-1ljd8xs.r-13l2t4g.r-1phboty.r-16y2uox.r-1jgb5lz.r-11wrixw.r-61z16t.r-1ye8kvj.r-13qz1uu.r-184en5c > div > section > div > div > div:nth-child(1) > div > div > article');
  const element = await page.$('#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div.css-1dbjc4n.r-14lw9ot.r-jxzhtn.r-1ljd8xs.r-13l2t4g.r-1phboty.r-16y2uox.r-1jgb5lz.r-11wrixw.r-61z16t.r-1ye8kvj.r-13qz1uu.r-184en5c > div > section > div > div > div:nth-child(1) > div > div > article');
  await element.screenshot({path: 'example.png'});
  await browser.close();
})();

