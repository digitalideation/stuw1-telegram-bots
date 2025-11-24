# Telegram Bot Setup Guide

This guide explains how to set up a Telegram bot to get the necessary credentials for API integration.

## 1. Setup

This section covers the initial setup of your Telegram account and bot.

### 1.1 Create a Telegram Account

If you don't have one already, download the Telegram app on your phone or desktop and create an account.

### 1.2 Interact with BotFather

The "BotFather" is the one bot to rule them all. You use it to create and manage other bots.

- Open Telegram and search for the user `@BotFather`. It has a verified blue checkmark next to its name.
- Start a chat with BotFather by clicking "Start" or sending `/start`.

### 1.3 Create a New Bot

- Send the `/newbot` command to BotFather.
- It will ask you for a name for your bot. Choose any name, for example, "nickschnee".
- Next, it will ask you for a username for the bot. This must be unique and end in "bot", for example, `nickschnee_bot`.

### 1.4 Get the Bot Token

- If the username is valid, BotFather will send you a message containing your **Bot Token**.
- The token will look something like this: `1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZ-123456789`.
- **Important:** Treat this token like a password and do not share it with anyone.
- Copy this token. You will need it for the `.env` file in your Nuxt application.

### 1.5 Get Your Chat ID

For the bot to send you messages, it needs to know your personal Chat ID. This is necessary for direct notifications, like in the button-click example.

1.  Find your newly created bot in Telegram (search for its username) and send it any message to initialize a chat.
2.  Open your web browser and navigate to the following URL. Replace `<YOUR_BOT_TOKEN>` with the token you received from BotFather:
    `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
3.  You will see a JSON response. Look for the `result` array. Inside, you'll find an object with a `message` property, which in turn contains a `chat` object with an `id`. This is your Chat ID.
    ```json
    {
      "ok": true,
      "result": [
        {
          "update_id": 123456789,
          "message": {
            "message_id": 1,
            "from": {
              "id": 987654321,
              "is_bot": false,
              "first_name": "Your",
              "last_name": "Name",
              "username": "your_username"
            },
            "chat": {
              "id": 123456789, // <-- THIS IS YOUR CHAT ID
              "first_name": "Your",
              "last_name": "Name",
              "username": "your_username",
              "type": "private"
            },
            "date": 1678886400,
            "text": "Hello"
          }
        }
      ]
    }
    ```
4.  Copy your Chat ID. You will also need this for the `.env` file for the notification bot.
