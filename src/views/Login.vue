<template>
    <div class="login">
        <div class="login-card">
            <h2 style="color: red;" class="title">个人网盘系统</h2>
            <h7 class="title">欢迎登录</h7>
            <el-form :model="form" :rules="rules" ref="loginForm" label-width="80px" class="form">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="form.password" show-password auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="checkCode">
                    <el-input placeholder="请输入验证码" prefix-icon="el-icon-picture-outline-round" v-model="form.checkCode">
                        <template #append>
                            <div style="width:100%;" @click="getCode" v-html="code">
                            </div>
                        </template>
                    </el-input>
                </el-form-item>

                <el-checkbox v-model="rememberMe" class="remember-me">记住账号</el-checkbox>
                <el-form-item>
                    <el-button @keyup.enter="handleLogin" @click="handleLogin">登录</el-button>
                    <el-button @click="handleregister">注册</el-button>
                </el-form-item>
            </el-form>
            <div class="tex" style="color: #ff69b4; text-align: center;  margin-top: 50px;">如需帮助请联系: 16888888@qq.com</div>
            <div style="color: #ff69b4; text-align: right;; bottom: 1px;">by.不朽</div>
        </div>

    </div>
</template>
  
<script>
import qs from "qs";

export default {
    name: "login",
    data() {
        return {
            form: {
                username: "",
                password: "",
                checkCode: ""
            },
            rules: {
                username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
                password: [{ required: true, message: "请输入密码", trigger: "blur" }]
            },
            rememberMe: false,
            code: "",
            codeText: "",

        };
    },




    methods: {
        handleLogin() {
            this.$refs.loginForm.validate(username => {
                if (username) {
                    const data = this.form;
                    console.log(data);

                    // Check if entered code matches generated code
                    if (data.checkCode !== this.codeText) {
                        this.$message.error("验证码错误，请重新输入。");
                        return;
                    }

                    const options = {
                        method: "POST",
                        data: qs.stringify(data),
                        url: "/login"
                    };
                    this.$axios(options)
                        .then(res => {
                            this.$message.success(res.data.message);
                            setTimeout(() => {
                                this.$router.push("/home");
                            }, 2000);
                            sessionStorage.setItem("token", res.data.token);

                            if (this.rememberMe) {
                                localStorage.setItem("username", data.username);
                                localStorage.setItem("password", data.password);
                                localStorage.setItem("token", res.data.token);
                            } else {
                                localStorage.removeItem("username");
                                localStorage.removeItem("password");
                                localStorage.removeItem("token");
                            }
                        })
                        .catch(error => {

                            if (error.response.status === 401) {
                                this.$message.error(error.response.data); // 显示错误消息框
                            } else if (error.response.status === 400) {
                                this.$message.error(error.response.data); // 显示错误消息框
                            } else {
                                console.log(error.message);
                            }
                        });
                }
            });
        },

        handleregister() {
            this.$router.push("/register");
        },
        getCode() {
            this.$axios.get("/login/checkCode").then(res => {
                console.log(res);
                this.code = res.data.data;
                this.codeText = res.data.text;
            });
        }
    },
    created() {
        const username = localStorage.getItem("username");
        const password = localStorage.getItem("password");
        if (username && password) {
            this.form.username = username;
            this.form.password = password;
            this.rememberMe = true;
        }
        this.getCode();
    }
};
</script>
  
<style lang="scss" scoped>
.login {
    background-image: url('/public/image.jpg');

    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background-size: cover;
    background-position: center center;
}

.login-card {
    width: 400px;
    padding: 30px;
    text-align: center;
    opacity: 0.9;
    background-color: rgba(244, 246, 244, 0.732);
    border-radius: 20px;
    box-shadow: 0 0 30px rgba(227, 8, 103, 0.87);
}

.title {
    font-size: 28px;
    margin-bottom: 30px;
    color: #333;
}

.form {
    margin-top: 20px;
}

.el-form-item__label {
    color: #666;
}

/deep/ .el-input {
    border-radius: 10px;

    color: rgb(226, 7, 7);
    border: none;
}

.el-checkbox {
    color: #666;
}

.remember-me {
    margin-top: 10px;
    color: #666;
}

.el-button {
    margin-right: 10px;
    margin-top: 20px;
    width: 120px;
    height: 48px;
    background-color: hwb(214 92% 5% / 0.389);
    color: red;
    border: none;

    &:hover {
        background-color: #ff40ec58;
    }

    &:focus {
        outline: none;
        box-shadow: none;
    }
}

/deep/ .el-input-group__append {
    border-left: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    padding: 0 !important;
}

.code-img {


    width: 100%;
    height: 100%;



    cursor: pointer;
    border-radius: 8px;
    background-color: #f7f7f7;

    &:hover {
        opacity: 0.8;
    }
}

@media(max-width: 768px) {
    .login-card {
        width: 350px;
        padding: 0px;
        text-align: center;
        opacity: 0.9;
        background-color: rgba(244, 246, 244, 0.732);
        border-radius: 20px;
        box-shadow: 0 0 30px rgba(227, 8, 103, 0.87);
    }

    .tex {
        margin-top: 25px !important;
    }

    .el-input {
        left: -20px;
        width: 200px;
    }

    .el-button {
        margin-right: 10px;
        margin-top: 20px;
        width: 100px;
        height: 48px;
        background-color: hwb(214 92% 5% / 0.389);
        color: red;
        border: none;

        &:focus {
            outline: none;
            box-shadow: none;
        }
    }
}
</style>