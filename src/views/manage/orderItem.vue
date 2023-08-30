<template>
  <div class="app-container">
    <pageTable @load-table-data="loadTableData" ref="dataTable" row-key="id" @selection-change="selectionChange">
      <template slot="function-button">
        <div style="float:right;display: inline-block;">
          <el-button type="primary" @click="add">新增</el-button>
          <el-button type="warning" @click="delAll">批量删除</el-button>
        </div>
      </template>
      <template slot="tb-columns">
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope">
            <el-image style="width: 100px; height: 100px" :src="getUrl(scope.row.img)" fit="fill"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" width="160" align="center"></el-table-column>
        <el-table-column prop="etc.storeName" label="商店名称" width="160" align="center"></el-table-column>
        <el-table-column prop="num" label="数量" width="180" align="center"></el-table-column>
        <el-table-column prop="price" label="单价" width="180" align="center"></el-table-column>
        <el-table-column prop="etc.status" label="状态" width="180" align="center">
          <template slot-scope="scope">
            {{ orderType[scope.row.etc.status] }}
            <!-- 订单状态
                (1为unpaid:'等待付款'，
                2为back:'等待商家发货'，
                3为unreceived:'商家已发货'，
                4为received:'等待用户评价'，
                5为completed:'交易已完成'，
                6为refunds:'商品退货处理中'，
                7为cancelled:'订单已取消') -->
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button @click="identify(scope.row.id)" v-show="scope.row.etc.status == 5">退换确认</el-button>
            <el-button @click="delive(scope.row.id)" v-show="scope.row.etc.status == 2">发货</el-button>
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
import { delivery,identify } from '@/api/orderItem'
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
      searchData: { orderId: null },
      orderType: ['全部', '待付款', '待发货', '待收货', '待评价', '退换货','已取消'],
    }
  },
  created() {
    //将orderId传进来
    this.searchData.orderId = this.$route.query.orderId
  },
  methods: {
    delive(id) {
      this.$confirm("是否发货?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delivery("/orderItem/delivery", { id: id }).then((response) => {
          console.log(response)
          this.$refs.dataTable.loadTableData("reload")
        })
      }).catch(() => {
      })
    },
    identify(id) {
      this.$confirm("是否确认?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        identify("/orderItem/cancelOrderItem", { ids: id }).then((response) => {
          console.log(response)
          this.$refs.dataTable.loadTableData("reload")
        })
      }).catch(() => {
      })
    },

    getUrl(url) {
      if (url == null) {
        return base_url + "/resource/tool/placeholder.png"
      } else {
        return base_url + url
      }
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
        this.$message.warning("请选择用户")
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
        postRequest("/user/delete", { ids: ids }).then((response) => {
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
      console.log("11", this.searchData);
      getRequest("/orderItem/getList", {
        ...filter,
        ...this.searchData
      }).then((response) => {
        // res = result
        let data = {
          data: [],
        };
        console.log("lenghth", response.data.data.data)
        for (let i = 0; i < response.data.data.data.length; i++) {
          data.data.push(response.data.data.data[i]);
        }
        console.log("11", data)
        callback(data)

      }).catch((error) => {
      })
    }
  },

}
</script>
<style scoped>
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