# Telegram Notification Bot in Nuxt

This guide explains how to set up a notification bot within a Nuxt application, where a user action (like clicking a button) triggers a Telegram message.

## 1. Architecture Overview

The architecture is designed to be simple and secure. The frontend (the user's browser) never directly interacts with the Telegram API or handles sensitive credentials. Instead, it makes a request to a dedicated backend API route within our Nuxt app, which then securely communicates with Telegram.

- **Frontend (`app/pages/index.vue`)**: A Vue component with a button. When clicked, it sends the content of a textarea to our backend API.
- **Backend API (`server/api/sendMessage.post.js`)**: A serverless function that runs on the server. It receives the message from the frontend.
- **Configuration (`nuxt.config.ts` & `.env`)**: Securely stores and provides the Bot Token and Chat ID to the backend API route.
- **Telegram API**: The external service that our backend communicates with to send the message.

## 2. File Breakdown

Here are the key files involved in this implementation:

-   **`.env`**:
    This file stores your secret credentials. You should create it by copying `.env.example`. You'll need the credentials from the `telegram_setup.md` guide.
    ```
    TELEGRAM_BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN_HERE
    TELEGRAM_CHAT_ID=YOUR_TELEGRAM_CHAT_ID_HERE
    ```

-   **`nuxt.config.ts`**:
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

-   **`server/api/sendMessage.post.js`**:
    This is the server-side endpoint. It's a POST route that reads the message from the request body. It then uses the `useRuntimeConfig()` composable to access the bot token and chat ID. Finally, it constructs the URL and uses `$fetch` to send the request to the Telegram API.
    ```javascript
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

-   **`app/pages/index.vue`**:
    This is the Vue component for the user interface. It contains a `<textarea>` for the message and a `<button>`. The `sendMessage` method is triggered on button click. It uses Nuxt's `$fetch` to make a POST request to our own `/api/sendMessage` endpoint, sending the message content in the body.
    ```vue
    <script setup>
    import { ref } from "vue";
    
    const message = ref("Hello from Nuxt!");
    
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

## 3. Next Steps

To run this project:
1.  Complete the steps in `telegram_setup.md` to get your credentials.
2.  Create a `.env` file and add your token and chat ID.
3.  Run `npm install` to install dependencies.
4.  Run `npm run dev` to start the application and test the notification functionality.
