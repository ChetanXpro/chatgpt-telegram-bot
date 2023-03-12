import { Configuration, OpenAIApi } from "openai";
// const logger = require("./logger");
var sdk = require("microsoft-cognitiveservices-speech-sdk");
// import { Stream } from "microsoft-cognitiveservices-speech-sdk/distrib/lib/src/common/Stream";

// PassThroughStream = require('stream').PassThrough
import fs = require('fs');

// import { unlink } from 'node:fs/promises';
// const { unlink } = require('node:fs/promises')

import { unlink } from 'node:fs/promises'

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API,
});

const openai = new OpenAIApi(configuration);

// Generate image from prompt
const getImage = async (text: any) => {
    try {
        const response = await openai.createImage({
            prompt: text,
            n: 1,
            size: "512x512",
        });

        return response.data.data[0].url;
    } catch (error) {
        console.error("Error while generating image");
    }
};
// Generate answer from prompt
const getChat = async (text: any) => {
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
        console.error("Error while generating Answer");
    }
};

// Convert to standard english
const correctEngish = async (text: any) => {
    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Correct this to standard English: /n${text}`,
            temperature: 0,
            max_tokens: 1000,
        });

        return response.data.choices[0].text;
    } catch (error) {
        console.error("Error while generating English ");
    }
};


const speak = async (text: any, ctx: { chat: { username: any; first_name: any; }; sendMessage: (arg0: string) => any; replyWithAudio: (arg0: { source: string; }) => any; }) => {
    try {
        const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION);
        const audioConfig = sdk.AudioConfig.fromAudioFileOutput(`${ctx.chat.username || ctx.chat.first_name}.mp3`);
        speechConfig.speechSynthesisVoiceName = "hi-IN-SwaraNeural";
        speechConfig.speechSynthesisOutputFormat = 5;


        var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig)


        synthesizer.speakTextAsync(
            text,
            async (result: any) => {
                synthesizer.close();
                if (result) {




                    await fs.createReadStream(`${ctx.chat.username || ctx.chat.first_name}.mp3`)

                    fs.stat(`${ctx.chat.username || ctx.chat.first_name}.mp3`, async (err: any, stats: { size: any; }) => {
                        if (err) {
                            return await ctx.sendMessage('Please enter text in english or hindi')
                        } else {

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
            (error: any) => {
                console.log(error);
                synthesizer.close();
            });




        // synthesizer.close();
    } catch (error) {
        console.log(error)
        synthesizer.close();
    }
}

export { openai, getImage, getChat, correctEngish, speak };
