<template>
    <div>
        <!--面包屑 导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>角色管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片视图区-->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="4">
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            <el-table :data="roleList" border stripe>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <!--
                            渲染一级权限
                            el-row中col被划分了24份
                        -->
                        <el-row :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, index1) in scope.row.children" :key="item1.id">
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{ item1.name }}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!--渲染二、三级权限-->
                            <el-col :span="19">
                                <el-row :class="[index2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, index2) in item1.children" :key="item2.id">
                                    <!--二级权限-->
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{ item2.name }}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!--三级权限-->
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">
                                            {{ item3.name }}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        <!-- <pre>{{ scope.row }}</pre> -->
                    </template>
                </el-table-column>
                <!--索引列-->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="name" label="名称"> </el-table-column>
                <el-table-column prop="desc" label="路径"> </el-table-column>
                <el-table-column label="操作" width="305px">
                    <!--模板插槽实现自定义组件显示-->
                    <template slot-scope="scope">
                        <!--修改按钮-->
                        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                        <!--删除按钮-->
                        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                        <!--分配权限按钮-->
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="showAlotRightsDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!--角色分配权限对话框-->
        <el-dialog title="分配角色权限" :visible.sync="alotRightsDialogVisible" width="50%" @close="alotRightsDialogClosed">
            <!--内容主题区-->
            <el-tree :data="treeData" show-checkbox default-expand-all node-key="id" ref="treeRef" highlight-current :props="treeProps" :default-checked-keys="treeCheckedKeys"> </el-tree>
            <!--内容底部按钮区-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="alotRightsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitAlotRightsForm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 角色列表
            roleList: [],
            // 分配权限对话框是否显示
            alotRightsDialogVisible: false,
            // tree上渲染权限数据
            treeData: [],
            // 渲染tree时，tree模板属性与data中属性值对接配置
            treeProps: {
                children: "children",
                label: "name"
            },
            // 已经选中的权限keys
            treeCheckedKeys: [],
            // 当前分配权限对话框显示的角色id
            treeRelationRoleId: ""
        };
    },
    // 生性周期函数，加载角色列表
    created() {
        this.getRoleList();
    },
    methods: {
        // 获取角色列表
        async getRoleList() {
            // const { data: res } = await this.$http.get("roles/list");
            // // 请求失败
            // if (res.meta.status !== 200) {
            //     this.$message.error("请求角色列表失败！");
            // }

            // this.roleList = res.data;
            this.roleList = [
                {
                    id: 1,
                    name: "超级管理员",
                    desc: "拥有所有操作权限",
                    children: [
                        {
                            id: 1,
                            name: "用户管理",
                            path: "/users",
                            level: 0,
                            children: [
                                {
                                    id: 1001,
                                    name: "用户列表",
                                    path: "/users/list",
                                    level: 1,
                                    children: [
                                        { id: 1001001, name: "用户删除", path: "/users/list", level: 2 },
                                        { id: 1001002, name: "用户修改", path: "/users/list", level: 2 },
                                        { id: 1001003, name: "权限分配", path: "/users/list", level: 2 }
                                    ]
                                }
                            ]
                        },
                        {
                            id: 2,
                            name: "权限管理",
                            path: "/powers",
                            level: 0,
                            children: [
                                { id: 2001, name: "权限列表", path: "/rights/list", level: 1, children: [] },
                                {
                                    id: 2002,
                                    name: "角色列表",
                                    path: "/rights/list",
                                    level: 1,
                                    children: [
                                        { id: 2002001, name: "添加角色", path: "/rights/list", level: 2 },
                                        { id: 2002002, name: "编辑角色", path: "/rights/list", level: 2 }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 2,
                    name: "维护人员",
                    desc: "系统维护人员",
                    children: [
                        {
                            id: 2,
                            name: "权限管理",
                            path: "/powers",
                            level: 0,
                            children: [
                                { id: 2001, name: "权限列表", path: "/rights/list", level: 1, children: [] },
                                {
                                    id: 2002,
                                    name: "角色列表",
                                    path: "/rights/list",
                                    level: 1,
                                    children: [{ id: 2002001, name: "添加角色", path: "/rights/list", level: 2 }]
                                }
                            ]
                        }
                    ]
                },
                { id: 3, name: "编辑人员", desc: "编辑人员权限", children: [] }
            ];
        },
        // 根据权限id，删除角色下分配的权限
        async removeRightById(roleInfo, rightId) {
            const confirmResult = await this.$confirm("此操作将永久删除该角色权限, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).catch((err) => err);

            if (confirmResult != "confirm") {
                return this.$message.info("已取消删除操作");
            }

            const { data: res } = await this.$http.delete(`roles/${roleInfo.id}/rights/${rightId}`);
            if (res.meta.status !== 200) {
                return this.$message.error("删除角色权限失败！");
            }

            return this.$message.success("删除角色权限成功！");
            // 如果直接调用角色接口会导致页面刷新，展开的权限列表页会合并掉。因此不建议这么操作。
            // this.getRoleList();

            // 此时为了解决‘删除后带来刷新折叠’问题，可以在删除后返回结果，然后重新赋值给当前row
            roleInfo = res.data;
        },
        // 点击‘分配权限’按钮后，弹出‘分配角色权限’对话框
        async showAlotRightsDialog(roleInfo) {
            this.treeRelationRoleId = roleInfo.id;
            // // 请求对应的数据，渲染到tree控件上
            // const { data: res } = await this.$http.get("rights/tree");
            // if (res.meta.status !== 200) {
            //     return this.$message.error("获取权限树失败！");
            // }

            // // 获取到权限树，赋值给treeData，用来渲染tree控件
            // this.treeData = res.data;
            this.treeData = [
                {
                    id: 1,
                    name: "用户管理",
                    path: "/users",
                    level: 0,
                    children: [
                        {
                            id: 1001,
                            name: "用户列表",
                            path: "/users/list",
                            level: 1,
                            children: [
                                { id: 1001001, name: "用户删除", path: "/users/list", level: 2 },
                                { id: 1001002, name: "用户修改", path: "/users/list", level: 2 },
                                { id: 1001003, name: "权限分配", path: "/users/list", level: 2 }
                            ]
                        }
                    ]
                },
                {
                    id: 2,
                    name: "权限管理",
                    path: "/powers",
                    level: 0,
                    children: [
                        { id: 2001, name: "权限列表", path: "/rights/list", level: 1, children: [] },
                        {
                            id: 2002,
                            name: "角色列表",
                            path: "/rights/list",
                            level: 1,
                            children: [
                                { id: 2002001, name: "添加角色", path: "/rights/list", level: 2 },
                                { id: 2002002, name: "编辑角色", path: "/rights/list", level: 2 },
                                { id: 2002003, name: "删除角色", path: "/rights/list", level: 2 }
                            ]
                        }
                    ]
                }
            ];

            // 设置已经选中的叶子节点
            this.getLeafKeys(roleInfo, this.treeCheckedKeys);

            this.alotRightsDialogVisible = true;
        },
        // 递归选择role最后一个叶子节点值并保存为tree默认选中节点id
        getLeafKeys(role, checkedKeys) {
            if (!role.children || role.children.length === 0) {
                checkedKeys.push(role.id);
                return;
            }
            role.children.forEach((item, idx) => this.getLeafKeys(item, checkedKeys));
        },
        // 对话框关闭时，清空对话框中选中的之前选中的权限，否则会导致：‘上次打开的选中信息会叠加到下次选中的对话框中’。
        alotRightsDialogClosed() {
            this.treeCheckedKeys = [];
            this.treeRelationRoleId = "";
        },
        // 提交权限分配结果
        async submitAlotRightsForm() {
            const checkedKeys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()];
            const idsStr = checkedKeys.join(",");
            // 发起网络请求保存数据
            const { data: res } = await this.$http.post(`roles/${this.treeRelationRoleId}/rights`, { rightIds: idsStr });
            if (res.meta.status !== 200) {
                return this.$$message.error("分配角色权限分配失败！");
            }

            this.$$message.success("分配角色权限成功！");
            this.getRoleList();
            this.showAlotRightsDialog = false;
        }
    }
};
</script>
<style lang="less" scoped>
.el-tag {
    margin: 7px;
}
.bdtop {
    border-top: 1px solid #eee;
}
.bdbottom {
    border-bottom: 1px solid #eee;
}
.vcenter {
    display: flex;
    align-items: center;
}
</style>
