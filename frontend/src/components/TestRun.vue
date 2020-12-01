<template>
  <div class="test_run" :class="{ 'test_run--pass': testObj.passed }">
    <div class="">
      {{ testHeader }}
    </div>
  </div>
</template>

<script>
import { toRefs, computed } from "vue";
import { DateTime } from "luxon";

export default {
  props: {
    testObj: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { testObj } = toRefs(props);

    const passedTests = testObj.value.tests.filter((x) => {
      return x.state === "passed";
    }).length;

    const formatDate = (date) => {
      return DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_FULL);
    };

    const testHeader = computed(() => {
      return `${formatDate(testObj.value.date)} (${passedTests} / ${
        testObj.value.tests.length
      })`;
    });

    return {
      passedTests,
      testHeader,
    };
  },
};
</script>

<style lang="scss">
.test_run {
  @apply p-3 border relative;

  &::after {
    @apply bg-red-500 absolute inset-y-0;
    content: " ";
    content: " ";
    width: 8px;
    left: -1px;
  }

  &.test_run--pass::after {
    @apply bg-green-500;
  }

  & + & {
    @apply border-t-0;
  }
}
</style>
