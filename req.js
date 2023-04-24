require("dotenv").config();
const express = require("express");
const { Client } = require("twitter-api-sdk");
const rwClient = require("./twitterClient.js");
const CronJob = require("cron").CronJob;
const axios = require("axios");
const puppeteer = require("puppeteer");
var fs = require("fs");
const sarcReply = require('./sarcReply.js');
//1615407323295657984 1605229092789682178 1650084228531642368 1615406967438323713
var ScinceID;
const client = new Client(process.env.BEARER_TOKEN);process.env.BEARER_TOKEN

const app = express();

async function main() {
  ScinceID = await fs.readFileSync('./store.txt', 'utf8');
  const response = await client.tweets.usersIdMentions("1332268941159194626", {
    since_id: [ScinceID],
  });

  console.log(response.data);
  if (response.meta.result_count > 0) {
    console.log("yes");
    for (var i = 0; i < response.meta.result_count; i++) {
      //ScinceID = response.data[i].id;
      fs.writeFileSync('./store.txt', response.data[i].id, 'utf8');
      const temp = finder(response.data[i].id);
    }
  } else {
    console.log("no");
  }
}

const finder = async (id) => {
  const finderResponse = await client.tweets
    .findTweetsById({
      ids: [id],
      expansions: ["referenced_tweets.id"],
    })
    .then((res) => {
      if (res.data[0].text.includes('joke')) {
        joke(id);
      } else if (res.data[0].text.includes('reply')) {
          sarcReply(res.data[0].referenced_tweets[0].id, id);
      }else {
        screenshot(res.data[0].referenced_tweets[0].id, id);
      }
    });
  console.log(finderResponse);
};

const joke = async (id) => {
  axios
    .get(
      "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,racist,sexist&type=single"
    )
    .then(async (res) => {
      //tweet(res.data.joke, item.id)
      try {
        await rwClient.v1.reply(res.data.joke,id);
        console.log("joke sent");
      } catch (error) {
        console.log("error at joke: "+ error);
      }
    })
    .catch((err) => console.log(err));
};

const screenshot = async (ssid, id) => {
  var link = "https://twitter.com/AlpheriorKeys/status/".concat(ssid);
  var filepath = id + "example.png";
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(link, {
    waitUntil: ["load", "domcontentloaded", "networkidle0", "networkidle2"],
    waitNetworkIdle: true,
    timeout: 60000,
  });
  page.setViewport({ width: 3600, height: 2400 });
  await page.waitForSelector(
    "#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div.css-1dbjc4n.r-14lw9ot.r-jxzhtn.r-1ljd8xs.r-13l2t4g.r-1phboty.r-16y2uox.r-1jgb5lz.r-11wrixw.r-61z16t.r-1ye8kvj.r-13qz1uu.r-184en5c > div > section > div > div > div:nth-child(1) > div > div > article"
  );
  const element = await page.$(
    "#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div.css-1dbjc4n.r-14lw9ot.r-jxzhtn.r-1ljd8xs.r-13l2t4g.r-1phboty.r-16y2uox.r-1jgb5lz.r-11wrixw.r-61z16t.r-1ye8kvj.r-13qz1uu.r-184en5c > div > section > div > div > div:nth-child(1) > div > div > article"
  );
  await element.screenshot({ path: filepath }); //.then(res => console.log("sstaken")).catch(err => console.log(err));
  await browser.close().then((res) => tweet("xyz", id));
};

const tweet = async (text, repid) => {
  var uppath = "./" + repid + "example.png";

  try {
    const mediaIds = await Promise.all([rwClient.v1.uploadMedia(uppath)]);
    await rwClient.v1.reply("here is your SS", repid, {
      media_ids: mediaIds,
    });
    console.log("ss sent");
    fs.unlinkSync(uppath);
  } catch (e) {

    uppath = "./errorImg2.jpeg";
    const mediaIds = await Promise.all([rwClient.v1.uploadMedia(uppath)]);
    await rwClient.v1.reply("Unable to create SS", repid, {
      media_ids: mediaIds,
    });

    console.error(e);
  }
};

app.post('/some_route',async (req, res) => {
  await main();
  return res.send('ok')
});  

// const job = new CronJob("30 * * * * *", () => {
//   console.log("cron job starting!");
//   //tweet()
//   main();
// });
// //
// console.log("at job");
// job.start();
// //main();

const hostname = "0.0.0.0";
const port = 3000;

app.listen(port, hostname, () => {
  console.log("Server running at http://$(hostname):$(port)/");
});
