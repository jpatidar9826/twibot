require("dotenv").config();
//import twitter-api-v2
const { TwitterApi } = require("twitter-api-v2");

//fill your API credentials
const client = new TwitterApi({
  appKey: process.env.APP_KEY,
  appSecret: process.env.APP_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessSecret: process.env.ACCESS_SECRET,
  bearerToken: process.env.BEARER_TOKEN
})

//provide read write controls
const rwClient = client.readWrite;

//create tweet function which post a text only tweet
const textTweet = async () => {
  try {
    //use .tweet() method and pass the text you want to post
    await rwClient.v2.tweet("This tweet has been created using nodejs");

    console.log("success");
  } catch (error) {
    console.error(e);
  }
};

//create tweet function which post tweet with media and text
const mediaTweet = async () => {
  try {

    //create mediaID 
    const mediaId = await client.v1.uploadMedia(
        //put path of image you wish to post
      "./errorImg.jpeg"
    );
    // use tweet() method and pass object with text in text feild and media items in media feild
    await rwClient.v2.tweet({
      text: "Twitter is a fantastic social network. Look at this:",
      media: { media_ids: [mediaId] },
    });
    console.log("success");
  } catch (e) {
    console.error(e);
  }
};

//call any of methods and you are done 
mediaTweet();
textTweet();

