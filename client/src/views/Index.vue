<template>
    <el-container>
        <el-header>
            <app-header></app-header>
        </el-header>
        <el-main>
            <keep-alive>
                <router-view />
            </keep-alive>
        </el-main>
    </el-container>
</template>

<script>
import Header from "../components/Header";
import jwtDecode from "jwt-decode";

export default {
    name: "index",
    data() {
        return {};
    },
    components: {
        "app-header": Header
    },
    methods: {},
    created() {
        this.$store.state.userInfo = jwtDecode(
            localStorage.getItem("gssf_token")
        );
    }
};
</script>

<style lang="less" scoped>
.el-container {
    height: 100%;
    // .el-main{
    //     padding-top:10px;
    // }
}
</style>
