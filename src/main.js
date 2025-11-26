import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import Login from "./pages/Login.vue";
import Home from "./pages/Home.vue";

const routes = [
    { path: "/", component: Home },
    { path: "/login", component: Login },
    // optionally: API route /api/protected if you implement server
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

createApp(App).use(router).mount("#app");
