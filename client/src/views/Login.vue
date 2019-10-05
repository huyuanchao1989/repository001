<template>
    <div class="wrapper">
        <el-container>
            <el-main>
                <el-form>
                    <el-form-item id="title">
                        <h2>GSSF WEB</h2>
                    </el-form-item>

                    <label id="error">{{error}}</label>

                    <el-form-item id="phone">
                        <el-input
                            clearable
                            v-model="phone"
                            placeholder="手机号"
                            @input="clearErr"
                            @change="storePhone"
                        ></el-input>
                    </el-form-item>

                    <el-form-item id="password">
                        <el-input
                            v-model="password"
                            placeholder="密码"
                            clearable
                            type="password"
                            show-password
                            @input="clearErr"
                        ></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-switch
                            v-model="isDefer"
                            inactive-color="rgb(161, 153, 153)"
                            active-text="6h免登陆"
                        ></el-switch>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" class="login-button" @click.prevent="login">登陆</el-button>
                    </el-form-item>

                    <el-form-item id="other">
                        <router-link to="/register" tag="a">注册</router-link>&nbsp;|
                        <a href @click.prevent="dialogVisiable = true">忘记密码</a>
                    </el-form-item>
                </el-form>

                <el-dialog title :visible.sync="dialogVisiable" width="30%" center>
                    <span>将发送临时密码，请注意查看，临时密码可以使用6个小时，然后将失效，请在失效前在系统的个人信息菜单重设密码。一个月内只可以使用两次临时密码</span>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="info" @click="dialogVisiable = false">取 消</el-button>
                        <el-button type="primary" @click="dialogVisiable = false">发 送</el-button>
                    </span>
                </el-dialog>
            </el-main>
            <el-footer>Copyright (C) 河南畅联通信技术有限公司 ；Author：MrHu</el-footer>
        </el-container>
    </div>
</template>

<script>
import jwtDecode from 'jwt-decode'
export default {
    name: "Login",
    data() {
        return {
            phone: "",
            password: "",
            error: "",
            dialogVisiable: false,
            isDefer:false   //是否延期
        };
    },
    methods: {
        login() {
            if (!this.phone) {
                this.error = "请输入手机号";
                return;
            } else if (!this.password) {
                this.error = "请输入密码";
                return;
            }
            this.$axios
                .get("/api/login", {
                    params: {
                        phone: this.phone,
                        password: this.password,
                        isDefer:this.ifDefer
                    }
                })
                .then(res => {
                    let code = res.data.code;
                    if (code === "0") {
                        this.error = res.data.msg;
                    } else if (code === "1") {
                        localStorage.setItem("gssf_token", res.data.token);
                        this.$store.state.userInfo = jwtDecode(res.data.token);
                        this.$router.replace("/index");
                    }
                });
        },
        clearErr() {
            if (this.error) {
                this.error = "";
            }
        },
        storePhone() {   // 存储手机号，便于登陆时省去填写的麻烦
            localStorage.setItem("gssf_phone", this.phone);
        }
    },
    created() {
        this.phone = localStorage.getItem("gssf_phone");
        $(window).on("keypress", e => {
            if (e.keyCode === 13) {
                this.login();
                $(window).off("keypress");
            }
        });
    }
};
</script>
<style lang="less" scoped>
* {
    -moz-user-select: none;
    -o-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.wrapper {
    width: 100%;
    height: 100%;
    background-image: url("../assets/login_bg.png");
    background-size: cover;
    .el-container {
        width: 100%;
        height: 100%;
        .el-main {
            display: flex;
            justify-content: center;
            align-items: center;
            .el-form {
                width: 300px;
                background-color: #ececec;
                padding: 20px 20px 0px 20px;
                border-radius: 5px;
                opacity: 0.9;
                .el-form-item {
                    margin-bottom: 10px;
                    h2 {
                        margin: 0;
                    }
                }
                #error {
                    color: red;
                    font-size: 12px;
                    width: 100%;
                    margin: 0 0 0 5px;
                }
                #title {
                    font-family: cursive;
                    text-align: center;
                    color: #409eff;
                    margin: 0;
                }
                #other {
                    text-align: center;
                }
                .el-button {
                    width: 100%;
                }
            }
        }
        .el-footer {
            color: #409eff;
            text-align: center;
        }
    }
}
</style>
