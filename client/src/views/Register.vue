<template>
    <div class="wrapper">
        <el-container>
            <el-header>
                <div>
                    <h2>账号申请</h2>
                </div>
                <div>
                    <router-link to="/login" tag="a">返回登陆</router-link>
                </div>
            </el-header>
            <el-main>
                <el-form
                    label-width="auto"
                    ref="ruleForm"
                    size="small"
                    :model="ruleForm"
                    status-icon
                    :rules="rules"
                >
                    <!-- el-form-item ************************ -->
                    <el-form-item id="nickname" label="昵称" prop="nickname">
                        <el-popover
                            placement="right"
                            width="100"
                            trigger="focus"
                            :content="tips.nickname"
                        >
                            <el-input
                                clearable
                                v-model="ruleForm.nickname"
                                placeholder="nickname"
                                slot="reference"
                                autocomplete="off"
                            ></el-input>
                        </el-popover>
                    </el-form-item>

                    <el-form-item id="phone" label="手机号" prop="phone">
                        <el-popover
                            placement="right"
                            width="100"
                            trigger="focus"
                            :content="tips.phone"
                        >
                            <el-input
                                clearable
                                v-model.number="ruleForm.phone"
                                placeholder="phone"
                                slot="reference"
                            ></el-input>
                        </el-popover>
                    </el-form-item>

                    <el-form-item id="password" label="密码" prop="password">
                        <el-popover
                            placement="right"
                            width="100"
                            trigger="focus"
                            :content="tips.password"
                        >
                            <el-input
                                clearable
                                v-model="ruleForm.password"
                                placeholder="password"
                                slot="reference"
                            ></el-input>
                        </el-popover>
                    </el-form-item>

                    <el-form-item id="remark" label="备注" prop="remark">
                        <el-popover
                            placement="right"
                            width="100"
                            trigger="focus"
                            :content="tips.remark"
                        >
                            <el-input
                                show-word-limit
                                rows="3"
                                type="textarea"
                                maxlength="100"
                                resize="none"
                                v-model="ruleForm.remark"
                                placeholder="remark"
                                slot="reference"
                            ></el-input>
                        </el-popover>
                    </el-form-item>

                    <el-form-item id="verify" label="验证码" prop="verify">
                        <el-input v-model="ruleForm.verify" placeholder="verify" clearable>
                            <el-button
                                slot="append"
                                type="info"
                                id="verify-btn"
                                :disabled="verify.disabled"
                                @click="sendSms"
                            >{{verify.btnLabel}}</el-button>
                        </el-input>
                    </el-form-item>

                    <el-form-item id="submit">
                        <el-button type="primary" @click="submitForm">提 交</el-button>
                    </el-form-item>
                    <!-- el-form-item ************************ -->
                </el-form>
            </el-main>
        </el-container>
    </div>
</template>

 <script>
export default {
    name: "register",
    data() {
        var checkNickname = (rule, val, cb) => {
            if (!val) {
                return cb(new Error("昵称不能为空"));
            } else if (val.length < 2) {
                return cb(new Error("昵称过短"));
            } else if (val.length > 15) {
                return cb(new Error("昵称过长"));
            }
            cb();
        };
        var checkPhone = (rule, val, cb) => {
            var oReg = /^[1][3,4,5,7,8][0-9]{9}$/;
            if (!val) {
                return cb(new Error("手机号不能为空"));
            } else if (!oReg.test(val)) {
                return cb(new Error("请输入正确的手机号！"));
            } else {
                this.$axios
                    .get("/api/register/phone", {
                        params: { phone: val }
                    })
                    .then(res => {
                        var code = res.data.code;
                        var msg = res.data.msg;
                        if (code == "1") {
                            return cb(new Error(msg));
                        } else if (code == "0") {
                            cb();
                        } else {
                            return cb(new Error("unknow error"));
                        }
                    });
            }
        };
        var checkPassword = (rule, val, cb) => {
            if (!val) {
                return cb(new Error("密码不能为空！"));
            } else {
                if (!/^[\s\S]{6,16}$/g.test(val)) {
                    return cb(
                        new Error("密码长度必须大于等于6位且小于等于15位！")
                    );
                } else if (!/[A-Za-z]+/g.test(val)) {
                    return cb(new Error("您设置的密码没有包含字母！"));
                } else if (!/[\d]+/g.test(val)) {
                    return cb(new Error("您设置的密码没有包含数字！"));
                } else if (!/[!@#$\.]+/g.test(val)) {
                    return cb(
                        new Error("您设置的密码必须包含提示中的特殊符号")
                    );
                } else {
                    cb();
                }
            }
        };
        var checkVerify = (rule, val, cb) => {
            if (!val) {
                return cb(new Error("短信验证码不能为空！"));
            } else {
                this.$axios
                    .get("/api/register/verify", {
                        params: {
                            sendTime: new Date().getTime(),
                            verifyCode: this.ruleForm.verify,
                            relativePhone: this.verify.relativePhone
                        }
                    })
                    .then(res => {
                        if (res.data.code == "error") {
                            return cb(new Error(res.data.msg));
                        } else {
                            cb();
                        }
                    });
            }
        };
        return {
            tips: {
                nickname: "请取个可爱又帅气的昵称，2~15个字符",
                phone: "请使用有效的手机号，该号码将作为登陆号码使用",
                password:
                    "6~20个字符，且必须包含字母、数字和以下指定的特殊符号中的一种或多种 $ ! @ . # ",
                remark:
                    "最多100个字符，请备注下个人信息，以便管理员通过您的账号申请"
            },
            ruleForm: {
                nickname: "",
                phone: "",
                password: "",
                remark: "",
                verify: ""
            },
            rules: {
                nickname: [
                    {
                        validator: checkNickname,
                        trigger: "blur",
                        required: true
                    }
                ],
                phone: [
                    { validator: checkPhone, trigger: "blur", required: true }
                ],
                password: [
                    {
                        validator: checkPassword,
                        trigger: "blur",
                        required: true
                    }
                ],
                verify: [
                    { validator: checkVerify, trigger: "blur", required: true }
                ]
            },
            verify: {
                btnLabel: "发送短信",
                disabled: false,
                relativePhone: "",
                sendTime: null, //单位毫秒
                sendState: null,
                effectiveTime: 120 * 1000 //有效时间2分钟，单位毫秒
            }
        };
    },
    methods: {
        submitForm() {
            this.$refs["ruleForm"].validate(valid => {
                if (valid) {
                    this.$axios
                        .post("api/register", this.ruleForm)
                        .then(res => {
                            if (res.data.code === "1") {
                                this.$message({
                                    message:
                                        "提交成功，正在等待管理审核 ！如急需通过请联系13839764646 。",
                                    type: "success",
                                    showClose: true,
                                    duration: 0
                                });
                            }
                        });
                } else {
                    return false;
                }
            });
        },
        sendSms() {
            if (!this.ruleForm.phone) {
                this.$message({
                    showClose: true,
                    message: "请输入正确的手机号！",
                    type: "error"
                });
                return;
            }

            this.$axios
                .get("/api/register/sendVerify", {
                    params: { phone: this.ruleForm.phone }
                })
                .then(res => {
                    let code = res.data.code;
                    this.verify.sendState = code == "ok" ? 1 : 0;
                    if (code == "error") {
                        this.$message({
                            showClose: true,
                            message: res.data.msg.data.Message,
                            type: "error"
                        });
                    } else if (code == "ok") {
                        this.$message({
                            showClose: true,
                            message: "短信已发送成功！请注意查收！",
                            type: "success"
                        });
                    }
                    this.countDown();
                });
        },
        countDown() {
            //从服务器session获取倒计时
            this.$axios.get("/api/register/getVerifyTime").then(res => {
                if (res.data.code !== "null") {
                    this.verify.relativePhone = res.data.phone;
                    this.verify.sendTime = res.data.createTime;
                }
            });
        }
    },
    computed: {
        sendTime() {
            return this.verify.sendTime;
        }
    },
    watch: {
        sendTime(val) {
            //获取 过期时间 与现在的差额
            let differ = parseInt(
                (val + this.verify.effectiveTime - new Date().getTime()) / 1000
            );
            if (differ > 0) {
                this.verify.disabled = true;
                let timer = setInterval(() => {
                    differ--;
                    if (differ <= 0) {
                        clearInterval(timer);
                        this.verify.btnLabel = "发送短信";
                        this.verify.disabled = false;
                        return;
                    }
                    this.verify.btnLabel = differ + "秒";
                }, 1000);
            }
        }
    },
    created() {
        this.countDown();
    }
};
</script>

<style lang="less" scoped>
* {
    text-decoration: none;
    -moz-user-select: none;
    -o-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.wrapper {
    color: white;
    width: 100%;
    height: 100%;
    background-image: url("../assets/register_bg.png");
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .el-container {
        flex-basis: 400px;
        flex-grow: 0;
        background-color: #ececec;
        opacity: 0.9;
        border-radius: 10px;
        .el-header {
            display: inherit;
            justify-content: space-between;
            align-items: flex-end;
            border-bottom: 1px solid #409eff;
            div {
                margin-bottom: 5px;
            }
            h2 {
                display: inline-block;
                margin: 0;
                color: #409eff;
            }
            a {
                color: #409eff;
            }
        }
        .el-main {
            .el-form {
                #verify {
                    #verify-btn {
                        color: #409eff;
                        width: 100px;
                    }
                }
                #submit {
                    .el-button {
                        width: 100%;
                        font-weight: bold;
                    }
                }
            }
        }
    }
}
</style>

