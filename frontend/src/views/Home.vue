<template>
  <div class="about">
    <router-link :to="{ name: 'Create' }" class="create-bug">Create New</router-link>
    <BugTable :bugs="bugs" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import BugTable from "@/components/BugTable";

export default {
  components: {
    BugTable,
  },
  computed: {
    ...mapGetters({
      bugs: "GET_BUGS",
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
