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
