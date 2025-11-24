# Telegram Bot Guide

This guide explains how to set up a Telegram bot and integrate it into a Nuxt 4 application to send notifications.

## 1. Setup

This section covers the initial setup of your Telegram account and bot to get the necessary credentials.

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
- Copy this token. You will need it later for the `.env` file in your Nuxt application.

### 1.5 Get Your Chat ID

For the bot to send you messages, it needs to know your personal Chat ID.

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
4.  Copy your Chat ID. You will also need this for the `.env` file.

## 2. Set Up a Notification Bot in Nuxt

This section explains how the Nuxt application is structured to send a message when a user clicks a button.

### 2.1 Architecture Overview

The architecture is designed to be simple and secure. The frontend (the user's browser) never directly interacts with the Telegram API or handles sensitive credentials. Instead, it makes a request to a dedicated backend API route within our Nuxt app, which then securely communicates with Telegram.

- **Frontend (`app/pages/index.vue`)**: A Vue component with a button. When clicked, it sends the content of a textarea to our backend API.
- **Backend API (`server/api/sendMessage.post.ts`)**: A serverless function that runs on the server (or on Vercel's infrastructure). It receives the message from the frontend.
- **Configuration (`nuxt.config.ts` & `.env`)**: Securely stores and provides the Bot Token and Chat ID to the backend API route.
- **Telegram API**: The external service that our backend communicates with to send the message.

### 2.2 File Breakdown

Here are the key files involved in this implementation:

- **`.env`**:
  This file stores your secret credentials. You should create it by copying `.env.example`.

  ```
  TELEGRAM_BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN_HERE
  TELEGRAM_CHAT_ID=YOUR_TELEGRAM_CHAT_ID_HERE
  ```

- **`nuxt.config.ts`**:
  This file configures your Nuxt app. We use the `runtimeConfig` section to expose the environment variables from the `.env` file to our server-side code in a secure way. They will not be exposed to the frontend.

  ```typescript
  export default defineNuxtConfig({
    // ... other config
    runtimeConfig: {
      telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
      telegramChatId: process.env.TELEGRAM_CHAT_ID,
    },
  });
  ```

- **`server/api/sendMessage.post.ts`**:
  This is the server-side endpoint. It's a POST route that reads the message from the request body. It then uses the `useRuntimeConfig()` composable to access the bot token and chat ID. Finally, it constructs the URL and uses `$fetch` to send the request to the Telegram API.

  ```typescript
  export default defineEventHandler(async (event) => {
    const { telegramBotToken, telegramChatId } = useRuntimeConfig();
    const body = await readBody(event);
    const text = encodeURIComponent(body.message);
    const url = `https://api.telegram.org/bot\${telegramBotToken}/sendMessage?chat_id=\${telegramChatId}&text=\${text}`;

    try {
      const response = await $fetch(url);
      return { statusCode: 200, body: JSON.stringify(response) };
    } catch (error) {
      // ... error handling
    }
  });
  ```

- **`app/pages/index.vue`**:
  This is the Vue component for the user interface. It contains a `<textarea>` for the message and a `<button>`. The `sendMessage` method is triggered on button click. It uses Nuxt's `$fetch` to make a POST request to our own `/api/sendMessage` endpoint, sending the message content in the body.
  ```vue
  <script setup>
  // ...
  const sendMessage = async () => {
    try {
      await $fetch("/api/sendMessage", {
        method: "POST",
        body: { message: message.value },
      });
      // ... handle success
    } catch (error) {
      // ... handle error
    }
  };
  </script>
  ```

### 2.3 Next Steps

Now you have all the necessary components:

- Your Bot Token
- Your Chat ID

Add these values to your `.env` file, run `npm install` and then `npm run dev` to start the application and test the notification functionality.
