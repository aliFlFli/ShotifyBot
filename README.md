# ShotifyBot ShotifyBot is a Telegram bot built with Node.js that captures screenshots from URLs and converts them into images or PDFs, powered by ApiFlash. It supports multiple languages and offers customizable settings for users. ## Features - **Screenshot Formats**: Capture screenshots in two modes: Standard (viewport) or Full-Page (entire webpage). - **Output Options**: Get screenshots as images (PNG or JPEG) or PDFs. - **Multi-Language Support**: Available in Persian (فارسی), English, and Arabic (العربية). Switch languages using the bot's buttons. - **Customizable Settings**: Adjust format (PNG/JPEG), enable/disable full-page mode, toggle between image and PDF output, and change language. - **Rate Limiting**: Daily limit of 100 requests per user to prevent abuse. - **API Management**: Uses 10 ApiFlash keys with a monthly limit of 100 requests per key, automatically switching to the least-used API. - **Persistent Storage**: User settings and request counts are stored in Redis for scalability. - **Admin Panel**: Admins can view user stats and total requests with the `/admin` command. - **Glitch Hosting Support**: Includes a self-ping mechanism to keep the bot alive on Glitch, with error notifications to the admin. ## Installation ### Prerequisites - Node.js (version 12 or higher) - A Telegram account and bot token (get it from @BotFather) - ApiFlash API keys (10 keys, each with a 100-request monthly limit) - Redis server (local or cloud, e.g., Redis Labs) - (Optional) Glitch account for hosting ### Setup Steps 1. Clone the repository: ``` git clone https://github.com/aliFIFli/ShotifyBot.git ``` 2. Navigate to the project folder: ``` cd ShotifyBot ``` 3. Install dependencies: ``` npm install ``` 4. Create a `.env` file with the following variables: ``` BOT_TOKEN=your_bot_token ADMIN_ID=your_telegram_admin_id API1_KEY=your_apiflash_key_1 API2_KEY=your_apiflash_key_2 API3_KEY=your_apiflash_key_3 API4_KEY=your_apiflash_key_4 API5_KEY=your_apiflash_key_5 API6_KEY=your_apiflash_key_6 API7_KEY=your_apiflash_key_7 API8_KEY=your_apiflash_key_8 API9_KEY=your_apiflash_key_9 API10_KEY=your_apiflash_key_10 REDIS_URL=your_redis_url PORT=3000 ``` 5. Run the bot: ``` node index.js ``` ## Usage 1. Find the bot on Telegram: @ShotifyBot 2. Start the bot with `/start` to see the welcome message and settings buttons. 3. Send a URL (e.g., https://example.com) to capture a screenshot. 4. Use the inline buttons to customize settings: - **Format**: Choose between PNG and JPEG. - **Full-Page**: Toggle full-page screenshot mode (on/off). - **Mode**: Switch between image or PDF output. - **Language**: Cycle between Persian, English, and Arabic. ## Configuration - **Timeout**: Set to 45 seconds to handle heavy websites. Adjust in the code (`index.js`) if needed. - **API Limits**: Each ApiFlash key has a 100-request monthly limit. The bot automatically switches to the least-used API. - **Redis**: Stores user settings (format, mode, language) and request counts for rate limiting. ## Dependencies - [Telegraf](https://telegraf.js.org/) - Telegram bot framework - [axios](https://axios-http.com/) - For HTTP requests to ApiFlash - [pdf-lib](https://pdf-lib.js.org/) - For generating PDFs from screenshots - [ioredis](https://github.com/luin/ioredis) - Redis client for Node.js - [dotenv](https://www.npmjs.com/package/dotenv) - For managing environment variables - [express](https://expressjs.com/) - For self-ping server on Glitch ## Hosting on Glitch The bot includes a self-ping mechanism to keep it alive on Glitch: - An Express server runs on port 3000 and responds to `/ping`. - The bot pings itself every 5 minutes, with a retry after 30 seconds if it fails. - Errors are reported to the admin via Telegram. To host on Glitch: 1. Import the repository to Glitch. 2. Set up the `.env` variables in Glitch's `.env` section. 3. Ensure Node.js version is compatible (e.g., 16.x). 4. Start the project and test the bot on Telegram. ## About the Project ShotifyBot was created by aliFIFli to help Telegram users capture screenshots and PDFs from URLs with ease. This project was developed with love 💖 for learning and helping others. ## License This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
