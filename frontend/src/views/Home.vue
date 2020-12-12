<template>
  <div class="about">
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
