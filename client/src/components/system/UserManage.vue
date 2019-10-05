<template>
    <el-container>
        <el-header>
            <el-input
                placeholder="请输入手机号"
                clearable
                v-model="searchInput"
                @change="clearSearchData"
            >
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
        </el-header>

        <el-table
            ref="table"
            :data="effectData"
            fit
            border
            size="mini"
            style="width: 100%"
            highlight-current-row
            :height="tableHeight"
        >
            <el-table-column type="index" label="序"></el-table-column>
            <el-table-column :prop="tableField[0].field" :label="tableField[0].label"></el-table-column>
            <el-table-column :prop="tableField[1].field" :label="tableField[1].label"></el-table-column>
            <el-table-column :prop="tableField[2].field" :label="tableField[2].label"></el-table-column>
            <el-table-column :prop="tableField[3].field" :label="tableField[3].label"></el-table-column>

            <el-table-column label="详细信息">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="success"
                        @click="singleUser(scope.$index, scope.row)"
                    >
                        <i class="el-icon-user"></i>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-footer>
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="pageSizeArr"
                :page-size="pageSize"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper"
            ></el-pagination>
        </el-footer>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            tableField: [
                { field: "nickname", label: "昵称" },
                { field: "phone", label: "手机号" },
                { field: "userGroup", label: "用户组" },
                { field: "currentState", label: "账号状态" }
            ],
            tableData: [],
            searchData: [],
            searchInput: null,
            tableHeight: null, // mounted 时动态调整表格高充
            total: null,
            currentPage: 1,
            pageSize: 10,
            pageSizeArr: [10, 20, 30, 50, 100]
        };
    },
    methods: {
        handleCurrentChange(index) {
            this.currentPage = index;
            this.getUsers();
        },
        handleSizeChange(num) {
            this.pageSize = num;
            this.getUsers();
        },
        getUsersCount() {
            this.$axios.get("/api/getUsersCount").then(res => {
                this.total = res.data.total;
            });
        },
        getUsers() {
            this.$axios
                .get("/api/getUsers", {
                    params: {
                        currentPage: this.currentPage,
                        pageSize: this.pageSize
                    }
                })
                .then(res => {
                    this.tableData = res.data.users;
                });
        },
        search() {
            this.$axios
                .get("/api/searchUser", {
                    params: { phone: this.searchInput }
                })
                .then(res => {
                    this.searchData = [];
                    this.searchData.push(res.data.user);
                });
        },
        clearSearchData() {
            if (!this.searchInput) {
                this.searchData = [];
            }
        },
        singleUser(index, row) {
            this.$router.push("/system/singleuser/" + row._id);
        }
    },
    computed: {
        effectData() {
            return this.searchData.length ? this.searchData : this.tableData;
        }
    },
    created() {
        this.getUsersCount();
        this.getUsers();
    },
    mounted() {
        this.tableHeight =
            window.innerHeight -
            this.$refs.table.$el.getBoundingClientRect().top -
            100;
    }
};
</script>

<style lang='less' scoped>
.el-container {
    padding-left: 20px;
    .el-header {
        display: flex;
        justify-content: center;
        .el-input {
            width: 30%;
        }
    }
    .el-footer {
        display: flex;
        justify-content: center;
        margin-top: 20px;
    }
}
</style>
