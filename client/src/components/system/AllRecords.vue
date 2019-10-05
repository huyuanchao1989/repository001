<template>
    <div class="wrapper">
        <div class="title">
            <label class="left">
                所有账号申请记录,共
                <span class="red">{{tableData.length}}</span>条:
            </label>
            <div class="between">
                <el-button-group>
                    <el-button @click="getAllRecords">
                        <img src="../../assets/刷新.svg" alt />
                    </el-button>
                    <el-button @click="deleteRows">
                        <img src="../../assets/删除.svg" alt />
                    </el-button>
                </el-button-group>
            </div>
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
            @selection-change="(val)=>{selectRows = val}"
        >
            <el-table-column fixed type="selection"></el-table-column>
            <el-table-column type="index" label="序"></el-table-column>
            <el-table-column
                :prop="tableField[0].field"
                :label="tableField[0].label"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column :prop="tableField[1].field" :label="tableField[1].label"></el-table-column>
            <el-table-column :prop="tableField[2].field" :label="tableField[2].label"></el-table-column>
            <el-table-column
                :prop="tableField[3].field"
                :label="tableField[3].label"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column :prop="tableField[4].field" :label="tableField[4].label"></el-table-column>
            <el-table-column :prop="tableField[5].field" :label="tableField[5].label"></el-table-column>
            <el-table-column :prop="tableField[6].field" :label="tableField[6].label"></el-table-column>
            <el-table-column :prop="tableField[7].field" :label="tableField[7].label"></el-table-column>
            <el-table-column :prop="tableField[8].field" :label="tableField[8].label"></el-table-column>
            <el-table-column :prop="tableField[9].field" :label="tableField[9].label"></el-table-column>
            <el-table-column :prop="tableField[10].field" :label="tableField[10].label"></el-table-column>
        </el-table>
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
                { field: "registerTime", label: "申请时间" },
                { field: "handleText", label: "处理说明" },
                { field: "handler", label: "管理员" },
                { field: "handlerPhone", label: "管理员手机号" },
                { field: "handleTime", label: "处理时间" }
            ],
            tableData: [],
            tableHeight: null, // mounted 时动态调整表格高充
            filterField: "",
            filterInput: "",
            searchText: "", // 按搜索按钮时才把filterInput里的值赋于此变量，不直接使用filterInput以防抖
            selectRows: []
        };
    },
    methods: {
        getAllRecords() {
            this.$axios
                .get("/api/registerRecords", {
                    params: { type: "all" }
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
        deleteRows() {
            let rowsId = this.selectRows.map((item, i) => {
                return item._id;
            });
            this.$axios
                .post("/api/deleteRecords", {
                    rowsId: rowsId
                })
                .then(res => {
                    let num = 0;
                    res.data.msg.forEach((ele, i) => {
                        num += ele.deletedCount;
                    });
                    this.getAllRecords();
                    this.$notify({
                        title: "成功",
                        message: "已成功删除" + num + "条记录！",
                        type: "success"
                    });
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
        this.getAllRecords();
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
    div.between {
        .el-button {
            padding: 3px 20px;
            img {
                width: 24px;
                height: 24px;
            }
        }
    }
    .right {
        width: 35%;
        min-width: 100px;
        .el-select {
            width: 120px;
        }
    }
}
</style>
