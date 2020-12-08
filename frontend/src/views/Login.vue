<template>
  <div class="login">
    <input type="text" placeholder="User Name" v-model="email" />
    <input type="password" placeholder="Password" v-model="password" />
    <button
      class="bg-blue-600 p-2 rounded-md text-white mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
      @click="onLogin"
    >
      Login
    </button>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup(props, { root }) {
    const email = ref("");
    const password = ref("");

    const onLogin = async () => {
      const success = root.$store.dispatch("login", { email, password });

      console.log(success);
    };

    return {
      email,
      password,
      onLogin,
    };
  },
};
</script>

<style lang="scss" scoped></style>
