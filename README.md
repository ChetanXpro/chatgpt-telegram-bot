## TELEGRAM BOT -> [@botOpenAI_Bot](https://t.me/botOpenAI_Bot)

### How to install this bot ?

- If You want to use database to store active users then use Master branch (You have to provide  mongoDb connection url)
- Or if you dont want to use database then checkout to bot-without-monogdb branch (no need to provide monogoDB connection url)


- Clone This repo
- To install all modules `npm install`
- Enter Your API keys in .env files
- To run developer server `npm run dev`

### Env

- `API=<YOUR_OPENAI_API>`
- `TG_API=<YOUR_TELEGRAM_BOT_API>`

- Need only if you want to save data to mongo Database
- `URI=<YOUR_MONOGDB_URI>`

## Commands 

### /ask <YOUR_QUESTION>
- With this command you can ask anything from bot.
- ex-> /ask what is utf-8 encoding


### /image <IMAGE_DESCRIPTION>
 - You can give a description to generate an image
 - ex-> /image A dog on moon.

### /en <YOUR_WRONG_GRAMMAR_ENGLISH>
 - You can send your sentence with wrong grammar bot will fix that.
 - /en i am going in my house roof
 
 

