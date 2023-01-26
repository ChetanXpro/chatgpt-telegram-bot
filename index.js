require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const {
  getImage,
  getChat,

  correctEngish,
} = require("./Helper/functions");

const { Telegraf } = require("telegraf");
const { default: axios } = require("axios");
const logger = require("./Helper/logger");
const connectDB = require("./Helper/db");
const OpenAiGroup = require("./Model/Aigroup");

const { limit } = require("@grammyjs/ratelimiter");

const checkAndSave = require("./Helper/saveToDb");

const configuration = new Configuration({
  apiKey: process.env.API,
});

const openai = new OpenAIApi(configuration);
module.exports = openai;

const bot = new Telegraf(process.env.TG_API);

connectDB();

// Bot on start
bot.start(async (ctx) => {
  if (ctx.chat.type === "group") {
    logger.info(`Bot started In: ${ctx.chat.title} `);
  } else if (ctx.chat.type === "private") {
    logger.info(`Bot started By ${ctx.chat.username || ctx.chat.first_name} `);
  }
  await checkAndSave(ctx);

  ctx.reply(
    "Welcome To AI Bot 🧿 \n\nCommands 👾 \n/ask  ask anything from me \n/image to create image from text  \n/en to correct your grammer \n\n\nContract @Chetan_Baliyan if you want to report any BUG or change in features"
  );
});

bot.help((ctx) => {
  ctx.reply(
    "\nCommands 👾 \n\n/ask  ask anything from me \n/image to create image from text  \n/en to correct your grammer \n\n\nContract @Chetan_Baliyan if you want to report any BUG or change in features "
  );
});

bot.use(
  limit({
    timeFrame: 7000,
    limit: 3,

    onLimitExceeded: async (ctx) => {
      logger.info(
        `Limit Exceeded: ${ctx.from.username || ctx.from.first_name}`
      );
      await ctx.reply("Please Avoid sending too many REQUEST");
    },

    keyGenerator: (ctx) => {
      return ctx.from?.id.toString();
    },
  })
);

bot.on("new_chat_members", async (ctx) => {
  console.log(ctx.update.message.chat.id);
  if (ctx.update.message.chat.id.toString() !== "-1001745862327") return;
  console.log(ctx.update.message.new_chat_member);

  const foundUser = await OpenAiGroup.find({
    userId: ctx.update.message.new_chat_member.id,
  });
 

  if (foundUser.length > 0) {
    foundUser[0].member_left = false;
    await foundUser.save();
    return;
  }

  await OpenAiGroup.create({
    userId: ctx.update.message.new_chat_member.id,
    username: ctx.update.message.new_chat_member.username || "",
    name: ctx.update.message.new_chat_member.first_name || "",
    member_left: false,
  });
});

bot.on("left_chat_member", async (ctx) => {
  if (ctx.update.message.chat.id.toString() !== "-1001745862327") return;

  await OpenAiGroup.findOneAndUpdate(
    {
      userId: ctx.update.message.left_chat_participant.id,
    },
    { member_left: true }
  );
});

//Bot on Image command
bot.command("image", async (ctx) => {
  const text = ctx.message.text?.replace("/image", "")?.trim().toLowerCase();
  logger.info(`Image: ${ctx.from.username || ctx.from.first_name}: ${text}`);
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
  await checkAndSave(ctx);
});

//Bot on ask command

bot.command("ask", async (ctx) => {
  const text = ctx.message.text?.replace("/ask", "")?.trim().toLowerCase();

  const foundUser = await OpenAiGroup.findOne({ userId: ctx.from.id });

  logger.info(`Chat: ${ctx.from.username || ctx.from.first_name}: ${text}`);
  if (!foundUser || foundUser.member_left === true) {
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
    ctx.sendChatAction("typing");

    const res = await getChat(text);
    if (res) {
      if (ctx.message.message_id) {
        ctx.telegram.sendMessage(
          ctx.message.chat.id,
          `${res}`,
          {
            reply_to_message_id: ctx.message.message_id,
          }
        );
      } else {
        ctx.sendMessage(`${res}`);
      }
    }
  } else {
    if (ctx.message.message_id) {
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

  await checkAndSave(ctx);
});

// Bot on en command
bot.command("en", async (ctx) => {
  const text = ctx.message.text?.replace("/en", "")?.trim().toLowerCase();
  logger.info(`EN: ${ctx.from.username || ctx.from.first_name}: ${text}`);
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
    ctx.sendChatAction("typing");
    const res = await correctEngish(text);
    if (res) {
      ctx.telegram.sendMessage(ctx.message.chat.id, res, {
        reply_to_message_id: ctx.message.message_id,
      });
    }
  } else {
    ctx.telegram.sendMessage(
      ctx.message.chat.id,
      "Please ask anything after /en",
      {
        reply_to_message_id: ctx.message.message_id,
      }
    );
  }
});

bot.command("yo", async (ctx) => {
  const text = ctx.message.text?.replace("/yo", "")?.trim().toLowerCase();
  logger.info(`Joke: ${ctx.from.username || ctx.from.first_name}: ${text}`);
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

  const ress = await axios.get("https://api.yomomma.info/");

  ctx.sendChatAction("typing");

  if (ress.data?.joke) {
    ctx.telegram.sendMessage(ctx.message.chat.id, ress.data?.joke, {
      reply_to_message_id: ctx.message.message_id,
    });
  }
});

bot.launch();
