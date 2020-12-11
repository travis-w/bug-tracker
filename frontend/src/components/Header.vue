<template>
  <div class="header">
    <div class="container mx-auto">
      <div class="title">
        <router-link :to="{ name: 'Home' }">Bug Tracker</router-link>
      </div>
      <div class="nav">
        <div v-if="isLogged">
          {{ user.email }} |
          <button class="cursor-pointer" @click="logout">Logout</button>
        </div>
        <div v-else>
          <router-link :to="{ name: 'Login' }">Login</router-link>
          | <router-link :to="{ name: 'Register' }">Register</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

import * as types from "@/store/types";

export default {
  computed: {
    ...mapGetters({
      isLogged: types.IS_LOGGED,
      user: types.GET_USER,
    }),
  },
  methods: {
    ...mapMutations({
      logout: types.LOG_OUT,
    }),
  },
};
</script>

<style lang="scss" scoped>
.header {
  @apply border-b mb-4 py-4;

  .title {
    @apply inline-block;
  }

  .nav {
    @apply float-right inline-block;
  }
}
</style>
