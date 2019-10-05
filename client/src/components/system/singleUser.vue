<template>
    <el-container>
        <el-header>
            <el-button icon="el-icon-d-arrow-left" type="success" @click="backUserList">返回用户列表</el-button>
        </el-header>
        <el-main>
            <el-row id="row1">
                <!-- col1 头像  -->
                <el-col :span="6">
                    <!-- <el-avatar :size="150" src="http://120.77.87.225/avatar/109.jpg"> -->
                    <el-avatar
                        :size="150"
                        fit='contain'
                        src=" "
                    >
                        <!-- <img src="http://120.77.87.225/avatar/109.jpg" @click="editAvatar" /> -->
                    </el-avatar>
                </el-col>
                <!-- col2 -->
                <el-col :span="18">
                    <el-row id="row1-1">
                        <el-col :span="16" id="row1-1-col1">
                            <ul>
                                <li class="nickname">
                                    <el-tooltip :content="genderTip" placement="top-start">
                                        <span class="img-wrapper">
                                            <img :src="gender" />
                                        </span>
                                    </el-tooltip>
                                    {{user.nickname}}
                                </li>
                                <li class="objectId" v-if="isAdmin">
                                    <span class="img-wrapper"></span>
                                    <label class="title">objectId:</label>
                                    <label>{{id}}</label>
                                </li>
                                <li class="phone">
                                    <span class="img-wrapper"></span>
                                    <label class="title">phone:</label>
                                    <label>{{user.phone}}</label>
                                </li>
                                <li class="password">
                                    <span class="img-wrapper" @click="editPassword">
                                        <i class="el-icon-edit"></i>
                                    </span>
                                    <label class="title">password:</label>
                                    <el-tooltip
                                        :content="'加密后密码：'+ user.password"
                                        placement="top-start"
                                    >
                                        <label>{{user.password}}</label>
                                    </el-tooltip>
                                </li>
                            </ul>
                        </el-col>
                        <!-- 点赞和差评 -->
                        <el-col :span="8" class="appraise" id="row1-1-col2">
                            <span class="good">
                                <img src="../../assets/good.svg" alt />
                                {{this.user.good}}
                            </span>
                            <span class="bad">
                                <img src="../../assets/bad.svg" alt />
                                {{this.user.bad}}
                            </span>
                        </el-col>
                    </el-row>
                    <!-- 个人签名 -->
                    <el-row id="row1-2" v-if="!startEditSign">
                        <span class="img-wrapper" @click="editSign">
                            <i class="el-icon-edit"></i>
                        </span>
                        <label>个人签名：{{user.sign}}</label>
                    </el-row>
                    <el-row id="row1-3" v-if="startEditSign">
                        <el-input
                            v-model="user.sign"
                            clearable
                            maxlength="50"
                            show-word-limit
                            size="small"
                            autofocus="true"
                        >
                            <el-button slot="append" icon="el-icon-check" @click="endEditSign"></el-button>
                        </el-input>
                    </el-row>
                </el-col>
            </el-row>
            <el-row id="row2">
                <el-col :xs="4" :sm="3" :md="2" class="title">
                    <label for>个人标签:</label>
                </el-col>
                <el-col :xs="20" :sm="21" :md="22">
                    <el-tooltip
                        v-for="(tag,i) in tags"
                        :key="i"
                        placement="top-start"
                        :disabled="!isAdmin"
                    >
                        <div class="tag-content" slot="content" style="min-width:150px;">
                            <el-row>
                                <el-col :span="6">作者：</el-col>
                                <el-col :span="18">{{tag.markerNickname}}</el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">手机：</el-col>
                                <el-col :span="18">{{tag.markerPhone}}</el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">时间：</el-col>
                                <el-col :span="18">{{tag.time}}</el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">内容：</el-col>
                                <el-col :span="18">{{tag.text}}</el-col>
                            </el-row>
                        </div>
                        <el-tag :color="tag.bgColor" :style="{color:tag.tColor}">{{tag.text}}</el-tag>
                    </el-tooltip>
                </el-col>
            </el-row>
            <el-row id="row3">
                <el-col :xs="4" :sm="3" :md="2" class="title">
                    <label>其它信息：</label>
                </el-col>
                <el-col :xs="20" :sm="21" :md="22">
                    <el-form label-width="80px" :disabled="!rowThreeEdit" size="small">
                        <el-col :xs="12" :sm="8" :lg="6" :xl="4">
                            <el-form-item label="生日">
                                <el-date-picker
                                    style="width:100%"
                                    v-model="user.birthday"
                                    placeholder="选择日期"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="8" :lg="6" :xl="4">
                            <el-form-item label="学历">
                                <el-input v-model="user.education"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="8" :lg="6" :xl="4">
                            <el-form-item label="身高">
                                <el-input v-model="user.height"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="8" :lg="6" :xl="4">
                            <el-form-item label="体重">
                                <el-input v-model="user.weight"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="8" :lg="6" :xl="4">
                            <el-form-item label="性别">
                                <el-select v-model="user.gender" placeholder="请选择">
                                    <el-option label="不详" value="0"></el-option>
                                    <el-option label="男" value="1"></el-option>
                                    <el-option label="女" value="2"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="8" :lg="6" :xl="4">
                            <el-form-item label="邮箱">
                                <el-input v-model="user.email"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :lg="12" :xl="8">
                            <el-form-item label="地址">
                                <el-input v-model="user.address"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form>
                    <div style="text-align:center">
                        <el-button type="danger" @click="otherInfoEdit" v-if="!rowThreeEdit">
                            <i class="el-icon-edit"></i> 开始修改
                        </el-button>
                        <el-button type="success" @click="otherInfoSave" v-if="rowThreeEdit">
                            <i class="el-icon-folder-checked"></i> 保存修改
                        </el-button>
                    </div>
                </el-col>
            </el-row>
            <el-row id="row4">
                <el-col :xs="4" :sm="3" :md="2" class="title">
                    <label>权限分配：</label>
                </el-col>
                <el-col :xs="16" :sm="18" :md="20" id="authories">
                    <el-transfer
                        style="text-align: left; display: inline-block;"
                        v-model="hadAuthories"
                        :render-content="renderFunc"
                        :titles="['可选权限', '已有权限']"
                        :format="{
                                noChecked: '${total}',
                                hasChecked: '${checked}/${total}'
                            }"
                        :data="transferData"
                    ></el-transfer>
                    <el-button type="success" id="saveAuthories" @click="saveAuthories">
                        <i class="el-icon-folder-checked"></i> 保存
                    </el-button>
                </el-col>
            </el-row>
            <el-row id="row5">
                <el-col :xs="4" :sm="3" :md="2" class="title">
                    <label>账号处理：</label>
                </el-col>
                <el-col :xs="16" :sm="18" :md="20" id="authories">
                    <el-row>
                        <!-- <el-col></el-col>
                        <el-col></el-col>-->
                        <el-button type="danger" id="saveAuthories" @click="saveAuthories">
                            <i class="el-icon-warning"></i> 账号冻结
                        </el-button>
                        <el-input label="原因："></el-input>
                    </el-row>

                    <el-button type="danger" id="saveAuthories" @click="saveAuthories">
                        <i class="el-icon-warning"></i> 账号删除
                    </el-button>
                </el-col>
            </el-row>
            <!-- dialog -->
            <el-dialog title="修改头像" :visible.sync="avatarDialogShow">
                <span>这是一段信息</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="avatarDialogShow = false">取 消</el-button>
                    <el-button type="primary" @click="avatarDialogShow = false">确 定</el-button>
                </span>
            </el-dialog>
            <!-- dialog -->
        </el-main>
    </el-container>
</template>
<script>
import path from "path";
export default {
    data() {
        const generateData = _ => {
            const data = [];
            const cities = [
                "上海上海上海上海上海上海上海上海上海",
                "北京",
                "广州",
                "深圳",
                "南京",
                "西安",
                "成都",
                "北京",
                "广州",
                "深圳",
                "南京",
                "西安"
            ];
            cities.forEach((city, index) => {
                data.push({
                    label: city,
                    key: index,
                    explain: "关于权限的说明 ..."
                });
            });
            return data;
        };
        return {
            id: this.$route.params.id, //如果组件外有keep-alive，只获取一次
            user: {},
            tags: [
                {
                    text: "一只小可爱!! ",
                    time: "2018-10-9 16:45",
                    markerNickname: "MrHu",
                    markerPhone: "13839764646",
                    bgColor: "yellow",
                    tColor: "black"
                },
                {
                    text: "大傻X !! ",
                    time: "2018-10-9 16:45",
                    markerNickname: "MrHu",
                    markerPhone: "13839764646",
                    bgColor: "#ccc",
                    tColor: "red"
                }
            ],
            users: {
                avatar: "avatar/109.jpg"
            },
            genderTip: "",
            rowThreeEdit: false,
            startEditSign: false,
            avatarDialogShow: false,
            hadAuthories: [],
            transferData: generateData(),
            renderFunc(h, option) {
                return (
                    <span>
                        <label style="display:inline-block">
                            {option.label}
                        </label>
                        <el-tooltip
                            placement="top-start"
                            effect="light"
                            content={option.explain}
                        >
                            <span style="padding:0;margin-left:10px;">
                                <i class="el-icon-question"></i>
                            </span>
                        </el-tooltip>
                    </span>
                );
            }
        };
    },
    methods: {
        backUserList() {
            this.$router.back(-1);
        },
        searchById(id) {
            this.$axios
                .get("/api/searchUserById", {
                    params: { id: id }
                })
                .then(res => {
                    this.user = res.data.user;
                    // console.log(this.user);
                });
        },
        editAvatar() {
            this.avatarDialogShow = !this.avatarDialogShow;
        },
        errorHandler() {},
        editSign() {
            this.startEditSign = true;
        },
        endEditSign() {
            this.startEditSign = false;
        },
        editPassword() {},
        otherInfoEdit() {
            this.rowThreeEdit = true;
        },
        otherInfoSave() {
            this.rowThreeEdit = false;
        },
        saveAuthories() {
            console.log("R  ", this.hadAuthories);
            console.log("L  ", this.transferData);
        }
    },
    watch: {
        $route(to, from) {
            if (from.path == "/system/usermanage") {
                this.id = to.params.id;
                this.searchById(to.params.id);
            }
        }
    },
    computed: {
        gender() {
            switch (this.user.gender) {
                case "1":
                    this.genderTip = "抠脚大汉";
                    return require("../../assets/male.svg");
                case "2":
                    this.genderTip = "萌妹子、小可爱";
                    return require("../../assets/female.svg");
                default:
                    this.genderTip = "此人性别不详，必是人妖，请速速修改";
                    return require("../../assets/gender.svg");
            }
        },
        isAdmin() {
            // return this.$store.state. === "管理员";
            return true;
        }
    },
    created() {
        this.searchById(this.id);
    }
};
</script>

<style lang="less" scoped>
* {
    list-style: none;
}

.el-container {
    height: 100%;
    background: url("../../assets/singleUserBg.jpg");
    padding-top: 10px;
    .appraise {
        display: flex;
        justify-content: right;
        align-items: center;
        span {
            margin: 20px;
        }
        img {
            width: 30px;
            height: 30px;
        }
    }
    #row1 {
        padding-bottom: 10px;
        border-bottom: 1px solid white;
        .el-avatar:hover {
            cursor: pointer;
        }
        .el-icon-edit {
            color: blue;
        }
        .el-icon-edit:hover {
            cursor: pointer;
        }
        #row1-1 {
            #row1-1-col1 {
                ul {
                    padding: 0;
                    margin: 0px 0px 15px 0px;
                    li {
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        label.title {
                            display: inline-block;
                            width: 100px;
                        }
                    }
                    .nickname {
                        font-weight: bold;
                        font-size: 30px;
                        img {
                            height: 30px;
                            width: 30px;
                        }
                    }
                }
            }
        }
        #row1-2 {
            label {
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
        #row1-3 {
            .el-input {
                .el-button {
                    color: blue;
                    font-size: 20px;
                }
            }
        }
    }
    #row2 {
        margin-top: 15px;
        padding-bottom: 20px;
        // border-bottom: 1px solid white;
        .el-tag {
            margin-left: 15px;
        }
    }
    #row3 {
        margin-top: 15px;
        padding-bottom: 20px;
        border-bottom: 1px solid white;
    }
    #row4 {
        margin-top: 15px;
        padding-bottom: 20px;
        border-bottom: 1px solid white;
        #authories {
            display: flex;
            align-items: flex-end;
            justify-content: center;
            #saveAuthories {
                margin: 20px;
            }
        }
    }
    #row5 {
        margin-top: 15px;
        padding-bottom: 10px;
    }
    span.img-wrapper {
        display: inline-block;
        width: 30px;
    }
}
</style>
