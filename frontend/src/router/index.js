import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/bugs/:bugId",
    name: "ViewBug",
    component: () =>
      import(/* webpackChunkName: "viewBug" */ "../views/ViewBug"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import(/* webpackChunkName: "login" */ "../views/Login"),
  },
  {
    path: "/register",
    name: "Register",
    component: () =>
      import(/* webpackChunkName: "register" */ "../views/Register"),
  },
  {
    path: "/create",
    name: "Create",
    // route level code-splitting
    // this generates a separate chunk (create.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "create" */ "../views/Create"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
