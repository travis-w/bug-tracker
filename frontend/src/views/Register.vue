<template>
  <div class="register">
    <form @submit.prevent="onRegister">
      <input type="text" placeholder="E-Mail" v-model="email" />
      <input
        type="password"
        class="mt-3"
        placeholder="Password"
        v-model="password"
      />
      <input
        type="password"
        class="mt-3"
        placeholder="Confirm Password"
        v-model="confirmPassword"
      />
      <button
        type="submit"
        class="bg-blue-600 p-2 rounded-md text-white mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="
          email === '' || password === '' || confirmPassword !== password
        "
      >
        Register
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
      confirmPassword: "",
    };
  },
  methods: {
    ...mapActions(["register"]),
    async onRegister() {
      const success = await this.register({
        email: this.email,
        password: this.password,
      });

      if (success) {
        this.$router.push({ name: "Login" });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
