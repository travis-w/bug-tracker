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
import { mapGetters, mapActions } from "vuex";

import Editor from "@/components/Editor";
import TestRun from "@/components/TestRun";

const BASE_URL = process.env.VUE_APP_API_BASE;

export default {
  components: { Editor, TestRun },
  data() {
    return {
      activeTab: 0,
      comment: "",
    };
  },
  computed: {
    ...mapGetters({
      getBugById: "GET_BUG_BY_ID",
    }),
    bug() {
      return this.getBugById(this.$route.params.bugId);
    },
    video() {
      return `${BASE_URL}/videos/${this.bug._id}/${this.bug.testResults?.[0]._id}/run.mp4`;
    },
  },
  methods: {
    ...mapActions(["loadBugById"]),
    deleteBug() {},
    retestBug() {},
    sendComment() {},
  },
  async created() {
    await this.loadBugById(this.$route.params.bugId);
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
