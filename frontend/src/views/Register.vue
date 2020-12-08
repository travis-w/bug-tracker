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
import { ref } from "vue";

export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const confirmPassword = ref("");

    const onRegister = async () => {
      // TODO: Save auth token and persist across other calls
      // const user = await register(email.value, password.value);
      console.log("TESTING");
    };

    return {
      email,
      password,
      confirmPassword,
      onRegister,
    };
  },
};
</script>

<style lang="scss" scoped></style>
