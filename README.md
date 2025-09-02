# Ticket Bot

> [!NOTE]
> This project **base** can be generated using the [Constant CLI](https://github.com/rinckodev/constatic)
> See the full documentation for this base by accessing: https://constatic-docs.vercel.app/discord

This is the most complete discord bot base you've ever seen! Developed by [@rinckodev](https://github.com/rinckodev), this project uses typescript in an incredible way to provide complete structures and facilitate the development of your discord bot.

> [!WARNING] > [NodeJs](https://nodejs.org/en) version required: 20.12 or higher

## Instructions

### Setup

Create a folder for the bot
Open the terminal in that folder and paste the command below

```bash
git clone https://github.com/FelipeSilva72/discord-ticket.git .
```

Install dependencies

```bash
npm install
```

Rename `.env.example` file to `.env`

Place [your bot token](https://constatic-docs.vercel.app/discord/guides/application) in `.env` file

```
BOT_TOKEN=your_token
```

```
GUILD_ID=your_guild_id
```

Run the bot in development with dev script

```bash
npm run dev
```

Build the project with the build command

```bash
npm run build
```

Run the built project with the start script

```bash
npm run start
```

### Usage

The bot has only one command, which contains some sub commands.

On the server use `/setup`

| command     | Usage          | Description              |
| ----------- | -------------- | ------------------------ |
| ticket      | `/ticket <channel>` | Send of setup ticket |

### Emojis

To generate emojis from the project folder, follow this guide https://constatic-docs.vercel.app/pt/docs/emojis/start
