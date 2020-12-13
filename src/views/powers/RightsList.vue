<template>
    <div>
        <!--面包屑 导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区-->
        <el-card>
            <el-table :data="rightList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="name" label="名称"> </el-table-column>
                <el-table-column prop="path" label="路径"> </el-table-column>
                <el-table-column label="层级">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level === 0" type="info">一级</el-tag>
                        <el-tag v-else-if="scope.row.level === 1" type="success">二级</el-tag>
                        <el-tag v-else type="warning">三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 权限列表
            rightList: []
        };
    },
    // 声明周期created函数：加载权限列表
    created() {
        this.getRightList();
    },
    methods: {
        // 网络请求，获取权限列表
        async getRightList() {
            // // 发起网络请求
            // const { data: res } = await this.$http.get("rights/list");

            // // 请求失败
            // if (res.meta.status !== 200) {
            //     this.$message.error("请求权限列表失败！");
            // }

            // this.rightList = res.data;
            this.rightList = [
                { id: 1, name: "用户管理", path: "/users", level: 0 },
                { id: 1001, name: "用户列表", path: "/users/list", level: 1 },
                { id: 1001001, name: "用户删除", path: "/users/list", level: 2 },
                { id: 1001002, name: "用户修改", path: "/users/list", level: 2 },
                { id: 1001003, name: "权限分配", path: "/users/list", level: 2 },
                { id: 2, name: "权限管理", path: "/powers", level: 0 },
                { id: 2001, name: "权限列表", path: "/rights/list", level: 1 },
                { id: 2002, name: "角色列表", path: "/rights/list", level: 1 },
                { id: 2002001, name: "添加角色", path: "/rights/list", level: 2 },
                { id: 2002002, name: "编辑角色", path: "/rights/list", level: 2 },
                { id: 2002003, name: "删除角色", path: "/rights/list", level: 2 }
            ];
        }
    }
};
</script>
