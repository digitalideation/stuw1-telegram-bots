export default defineEventHandler(async (event) => {
  const { telegramBotToken, telegramChatId } = useRuntimeConfig();
  const body = await readBody(event);

  if (!body.message) {
    throw createError({
      statusCode: 400,
      statusMessage: "No message provided",
    });
  }

  const text = encodeURIComponent(body.message);
  const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage?chat_id=${telegramChatId}&text=${text}`;

  try {
    const response = await $fetch(url);
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error("Error sending Telegram message:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to send message",
    });
  }
});
