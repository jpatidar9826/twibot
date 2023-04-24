require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const { Client } = require("twitter-api-sdk");
const rwClient = require("./twitterClient.js");

const client = new Client(process.env.BEARER_TOKEN);

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

const sarcReply = async (id, replyToId) => {
    let message;
  try {
    message = await client.tweets.findTweetsById({ids: [id]});
    console.log(message);
  } catch (error) {
    console.log(error);
  }
   
   let replyToText = "sarcastic reply only - " + message.data[0].text;

    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: replyToText,
            temperature: 0.5,
            max_tokens: 60,
            top_p: 0.3,
            frequency_penalty: 0.5,
            presence_penalty: 0,
          });
          await rwClient.v1.reply(response.data.choices[0].text,replyToId);
          console.log(response.data.choices[0].text);
    } catch (error) {
        console.log(error);
        await rwClient.v1.reply("Unable to fetch your request, ask better next time",replyToId);
    }
}

//reply("sarcastic reply only - google is better than you" ,1);
module.exports = sarcReply;