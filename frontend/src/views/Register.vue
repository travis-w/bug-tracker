<template>
  <div class="register">
    <input type="text" placeholder="User Name" v-model="email" />
    <input type="password" placeholder="Password" v-model="password" />
    <input type="password" placeholder="Password" v-model="confirmPassword" />
    <button
      class="bg-blue-600 p-2 rounded-md text-white mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
      @click="onRegister"
      :disabled="
        email === '' || password === '' || confirmPassword !== password
      "
    >
      Register
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
