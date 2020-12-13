<template>
    <div class="login_container">
        <div class="login_box">
            <div class="avatar_box">
                <img src="@/assets/logo.png" />
            </div>
            <el-form label-width="0px" class="login_form" :model="loginModel" :rules="loginRules" ref="loginForm">
                <el-form-item prop="username">
                    <el-input prefix-icon="el-icon-user-solid" v-model="loginModel.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" prefix-icon="el-icon-s-goods" v-model="loginModel.password"></el-input>
                </el-form-item>
                <el-form-item class="login_button">
                    <el-button type="primary" @click="submitLoginForm()">提交</el-button>
                    <el-button @click="resetLoginForm()">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name: "Login",
    props: {
        msg: String
    },
    data() {
        return {
            loginModel: {
                username: "",
                password: ""
            },
            loginRules: {
                username: [
                    { required: true, message: "请输入用户名", trigger: "blur" },
                    { min: 3, max: 12, message: "长度在3到12个字符", trigger: "blur" }
                ],
                password: [
                    { required: true, message: "请输入用户密码", trigger: "blur" },
                    { min: 6, max: 15, message: "长度在6到15个字符", trigger: "blur" }
                ]
            }
        };
    },
    methods: {
        submitLoginForm() {
            this.$refs.loginForm.validate(async (valid) => {
                if (!valid) {
                    return;
                }

                let setData = {
                    channel: 2,
                    email: "",
                    mobile: "",
                    oauthToken: "",
                    password: "e10adc3949ba59abbe56e057f20f883e",
                    tenantId: 202012120914,
                    type: 0,
                    userName: "xxx",
                    verifyCode: ""
                };

                // this.loading = true;
                // var _this = this;
                // this.$http.post("/saaslogin", setData).then((resp) => {
                //     console.log(resp);
                //     _this.loading = false;
                //     if (resp && resp.status == 200 && resp.data && resp.data.data && resp.data.data.token) {
                        // 1)登录成功之后toke，保存到客户端sessionStorage中
                        // 1.1)项目中除了登录接口之外，其他接口都必须登录之后才能访问；
                        // 1.2)token值应在当前网站打开期间生效，所已经将token保存在sessionStorage中
                        // window.sessionStorage.setItem("token", resp.data.data.token);
                        window.sessionStorage.setItem("token", "XXXXXX");
                        // 2)通过编程式导航跳转到后台主页，路由地址是/home
                        this.$router.push("/home");
                        this.$message({
                            message: "恭喜您，成功登录系统。",
                            type: "success"
                        });
                //     } else {
                //         this.$message({
                //             message: resp.data.message,
                //             type: "error"
                //         });
                //     }
                // });
            });
        },
        resetLoginForm() {
            this.$refs.loginForm.resetFields();
        }
    }
};
</script>

<style>
.login_container {
    background-color: #2b4b6b;
    height: 100%;
}

.login_box {
    width: 40%;
    height: 40%;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.avatar_box {
    height: 100px;
    width: 100px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
}

.avatar_box img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
}

.login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}

.login_button {
    display: flex;
    justify-content: flex-end;
}
</style>
