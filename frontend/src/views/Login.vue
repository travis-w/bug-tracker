<template>
  <div class="login">
    <form @submit.prevent="onLogin">
      <input type="text" placeholder="E-Mail" v-model="email" />
      <input
        type="password"
        class="mt-3"
        placeholder="Password"
        v-model="password"
      />
      <button
        type="submit"
        class="bg-blue-600 p-2 rounded-md text-white mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="email === '' || password === ''"
      >
        Login
      </button>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    ...mapActions(["login"]),
    async onLogin() {
      const success = await this.login({
        email: this.email,
        password: this.password,
      });

      if (success) {
        console.log("REDIRECT");
        this.$router.push({ name: "Home" });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
