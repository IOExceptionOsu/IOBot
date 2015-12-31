# IOBot

Discord bot.

### IMPORTANT NOTICE: IOBot will be rewritten in the near future to make it easier to install and hopefully more modular.

## Installation

1. Make sure node/npm is installed. Go to the project directory and `npm install`.
2. Edit your environmental variables:
  - `PASSWORD`: your Discord password.
  - `YOUTUBE_APIKEY`: your YouTube API key. (Follow [this guide](https://developers.google.com/youtube/v3/getting-started) for reference)
  - `CLEVERBOT_APIKEY` and `CLEVERBOT_APIUSER`: your Cleverbot [credentials](https://cleverbot.io/keys).
3. Make the following changes to `bot.js`:
  - Search for `DiscordClient` and where it says `email` change that to your Discord email.
4. If you'd like to use Cleverbot, make sure you set `cleverbot_on = true` at the beginning and set the credentials. Otherwise, set `cleverbot_on = false`.

Then run `node bot` and you should be good to go!