<template>
  <div class="about">
    <router-link :to="{ name: 'Create' }">Create New</router-link>
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

<style lang="scss" scoped></style>
