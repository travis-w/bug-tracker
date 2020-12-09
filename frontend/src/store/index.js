import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";

import UserModule from "@/store/modules/user";
import BugsModule from "@/store/modules/bugs";

// Vuex Perist Setup
const vuexPlugin = new VuexPersistence({
  storage: window.sessionStorage,
  reducer: (state) => state.user,
});

export default createStore({
  modules: {
    user: UserModule,
    bugs: BugsModule,
  },
  plugins: [vuexPlugin.plugin],
  strict: process.env.NODE_ENV !== "production",
});
