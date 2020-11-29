import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "@/assets/styles/tailwind.scss";
import "@/assets/styles/theme.scss";

createApp(App).use(store).use(router).mount("#app");
