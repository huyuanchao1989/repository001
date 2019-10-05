<template>
    <div class="wrapper">
        <el-row>
            <el-col :span="4">
                <el-menu
                    default-active="system/records"
                    class="el-menu-vertical-demo"
                    router
                    unique-opened
                >
                    <el-submenu index="/system/records">
                        <template slot="title">
                            <i class="el-icon-document"></i>
                            <span>申请记录</span>
                        </template>
                        <el-menu-item class="child-item" index="/system/pendingrecords">待处理申请</el-menu-item>
                        <el-menu-item class="child-item" index="/system/allrecords">所有申请</el-menu-item>
                    </el-submenu>

                    <el-submenu index="/system/users">
                        <template slot="title">
                            <i class="el-icon-user"></i>
                            <span>用户管理</span>
                        </template>
                        <el-menu-item class="child-item" index="/system/usermanage">用户列表</el-menu-item>
                    </el-submenu>

                    <el-submenu index="/system/foots">
                        <template slot="title">
                            <i class="el-icon-bicycle"></i>
                            <span>用户足迹</span>
                        </template>
                        <el-menu-item class="child-item" index="/system/userfootmark">1</el-menu-item>
                    </el-submenu>

                    <el-submenu index="/system/server">
                        <template slot="title">
                            <i class="el-icon-monitor"></i>
                            <span>服务器信息</span>
                        </template>
                        <el-menu-item class="child-item" index="/system/serverinfo">1</el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-col>
            <el-col :span="20">
                <keep-alive>
                    <router-view />
                </keep-alive>
            </el-col>
        </el-row>
    </div>
</template>


<style scoped lang='less'>
.child-item {
    color: blue;
    font-style: italic;
    text-decoration: underline;
}
.wrapper,
.el-row,
.el-col,
.el-menu {
    height: 100%;
}
.el-submenu {
    margin: 15px 15px 15px 0;
    // box-shadow: -1px 1px 2px 1px #ccc;
    // border-bottom: 1px solid #ccc;
    border-bottom:1px solid #ccc;
    border-left: 1px solid #ccc;
}
</style>
