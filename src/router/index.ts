import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "../pages/LandingPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import SignupPage from "../pages/SignupPage.vue";
import DashboardLayout from "../pages/dashboard/DashboardLayout.vue";
import DashboardPage from "../pages/dashboard/DashboardPage.vue";
import CoverageTimelinePage from "../pages/dashboard/CoverageTimelinePage.vue";
import PaymentRecordsPage from "../pages/dashboard/PaymentRecordsPage.vue";

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: (to) => {
    if (to.hash) return { el: to.hash, behavior: "smooth" };
    return { top: 0 };
  },
  routes: [
    { path: "/", component: LandingPage },
    {
      path: "/dashboard",
      component: DashboardLayout,
      children: [
        { path: "",         component: DashboardPage },
        { path: "coverage", component: CoverageTimelinePage },
        { path: "payments", component: PaymentRecordsPage },
        { path: ":pathMatch(.*)*", redirect: "/dashboard" },
      ],
    },
    { path: "/login",  component: LoginPage },
    { path: "/signup", component: SignupPage },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});

export default router;
