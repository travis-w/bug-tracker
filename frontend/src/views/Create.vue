<template>
  <div>
    <label>Bug Name</label>
    <input type="text" v-model="name" />
    <label>Bug Description</label>
    <textarea v-model="description" />
    <label>Test</label>
    <div class="border rounded-sm shadow-sm">
      <Editor class="h-52" v-model="test" />
    </div>
    <button
      type="button"
      class="bg-blue-600 p-2 rounded-md text-white mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="submitDisabled"
      @click="submitForm"
    >
      <div class="loader" v-if="loading" />
      <span v-else>Submit</span>
    </button>
    <video v-if="video" :src="video" autoplay controls></video>
  </div>
</template>

<script lang="ts">
import { ref, computed } from "vue";
import ky from "ky";

import Editor from "@/components/Editor";

const BASE_URL = process.env.VUE_APP_API_BASE;

export default {
  components: { Editor },
  setup() {
    const name = ref("");
    const description = ref("");
    const test = ref("");
    const loading = ref(false);
    const video = ref("");

    const submitDisabled = computed(
      () => name.value === "" || description.value === "" || test.value === ""
    );

    const submitForm = () => {
      loading.value = true;
      ky.post(`${BASE_URL}/bugs`, {
        json: {
          name: name.value,
          description: description.value,
          test: test.value
        },
        timeout: 60000
      })
        .then(data => {
          return data.json();
        })
        .then(res => {
          video.value = BASE_URL + res.video;
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => {
          loading.value = false;
        });
    };

    return {
      name,
      description,
      test,
      video,
      loading,
      submitDisabled,
      submitForm
    };
  }
};
</script>
