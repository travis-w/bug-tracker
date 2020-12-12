<template>
  <table class="w-full">
    <thead class="border-b-2">
      <tr>
        <th class="column__date">Date</th>
        <th>Title</th>
        <th class="column__user">User</th>
        <th class="column__test-status">Test Status</th>
        <th class="column__status">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="bug in bugs"
        :key="bug._id"
        class="bug__row"
        @click="visitBug(bug)"
        @key-up.enter="visitBug(bug)"
        tabindex="0"
        role="link"
      >
        <td class="column__date">{{ formatDate(bug.date) }}</td>
        <td>{{ bug.name }}</td>
        <td class="column__user">User</td>
        <td class="column__test-status">
          <span :class="testPillClasses(bug)">{{ bug.testStatus }}</span>
        </td>
        <td class="column__status">
          <span :class="pillClasses(bug)">{{ bug.status }}</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { DateTime } from "luxon";

export default {
  props: {
    bugs: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    formatDate(val) {
      return DateTime.fromISO(val).toFormat("MM/dd/yyyy");
    },
    pillClasses(bug) {
      let classes = ["pill"];

      if (bug.status === "Open") {
        classes.push("red");
      } else if (bug.status === "Closed") {
        classes.push("green");
      }

      return classes;
    },
    testPillClasses(bug) {
      let classes = ["pill"];

      if (bug.testStatus === "Failing") {
        classes.push("red");
      } else {
        classes.push("green");
      }

      return classes;
    },
    visitBug(bug) {
      this.$router.push({ name: "ViewBug", params: { bugId: bug._id } });
    },
  },
};
</script>

<style lang="scss" scoped>
th {
  @apply text-left px-4 py-2 box-content;

  &:first-of-type {
    @apply pl-0;
  }

  &:last-of-type {
    @apply pr-0;
  }
}

.column__status {
  width: 110px;
}

.column__test-status {
  width: 110px;
}

.column__date {
  width: 100px;
}

.column__user {
  width: 100px;
}

.bug__row {
  @apply cursor-pointer;

  td {
    @apply py-3 px-4 box-content;

    &:first-of-type {
      @apply pl-0;
    }

    &:last-of-type {
      @apply pr-0;
    }
  }

  & + & {
    @apply border-t;
  }
}

.pill {
  @apply rounded-xl bg-blue-400 px-3 text-white w-full inline-block text-center;

  &.green {
    @apply bg-green-400;
  }

  &.red {
    @apply bg-red-400;
  }
}
</style>
