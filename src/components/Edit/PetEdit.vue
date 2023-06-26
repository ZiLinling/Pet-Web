<template>
    <el-dialog :title="title" :visible="visible" :close-on-click-modal="false" :before-close="handleClose">
        <el-form :model="form" :rules="rules" label-width="100px" ref="form">
            <el-form-item label="照片">
                <el-upload ref="img" class="avatar-uploader" action="http://localhost:8090/Pet/resource/upload/pet"
                    :show-file-list="false" :on-change="displayImg" :on-success="handleAvatarSuccess" :auto-upload="false"
                    :before-upload="beforeAvatarUpload">
                    <el-image class="avatar" v-show="this.form.img" :src="getUrl(this.form.img, 'avatar')"
                        fit="cover"></el-image>
                    <i v-show="!this.form.img" class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="视频">
                <el-upload ref="video" class="avatar-uploader" action="http://localhost:8090/Pet/resource/upload/pet"
                    :show-file-list="false" :on-change="displayVideo" :on-success="handleVideoSuccess" :auto-upload="false"
                    :before-upload="beforeVideoUpload">
                    <video controls width="300" class="avatar" v-show="this.form.video"
                        :src="getUrl(this.form.video, 'video')" :autoplay="false">
                    </video>
                    <i v-show="!this.form.video" class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>

            <el-form-item label="昵称" prop="name">
                <el-input v-model="form.name" autocomplete="off" style="width:30%">
                </el-input>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
                <el-select v-model="form.gender" placeholder="请选择性别">
                    <el-option label="公" value="公">
                    </el-option>
                    <el-option label="母" value="母">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="年龄" prop="age" placeholder="请填写宠物年龄">
                <el-input v-model="form.age" autocomplete="off" style="width:30%"></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="price" placeholder="请填写出售价格">
                <el-input v-model="form.price" autocomplete="off" style="width:30%"></el-input>
            </el-form-item>
            <el-form-item label="品种" prop="breedId">
                <el-select v-model="form.breedId" placeholder="请选择宠物品种">
                    <el-option v-for="(item, index) in breeds" :key="index" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="form.status" placeholder="请设置宠物状态">
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
import md5 from 'js-md5';
export default {
    name: "UserEdit",
    data() {
        return {
            base_url: base_url,
            form: {},
            imageUrl: null,
            videoUrl: null,
            status: [
                { id: 0, name: "停止出售" },
                { id: 1, name: "正在出售" },
                { id: 2, name: "已售出" },
            ],
            picUpdate: false,
            videoUpdate: false,
            breeds: [],
            flag: false,
            saveOrUpdate: false, //false= save  true = update
            rules: {
                name: [
                    { required: true, message: '请填写宠物昵称', trigger: 'change' }
                ],
                gender: [
                    { required: true, message: '请选择宠物性别', trigger: 'change' }
                ],
                age: [
                    { required: true, message: '请填写宠物年龄', trigger: 'change' }
                ],
                breedId: [
                    { required: true, message: '请选择宠物品种', trigger: 'change' }
                ],
                price: [
                    { required: true, message: '请设置出售价格', trigger: 'change' }
                ],
                status: [
                    { required: true, message: '请设置宠物状态', trigger: 'change' }
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
        },
        storeId: {
        }
    },
    mounted() {
        if (JSON.stringify(this.defaultObj) == "{}") {
            this.saveOrUpdate = false
            this.form.storeId = this.storeId
        } else {
            this.form = JSON.parse(JSON.stringify(this.defaultObj))
            this.saveOrUpdate = true
            this.imageUrl = this.form.img
            this.videoUrl = this.form.video
        }
        getRequest("/breed/list").then((response) => {
            this.breeds = response.data.data
        }).catch((error) => {
        })
    },
    methods: {
        getUrl(url, type) {
            if (this.picUpdate && type == "avatar") {
                return url
            } else if (this.videoUpdate && type == "video") {
                return url
            } else if (url == null) {
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
        handleVideoSuccess(res, file) {
            this.form.video = res.data
            deleteRequest(this.imageUrl)
            this.saveUpdate()
        },
        displayImg(file) {
            this.picUpdate = true
            this.form.img = URL.createObjectURL(file.raw);
        },
        displayVideo(file) {
            this.videoUpdate = true
            this.form.video = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            let types = ['image/png', 'image/jpeg', 'image/jpg']
            const isImage = types.includes(file.type);
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isImage) {
                this.$message.error('上传图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!');
            }
            return isImage && isLt2M;
        },
        beforeVideoUpload(file) {
            let types = ['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb']
            const isImage = types.includes(file.type);
            const isLt10M = file.size / 1024 / 1024 < 20;
            if (!isImage) {
                this.$message.error('请上传正确的视频格式');
            }
            if (!isLt10M) {
                this.$message.error('上传视频大小不能超过 20MB!');
            }
            return isImage && isLt10M;
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
                console.log(1111)
                if (this.imageUrl != this.form.img) {
                    this.$refs["img"].submit()
                }
                if (this.videoUrl != this.form.video) {
                    this.$refs["video"].submit()
                }
                else {
                    this.saveUpdate()
                }
            })
        },
        saveUpdate() {
            if (this.saveOrUpdate) {
                postJsonRequest("/pet/update", {
                    ...this.form
                }).then(res => {
                    this.flag = true
                    this.$emit("close", this.flag)
                    this.$message.success("更新宠物信息成功")
                }).catch(err => {
                    this.flag = false
                    this.$emit("close", this.flag)
                })
            } else {
                postJsonRequest("/pet/add", {
                    ...this.form
                }).then(res => {
                    this.flag = true
                    this.$emit("close", this.flag)
                    this.$message.success("新增宠物成功")
                }).catch((error) => {
                    this.flag = false
                    this.$emit("close", this.flag)
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