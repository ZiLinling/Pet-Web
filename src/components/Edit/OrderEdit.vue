<template>
    <el-dialog :title="title" :visible="visible" :close-on-click-modal="false" :before-close="handleClose">
        <el-form :model="form" :rules="rules" label-width="100px" ref="form">
            <!-- <el-form-item label="头像">
                <el-upload ref="img" class="avatar-uploader" action="http://localhost:8090/Pet/resource/upload/avatar"
                    :show-file-list="false" :on-change="displayImg" :on-success="handleAvatarSuccess" :auto-upload="false"
                    :before-upload="beforeAvatarUpload">
                    <el-image class="avatar" v-show="this.form.img" :src="getUrl(this.form.img)" fit="cover"></el-image>
                    <i v-show="!this.form.img" class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item> -->
            <!-- <el-form-item label="订单编号" prop="id" v-if="!this.saveOrUpdate">
                <el-input v-model="form.id" autocomplete="off" style="width:30%"  :disabled="true">
                </el-input>
            </el-form-item> -->
            <el-form-item label="用户编号" prop="userId" v-if="!this.saveOrUpdate">
                <el-input v-model="form.userId" autocomplete="off" style="width:40%"></el-input>
            </el-form-item>
            <el-form-item label="收件人姓名" prop="name">
                <el-input v-model="form.name" autocomplete="off" style="width:40%"></el-input>
            </el-form-item>
            <el-form-item label="收件人地址" prop="address" >
                <el-input v-model="form.address" autocomplete="off" style="width:70%"></el-input>
            </el-form-item>
            <el-form-item label="收件人电话" prop="telephone" >
                <el-input v-model="form.telephone" autocomplete="off" style="width:30%"></el-input>
            </el-form-item>
            <el-form-item label="总价" prop="price">
                <el-input v-model="form.price" autocomplete="off" style="width:30%" :disabled="this.saveOrUpdate">
                </el-input>
            </el-form-item>
            <el-form-item label="备注" prop="postscript" >
                <el-input v-model="form.postscript" autocomplete="off" style="width:30%"></el-input>
            </el-form-item>
            
            <!-- <el-form-item label="权限" prop="role">
                <el-select v-model="form.role" placeholder="请选择权限">
                    <el-option v-for="(item, index) in role" :key="index" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="form.status" placeholder="请设置订单状态">
                    <el-option v-for="(item, index) in status" :key="index" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item> -->
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
    name: "UserEdit",
    data() {
        return {
            base_url: base_url,
            form: {},
            imageUrl: null,
            role: [
                { id: 0, name: "会员" },
                { id: 1, name: "管理员" },
            ],
            status: [
                { id: 0, name: "禁用" },
                { id: 1, name: "启用" },
            ],
            picUpdate: false,
            flag: false,
            saveOrUpdate: false, //false= save  true = update
            password: "",
            rules: {
                userId: [
                    { required: true, message: '请填写账号', trigger: 'change' }
                ],
                name: [
                    { required: true, message: '请填写昵称', trigger: 'change' }
                ],
                address: [
                    { required: true, message: '请填写地址', trigger: 'change' }
                ],
                telephone: [
                    { required: true, message: '请填写电话', trigger: 'change' }
                ],
               price: [
                    { required: true, message: '请设置金额', trigger: 'change' }
                ],
            }
        }
    },
    props: {
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
            this.saveOrUpdate = true
            this.imageUrl = this.form.img
        }
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
            this.$refs["form"].validate((valid) => {
                        this.saveUpdate()
                })
        },
        saveUpdate() {
            if (this.saveOrUpdate) {
                postJsonRequest("/order/update", {
                    ...this.form
                }).then(res => {
                    this.flag = true
                    this.$emit("close", this.flag)
                    this.$message.success("更新信息成功")
                }).catch(err => {
                    this.flag = false
                    this.$emit("close", this.flag)
                })
            } else {
                postJsonRequest("/order/generate", {
                    ...this.form
                }).then(res => {
                    this.flag = true
                    this.$emit("close", this.flag)
                    this.$message.success("新增订单成功")
                }).catch((error) => {
                    this.flag = false
                    this.$emit("close", this.flag)
                    this.$message.error("当前账号已存在")
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
</style>