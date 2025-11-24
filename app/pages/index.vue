<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">{{ title }}</h1>
    <div class="max-w-md">
      <textarea
        v-model="message"
        class="w-full p-2 border rounded mb-2"
        rows="4"
        placeholder="Deine Nachricht an den Bot..."
      ></textarea>
      <button
        @click="sendMessage"
        :disabled="loading"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        <span v-if="loading">Sende...</span>
        <span v-else>Nachricht senden</span>
      </button>
      <p v-if="response" class="mt-4 p-2 bg-gray-100 rounded">
        Antwort vom Server: {{ response }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const title = "Telegram Bot Test";
const message = ref(
  "Hallo Welt! Dies ist eine Testnachricht von meiner Nuxt-App."
);
const loading = ref(false);
const response = ref(null);

const sendMessage = async () => {
  if (!message.value.trim()) {
    alert("Bitte gib eine Nachricht ein.");
    return;
  }
  loading.value = true;
  response.value = null;
  try {
    const res = await $fetch("/api/sendMessage", {
      method: "POST",
      body: { message: message.value },
    });
    response.value = "Nachricht erfolgreich gesendet!";
    console.log(res);
  } catch (error) {
    console.error("Fehler beim Senden der Nachricht:", error);
    response.value = `Fehler: ${error.statusMessage || error.message}`;
  } finally {
    loading.value = false;
  }
};
</script>
