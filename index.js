const rwClient = require("./twitterClient.js");
const CronJob = require("cron").CronJob;

const tweet = async () => {
    try {

      const mediaIds = await Promise.all([rwClient.v1.uploadMedia('./example.png')]);
      await rwClient.v1.reply('reply to previously created tweet.',"1602579498062426112",{ media_ids: mediaIds });

    } catch (e) {
        console.error(e)
    }
}

const job = new CronJob("*/1 * * * *", () => {
    console.log('cron job starting!');
//     tweet()
});
//
console.log("at job");
//job.start();
 tweet();

// const tweets = await client.v2.tweets(['20', '141']);
