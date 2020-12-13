import Vue from "vue";
import Router from "vue-router";
import Login from "../views/Login.vue";
import Home from "../views/Home.vue";
import Welcome from "../components/Welcome.vue";
import UsersList from "../views/users/UsersList.vue";
import RightsList from "../views/powers/RightsList.vue";
import RolesList from "../views/powers/RolesList.vue";
import CategoriesList from "../views/goods/CategoriesList.vue";
import ParamsList from "../views/goods/ParamsList.vue";
import GoodsList from "../views/goods/GoodsList.vue";
import AddGood from "../views/goods/AddGood.vue";
import OrdersList from "../views/orders/OrdersList.vue";
import StatisticsReport from "../views/statistics/Reports.vue";

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: "/",
            redirect: "/login"
        },
        {
            path: "/login",
            name: "LoginView",
            component: Login
        },
        {
            path: "/home",
            name: "HomeView",
            component: Home,
            redirect: "/welcome",
            children: [
                { path: "/welcome", component: Welcome },
                { path: "/users/list", component: UsersList },
                { path: "/powers/rights/list", component: RightsList },
                { path: "/powers/roles/list", component: RolesList },
                { path: "/goods/categories/list", component: CategoriesList },
                { path: "/goods/params/list", component: ParamsList },
                { path: "/goods/list", component: GoodsList },
                { path: "/goods/add", component: AddGood },
                { path: "/orders/list", component: OrdersList },
                { path: "/statistics/report", component: StatisticsReport }
            ]
        },
        {
            path: "/about",
            name: "AboutView",
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ "../views/About.vue")
        }
    ]
});

router.beforeEach((to, from, next) => {
    if (to.path === "/login") {
        return next();
    }

    const tokenStr = window.sessionStorage.getItem("token");
    if (!tokenStr) {
        return next("/login");
    } else {
        next();
    }
});

export default router;
