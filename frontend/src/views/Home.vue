<template>
  <div class="about">
    {{ bugs }}
  </div>
</template>

<script>
import ky from "ky";
import { ref } from "vue";

const BASE_URL = process.env.VUE_APP_API_BASE;

export default {
  setup() {
    const bugs = ref([]);

    const setBugs = val => {
      bugs.value = [...val];
    };

    return {
      bugs,
      setBugs
    };
  },
  beforeRouteEnter: async (to, from, next) => {
    const results = await ky.get(`${BASE_URL}/bugs`).json();

    next(vm => {
      vm.setBugs(results);
    });
  }
};
</script>
