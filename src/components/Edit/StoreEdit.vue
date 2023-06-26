<template>
    <el-dialog :title="title" :visible="visible" :close-on-click-modal="false" :before-close="handleClose">
        <el-form :model="form" :rules="rules" label-width="100px" ref="form">
            <el-form-item label="商店图片">
                <el-upload ref="img" class="avatar-uploader" action="http://localhost:8090/Pet/resource/upload/store"
                    :show-file-list="false" :on-change="displayImg" :on-success="handleAvatarSuccess" :auto-upload="false"
                    :before-upload="beforeAvatarUpload">
                    <el-image class="avatar" v-show="this.form.img" :src="getUrl(this.form.img)" fit="cover"></el-image>
                    <i v-show="!this.form.img" class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="商店名称" prop="name">
                <el-input v-model="form.name" autocomplete="off" style="width:40%"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="telephone">
                <el-input v-model="form.telephone" autocomplete="off" style="width:30%"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="address">
                <Map @locationSure="locationSure" :address="this.form.address"></Map>
            </el-form-item>

            <el-form-item label="状态">
                <el-select v-model="form.status" placeholder="请设置商店状态">
                    <el-option v-for="(item, index) in status" :key="index" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="介绍">
                <el-input v-model="form.description" autocomplete="off" type="textarea"
                    :autosize="{ minRows: 4, maxRows: 6 }" style="width:80%">
                </el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="save">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { base_url, postJsonRequest, deleteRequest, getRequest } from '@/api/axios'
import Map from '@/components/Map/map'

export default {
    name: "UserEdit",
    components: { Map },
    data() {
        return {
            base_url: base_url,
            form: {},
            imageUrl: null,
            picUpdate: false,
            flag: false,
            status: [
                { id: 0, name: "禁用" },
                { id: 1, name: "启用" },
            ],
            saveOrUpdate: false, //false= save  true = update
            rules: {
                name: [
                    { required: true, message: '请填写商店名称', trigger: 'change' }
                ],
                telephone: [
                    { required: true, message: '请填写联系电话', trigger: 'change' }
                ],
                address: [
                    { required: true, message: '请填写地址', trigger: 'change' }
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
        locationSure(val) {
            this.form.address = val.locationName
            this.form.longitude = val.longitude
            this.form.latitude = val.latitude
        },
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
                if (this.imageUrl != this.form.img) {
                    this.$refs["img"].submit()
                }
                else {
                    this.saveUpdate()
                }
            })
        },
        saveUpdate() {
            if (this.saveOrUpdate) {
                postJsonRequest("/store/update", {
                    ...this.form
                }).then(res => {
                    this.flag = true
                    this.$emit("close", this.flag)
                    this.$message.success("更新商店信息成功")
                }).catch(err => {
                    this.flag = false
                    this.$emit("close", this.flag)
                })
            } else {
                postJsonRequest("/store/add", {
                    ...this.form
                }).then(res => {
                    this.flag = true
                    this.$emit("close", this.flag)
                    this.$message.success("新增商店成功")
                }).catch((error) => {
                    console.log(error)
                    this.flag = false
                    this.$emit("close", this.flag)
                    this.$message.error("当前商店已存在")
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