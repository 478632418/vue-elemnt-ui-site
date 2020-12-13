<template>
    <el-container class="home-container">
        <!--header-->
        <el-header>
            <div>
                <img src="../assets/logo.png" style="width:40px;height:40px;" />
                <span>Vue实战</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!--页面主题-->
        <el-container>
            <!--页面主题-左侧-->
            <!--
                是否开启折叠动画：collapse-transition
                每次展开一个菜单：unique-opened
                collapse：true=折叠，false=展开
                router: 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转
                default-active：记录当前被激活的菜单
            -->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <el-menu
                    :default-active="activePath"
                    background-color="#333744"
                    text-color="#fff"
                    active-text-color="#409EFF"
                    :unique-opened="true"
                    :collapse="isCollapse"
                    :collapse-transition="false"
                    :router="true"
                >
                    <el-submenu :index="menu.id + ''" v-for="menu in menuList" :key="menu.id">
                        <template slot="title">
                            <i :class="menu.iconfont"></i>
                            <span>{{ menu.name }}</span>
                        </template>
                        <el-menu-item :index="subMenu.path" v-for="subMenu in menu.children" :key="subMenu.id" @click="storageActiveNavigatePath(subMenu.path)">
                            <template slot="title">
                                <i :class="subMenu.iconfont"></i>
                                <span slot="title">{{ subMenu.name }}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!--页面主题-右侧-->
            <el-main>
                <!---实现页面主题被替换-->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            // 左侧菜单
            menuList: [],
            // 是否折叠或展开左侧菜单
            isCollapse: false,
            // 记录被激活的菜单的router path
            activePath: ""
        };
    },
    // 在页面被创建的时候，声明周期内一定会调用created
    created() {
        // 立即加载左侧菜单数据
        this.getMenuList();
        this.activePath = window.sessionStorage.getItem("activePath");
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        logout() {
            // 清空token
            window.sessionStorage.removeItem("token");
            // 重定向到登录页
            this.$router.push("/login");
        },
        getMenuList() {
            // 请求网络
            this.menuList = [
                { id: 1, name: "用户管理", path: "users", order: 1, iconfont: "el-icon-user", children: [{ id: 1001, name: "用户列表", path: "/users/list", order: 1, iconfont: "el-icon-s-grid" }] },
                {
                    id: 2,
                    name: "权限管理",
                    path: "powers",
                    order: 2,
                    iconfont: "el-icon-set-up",
                    children: [
                        { id: 2001, name: "角色列表", path: "/powers/roles/list", order: 1, iconfont: "el-icon-s-grid" },
                        { id: 2002, name: "权限列表", path: "/powers/rights/list", order: 2, iconfont: "el-icon-s-grid" }
                    ]
                },
                {
                    id: 3,
                    name: "商品管理",
                    path: "goolds",
                    order: 3,
                    iconfont: "el-icon-s-claim",
                    children: [
                        { id: 3001, name: "商品列表", path: "/goods/list", order: 1, iconfont: "el-icon-s-grid" },
                        { id: 3002, name: "分类参数", path: "/goods/params/list", order: 2, iconfont: "el-icon-s-grid" },
                        { id: 3003, name: "商品分类", path: "/goods/categories/list", order: 3, iconfont: "el-icon-s-grid" }
                    ]
                },
                {
                    id: 4,
                    name: "订单管理",
                    path: "/orders",
                    order: 4,
                    iconfont: "el-icon-s-order",
                    children: [{ id: 4001, name: "订单列表", path: "/orders/list", order: 1, iconfont: "el-icon-s-grid" }]
                },
                {
                    id: 5,
                    name: "数据统计",
                    path: "/reports",
                    order: 5,
                    iconfont: "el-icon-s-data",
                    children: [{ id: 5001, name: "统计报表", path: "/statistics/report", order: 1, iconfont: "el-icon-s-grid" }]
                }
            ];
        },
        // 点击切换折叠、展开左侧菜单
        toggleCollapse() {
            this.isCollapse = !this.isCollapse;
        },
        // 点击二级菜单时，保存当前点击菜单的router，用于赋值给default-active的值，用于记录当前激活菜单（防止刷新后菜单选中效果消失）。
        storageActiveNavigatePath(activePath) {
            window.sessionStorage.setItem("activePath", activePath);
            this.activePath = activePath;
        }
    }
};
</script>
<style lang="less" scoped>
.home-container {
    height: 100%;
}
.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
}
.el-header div {
    display: flex;
    align-items: center;
}
.el-header div span {
    margin-left: 15px;
}
.el-aside {
    background-color: #373744;
}
.el-main {
    background-color: #eaedf1;
}
.toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.25em;
}
</style>
