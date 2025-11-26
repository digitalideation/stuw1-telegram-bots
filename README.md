# Building Telegram Bots with Nuxt 4

This project is a hands-on guide to creating Telegram bots using the Nuxt 4 framework. It demonstrates how to set up a bot, send notifications from a web interface, and build an interactive bot that responds to user commands using webhooks.

It was built for the course Studio Web and Mobile I at HSLU Digital Ideation in Autumn 2025 by Nick Schneeberger.

## Lessons

This repository is structured as a series of lessons. Please follow them in order to build your understanding from the ground up.

### [Part 1: Telegram Bot Setup](./telegram_setup.md)

**Goal:** Get your bot credentials.

Before writing any code, you need to register your bot with Telegram and get the necessary credentials. This guide will walk you through:

- Using the `BotFather` to create a new bot.
- Obtaining your unique **Bot Token**.
- Finding your personal **Chat ID** to receive messages.

➡️ **[Start with the setup guide](./telegram_setup.md)**

---

### [Part 2: Simple Notification Bot](./telegram_notification.md)

**Goal:** Send a message from a Nuxt app to Telegram.

In this part, you will build your first simple bot. The goal is to create a web page with a button that sends a predefined message to your Telegram chat. You will learn about:

- The basic architecture for secure communication with the Telegram API.
- Creating a frontend in Nuxt to trigger the bot.
- Building a server-side API endpoint in Nuxt to handle the logic and protect your credentials.

➡️ **[Continue with the notification bot guide](./telegram_notification.md)**

---

### [Part 3: Interactive Weather Bot with Webhooks](./telegram_webhook.md)

**Goal:** Create a bot that responds to user commands.

This final lesson introduces a more advanced and powerful concept: webhooks. You will build a bot that a user can interact with. For example, typing `/weather Zurich` will make the bot reply with the current weather in Zurich. You will learn:

- What webhooks are and why they are better than polling for interactive bots.
- How to use `ngrok` to expose your local development server to the internet so Telegram can reach it.
- How to parse user commands, fetch data from an external API, and send a dynamic reply.

➡️ **[Finish with the interactive webhook bot guide](./telegram_webhook.md)**

## 🛠️ Project Setup

To run this project on your local machine, first make sure you have cloned it.

### 1. Install Dependencies

Navigate into the project directory and install the required dependencies.

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root of the project by copying the example file:

```bash
cp env.example .env
```

Now, open the `.env` file and fill in the credentials you obtained in **[Part 1](./telegram_setup.md)**:

```
TELEGRAM_BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN_HERE
TELEGRAM_CHAT_ID=YOUR_TELEGRAM_CHAT_ID_HERE
```

### 3. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

---

**Happy Coding! 🚀**
