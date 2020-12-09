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
import { mapGetters, mapActions } from "vuex";

export default {
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
