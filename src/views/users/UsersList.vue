<template>
    <div>
        <!--面包屑 导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区-->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="createUserDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <!---
            border:表格边框显示；
            stripe:隔行变色
            -->
            <el-table :data="userList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="username" label="姓名"> </el-table-column>
                <el-table-column prop="mobile" label="电话"> </el-table-column>
                <el-table-column prop="email" label="邮件"> </el-table-column>
                <el-table-column prop="roleName" label="角色"> </el-table-column>
                <el-table-column label="状态">
                    <!--模板插槽实现自定义组件显示-->
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.state" @change="changeUserState(scope.row)"> </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200px">
                    <!--模板插槽实现自定义组件显示-->
                    <template slot-scope="scope">
                        <!--修改按钮-->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditUserDialog(scope.row)"></el-button>
                        <!--删除按钮-->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                        <!--
                            分配权限按钮 
                            :enterable="false"鼠标进入tip后隐藏tip
                        -->
                        <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showAlotRoleDialog(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                background
                :page-sizes="[10, 20, 50, 100, 200]"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-size="queryInfo.pageSize"
                :current-page="queryInfo.pageNum"
                :total="this.total"
                layout="total, sizes, prev, pager, next, jumper"
            >
            </el-pagination>
        </el-card>

        <!--添加用户对话框-->
        <el-dialog title="添加用户" :visible.sync="createUserDialogVisible" width="50%" @close="createUserDialogClosed">
            <!--内容主题区-->
            <el-form :model="createUserForm" :rules="createUserFormRules" ref="createUserFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="createUserForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="createUserForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮件" prop="email">
                    <el-input v-model="createUserForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="createUserForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!--内容底部按钮区-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="createUserDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitCreateUserForm">确 定</el-button>
            </span>
        </el-dialog>

        <!--编辑用户对话框-->
        <el-dialog title="编辑用户" :visible.sync="editUserDialogVisible" width="50%" @close="editUserDialogClosed">
            <!--内容主题区-->
            <el-form :model="editUserForm" :rules="editUserFormRules" ref="editUserFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="editUserForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮件" prop="email">
                    <el-input v-model="editUserForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editUserForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!--内容底部按钮区-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editUserDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitEditUserForm">确 定</el-button>
            </span>
        </el-dialog>

        <!--分配角色对话框-->
        <el-dialog title="编辑用户" :visible.sync="alotRoleDialogVisible" width="50%" @close="alotRoleDialogClosed">
            <!--内容主题区-->
            <div>
                <p>当前的用户：{{ alotRoleUserInfo.username }}</p>
                <p>当前的角色：{{ alotRoleUserInfo.roleName }}</p>
                <p>
                    分配新角色：
                    <el-select filterable v-model="alotRoleId" placeholder="请选择角色">
                        <el-option v-for="item in alotRoleList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                    </el-select>
                </p>
            </div>

            <!--内容底部按钮区-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="alotRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitAlotRoleForm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: "UserList",
    data() {
        var validateEmail = (rule, value, cb) => {
            // 验证邮箱的正则表达式
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
            if (regEmail.test(value)) {
                // 合法的邮箱
                return cb();
            }
            // 不合法的邮箱
            return cb(new Error("请输入合法的邮箱"));
        };
        var validatePhone = (rule, value, cb) => {
            // 验证手机号的正则表达式
            const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
            if (regMobile.test(value)) {
                // 合法的手机号
                return cb();
            }
            // 不合法的手机号
            return cb(new Error("请输入合法的手机号"));
        };
        return {
            queryInfo: {
                query: "",
                pageNum: 0,
                pageSize: 10
            },
            userList: [],
            total: 0,
            // 添加用户弹窗是否打开
            createUserDialogVisible: false,
            // 添加用户表单
            createUserForm: {
                username: "",
                password: "",
                email: "",
                mobile: ""
            },
            // 添加用户验证规则
            createUserFormRules: {
                username: [
                    { required: true, message: "请输入用户名", trigger: "blur" },
                    { min: 3, max: 32, message: "用户名长度在3到32之间", trigger: "blur" }
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" },
                    { min: 6, max: 15, message: "密码长度在6到15之间", trigger: "blur" }
                ],
                email: [
                    { required: true, message: "请输入邮箱", trigger: "blur" },
                    { validator: validateEmail, trigger: "blur" }
                ],
                mobile: [
                    { required: true, message: "请输入手机", trigger: "blur" },
                    { validator: validatePhone, trigger: "blur" }
                ]
            },
            // 编辑用户他创是否打开
            editUserDialogVisible: false,
            // 编辑用户表单
            editUserForm: {
                username: "",
                email: "",
                mobile: ""
            },
            // 白鸡用户验证规则
            editUserFormRules: {
                username: [
                    { required: true, message: "请输入用户名", trigger: "blur" },
                    { min: 3, max: 32, message: "用户名长度在3到32之间", trigger: "blur" }
                ],
                email: [
                    { required: true, message: "请输入邮箱", trigger: "blur" },
                    { validator: validateEmail, trigger: "blur" }
                ],
                mobile: [
                    { required: true, message: "请输入手机", trigger: "blur" },
                    { validator: validatePhone, trigger: "blur" }
                ]
            },
            // 分配角色对话框
            alotRoleDialogVisible: false,
            // 分配角色操作对应的用户,打开对话框时，赋值到这里，需要在关闭对话框时，清空该值。
            alotRoleUserInfo: {},
            // 可分配的角色列表
            alotRoleList: [],
            // 分配给当前操作用户的角色id
            alotRoleId: ""
        };
    },
    created() {
        this.getUserList();
    },
    methods: {
        async getUserList() {
            console.log("call getUserList()");
            this.userList = [
                { id: 1, username: "admin", email: "admin@vuedemo.com", mobile: "18811118888", address: "xxx", roleId: 1, roleName: "超级管理员", state: true },
                { id: 2, username: "zhangsan", email: "zhangsan@vuedemo.com", mobile: "18811118888", address: "xxx", roleId: 2, roleName: "普通用户", state: true },
                { id: 3, username: "lisi", email: "lisi@vuedemo.com", mobile: "18811118888", address: "xxx", roleId: 2, roleName: "普通用户", state: false }
            ];
            this.total = 1000;
        },
        handleSizeChange(val) {
            this.queryInfo.pageSize = val;
            this.getUserList();
        },
        handleCurrentChange(val) {
            this.queryInfo.pageNum = val;
            this.getUserList();
        },
        async changeUserState(userInfo) {
            return this.$message.success("修改用户状态成功！");
        },
        // 添加用户表单弹窗关闭
        createUserDialogClosed() {
            this.$refs.createUserFormRef.resetFields();
        },
        //添加用户表单提交
        async submitCreateUserForm() {
            this.$refs.createUserFormRef.validate(async (valid) => {
                if (!valid) {
                    // 未验证通过直接返回
                    return;
                }

                // 验证通过后，提交添加用户网络请求
                const { data: res } = await this.$http.post("/user/create", this.createUserForm);

                if (res.meta.status !== 200) {
                    return this.$message.error("添加用户失败！");
                }
                this.$message.success("添加用户成功！");
                this.createUserDialogVisible = false;

                // 重新获取用户列表
                this.getUserList();
            });
        },
        // 弹出用户编辑弹窗
        showEditUserDialog(userInfo) {
            // const {data:res}=await this.$http.get(`/user/${userInfo.id}`);
            // // 查询失败就返回错误提示
            // if(res.meta.status!==200){
            //     return this.$message.error("查询用户信息失败！");
            // }
            // // 查找到了用户，就赋值给editUserForm
            // this.editUserForm=res.meta.data;
            this.editUserForm = userInfo;
            this.editUserDialogVisible = true;
        },
        // 编辑用户表单弹窗关闭
        editUserDialogClosed() {
            this.$refs.editUserFormRef.resetFields();
        },
        // 编辑用户表单提交
        async submitEditUserForm() {
            this.$refs.editUserFormRef.validate(async (valid) => {
                if (!valid) {
                    // 未验证通过直接返回
                    return;
                }

                // 验证通过后，提交添加用户网络请求
                const { data: res } = await this.$http.put(`/user/edit/${this.editUserForm.id}`, {
                    mobile: this.editUserForm.mobile,
                    email: this.editUserForm.email
                });

                if (res.meta.status !== 200) {
                    return this.$message.error("编辑用户失败！");
                }

                // 关闭对话框
                this.editUserDialogVisible = false;
                // 重新获取用户列表
                this.getUserList();
                // 提示操作成功
                this.$message.success("编辑用户成功！");
            });
        },
        // 删除用户
        async removeUserById(userId) {
            const confirmResult = await this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).catch((err) => err);

            // 如果确定，返回confirm
            // 如果取消，返回cancel
            //console.log(confirmResult);
            if (confirmResult !== "confirm") {
                return this.$message.info("已取消删除！");
            }

            // 已经确认删除
            console.log("已经确认删除！");
        },
        // 分配角色对话框‘关闭’事件:清空当前操作人，清空当前分配角色Id
        alotRoleDialogClosed() {
            this.alotRoleUserInfo = {};
            this.alotRoleId = "";
        },
        // 点击‘分配角色’按钮事件
        async showAlotRoleDialog(userInfo) {
            this.alotRoleUserInfo = userInfo;

            // // 加载角色列表
            // const { data: res } = await this.$http.get("/roles/list");
            // if (res.meta.status !== 200) {
            //     this.$message.error("加载角色列表失败！");
            // }
            // // 角色列表数据源赋值
            // this.alotRoleList = res.data;
            this.alotRoleList = [
                { id: 1, name: "超级管理员", desc: "超级用户角色组" },
                { id: 2, name: "普通用户", desc: "普通用户角色组" }
            ];

            // 赋值原来用户的角色ID
            this.alotRoleId = userInfo.roleId;
            // 显示对话框
            this.alotRoleDialogVisible = true;
        },
        // 分配角色对话框中‘确定’按钮点击事件
        async submitAlotRoleForm() {
            if (!this.alotRoleId) {
                this.message.error("请选择用户要分配的角色！");
            }

            const { data: res } = await this.$http.post(`/users/${this.alotRoleUserInfo.id}/role`, { roleId: this.alotRoleId});
            if (!res.meta.status !== 200) {
                this.message.error("分配用户角色失败！");
            }

            this.getUserList();
            this.message.success("分配用户角色成功！");
            this.alotRoleDialogVisible = false;
        }
    }
};
</script>
<style lang="less" scoped></style>
