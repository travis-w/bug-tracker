import { createStore } from "vuex";

import UserModule from "@/store/modules/user";

export default createStore({
  modules: {
    user: UserModule,
  },
  strict: process.env.NODE_ENV !== "production",
});
