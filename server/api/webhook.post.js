export default defineEventHandler(async (event) => {
  const { telegramBotToken } = useRuntimeConfig();
  const body = await readBody(event);

  // console.log("body", body);

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
      // console.log("geoResponse", geoResponse);

      if (!geoResponse.results || geoResponse.results.length === 0) {
        await sendMessage(
          telegramBotToken,
          chatId,
          `Could not find the city: ${cityName}`
        );
        return { statusCode: 200, body: "OK" };
      }

      const location = geoResponse.results[0];
      console.log("location", location);
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
