import { Context } from 'telegraf';
import createDebug from 'debug';
import { OpenAiGroup } from '../Model/Aigroup'

import { author, name, version } from '../../package.json';
import { getChat, getImage, speak } from '../helper/functions';

const debug = createDebug('bot:about_command');

const about = () => async (ctx: Context) => {
  const message = `*${name} ${version}*\n${author}`;
  debug(`Triggered "about" command with message \n${message}`);
  await ctx.replyWithMarkdownV2('i am chetan', { parse_mode: 'Markdown' });
};

const chat = () => async (ctx: any) => {
  const text = ctx?.message?.text.replace("/ask", "")?.trim().toLowerCase();
  console.log(text)

  const foundUser = await OpenAiGroup.findOne({ userId: ctx?.from?.id });

  // logger.info(`Chat: ${ctx.from.username || ctx.from.first_name}: ${text}`);
  if (!foundUser || foundUser.member_left === true) {
    if (ctx.message?.message_id) {
      ctx.telegram.sendMessage(
        ctx.message.chat.id,
        `Please join @OpenAl_Group before using this bot`,
        {
          reply_to_message_id: ctx.message.message_id,
        }
      );
    } else {
      ctx.sendMessage(`Please join @OpenAl_Group before using this bot`);
    }

    return;
  }

  if (text) {
    ctx.sendChatAction("typing");

    const res = await getChat(text);
    if (res) {
      if (ctx?.message?.message_id) {
        ctx.telegram.sendMessage(ctx.message.chat.id, `${res}`, {
          reply_to_message_id: ctx.message.message_id,
        });
      } else {
        ctx.sendMessage(`${res}`);
      }
    }
  } else {
    if (ctx?.message?.message_id) {
      ctx.telegram.sendMessage(
        ctx.message.chat.id,
        "Please ask anything after /ask",
        {
          reply_to_message_id: ctx.message.message_id,
        }
      );
    } else {
      ctx.sendMessage("Please ask anything after /ask");
    }
  }

  // await checkAndSave(ctx);
};


const speech = () => async (ctx: any) => {
  try {
    const text = ctx.message.text?.replace("/speech", "")?.trim().toLowerCase();
    // logger.info(`Speech: ${ctx.from.username || ctx.from.first_name}: ${text}`);
    console.log(text)

    if(!text) return ctx.reply('Give text for this command')

    // if (ctx.update.message.chat.id.toString() === "-1001745862327") {

      ctx.sendChatAction('upload_voice')
    
      const result = await speak(text, ctx)
    // } else {


      // ctx.sendMessage(`You can only use this text to speech feature in @OpenAl_Group `);



    // }
  } catch (error) {
    // logger.error('Error in Speech')
  }


};



const genImage = () => async (ctx: any) =>{
  const text = ctx.message.text?.replace("/image", "")?.trim().toLowerCase();
  // logger.info(`Image: ${ctx.from.username || ctx.from.first_name}: ${text}`);
  const foundUser = await OpenAiGroup.findOne({ userId: ctx.from.id });

  if (!foundUser) {
    if (ctx.message.message_id) {
      ctx.telegram.sendMessage(
        ctx.message.chat.id,
        `Please join @OpenAl_Group before using this bot`,
        {
          reply_to_message_id: ctx.message.message_id,
        }
      );
    } else {
      ctx.sendMessage(`Please join @OpenAl_Group before using this bot`);
    }

    return;
  }
  if (text) {
    const res = await getImage(text);

    if (res) {
      ctx.sendChatAction("upload_photo");
      if (ctx.message.message_id) {
        ctx.telegram.sendPhoto(ctx.message.chat.id, res, {
          reply_to_message_id: ctx.message.message_id,
        });
      } else {
        ctx.sendPhoto(res);
      }
    } else {
      if (ctx.message.message_id) {
        ctx.telegram.sendMessage(
          ctx.message.chat.id,
          "I can't generate image for this text\n\nPlease use this bot for Educational Purposes , else you will be blocked by bot.",
          {
            reply_to_message_id: ctx.message.message_id,
          }
        );
      } else {
        ctx.sendMessage(
          "I can't generate image for this text\n\nPlease use this bot for Educational Purposes , else you will be blocked by bot."
        );
      }
    }
  } else {
    ctx.telegram.sendMessage(
      ctx.message.chat.id,
      "You have to give some description after /image",
      {
        reply_to_message_id: ctx.message.message_id,
      }
    );
  }
  // await checkAndSave(ctx);
}

export { about ,chat,speech,genImage};
