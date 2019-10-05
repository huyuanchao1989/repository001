<template>
    <div class="wrapper">
        <div class="title">
            <label class="left">
                待处理账号申请记录,共
                <span class="red">{{tableData.length}}</span>条:
            </label>
            <el-input
                class="right input-with-select"
                placeholder="请输入内容"
                v-model="filterInput"
                clearable
                @input="removeFilter"
            >
                <el-select v-model="filterField" slot="prepend" placeholder="搜索字段">
                    <el-option
                        v-for="(item, i ) in tableField"
                        :key="i"
                        :label="item.label"
                        :value="item.field"
                    ></el-option>
                </el-select>
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
        </div>
        <el-table
            ref="table"
            :data="filterData"
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
            <el-table-column :prop="tableField[4].field" :label="tableField[4].label"></el-table-column>
            <el-table-column :prop="tableField[5].field" :label="tableField[5].label"></el-table-column>
            <el-table-column :prop="tableField[6].field" :label="tableField[6].label"></el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="success"
                        @click="handleEdit(scope.$index, scope.row)"
                    >
                        <i class="el-icon-edit"></i>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- dialog -->
        <el-dialog title="编辑" :visible.sync="dialogVisible" width="30%" @closed="clearDialog">
            <span>
                <el-radio v-model="passState" label="1" border>通过</el-radio>
                <el-radio v-model="passState" label="0" border>不通过</el-radio>
                <el-input
                    placeholder="处理情况说明"
                    show-word-limit
                    rows="2"
                    type="textarea"
                    maxlength="20"
                    resize="none"
                    v-model="handleRemarks"
                ></el-input>
            </span>
            <span slot="footer" class="dialog-footer">
                <div class="foot-left">
                    <el-switch
                        v-model="sendMsg"
                        active-color="#13ce66"
                        inactive-color="#d0d0d0"
                        active-text="短信通知客户"
                    ></el-switch>
                </div>
                <div class="foot-right">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submit">确 定</el-button>
                </div>
            </span>
        </el-dialog>
        <!-- dialog -->
    </div>
</template>

<script>
export default {
    data() {
        return {
            tableField: [
                { field: "_id", label: "ID" },
                { field: "nickname", label: "昵称" },
                { field: "phone", label: "手机号" },
                { field: "password", label: "密码" },
                { field: "remarks", label: "申请说明" },
                { field: "registerState", label: "申请状态" },
                { field: "registerTime", label: "申请时间" }
            ],
            tableData: [],
            tableHeight: null, // mounted 时动态调整表格高充
            filterField: "",
            filterInput: "",
            searchText: "", // 按搜索按钮时才把filterInput里的值赋于此变量，不直接使用filterInput以防抖
            dialogVisible: false,
            sendMsg: false,
            passState: "",
            handleRemarks: "",
            handleUid: "", //dialog弹出时将要编辑的用户的Id填入，关闭时清空
            userPhone: "",
            nickName: ""
        };
    },
    methods: {
        handleEdit(index, row) {
            this.handleUid = row._id;
            this.userPhone = row.phone;
            this.nickname = row.nickname;
            this.password = row.password;
            this.dialogVisible = true;
        },
        getPendingRecords() {
            this.$axios
                .get("/api/registerRecords", {
                    params: { type: "pending" }
                })
                .then(res => {
                    this.tableData = res.data;
                });
        },
        search() {
            if (!this.filterField) {
                this.$message({
                    showClose: true,
                    message: "搜索字段未选择",
                    type: "error"
                });
            } else {
                this.searchText = this.filterInput;
            }
        },
        removeFilter() {
            if (!this.filterInput) {
                this.searchText = "";
            }
        },
        clearDialog() {
            this.sendMsg = false;
            this.passState = "";
            this.handleRemarks = "";
            this.handleUid = "";
        },
        submit() {
            this.$axios
                .post("/api/registerHandle", {
                    _id: this.handleUid,
                    userPhone: this.userPhone,
                    nickname: this.nickname,
                    sendMsg: this.sendMsg,
                    registerState: this.passState,
                    handleText: this.handleRemarks,
                    handler: this.$store.state.userInfo.nickname,
                    handlerPhone: this.$store.state.userInfo.phone
                })
                .then(res => {
                    this.dialogVisible = false;
                    this.getPendingRecords();
                    if (res.data.code == "ok") {
                        this.$notify({
                            title: "成功",
                            message: res.data.msg,
                            type: "success"
                        });
                    }else{
                        this.$notify({
                            title: "错误",
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                });
        }
    },
    computed: {
        filterData() {
            if (this.searchText) {
                return this.tableData.filter(item => {
                    return (
                        item[this.filterField].indexOf(this.searchText) !== -1
                    );
                });
            } else {
                return this.tableData;
            }
        }
    },
    created() {
        this.getPendingRecords();
    },
    mounted() {
        this.tableHeight =
            window.innerHeight -
            this.$refs.table.$el.getBoundingClientRect().top -
            30;
    }
};
</script>

<style lang='less' scoped>
.wrapper {
    padding-left: 20px;
}
span.red {
    color: red;
}
div.title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
}
.right {
    width: 35%;
    min-width: 100px;
}
.el-select {
    width: 120px;
}
.el-dialog {
    // span{
    .el-radio {
        margin-bottom: 15px;
    }

    .el-input {
        margin-top: 10px;
    }
    // }
    .dialog-footer {
        display: flex;
        justify-content: space-between;
        .foot-left {
            display: inherit;
            align-items: center;
        }
    }
}
</style>
