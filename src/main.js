import { createApp } from "vue";
import App from "./App.vue";

// Styles
import "@/styles/global.scss";

// Store
import store from "@/store";

// Utils
import fileSize from "@/utils/fileSize.js";
import elapsed from "@/utils/elapsed.js";

const app = createApp(App);
app.use(store);
app.config.globalProperties.$filters = {
  fileSize,
  elapsed,
};
app.mount("#app");
