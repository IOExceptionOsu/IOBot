# IOBot

Discord bot.

## Installation

1. Make sure node/npm is installed. Go to the project directory and `npm install`.
2. Edit your environmental variables:
  - `PASSWORD`: your Discord password.
  - `YOUTUBE_APIKEY`: your YouTube API key. (Follow [this guide](https://developers.google.com/youtube/v3/getting-started) for reference)
3. Make the following changes to `bot.js`:
  - Search for `DiscordClient` and where it says `email` change that to your Discord email.

Then run `node bot` and you should be good to go!
