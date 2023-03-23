<template>
    <body class="quanju">
        <el-container class="quanju">

            <!--          //首页头部 -->
            <el-header>
                <el-row :gutter="10" style="width: 100%; height: 100%;">

                    <el-col class="el-col_top" :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
                        <div class="grid-content bg-purple">
                            <marquee scrollamount="3">
                                <font color="red"> 基于vue和node的个人网盘系统</font>
                            </marquee>

                        </div>
                    </el-col>
                    <el-col class="el-col_top" :xs="4" :sm="6" :md="8" :lg="9" :xl="11">
                        <div class="grid-content bg-purple">

                        </div>
                    </el-col>
                    <el-col class="el-col_top" :xs="4" :sm="6" :md="8" :lg="9" :xl="11">
                        <div class="grid-content bg-purple"></div>
                    </el-col>
                    <el-col class="el-col_top" :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
                        <div class="grid-content bg-purple-light">
                            <div style=" float: right;">

                                <!--      用户信息 -->
                                <el-button circle @click="showUserInfo" class="fluorescent">{{ userInfo.username
                                }}</el-button>
                                <el-dialog :visible.sync="userInfoDialogVisible" title="用户信息" class="xinxi" width="50vh">
                                    <el-form ref="userInfoForm" :model="userInfo" label-width="80px">
                                        <el-form-item label="用户名">
                                            <el-input v-model="userInfo.username" disabled></el-input>
                                        </el-form-item>
                                        <el-form-item label="邮箱">
                                            <el-input v-model="userInfo.email"></el-input>
                                        </el-form-item>
                                        <el-form-item label="注册时间">
                                            <el-input v-model="userInfo.datetime" disabled></el-input>
                                        </el-form-item>

                                    </el-form>
                                    <div>
                                        <progress-bar :used="this.userInfo.usedSpace"
                                            :total="this.userInfo.totalSpace"></progress-bar>

                                    </div>

                                    <div slot="footer" class="dialog-footer">
                                        <el-button style="padding:10px 5px 10px; color: red;"
                                            @click="loginout">退出登录</el-button>
                                        <el-button style="padding:10px 10px 10px;color: red;"
                                            @click="showPasswordForm">修改密码</el-button>
                                        <el-button style="padding:10px 20px 10px;color: red;"
                                            @click="userInfoDialogVisible = false">取消</el-button>
                                        <el-button style="padding:10px 20px 10px;" type="primary"
                                            @click="updateUserInfo">确定</el-button>
                                    </div>
                                </el-dialog>
                                <el-dialog :visible.sync="passwordDialogVisible" title="修改密码" width="50vh">
                                    <el-form ref="passwordForm" :rules="rules" :model="passwordInfo" label-width="80px">
                                        <el-form-item label="新密码" prop="password">
                                            <el-input v-model="passwordInfo.password" show-password></el-input>
                                        </el-form-item>
                                        <el-form-item label="确认密码" prop="confirmPassword">
                                            <el-input v-model="passwordInfo.confirmPassword" show-password></el-input>
                                        </el-form-item>
                                    </el-form>
                                    <div slot="footer" class="dialog-footer">
                                        <el-button @click="passwordDialogVisible = false">取消</el-button>
                                        <el-button type="primary" @click="updatePassword">确定</el-button>
                                    </div>
                                </el-dialog>

                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-header>

            <!--     //首页左侧导航区域 -->
            <el-aside>
                <!--   //导航菜单 -->
                <el-menu default-active="activeType" @select="handleTypeSelect" style="margin-top: 0 ; overflow: hidden;">

                    <el-menu-item index="all">
                        <i class="el-icon-menu"></i>
                        <span slot="title">全部</span>
                    </el-menu-item>
                    <el-menu-item index="image">
                        <i class="el-icon-picture"></i>
                        <span slot="title">图片</span>
                    </el-menu-item>
                    <el-menu-item index="video">
                        <i class="el-icon-video-camera"></i>
                        <span slot="title">视频</span>
                    </el-menu-item>
                    <el-menu-item index="audio">
                        <i class="el-icon-headset"></i>
                        <span slot="title">音乐</span>
                    </el-menu-item>
                    <el-menu-item index="document">
                        <i class="el-icon-document"></i>
                        <span slot="title">文档</span>
                    </el-menu-item>
                    <el-menu-item index="other">
                        <i class="el-icon-s-order"></i>
                        <span slot="title">其他</span>
                    </el-menu-item>
                </el-menu>

                <div style="height:30px;">

                </div>
                <!--      //上传组件 -->
                <el-upload width:12vw drag action="/api/file/add" :headers="getAuthHeader()" :limit="9"
                    :on-exceed="handleExceed" multiple :before-upload="beforeUpload" :on-success="dealSuccess"
                    :on-error="dealError">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">可以上传任意文件</div>
                </el-upload>

            </el-aside>


            <!--     //首页右侧文件信息 -->
            <el-main>

                <!--     //文件列表 -->
                <el-table :data="tableData" style="width: 88vw     padding: 0;" height=85vh
                    :default-sort="{ prop: 'uploadTime', order: 'descending' }">
                    <el-table-column prop="name" sortable label="文件名">
                        <template slot-scope="scope">
                            <span style="color: red">{{ scope.row.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="size" label="文件大小"></el-table-column>
                    <el-table-column prop="uploadTime" sortable label="上传时间"></el-table-column>
                    <el-table-column prop="type" sortable label="类型">


                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" plain round size="small"
                                @click="downloadFile(scope.row)">下载</el-button>
                            <el-button type="success" plain round size="small" @click="viewFile(scope.row)">查看</el-button>
                            <el-button type="danger" plain round size="small"
                                @click="deleteFile(scope.row, scope.$index)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
        </el-container>


    </body>
</template>

<script>
import ProgressBar from '../components/ProgressBar.vue';

// 对上传文件进行编码处理，防止文件名中包含特殊字符
function encodeFileName(file) {
    const fileName = encodeURIComponent(file.name);
    const newFile = new File([file], fileName, { type: file.type });
    return newFile;
}




export default {



    /* 数据 */
    data() {
        return {
            /* 文件信息处理 */
            files: [], // 所有的文件列表
            activeType: "all", // 当前选中的文件过滤器
            tableData: [],

            // 在线查看功能
            dialogVisible: false,
            fileUrl: '',
            isImage: false,

            /*  用户信息处理 */
            userInfoDialogVisible: false,
            passwordDialogVisible: false,
            userInfo: {
                username: '',
                email: '',
                datetime: '',
                totalSpace: '',
                usedSpace: ''
            },
            passwordInfo: {
                password: '',
                confirmPassword: ''
            },

            // 表单验证规则
            rules: {
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { len: 6, message: '密码长度必须为6位', trigger: 'blur' },
                    { pattern: /^[0-9]+$/, message: '密码只能包含数字', trigger: 'blur' }
                ],
                confirmPassword: [
                    { required: true, message: '请再次输入密码', trigger: 'blur' },
                    { validator: this.validatePassword, trigger: 'blur' }
                ]
            }

        }
    },


    /* 页面初始化 */
    created() {
        // 获取用户信息
        this.$axios.get('/usercx', {}).then(response => {
            this.userInfo = response.data;
            this.allSize = this.userInfo.totalSpace
            this.usedSize = this.userInfo.usedSpace
            console.log(this.userInfo)
        })
    },


    methods: {
        loginout() {
            setTimeout(() => {
                this.$router.push('login')
            }, 1000);
            localStorage.removeItem("token");
        },
        /* 文件信息处理 */
        // 处理选中的文件类型
        handleTypeSelect(type) {
            this.activeType = type;
            this.updateTableData();
        },

        // 更新表格数据
        updateTableData() {
            let filteredFiles = [];
            if (this.activeType === 'all') {
                filteredFiles = this.files;
            } else {
                filteredFiles = this.files.filter(file => file.type === this.activeType);
            }

            // 将文件列表转换为表格数据格式
            this.tableData = filteredFiles.map(file => {
                return {
                    name: file.file_name,
                    size: file.size,
                    uploadTime: file.upload_time,
                    type: file.type
                };
            });
        },
        // 下载文件
        downloadFile(row) {
            const fileName = row.name
            const url = `/file/download?&fileName=${fileName}`;
            this.$axios({
                url: url,
                method: 'get',
                responseType: 'blob'
            }).then(function (response) {
                // 将响应数据下载为文件
                var blob = new Blob([response.data]);
                var a = document.createElement("a");
                a.href = window.URL.createObjectURL(blob);
                a.download = fileName;// 下载文件的文件名
                a.click();
            })

        },

        // 查看文件
        viewFile(row) {
            //如果本地有 获取本地token

            var token = localStorage.getItem("token");
            if (!token)
                var token = sessionStorage.getItem("token")
            var username = this.userInfo.username

            // 构建URL
            var url = "/public/uploads/" + encodeURIComponent(username) + "/" + encodeURIComponent(row.name) + "?token=" + encodeURIComponent(token);

            // 打开URL
            window.open(url);
        },
        // 删除文件
        deleteFile(row, index) {
            const confirmMsg = `确认删除文件[${row.name}]吗？`;
            this.$confirm(confirmMsg, '提示', {
                type: 'warning'
            }).then(() => {
                // 发送请求到API，然后更新this.files和this.tableData数组
                const fileName = row.name
                const url = `/file/delete?&fileName=${fileName}`;
                this.$axios({
                    url: url,
                    method: 'delete',
                    responseType: 'blob'
                }).then(response => {
                    // 文件信息获取
                    this.$axios.get('/file/list').then(res => {
                        this.files = res.data;
                        this.updateTableData();
                    }).catch(err => {
                        this.$message.error(err.response.data)
                    });
                    // 用户信息获取
                    this.$axios.get('/usercx', {}).then(response => {
                        this.userInfo = response.data;
                        this.allSize = this.userInfo.totalSpace
                        this.usedSize = this.userInfo.usedSpace
                    });
                }).catch(error => {
                    console.log(error);
                });
            }).catch(() => {
                // 用户取消删除操作
            });
        },


        /* 用户信息处理 */
        // 打开用户信息表
        showUserInfo() {
            this.userInfoDialogVisible = true
        },

        // 提交用户信息修改，通过 API 调用
        updateUserInfo() {
            this.$axios.post('/usergx', { email: this.userInfo.email }).then(response => {
                // 修改成功，关闭对话框并刷新页面
                this.$message.success('nice~修改邮箱成功')
                this.userInfoDialogVisible = false
            }).catch(error => {
                console.error(error)
                this.$message.success('发生错误，修改失败')
            })
        },

        //打开密码修改页面
        showPasswordForm() {
            this.userInfoDialogVisible = false;
            this.passwordDialogVisible = true;

            // 绑定方法以避免失去Vue实例的访问权限
            this.validatePassword = this.validatePassword.bind(this);

            this.passwordInfo = {
                password: '',
                confirmPassword: ''
            }
        },

        // 确认两次密码输入是否一致
        validatePassword(rule, value, callback) {
            if (value !== this.passwordInfo.password) {
                callback(new Error('两次输入的密码不一致'));
            } else {
                callback();
            }
        },

        // 提交密码修改，通过API调用
        updatePassword() {
            this.$refs.passwordForm.validate(valid => {
                if (valid) {
                    this.$axios.post('/usermimagx', { password: this.passwordInfo.password }).then(response => {
                        // 修改成功，跳转到登录页面
                        setTimeout(() => {
                            this.$router.push('login')
                        }, 1000);
                        this.$message.success('nice~修改密码成功')
                    }).catch(error => {
                        console.error(error)
                        this.$message.success('发生错误，修改失败')
                    })
                } else {
                    // 显示错误信息
                    this.$message.error('请重新输入')
                }
            });
        },


        // 文件上传处理

        // 处理文件名编码和文件类型
        beforeUpload(file) {
            this.uploadFile = encodeFileName(file);
        },

        // 处理同时上传文件数量的限制
        handleExceed(files) {
            this.$message.warning(`最多同时上传 8 个文件，本次选择了 ${files.length} 个文件`);
        },

        // 上传成功处理
        dealSuccess() {
            this.$message.success('上传文件成功!')

            // 文件信息获取
            this.$axios.get('/file/list').then(res => {
                this.files = res.data;
                this.updateTableData();
            }).catch(err => {
                this.$message.error(err.response.data)
            });

            // 用户信息获取
            this.$axios.get('/usercx', {}).then(response => {
                this.userInfo = response.data;
                this.allSize = this.userInfo.totalSpace
                this.usedSize = this.userInfo.usedSpace
                console.log(this.userInfo)
            })

        },

        // 上传失败处理
        dealError() {
            this.$message.error('上传失败，文件已存在或服务器发生故障')
        }

    },


    computed: {

        // 显示文件列表
        filteredFiles() {
            if (this.activeType === "all") {
                return this.files;
            } else {
                return this.files.filter((file) => file.type === this.activeType);
            }
        },
    },


    components: {
        ProgressBar
    },
    //生命周期钩子
    mounted() {
        // 文件信息获取
        this.$axios.get('/file/list').then(res => {
            this.files = res.data;
            this.updateTableData();
        }).catch(err => {
            this.$message.error('登录信息错误，请先登录');


            setTimeout(() => {
                this.$router.push("/login");
            }, 1000);
        });
    }
}



</script>

<style lang="scss" scoped>
//窗口
.quanju {
    background-image: url('/public/image.jpg');

    height: 100vh;
    width: 100vw;
    background-size: cover;
    background-position: center center;
}

/* 头部布局 */
.el-col_top {
    border-radius: 4px;
    height: 100%;
}


.bg-purple1 {
    background: rgba(0, 0, 0, 0);
    ;
    height: 100%;
}

.bg-purple-light {
    background: rgba(0, 0, 0, 0);
    ;
    right: 0;
    height: 100%;
}

//头像颜色
.fluorescent {

    box-shadow: 0 0 30px rgba(255, 0, 8, 0.895);

    background-color: #00ffaec0;


}


.el-header {

    position: relative;
    background-color: rgba(7, 205, 240, 0.462);
    color: #333;
    width: 100%;

    text-align: center;
    line-height: 60px;
}

//用户信息

/deep/ .el-dialog {
    position: relative;
    margin: 0 auto 3.125vw;
    background: #a5e3eedc;
    border-radius: 20px;
    box-shadow: 0 0 30px rgba(227, 8, 8, 0.87);
    box-sizing: border-box;

}

/deep/.el-input__inner {

    background-color: #f5f7fa;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    box-sizing: border-box;
    color: #f20b0b;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    outline: 0;
    padding: 0 15px;
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    width: 100%;
}

/deep/ .el-input.is-disabled .el-input__inner {
    background-color: #f5f7fac9;
    border-color: #e4e7ed00;
    color: #d555bd;
    cursor: not-allowed;
}

//左侧布局
.el-aside {
    width: 12vw !important;
    position: absolute;
    display: block;
    left: 0;

    bottom: 0;
    opacity: 0.8;
    background-color: #fff;
    top: 60px;

    color: rgba(0, 0, 0, 0)
}

/deep/ .el-upload-dragger {
    background-color: #fff;
    border: 1px dashed #0ded31;
    border-radius: 6px;
    box-sizing: border-box;
    width: 12vw;
    height: 180px;
    text-align: center;
    cursor: pointer;
    overflow: hidden;
}

.el-upload-dragger .el-icon-upload {
    font-size: 67px;
    color: #6dd8cb;
    margin: 40px 0 16px;
    line-height: 50px;
}

///右侧布局
.el-main {
    width: 88vw;
    position: absolute;

    padding: 0;
    left: 12vw;
    background-color: #fff;
    opacity: 0.8;
    top: 60px;
    bottom: 0;
    overflow-y: hidden;

}



/deep/ .el-table .el-table__body,
.el-table__footer,
.el-table__header {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    flex: 1;
    width: 88vw !important;

    font-size: 10px !important;
    color: #606266;
}



//移动端布局
@media (max-width: 768px) {

    /deep/ .el-dialog {
        position: relative;
        margin: 0 auto 3.125vw;
        background: #a5e3eedc;

        /* width: 52vh; */
        border-radius: 20px;
        box-shadow: 0 0 30px rgba(227, 8, 8, 0.87);
        box-sizing: border-box;
    }
}

@media (max-width: 768px) {

    /deep/ .el-dialog {
        position: relative;
        margin: 0 auto 3.125vw;
        background: #a5e3eedc;

        width: 52vh;
        border-radius: 20px;
        box-shadow: 0 0 30px rgba(227, 8, 8, 0.87);
        box-sizing: border-box;
    }

    .el-table {
        width: 88vw;
        font-size: 10px;
        ;
    }

    /deep/ .el-upload-dragger {
        background-color: #fff;
        border: 1px dashed #0ded31;
        border-radius: 6px;
        box-sizing: border-box;
        width: 12vw;
        height: 130px;
        text-align: center;
        cursor: pointer;
        overflow: hidden;
    }

    .el-upload-dragger .el-icon-upload {
        font-size: 43px;
        color: #38c8afbf;
        margin: 18px 0 21px;
        line-height: 0px;

    }

    .el-upload {
        width: 50px !important;

    }



    .el-table .el-table__cell {
        padding: 0px 0px 20px 0px; //上右下左
        min-width: 0;
        box-sizing: border-box;
        text-overflow: ellipsis;
        vertical-align: middle;
        position: relative;
        text-align: left;

    }


    /deep/ .el-upload {
        width: 12vw;
        height: 135px;
        font-size: 7px !important;
    }



    /deep/ .tbody {
        width: 300px;
    }

    /deep/ .upload-text {
        font-size: 5px !important;
    }

    .el-upload-dragger .el-upload__text {
        color: #606266;
        font-size: 12px;
        text-align: center;
    }

    .el-button--small.is-round {
        padding: 0px 20px;
        float: left;
        margin: 3px;
        font-size: 3px;
        border-radius: 3px;
    }

    /deep/ .el-table-row {
        padding: 0;
        width: 300px;
    }

    /deep/.el-table .cell {
        box-sizing: border-box;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        word-break: break-all;
        line-height: 13px;
        padding-left: 10px;
        padding-right: 10px;


    }

    /deep/ .el-table .el-table__cell {
        padding-top: 6px;
        padding-right: 0px;
        padding-bottom: 6px;
        padding-left: 0px;
        padding-top: 12px;
        padding-right: 0px;
        padding-bottom: 6px;
        padding-left: 0px;
        min-width: 0;
        box-sizing: border-box;
        text-overflow: ellipsis;
        vertical-align: middle;
        position: relative;
        text-align: left;
    }


}
</style>


.