
<template>
    <div class="kk">
        <div class="container">
            <h2 class="title">欢迎注册</h2>
            <div style="height:30px ;"></div>
            <el-form :model="form" :rules="rules" ref="registerForm" label-position="left" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" show-password></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirm">
                    <el-input v-model="form.confirm" show-password></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="submitForm" @keyup.enter="submitForm">注册</el-button>
                    <el-button @click="back">返回</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>

import qs from 'qs';
/* import { timeouts } from 'retry'; */

export default {





    data() {
        return {
            form: {
                username: '',
                email: '',
                password: '',
                confirm: ''
            },
            rules: {
                username: [
                    { required: true, message: '请输入2到6位数的用户名', trigger: 'blur' },
                    { min: 2, message: '用户名长度不能小于两位数', trigger: 'blur' },
                    { max: 6, message: '用户名长度不能大于六位数', trigger: 'blur' },
                    { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '用户名只能包含数字、字母和中文', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入5到11位数的qq邮箱', trigger: 'blur' },
                    { min: 12, message: '邮箱最少位数是5', trigger: 'blur' },
                    { max: 19, message: '请输入11位数以下的邮箱', trigger: 'blur' },
                    { pattern: /^(\w-*\.*)+@qq.com$/, message: '邮箱格式不正确,只能输入QQ邮箱', trigger: 'blur' }

                ],
                password: [
                    { required: true, message: '请输入6位纯数字密码', trigger: 'blur' },
                    { len: 6, message: '密码长度必须为6位', trigger: 'blur' },
                    { pattern: /^[0-9]+$/, message: '密码只能包含数字', trigger: 'blur' }
                ],
                confirm: [
                    { required: true, message: '请再次输入密码', trigger: 'blur' },
                    { validator: this.validatePassword, trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        validatePassword(rule, value, callback) {
            if (value !== this.form.password) {
                callback(new Error('两次输入的密码不一致'))
            } else {
                callback()
            }
        },

        submitForm() {

            this.$refs.registerForm.validate(valid => {
                if (valid) {
                    // 表单验证通过，提交表单
                    this.dialogFormVisible = false
                    const data = this.form;
                    const options = {
                        method: 'POST',
                        data: qs.stringify(data),
                        url: '/register'
                    };
                    this.$axios(options).then(res => {
                        {
                            //注册成功，收到后端的提示信息
                            this.$message.success(res.data.message)
                            setTimeout(() => {
                                this.$router.push('login')
                            }, 2000);

                        }

                    }).catch(err => {
                        if (err.response.status == 422)
                            this.$message.error(err.response.data.errors[0].msg)
                        this.$message.error(err.response.data)



                    })
                }
            })
        },
        back() {
            this.$router.push('/login')
        }
    }
}
</script>
<style lang="scss" scoped>
.kk {
    background-image: url('/public/image.jpg');

    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background-size: cover;
    background-position: center center;
}

.el-button {
    margin-right: 10px;
    margin-top: 20px;
    width: 120px;
    height: 48px;
    background-color: hwb(214 92% 5%/0.389);
    color: red;
    border: none;
}

.container {
    width: 400px;
    margin: 0 auto;
    padding: 30px;
    opacity: 0.9;
    background-color: rgba(255, 255, 255, 0.692);
    border: 1px solid #ccc;
    border-radius: 20px;
    box-shadow: 0 0 30px rgba(227, 8, 103, 0.87);

}

@media(max-width: 768px) {
    .container[data-v-63ae9146] {
        width: 288px;
        margin: 0 auto;
        padding: 30px;
        opacity: 0.9;
        background-color: rgba(255, 255, 255, 0.692);
        border: 1px solid #ccc;
        border-radius: 20px;
        box-shadow: 0 0 30px rgba(227, 8, 103, 0.87);
    }

    .el-button {
        margin-right: 10px;
        margin-top: 20px;
        width: 87px;
        height: 40px;
        background-color: rgba(255, 255, 255, 0.692);
        color: red;
        border: none;
    }

}
</style>