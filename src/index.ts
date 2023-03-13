import { Telegraf } from 'telegraf';

import { about, chat, genImage, speech } from './commands';
import { greeting } from './text';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { development, production } from './core';

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';

const bot = new Telegraf(BOT_TOKEN);

bot.command('about', about());

bot.command('ask', chat())

// bot.on('message', greeting());

bot.command('speech', speech())
bot.command('image', genImage())


bot.start(greeting());


//prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};
//dev mode
ENVIRONMENT !== 'production' && development(bot);
