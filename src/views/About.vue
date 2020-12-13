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
            <el-aside width="200px">
                <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
                    <el-submenu index="1">
                        <template slot="title"><i class="el-icon-message"></i>导航一</template>
                        <el-menu-item-group>
                            <template title="分组1">分组1</template>
                            <el-menu-item index="1-1">选项1</el-menu-item>
                            <el-menu-item index="1-2">选项2</el-menu-item>
                        </el-menu-item-group>

                        <el-menu-item-group title="分组2">
                            <el-menu-item index="1-3">选项3</el-menu-item>
                        </el-menu-item-group>

                        <el-submenu index="1-4">
                            <template slot="title">选项4</template>
                            <el-menu-item index="1-4-1">选项1</el-menu-item>
                        </el-submenu>
                    </el-submenu>
                    <el-menu-item index="2"><i class="el-icon-menu"></i><a href="https://www.ele.me" target="_blank" style="display:block">导航二</a></el-menu-item>
                    <el-menu-item index="3"><i class="el-icon-setting"></i>导航三</el-menu-item>
                </el-menu>
            </el-aside>
            <!--页面主题-右侧-->
            <el-main>Main</el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
  name:"AboutView",
    data() {
        return {
            isCollapse: true
        };
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
        }
    }
};
</script>
<style>
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
</style>
