# ShotifyBot ShotifyBot is a Telegram bot built with Node.js and ApiFlash that takes screenshots of the links you send.
## Features - Takes high-quality screenshots from links - Supports language selection (Persian and English - Arabic) - Adjustable timeout (currently set to 45 seconds) - Uses ApiFlash for fast processing 
## Installation 
### Prerequisites - Node.js (version 12 or higher) - A Telegram account and bot token (from @BotFather) - An ApiFlash key (for taking screenshots)
### Setup Steps 1. Clone the repository: ``` git clone https://github.com/aliFIFli/ShotifyBot.git ``` 2. Navigate to the project folder: ``` cd ShotifyBot ``` 3. Install dependencies: ``` npm install ``` 4. Create a `.env` file and set the variables: ``` BOT_TOKEN=your_bot_token APIFLASH_KEY=your_apiflash_key ``` 5. Run the bot: ``` node index.js ```
## Usage 1. Find the bot on Telegram: @ShotifyBot 2. Send a link (e.g., https://example.com) 3. The bot will send you a screenshot of the page!
## Configuration - **Timeout**: Currently set to 45 seconds to support heavy websites. You can change it in the code (file `index.js`). - **Language**: Supports Persian and English. You can change the language using the bot's buttons.
## Dependencies - [Telegraf](https://telegraf.js.org/) - For Telegram integration - [axios](https://axios-http.com/) - For HTTP requests - [dotenv](https://www.npmjs.com/package/dotenv) - For managing environment variables
## About the Project ShotifyBot was created by aliFIFli to help Telegram users easily take screenshots of web pages. This project was developed with love 💖 for learning and helping others.
## License This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
