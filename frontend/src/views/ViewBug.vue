<template>
  <div v-if="bug">
    <h1 class="page-title">{{ bug.name }}</h1>
    <video v-if="video" class="m-auto max-w-4xl" :src="video" controls />

    <div class="tab">
      <div class="tab__buttons">
        <button @click="activeTab = 0">Info</button>
        <button @click="activeTab = 1">Test History</button>
        <button @click="activeTab = 2">Discussion</button>
        <button @click="activeTab = 3">Test Source</button>
        <button @click="activeTab = 4">Other</button>
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
          <ol>
            <li v-for="comment in bug.comments" :key="comment._id">
              {{ comment.comment }}
            </li>
          </ol>
          <textarea v-model="comment" />
          <button
            class="bg-blue-600 p-2 rounded-md text-white mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="sendComment"
          >
            Comment
          </button>
        </div>
        <div v-else-if="activeTab === 3">
          <Editor class="h-52" v-model="bug.test" :read-only="true" />
        </div>
        <div v-else-if="activeTab === 4">
          <!-- Trash tab to throw stuff in now for functionality -->
          <button @click="deleteBug">Delete</button>
          <button @click="retestBug">Retest</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import Editor from "@/components/Editor";
import TestRun from "@/components/TestRun";
import {
  getBugById,
  deleteBugById,
  retestBugById,
  commentBugById,
} from "@/api/bugs";

const BASE_URL = process.env.VUE_APP_API_BASE;

export default {
  components: { Editor, TestRun },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const bug = ref(null);
    const video = ref(null);
    const activeTab = ref(0);
    const comment = ref("");

    // TODO: Look into asyc setup/vue suspense
    getBugById(route.params.bugId).then((res) => {
      bug.value = { ...res };
      video.value = `${BASE_URL}/videos/${bug.value._id}/${bug.value.testResults?.[0]._id}/run.mp4`;
    });

    const deleteBug = async () => {
      await deleteBugById(bug.value._id);

      router.push({ name: "Home" });
    };

    const retestBug = async () => {
      const results = await retestBugById(bug.value._id);

      console.log(results);
    };

    const sendComment = async () => {
      await commentBugById(bug.value._id, comment.value);

      bug.value = {
        ...bug.value,
        comments: [...bug.value.comments, { comment: comment.value }],
      };

      comment.value = "";
    };

    return {
      bug,
      video,
      activeTab,
      deleteBug,
      retestBug,
      comment,
      sendComment,
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
