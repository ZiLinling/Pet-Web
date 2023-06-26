<template>
    <div class="app-container">
        <pageTable @load-table-data="loadTableData" ref="dataTable" row-key="id" @selection-change="selectionChange">
            <template slot="function-button">
                <div style="float:right;display: inline-block;">
                    <el-button type="primary" @click="add">新增</el-button>
                    <el-button type="warning" @click="delAll">批量删除</el-button>
                </div>
                <div class="search">
                    <div>商品种类
                        <el-select v-model="searchData.category" clearable placeholder="请选择">
                            <el-option v-for="item in category" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div>商品名称<el-input v-model="searchData.name" placeholder="输入商品名称搜索搜索" /></div>
                    <div>
                        商品状态
                        <el-select v-model="searchData.status" clearable placeholder="请选择">
                            <el-option v-for="item in status" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <el-button icon="el-icon-search" circle @click="search()"></el-button>
                </div>
            </template>
            <template slot="tb-columns">
                <el-table-column label="图片" width="120" align="center">
                    <template slot-scope="scope">
                        <el-image style="width: 100px; height: 100px" :src="getUrl(scope.row.img)" fit="fill"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="商品名称" width="160" align="center"></el-table-column>
                <el-table-column label="种类" width="160" align="center">
                    <template slot-scope="scope">
                        {{ category[scope.row.category - 1].name }}
                    </template>
                </el-table-column>
                <el-table-column prop="stock" label="库存" width="120" align="center"></el-table-column>
                <el-table-column prop="price" label="价格" width="140" align="center"></el-table-column>

                <el-table-column label="状态" width="160" align="center">
                    <template slot-scope="scope">
                        {{ status[scope.row.status].name }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
                        <el-button type="danger"
                            @click="del(scope.row.id, scope.row.img ? scope.row.img.substring(directory.length) : scope.row.img)">删除</el-button>
                    </template>
                </el-table-column>
            </template>
        </pageTable>
        <Edit :title=title :visible=visible v-if="visible" :defaultObj=defaultObj @close="close" :storeId=storeId></Edit>
    </div>
</template>
  
<script>
import { getRequest, postJsonRequest, postRequest, base_url, deleteRequest } from '@/api/axios'
import PageTable from '@/components/Edit/PageTable'
import Edit from '@/components/Edit/GoodsEdit'

export default {
    name: "userManage",
    components: { PageTable, Edit },
    data() {
        return {
            storeId: this.$route.query.storeId,
            base_url: base_url,
            title: "新增",
            directory: "/resource/goods/",
            visible: false,
            defaultObj: {},
            tableData: [],
            ids: "",
            imgs: "",
            status: [
                { id: 0, name: "已下架" },
                { id: 1, name: "正在出售" },
                { id: 2, name: "已售空" },
            ],
            category: [
                { id: 1, name: "玩具" },
                { id: 2, name: "保健品" },
                { id: 3, name: "主粮" },
            ],
            searchData: {
                account: "",
                name: "",
            },
            breeds: [],
        }
    },
    methods: {
        getUrl(url) {
            if (url == null) {
                return base_url + "/resource/tool/placeholder.png"
            } else {
                return base_url + url
            }
        },
        search() {
            this.$refs.dataTable.loadTableData('reload')
        },
        selectionChange(selection) {
            var ids = []
            var imgs = []
            for (var item of selection) {
                ids.push(item.id)
                //去除img前面的/resouce/avatar/,保留id存入imgs
                imgs.push(item.img.substring(this.directory.length))
            }
            console.log(imgs)
            this.ids = ids.join(",")
            this.imgs = imgs.join(",")
        },
        add() {
            this.visible = true
            this.title = "新增"
            this.defaultObj = {}
        },
        edit(obj) {
            this.visible = true
            this.title = "编辑"
            this.defaultObj = obj
        },
        delAll() {
            if (this.ids.length == 0) {
                this.$message.warning("请选择商品")
            } else {
                this.del(this.ids, this.imgs)
            }
        },
        del(ids, imgs) {
            console.log(imgs)
            this.$confirm("是否删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                postRequest("/goods/delete", { ids: ids }).then((response) => {
                    deleteRequest(this.directory + imgs)
                    this.$message.success("删除成功")
                    this.$refs.dataTable.loadTableData("reload")
                })
            }).catch(() => {
            })
        },
        close(val) {
            this.visible = false
            if (val) {
                //flush
                this.$refs.dataTable.loadTableData('reload')
            }
        },
        loadTableData(filter, callback) {
            getRequest("/goods/getList", {
                ...filter,
                storeId: this.storeId,
                ...this.searchData
            }).then((response) => {
                // res = result
                let data = {
                    data: response.data.data.records,
                    total: response.data.data.total
                }
                callback(data)
            }).catch((error) => {
            })
        }
    }
}
</script>
<style scoped>
.search>div {
    width: 25%;
    display: inline-block;
    margin-left: 0px;
    font-size: 14px;
}

.search>div>.el-input,
.search>div>.el-select {
    width: 75%;
    margin-left: 10px;
}

.el-header,
.el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
}

.el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
}

.el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
}

body>.el-container {
    margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
    line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
    line-height: 320px;
}

.formItem {
    vertical-align: middle;
}
</style>