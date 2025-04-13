# Screenshot Telegram Bot

A powerful Telegram bot that captures website screenshots using multiple APIs with automatic load balancing, user settings, rate limiting, and PDF export support.

## Features

- **Multi-language support** (English, Persian, Arabic)
- **10 rotating screenshot APIs** with usage tracking and fallback
- **Image or PDF output** (configurable per user)
- **Daily request limit** per user
- **Redis-based storage** for user settings and stats
- **Admin notifications** for errors, API limits, and access panel
- **Self-pinging** to stay alive on platforms like Glitch
- **Express endpoint** (`/ping`) for uptime monitoring

## Technologies Used

- [Node.js](https://nodejs.org/)
- [Telegraf](https://telegraf.js.org/)
- [Redis](https://redis.io/)
- [pdf-lib](https://github.com/Hopding/pdf-lib)
- [axios](https://axios-http.com/)
- [express](https://expressjs.com/)
- [dotenv](https://github.com/motdotla/dotenv)

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/screenshot-telegram-bot.git
   cd screenshot-telegram-bot

2. Install dependencies:

npm install


3. Configure environment variables:

Create a .env file and fill it with your credentials:

BOT_TOKEN=your_telegram_bot_token
ADMIN_ID=your_telegram_user_id
REDIS_URL=redis://localhost:6379

API1_KEY=your_apiflash_key_1
API2_KEY=your_apiflash_key_2
...
API10_KEY=your_apiflash_key_10


4. Start the bot:

node index.js



Usage

1. Start the bot on Telegram: @your_bot_username


2. Send any URL to get a screenshot


3. Use inline buttons to change:

Screenshot format (PNG/JPEG)

Output type (Image/PDF)

Full page capture (on/off)

Language (EN/FA/AR)




Admin Panel

Admins can use the /admin command to view:

Total users

Number of screenshot requests

API usage status


API Load Balancing

The bot automatically picks the API with the least usage this month (up to the monthly limit). If all APIs hit their limits, an admin alert is triggered.

Hosting Tips

Use platforms like Glitch, Railway, Render, or Heroku

Keep the bot alive using the built-in /ping and setInterval pinger

Redis is required — use hosted Redis if not running locally


License

This project is licensed under the MIT License.
