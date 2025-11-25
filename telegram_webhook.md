# Telegram Webhooks Guide

This guide explains how to work with Telegram Webhooks to create an interactive bot that responds to user commands.

## 1. What is a Webhook?

A webhook is a mechanism for a server-side application to provide other applications with real-time information. It's sometimes called a "reverse API" or a "push API".

In the context of Telegram bots, you have two ways of getting updates (like messages from users):

1.  **Polling (`getUpdates`)**: Your server periodically asks Telegram, "Hey, are there any new messages for me?". This is what we simulate when we manually check the `getUpdates` URL in the browser. It can be inefficient as you might make many requests with no new messages.
2.  **Webhook**: You provide Telegram with a public URL (an endpoint in our Nuxt app). Whenever a new message is sent to your bot, Telegram **immediately sends a POST request** (a "push") with the message data to your URL.

For an interactive bot that needs to respond quickly to commands, a webhook is the preferred method.

## 2. Using Webhooks with a Localhost Server

A major challenge during development is that your local server (e.g., `http://localhost:3000`) is not accessible from the public internet. Telegram's servers cannot send a request to your `localhost`.

To solve this, we can use a **tunneling service**. This service creates a secure tunnel from a public URL to your local machine. A very popular tool for this is **ngrok**.

### Setting up Ngrok

1.  **Download and Install Ngrok**: Go to the [ngrok website](https://ngrok.com/download), download it for your operating system, and unzip it.
2.  **Connect Your Account**: Follow their instructions to connect your account with your auth token. This is usually a one-time setup.
3.  **Start your Nuxt App**: Run your Nuxt development server as usual: `npm run dev`. It will likely be running on `http://localhost:3000`.
4.  **Start Ngrok**: In a **new** terminal window, run the following command to start a tunnel to your Nuxt server:
    ```bash
    ngrok http 3000
    ```
5.  **Get Your Public URL**: Ngrok will display a screen with information about the tunnel. Look for the `Forwarding` line with an `https` address, something like `https://<random-string>.ngrok-free.app`. This is now your public URL that forwards all traffic to your local Nuxt app. Copy this URL.

### Setting the Webhook with Telegram

Now you need to tell Telegram to send all updates to your new public URL.

- Take your ngrok URL and append the path to the API endpoint we are about to create, for example: `/api/webhook`. Your final webhook URL will be something like: `https://<random-string>.ngrok-free.app/api/webhook`.
- Open your browser or a terminal and make a request to the following URL, replacing the tokens with your actual bot token and your public webhook URL:

  `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=<YOUR_PUBLIC_WEBHOOK_URL>`

- If it's successful, you will see a JSON response: `{"ok":true,"result":true,"description":"Webhook was set"}`.

Now, any message sent to your bot will be forwarded by Telegram to your ngrok URL, which in turn sends it to your local Nuxt app's `/api/webhook` endpoint.

## 3. Building a Weather Bot

Let's build a bot where a user can type `/weather Zurich` and get the current weather in Zurich. We will use the free [Open-Meteo API](https://open-meteo.com/), which does not require an API key.

### The Webhook Handler (`server/api/webhook.post.js`)

This file will be the heart of our interactive bot. It will receive the update from Telegram, parse the command, fetch the weather, and send a reply.

Here is the code for `server/api/webhook.post.js`:

```javascript
import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
  const { telegramBotToken } = useRuntimeConfig();
  const body = await readBody(event);

  // Ignore anything that is not a message
  if (!body || !body.message || !body.message.text) {
    return { statusCode: 200, body: "OK" };
  }

  const messageText = body.message.text;
  const chatId = body.message.chat.id;

  // Check if the message is a weather command
  if (messageText.startsWith("/weather")) {
    const cityName = messageText.split(" ")[1];

    if (!cityName) {
      await sendMessage(
        telegramBotToken,
        chatId,
        "Please provide a city name. Usage: /weather Zurich"
      );
      return { statusCode: 200, body: "OK" };
    }

    try {
      // 1. Geocode the city name to get coordinates
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        cityName
      )}&count=1`;
      const geoResponse = await $fetch(geoUrl);

      if (!geoResponse.results || geoResponse.results.length === 0) {
        await sendMessage(
          telegramBotToken,
          chatId,
          `Could not find the city: ${cityName}`
        );
        return { statusCode: 200, body: "OK" };
      }

      const location = geoResponse.results[0];
      const { latitude, longitude, name } = location;

      // 2. Get the weather for the coordinates
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
      const weatherResponse = await $fetch(weatherUrl);

      const temp = weatherResponse.current_weather.temperature;
      const windspeed = weatherResponse.current_weather.windspeed;
      const replyText = `The current weather in ${name} is ${temp}°C with a wind speed of ${windspeed} km/h.`;

      // 3. Send the weather back to the user
      await sendMessage(telegramBotToken, chatId, replyText);
    } catch (error) {
      console.error("Weather bot error:", error);
      await sendMessage(
        telegramBotToken,
        chatId,
        "Sorry, something went wrong while fetching the weather."
      );
    }
  }

  // Always return a 200 OK to Telegram, otherwise it will keep re-sending the update.
  return { statusCode: 200, body: "OK" };
});

// Helper function to send a message using the Telegram API
async function sendMessage(botToken, chatId, text) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  try {
    await $fetch(url, {
      method: "POST",
      body: {
        chat_id: chatId,
        text: text,
      },
    });
  } catch (error) {
    console.error("Failed to send message:", error);
  }
}
```

### How the Code Works

1.  **Receives Update**: The handler receives the POST request from Telegram and reads the body.
2.  **Parses Command**: It checks if the message text begins with `/weather`. If so, it extracts the city name that follows.
3.  **Geocoding**: It calls the Open-Meteo geocoding API to convert the city name (e.g., "Zurich") into geographic coordinates (latitude and longitude). This is necessary because the weather API requires coordinates.
4.  **Fetches Weather**: Using the coordinates, it calls the Open-Meteo forecast API to get the current weather data.
5.  **Sends Reply**: It formats a user-friendly message with the weather information and uses a helper function (`sendMessage`) to send this message back to the user who requested it. The `chat.id` from the incoming message is used to ensure the reply goes to the correct person or group.
6.  **Responds to Telegram**: It's crucial to always send a `200 OK` response back to Telegram quickly. This acknowledges that you have received the update. If Telegram doesn't get a `200 OK`, it will assume the delivery failed and will try to send the same update again, which can lead to your bot sending duplicate replies.

## 4. Live Webhook URL

The current webhook is set to: `https://unvigorous-christa-epigrammatic.ngrok-free.dev/api/webhook`
