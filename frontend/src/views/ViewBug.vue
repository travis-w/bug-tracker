<template>
  <div v-if="bug">
    <h1 class="page-title">{{ bug.name }}</h1>
    <video v-if="video" class="m-auto max-w-4xl" :src="video" controls />

    <div class="tab">
      <div class="tab__buttons">
        <button @click="activeTab = 0">Info</button>
        <button @click="activeTab = 1">Test History</button>
        <button @click="activeTab = 2">Test Source</button>
      </div>
      <div class="tab__content">
        <div v-if="activeTab === 0">Info Tab</div>
        <div v-if="activeTab === 1">
          <TestRun
            v-for="testResult in bug.testResults"
            :key="testResult._id"
            :testObj="testResult"
          />
        </div>
        <div v-else-if="activeTab === 2">
          <Editor class="h-52" v-model="bug.test" :read-only="true" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRoute } from "vue-router";

import Editor from "@/components/Editor";
import TestRun from "@/components/TestRun";
import { getBugById } from "@/api/bugs";

const BASE_URL = process.env.VUE_APP_API_BASE;

export default {
  components: { Editor, TestRun },
  setup() {
    const route = useRoute();
    const bug = ref(null);
    const video = ref(null);
    const activeTab = ref(0);

    // TODO: Look into asyc setup/vue suspense
    getBugById(route.params.bugId)
      .then((res) => {
        bug.value = { ...res };
        video.value = `${BASE_URL}/videos/${bug.value._id}/${bug.value.testResults?.[0]._id}/run.mp4`;
      });

    return {
      bug,
      video,
      activeTab,
    };
  },
};
</script>

<style lang="scss">
.tab__buttons {
  @apply mb-2;

  button {
    @apply p-2;
  }

  button + button {
    @apply border-l;
  }
}
</style>
