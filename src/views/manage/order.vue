<template>
  <div class="app-container">
    <pageTable @load-table-data="loadTableData" ref="dataTable" row-key="id" @selection-change="selectionChange">
      <template slot="function-button">
        <div style="float:right;display: inline-block;">
          <el-button type="primary" @click="add">新增</el-button>
          <el-button type="warning" @click="delAll">批量删除</el-button>
        </div>
        <div class="search">
          <div>账号<el-input v-model="searchData.account" placeholder="输入账号搜索" /></div>
          <div>用户名<el-input v-model="searchData.name" placeholder="输入昵称搜索" /></div>
          <el-button icon="el-icon-search" circle @click="search()"></el-button>
        </div>
      </template>
      <template slot="tb-columns">
        <!-- <el-table-column label="头像" width="120" align="center">
          <template slot-scope="scope">
            <el-image style="width: 100px; height: 100px" :src="getUrl(scope.row.img)"
              fit="fill"></el-image>
          </template>
        </el-table-column> -->
        <el-table-column prop="id" label="ID" width="120" align="center"></el-table-column>
        <el-table-column prop="name" label="收件人姓名" width="160" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" align="center"></el-table-column>
        <el-table-column prop="address" label="地址" width="180" align="center"></el-table-column>
        <el-table-column prop="telephone" label="电话" width="180" align="center"></el-table-column>
        <el-table-column prop="price" label="总价" width="60" align="center"></el-table-column>
        <!-- <el-table-column align="center" label="权限" width="140">
          <template slot-scope="scope">
            {{ role[scope.row.role].name }}
          </template>
        </el-table-column> -->
        <el-table-column prop="postscript" label="备注" width="160" align="center">
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <router-link :to="{ name: 'orderItem', query: { 'orderId': scope.row.id } }">
              <el-button type="default" style="margin-right: 10px;">查看商品详情</el-button>
            </router-link>
            <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
            <el-button type="danger" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </pageTable>
    <Edit :title=title :visible=visible v-if="visible" :defaultObj=defaultObj @close="close"></Edit>
  </div>
</template>

<script>
import { getRequest, postJsonRequest, postRequest, base_url, deleteRequest } from '@/api/axios'
import PageTable from '@/components/Edit/PageTable'
import Edit from '@/components/Edit/OrderEdit'

export default {
  name: "userManage",
  components: { PageTable, Edit },
  data() {
    return {
      base_url: base_url,
      title: "新增",
      directory: "/resource/avatar/",
      visible: false,
      defaultObj: {},
      tableData: [],
      ids: "",
      imgs: "",
      role: [
        { id: 0, name: "会员" },
        { id: 1, name: "管理员" },
      ],
      searchData: {
        account: "",
        name: "",
      },
    }
  },
  methods: {
    getUrl(url) {
      if (url == null) {
        return base_url+"/resource/tool/placeholder.png"
      } else {
        return base_url + url
      }
    },
    search() {
      this.$refs.dataTable.loadTableData('reload')
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
        this.$message.warning("请选择订单")
      } else {
        this.del(this.ids, this.imgs)
      }
    },
    del(ids) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        postRequest("/order/delete", { ids: ids }).then((response) => {
          this.$message.success("删除成功")
          this.$refs.dataTable.loadTableData("reload")
        })
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
      getRequest("/order/getList", {
        ...filter,
        ...this.searchData
      }).then((response) => {
        // res = result
        let data = {
          data: response.data.data.records,
          total: response.data.data.total
        }
        callback(data)
        console.log("data",response.data.data)
      }).catch((error) => {
      })
    }
  }
}
</script>
<style scoped>
.search>div {
  width: 18%;
  display: inline-block;
  margin-left: 20px;
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