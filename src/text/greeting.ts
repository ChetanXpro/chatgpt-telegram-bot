import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:greeting_text');

const replyToMessage = (ctx: Context, messageId: number, string: string) =>
  ctx.reply(string, {
    reply_to_message_id: messageId,
  });

const greeting = () => async (ctx: Context) => {
  debug('Triggered "greeting" text command');

  const messageId = ctx.message?.message_id;
  const userName = `${ctx.message?.from.first_name} ${ctx.message?.from.last_name}`;



  if (ctx.chat?.type === "group") {
    // logger.info(`Bot started In: ${ctx.chat.title} `);
  } else if (ctx?.chat?.type === "private") {
    // logger.info(`Bot started By ${ctx.chat.username || ctx.chat.first_name} `);
  }
  // await checkAndSave(ctx);
  if (messageId) {
    await replyToMessage(ctx, messageId, "Welcome To AI Bot 🧿 \n\nCommands 👾 \n/ask  ask anything from me \n/image to create image from text  \n/en to correct your grammer \n\n\nContract @Chetan_Baliyan if you want to report any BUG or change in features");
  }
};

export { greeting };


