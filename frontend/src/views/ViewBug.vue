<template>
  <div>
    <h1>{{ bug.name }}</h1>
    <button>Delete</button>
    <Editor class="h-52" v-model="bug.test" :read-only="true" />
    <video :src="`http://localhost:8081/videos/${bug._id}/${bug.testResults?.[0]._id}/run.mp4`" controls></video>
  </div>
</template>

<script>
import ky from "ky";
import { ref } from "vue";
import { useRoute } from "vue-router";

import Editor from "@/components/Editor";

const BASE_URL = process.env.VUE_APP_API_BASE;

export default {
  components: { Editor },
  setup() {
    const route = useRoute();
    const bug = ref({});

    // TODO: Look into asyc setup/vue suspense
    ky.get(`${BASE_URL}/bugs/${route.params.bugId}`)
      .then(data => data.json())
      .then(res => {
        bug.value = { ...res };
      });

    return {
      bug
    };
  }
};
</script>
