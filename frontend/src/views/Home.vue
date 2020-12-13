<template>
  <div class="about">
    <router-link v-if="isLogged" :to="{ name: 'Create' }" class="create-bug">
      Create New
    </router-link>
    <BugTable :bugs="bugs" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import * as types from "@/store/types";

import BugTable from "@/components/BugTable";

export default {
  components: {
    BugTable,
  },
  computed: {
    ...mapGetters({
      bugs: types.GET_BUGS,
      isLogged: types.IS_LOGGED,
    }),
  },
  methods: {
    ...mapActions(["getAllBugs"]),
  },
  mounted() {
    this.getAllBugs();
  },
};
</script>

<style lang="scss" scoped>
.create-bug {
  @apply px-3 py-2 border-2 border-green-400 rounded-lg text-green-400 float-right;
}
</style>
