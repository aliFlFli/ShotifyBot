<p align="center">
  <img src="https://github.com/aliFlFli/ShotifyBot/blob/main/logo.png?raw=true" alt="ShotifyBot Logo" width="200"/>
</p>
# ShotifyBot

ShotifyBot is a Telegram bot built with Node.js that captures screenshots from URLs and converts them into images or PDFs, powered by ApiFlash. It supports multiple languages and offers customizable settings for users.

## Features

- **Screenshot Formats**: Capture screenshots in two modes: Standard (viewport) or Full-Page (entire webpage).
- **Output Options**: Get screenshots as images (PNG or JPEG) or PDFs.
- **Multi-Language Support**: Available in Persian (فارسی), English, and Arabic (العربية). Switch languages using the bot’s inline buttons.
- **Customizable Settings**: Adjust format (PNG/JPEG), enable/disable full-page mode, toggle between image and PDF output, and change language.
- **Rate Limiting**: Daily limit of 100 requests per user to prevent abuse.
- **API Management**: Uses 10 ApiFlash keys with a monthly limit of 100 requests per key, automatically switching to the least-used API.
- **Persistent Storage**: User settings and request counts are stored in Redis for scalability.
- **Admin Panel**: Admins can view user stats and total requests with the `/admin` command.
- **Glitch Hosting Support**: Includes a self-ping mechanism to keep the bot alive on Glitch, with error notifications sent to the admin.

## Technologies Used

- [Node.js](https://nodejs.org/)
- [Telegraf](https://telegraf.js.org/) – Telegram bot framework
- [axios](https://axios-http.com/) – For HTTP requests to ApiFlash
- [pdf-lib](https://pdf-lib.js.org/) – For generating PDFs from screenshots
- [ioredis](https://github.com/luin/ioredis) – Redis client for Node.js
- [dotenv](https://www.npmjs.com/package/dotenv) – For managing environment variables
- [express](https://expressjs.com/) – For the self-ping server on Glitch

## Installation

### Prerequisites

- **Node.js** (version 12 or higher)
- A Telegram account and bot token (obtainable from [@BotFather](https://telegram.me/BotFather))
- 10 ApiFlash API keys (each with a monthly limit of 100 requests)
- A Redis server (local or hosted, e.g., Redis Labs)
- (Optional) A Glitch account for hosting

### Setup Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/aliFIFli/ShotifyBot.git
   cd ShotifyBot

2. Install dependencies:

npm install


3. Configure Environment Variables:

Create a .env file in the project root with the following variables:

BOT_TOKEN=your_bot_token
ADMIN_ID=your_telegram_admin_id
REDIS_URL=your_redis_url
PORT=3000

API1_KEY=your_apiflash_key_1
API2_KEY=your_apiflash_key_2
API3_KEY=your_apiflash_key_3
API4_KEY=your_apiflash_key_4
API5_KEY=your_apiflash_key_5
API6_KEY=your_apiflash_key_6
API7_KEY=your_apiflash_key_7
API8_KEY=your_apiflash_key_8
API9_KEY=your_apiflash_key_9
API10_KEY=your_apiflash_key_10


4. Run the Bot:

node index.js



Usage

1. Find the bot on Telegram: Search for @ShotifyBot (or your bot's username).


2. Start the Bot: Use the /start command to display the welcome message and settings buttons.


3. Send a URL: Simply send a URL (e.g., https://example.com) to capture its screenshot.


4. Customize Settings: Use the inline buttons to:

Choose between PNG and JPEG formats.

Toggle the full-page mode.

Switch between image or PDF output.

Cycle through available languages (Persian, English, Arabic).




Configuration Details

Timeout: The HTTP request timeout is set to 45 seconds to handle heavy websites. You can adjust this value in the code (index.js) if necessary.

API Limits: Each ApiFlash key has a monthly request limit of 100. The bot automatically selects the API key with the least usage.

Redis Storage: User settings (format, output mode, language) and daily request counts are maintained in Redis to support rate limiting and scalability.


Glitch Hosting

For those hosting on Glitch, the bot includes a self-ping mechanism:

An Express server runs on port 3000 and responds to /ping.

The bot pings itself every 5 minutes and retries after 30 seconds if the ping fails.

Errors encountered during the ping are reported to the admin via Telegram.


To host on Glitch:

1. Import this repository into your Glitch project.


2. Set up the .env variables in Glitch's environment settings.


3. Ensure your project uses a compatible Node.js version (e.g., 16.x).


4. Start the project and test the bot on Telegram.



About the Project

ShotifyBot was created by aliFIFli to enable Telegram users to capture screenshots and PDFs from URLs effortlessly. Developed with passion for learning and sharing, this project is designed to be both practical and educational.

License

This project is licensed under the MIT License.
