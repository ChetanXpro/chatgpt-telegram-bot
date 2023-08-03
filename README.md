# Chatgpt telegram bot
### How to install this bot ?

- If You want to use extra features like speech service and database to store active users then use Master branch (You have to enter mongoDb connection url in .env)
- Or if you dont want to use database then checkout to bot-without-monogdb branch (no need to enter monogoDB connection url in .env)


- Clone This repo
- Create `.env` file in root
- Enter Your API keys in .env files
- To install all modules `npm install`
- To run developer server `npm run dev`

### Env

- `API=<YOUR_OPENAI_API>`
- `TG_API=<YOUR_TELEGRAM_BOT_API>`
- Need only if you want to use Text to Audio feature
- `AZURE_API=<YOUR_AZURE_TEXT_TO_AUDIO_API>`

- Need only if you want to save data to mongo Database
- `URI=<YOUR_MONOGDB_URI>`

## Commands 

### /ask <YOUR_QUESTION>
- With this command you can ask anything from bot.
- ex-> /ask what is utf-8 encoding

### /speech <YOUR_TEXT>
- Bot will generate Audio for your text
- ex-> /speech hi how are you


### /image <IMAGE_DESCRIPTION>
 - You can give a description to generate an image
 - ex-> /image A dog on moon.

### /en <YOUR_WRONG_GRAMMAR_ENGLISH>
 - You can send your sentence with wrong grammar bot will fix that.
 - /en i am going in my house roof
 
 

