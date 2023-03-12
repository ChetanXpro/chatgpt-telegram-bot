import { Context } from 'telegraf';
import createDebug from 'debug';
import { OpenAiGroup } from '../Model/Aigroup'

import { author, name, version } from '../../package.json';
import { getChat } from '../helper/functions';

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






export { about ,chat};
