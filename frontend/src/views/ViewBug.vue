<template>
  <div>
    <h1>{{ bug.name }}</h1>
  </div>
</template>

<script>
import ky from "ky";
import { ref } from "vue";
import { useRoute } from "vue-router";

const BASE_URL = process.env.VUE_APP_API_BASE;

export default {
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
