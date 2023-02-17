const { Configuration, OpenAIApi } = require("openai");
const logger = require("./logger");
var sdk = require("microsoft-cognitiveservices-speech-sdk");
const { Stream } = require("microsoft-cognitiveservices-speech-sdk/distrib/lib/src/common/Stream");

PassThroughStream = require('stream').PassThrough
const fs = require('fs')

// import { unlink } from 'node:fs/promises';
const { unlink } = require('node:fs/promises')

const configuration = new Configuration({
  apiKey: process.env.API,
});

const openai = new OpenAIApi(configuration);

// Generate image from prompt
const getImage = async (text) => {
  try {
    const response = await openai.createImage({
      prompt: text,
      n: 1,
      size: "512x512",
    });

    return response.data.data[0].url;
  } catch (error) {
    logger.error("Error while generating image");
  }
};
// Generate answer from prompt
const getChat = async (text) => {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: text,
      temperature: 0,
      max_tokens: 500,
    });

    return response.data.choices[0].text;
  } catch (error) {
    console.log(error);
    logger.error("Error while generating Answer");
  }
};

// Convert to standard english
const correctEngish = async (text) => {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Correct this to standard English: /n${text}`,
      temperature: 0,
      max_tokens: 1000,
    });

    return response.data.choices[0].text;
  } catch (error) {
    logger.error("Error while generating English ");
  }
};


const speak = async (text, ctx) => {
  try {
    const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION);
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(`${ctx.chat.username || ctx.chat.first_name}.mp3`);
    speechConfig.speechSynthesisVoiceName = "hi-IN-SwaraNeural";
    speechConfig.speechSynthesisOutputFormat = 5;


    var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig)


    synthesizer.speakTextAsync(
      text,
      async result => {
        synthesizer.close();
        if (result) {




          await fs.createReadStream(`${ctx.chat.username || ctx.chat.first_name}.mp3`)

          fs.stat(`${ctx.chat.username || ctx.chat.first_name}.mp3`, async (err, stats) => {
            if (err) {
              return await ctx.sendMessage('Please enter text in english or hindi')
            } else {
              console.log(stats.size)
              if (stats.size) {
                await ctx.replyWithAudio({ source: `${ctx.chat.username || ctx.chat.first_name}.mp3` })

                // ctx.telegram.sendAudio(ctx.message.chat.id,'')
                await unlink(`${ctx.chat.username || ctx.chat.first_name}.mp3`)
              } else {
                await ctx.sendMessage('Error while generating audio\nOnly use hindi or enlgish language \nPlease contract owner @Chetan_Baliyan')
                await unlink(`${ctx.chat.username || ctx.chat.first_name}.mp3`)
              }


              // return await unlink(`${ctx.chat.username || ctx.chat.first_name}.mp3`)
            }
          })


        }
      },
      error => {
        console.log(error);
        synthesizer.close();
      });




    // synthesizer.close();
  } catch (error) {
    console.log(error)
    synthesizer.close();
  }
}

module.exports = { openai, getImage, getChat, correctEngish, speak };
