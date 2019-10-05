<template>
    <div class="wrapper">
        <div class="left">
            <el-menu
                :default-active="activeIndex"
                class="el-menu-demo"
                mode="horizontal"
                background-color="#2C3E50"
                text-color="#d4237a"
                active-text-color="white"
                router
            >
                <el-menu-item index="/index/service">
                    <img src="../assets/serve_o.svg" alt />
                    业务单
                </el-menu-item>
                <el-menu-item index="/index/materials">
                    <img src="../assets/mater_m.svg" alt />
                    物料管理
                </el-menu-item>
                <el-menu-item index="/index/familyguest">
                    <img src="../assets/famGui_o.svg" alt />
                    家客工单
                </el-menu-item>
                <el-menu-item index="/index/files">
                    <img src="../assets/files_m.svg" alt />
                    文件区
                </el-menu-item>
                <el-menu-item index="/index/system">
                    <img src="../assets/sys_m.svg" alt />
                    系统维护
                </el-menu-item>
            </el-menu>
        </div>
        <div class="right">
            <div class="right-item">
                <el-badge class="item">
                    <el-avatar :size="40" :src="avatarUrl"></el-avatar>
                </el-badge>
            </div>

            <div class="right-item">
                <el-badge value="12" class="item">
                    <img src="../assets/email_red.svg" alt />
                </el-badge>
            </div>

            <div class="right-item">
                <el-badge value="12" class="item">
                    <img src="../assets/chat_red.svg" alt />
                </el-badge>
            </div>

            <div class="right-item" @click='loginOut'>
                <el-badge class="item">
                    <img src="../assets/out.svg" alt />
                </el-badge>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            activeIndex: "/index/service",
            avatarUrl:
                "https://www.moxing.ws/template/color_free222/images/logo.png"
        };
    },
    methods:{
        loginOut(){
            localStorage.removeItem('gssf-token');
            this.$router.push('/');
        }
    }
};
</script>

<style lang='less' scoped>
.wrapper {
    display: flex;
    justify-content: space-between;
    background-color: #2c3e50;
    .left {
        .el-menu {
            border-bottom: 0;
            .el-menu-item {
                img {
                    height: 20px;
                    width: 20px;
                }
            }
        }
    }
    .right {
        .right-item {
            cursor: pointer;
            display: inline-block;
            margin-top: 10px;
            margin-right: 15px;
            img {
                height: 40px;
                width: 40px;
            }
        }
    }
}
</style>
