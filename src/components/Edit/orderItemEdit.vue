<template>
    <el-dialog :title="title" :visible="visible" :close-on-click-modal="false" :before-close="handleClose">
        <el-form :model="form" :rules="rules" label-width="100px" ref="form">
            <!-- <el-form-item label="ID" prop="id" v-if="!this.saveOrUpdate">
                <el-input v-model="form.id" autocomplete="off" style="width:30%" :disabled="this.saveOrUpdate">
                </el-input>
            </el-form-item> -->
            <el-form-item label="所属订单编号" prop="orderId" >
                <el-input v-model="orderId" autocomplete="off" style="width:30%" :disabled="true">
                </el-input>
            </el-form-item>
            <el-form-item label="物品编号" prop="itemId" v-if="!this.saveOrUpdate">
                <el-input v-model="form.itemId" autocomplete="off" style="width:30%"
                    :disabled="this.saveOrUpdate" placeholder="请在确认商品编号后填写"></el-input>
            </el-form-item>
            <el-form-item label="数量" prop="num">
                <el-input v-model="form.num" autocomplete="off" style="width:30%"></el-input>
            </el-form-item>
            <el-form-item label="商品划分" prop="type">
                <!-- <el-input v-model="form.type" autocomplete="off" style="width:30%"
                    :disabled="this.saveOrUpdate" placeholder="请输入0或者1"></el-input>
                <el-tooltip class="item" effect="dark" placement="right">
                    <div slot="content"   class="content" >
                      <p>0:宠物</p>
                      <p>1:商品</p>
                    </div>
                    <el-button>提示</el-button>
                </el-tooltip> -->
                <el-select v-model="form.gender" placeholder="请选择分类">
                    <el-option :label=item :value=index v-for="(item,index) in classification" :key="index" >
                    </el-option>
                </el-select>

            </el-form-item>
            <el-form-item label="单价" prop="price">
                <el-input v-model="form.price" autocomplete="off" style="width:30%">
                </el-input>
            </el-form-item>
            
            <el-form-item label="订单状态" prop="etc.status" v-if="this.saveOrUpdate">
                <el-select v-model="form.etc.status" placeholder="请选择状态">
                    <el-option :label=item :value=cnt v-for="(item,cnt) in statusText" :key="cnt" >
                    </el-option>
                </el-select>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="save">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { base_url, postJsonRequest, deleteRequest } from '@/api/axios'
import md5 from 'js-md5';
export default {
    name: "orderItemEdit",
    data() {
        return {
            classification: ["宠物", "商品"],
            base_url: base_url,
            form: {},
            imageUrl: null,
            role: [
                { id: 0, name: "会员" },
                { id: 1, name: "管理员" },
            ],
            // status: [
            //     { id: 0, name: "禁用" },
            //     { id: 1, name: "启用" },
            // ],
            picUpdate: false,
            statusText: [
                '等待付款',
                '等待商家发货',
                '商家已发货',
                '等待用户评价',
                '商品退货处理中',
                '交易已完成',
                '订单已取消'
            ],
            flag: false,
            saveOrUpdate: false, //false= save  true = update
            password: "",
            rules: {
                itemId: [
                    { required: true, message: '请填写商品编号', trigger: 'change' }
                ],
                num: [
                    { required: true, message: '请填写数量', trigger: 'change' }
                ],
                type: [
                    { required: true, message: '请填写商品划分', trigger: 'submit' }
                ],
                price: [
                    { required: true, message: '请填写单价', trigger: 'change' }
                ],
            }
        }
    },
    props: {
        orderId: {
            type: String,
        },
        title: {
            type: String,
            default: "新增"
        },
        visible: {
            type: Boolean,
            default: false
        },
        defaultObj: {
            type: Object
        }
    },
    mounted() {

        if (JSON.stringify(this.defaultObj) == "{}") {
            this.saveOrUpdate = false
        } else {
            this.form = JSON.parse(JSON.stringify(this.defaultObj))
            this.form.etc.status -= 1
            this.saveOrUpdate = true
            this.imageUrl = this.form.img
        }
        console.log("saveOrUpdate",  this.saveOrUpdate)
    },
    methods: {
        getUrl(url) {
            if (this.picUpdate) {
                return url
            }
            else if (url == null) {
                return "/"
            } else {
                return base_url + url
            }
        },
        handleAvatarSuccess(res, file) {
            this.form.img = res.data
            deleteRequest(this.imageUrl)
            this.saveUpdate()
        },
        displayImg(file) {
            this.picUpdate = true
            this.form.img = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            let types = ['image/png', 'image/jpeg', 'image/jpg']
            const isImage = types.includes(file.type);
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isImage) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isImage && isLt2M;
        },
        handleClose() {
            this.close()
        },
        close() {
            this.flag = false
            this.$emit("close", this.flag)
        },
        save() {
            console.log("form",this.form)
            this.$refs["form"].validate((valid) => {
                if (valid) {
                        this.saveUpdate()
                }
            })
        },
        saveUpdate() {
            console.log("orderId",this.orderId)
            if (this.saveOrUpdate) {
                postJsonRequest("/orderItem/update", {
                    ...this.form,
                    orderId:this.orderId
                }).then(res => {
                    this.flag = true
                    this.$emit("close", this.flag)
                    this.$message.success("订单信息成功")
                }).catch(err => {
                    this.flag = false
                    this.$emit("close", this.flag)
                })
            } else {
                postJsonRequest("/orderItem/generate", {
                    ...this.form,
                    orderId:this.orderId
                }).then(res => {
                    this.flag = true
                    this.$emit("close", this.flag)
                    this.$message.success("新增订单信息成功")
                }).catch((error) => {
                    this.flag = false
                    this.$emit("close", this.flag)
                    this.$message.error("新增失败")
                })
            }
        }
    }
}
</script>
<style scoped> .avatar-uploader .el-upload {
     border: 1px dashed #d9d9d9;
     border-radius: 6px;
     cursor: pointer;
     position: relative;
     overflow: hidden;
 }

 .avatar-uploader .el-upload:hover {
     border-color: #409EFF;
 }

 .avatar-uploader-icon {
     font-size: 28px;
     color: #8c939d;
     width: 178px;
     height: 178px;
     line-height: 178px;
     text-align: center;
 }

 .avatar {
     width: 178px;
     height: 178px;
 }
 .content{
    width: 50px; 
    font-size: 12px;
     height: 35px;
     margin-top: -17px;
     margin-left: 4px;

 }
</style>