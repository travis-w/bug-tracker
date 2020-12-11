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
import { mapActions } from "vuex";

import Editor from "@/components/Editor";

const BASE_URL = process.env.VUE_APP_API_BASE;

export default {
  components: { Editor },
  data() {
    return {
      name: "",
      description: "",
      test: "",
      loading: false,
      previewLoading: false,
      video: "",
    };
  },
  computed: {
    submitDisabled() {
      return this.name === "" || this.description === "" || this.test === "";
    },
    previewDisabled() {
      return this.test === "";
    },
  },
  methods: {
    ...mapActions(["createNewBug"]),
    async apiCall(preview = false) {
      return;
    },

    async submitBug() {
      this.loading = true;

      const result = await this.createNewBug({
        name: this.name,
        description: this.description,
        test: this.test,
        preview: false,
      });

      // TODO: Delay redirect
      if (result) {
        this.$router.push({ name: "ViewBug", params: { bugId: result.bugId } });
      }

      this.loading = false;
    },

    async previewBug() {
      this.previewLoading = true;

      const result = await this.createNewBug({
        name: this.name,
        description: this.description,
        test: this.test,
        preview: true,
      });

      if (result) {
        this.video = BASE_URL + result.video;
      }

      this.previewLoading = false;
    },
  },
};
</script>
