<template>
  <div class="about">
    <ul>
      <router-link
        v-for="bug in bugs"
        class="bug_item"
        :key="bug._id"
        :to="{ name: 'ViewBug', params: { bugId: bug._id } }"
      >
        <li>
          {{ bug.name }}
        </li>
      </router-link>
    </ul>
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

<style lang="scss">
.bug_item {
  @apply border relative p-3 block;

  &::after {
    @apply bg-red-500 absolute inset-y-0;
    content: " ";
    width: 8px;
    left: -1px;
  }

  & + & {
    border-top: 0;
  }
}
</style>
