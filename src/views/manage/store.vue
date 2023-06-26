<template>
  <div class="app-container">
    <pageTable @load-table-data="loadTableData" ref="dataTable" row-key="id" @selection-change="selectionChange">
      <template slot="function-button">
        <div style="float:right;display: inline-block;">
          <el-button type="primary" @click="add">新增</el-button>
          <el-button type="warning" @click="delAll">批量删除</el-button>
        </div>
        <div class="search">
          <div>商店名称<el-input v-model="searchData.key" placeholder="输入商店名称搜索" /></div>
          <el-button icon="el-icon-search" circle @click="search()"></el-button>
        </div>
      </template>
      <template slot="tb-columns">
        <el-table-column label="商店图片" width="120" align="center">
          <template slot-scope="scope">
            <el-image style="width: 100px; height: 100px" :src="getUrl(scope.row.img)" fit="fill"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商店名称" width="160" align="center"></el-table-column>
        <el-table-column prop="telephone" label="联系电话" width="180" align="center"></el-table-column>
        <el-table-column prop="address" label="地址" width="180" align="center"></el-table-column>
        <el-table-column label="状态" width="160" align="center">
          <template slot-scope="scope">
            {{ status[scope.row.status].name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="管理" width="160">
          <template slot-scope="scope">
            <router-link :to="{ name: 'Pet', query: { 'storeId': scope.row.id } }">
              <el-button type="primary">宠物管理</el-button>
            </router-link>
            <router-link :to="{ name: 'Goods', query: { 'storeId': scope.row.id } }">
              <el-button type="danger">周边管理</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
            <el-button type="danger" @click="del(scope.row.id, scope.row.img.substring(directory.length))">删除</el-button>
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
import Edit from '@/components/Edit/StoreEdit'


export default {
  name: "storeManage",
  components: { PageTable, Edit },
  data() {
    return {
      base_url: base_url,
      directory: "/resource/store/",
      title: "新增",
      visible: false,
      defaultObj: {},
      tableData: [],
      status: [
        { id: 0, name: "禁用" },
        { id: 1, name: "启用" },
      ],
      ids: "",
      imgs: "",
      drawer: false,
      searchData: {
        name: "",
      },
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
        this.$message.warning("请选择用户")
      } else {
        this.del(this.ids, this.imgs)
      }
    },
    del(ids, imgs) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        postRequest("/store/delete", { ids: ids }).then((response) => {
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
      getRequest("/store/getList", {
        ...filter,
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
  width: 30%;
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