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
      @click="submitBug"
    >
      <div class="loader" v-if="loading" />
      <span v-else>Submit</span>
    </button>
    <button
      type="button"
      class="bg-blue-600 p-2 rounded-md text-white mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="previewDisabled"
      @click="previewBug"
    >
      <div class="loader" v-if="previewLoading" />
      <span v-else>Preview</span>
    </button>
    <video v-if="video" :src="video" autoplay controls></video>
  </div>
</template>

<script lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
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
    const previewLoading = ref(false);
    const video = ref("");
    const router = useRouter();

    const submitDisabled = computed(
      () => name.value === "" || description.value === "" || test.value === ""
    );

    const previewDisabled = computed(() => test.value === "");

    const apiCall = async (preview = false) => {
      return await ky.post(`${BASE_URL}/bugs`, {
        json: {
          name: name.value,
          description: description.value,
          test: test.value,
          preview: preview
        },
        timeout: 60000
      }).json();
    }

    const submitBug = async () => {
      loading.value = true;

      try {
        const results = await apiCall();

        // TODO: Delay redirect
        router.push({ name: "ViewBug", params: { bugId: results.bugId }});
      } catch (err) {
        console.log("ERROR HANDLING");
      }
      
      loading.value = false;
    };

    const previewBug = async () => {
      previewLoading.value = true;

      try {
        const results = await apiCall(true);

        video.value = BASE_URL + results.video;
      } catch (err) {
        console.log("ERROR HANDLING");
      }
      
      previewLoading.value = false;
    }

    return {
      name,
      description,
      test,
      video,
      loading,
      submitDisabled,
      submitBug,
      previewLoading,
      previewDisabled,
      previewBug
    };
  }
};
</script>
