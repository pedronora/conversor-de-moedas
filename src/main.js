import { createApp } from "vue";
import App from "./App.vue";
import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const app = createApp(App);

inject();
injectSpeedInsights();

app.mount("#app");
