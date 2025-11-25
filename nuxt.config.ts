import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["./app/assets/css/main.css"],
  vite: {
    server: {
      allowedHosts: ["unvigorous-christa-epigrammatic.ngrok-free.dev"],
      hmr: {
        protocol: "wss",
        host: "localhost",
      },
      // HMR in Gitpod
      // hmr: {
      //   protocol: "wss",
      //   clientPort: 443,
      //   host: `4000-${process.env.GITPOD_WORKSPACE_ID}.${process.env.GITPOD_WORKSPACE_CLUSTER_HOST}`,
      // },
    },
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
    telegramChatId: process.env.TELEGRAM_CHAT_ID,
  },
});
