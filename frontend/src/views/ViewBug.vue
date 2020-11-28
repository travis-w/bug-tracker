<template>
  <div v-if="bug">
    <h1 class="page-title">{{ bug.name }}</h1>
    <video
      v-if="video"
      class="m-auto max-w-4xl"
      :src="video"
      controls
    />

    <div class="tab">
      <div class="tab__buttons">

      </div>
      <div class="tab__content">
        <div v-if="activeTab === 0">
          <TestRun
            v-for="testResult in bug.testResults"
            :key="testResult._id"
            :testObj="testResult"
          />
        </div>
        <div v-else-if="activeTab === 1">
          <Editor class="h-52" v-model="bug.test" :read-only="true" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ky from "ky";
import { ref } from "vue";
import { useRoute } from "vue-router";

import Editor from "@/components/Editor";
import TestRun from "@/components/TestRun";

const BASE_URL = process.env.VUE_APP_API_BASE;

export default {
  components: { Editor, TestRun },
  setup() {
    const route = useRoute();
    const bug = ref(null);
    const video = ref(null);
    const activeTab = ref(0);

    // TODO: Look into asyc setup/vue suspense
    ky.get(`${BASE_URL}/bugs/${route.params.bugId}`)
      .then(data => data.json())
      .then(res => {
        bug.value = { ...res };
        video.value = `http://localhost:8081/videos/${bug.value._id}/${bug.value.testResults?.[0]._id}/run.mp4`;
      });

    return {
      bug,
      video,
      activeTab
    };
  }
};
</script>
