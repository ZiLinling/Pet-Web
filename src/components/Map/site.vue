<template>
    <div v-if="dialogShow">
        <el-dialog title="定位" width="520px" :before-close="hide" :visible.sync="dialogShow" :close-on-click-modal="false"
            append-to-body class="site">
            <el-row class="app-container home">
                <el-col :span="24" class="box">
                    <el-amap ref="map" vid="amapDemo" :center="center" :zoom="zoom" class="amap-demo" :events="events">
                        <el-amap-marker :position="center" key="100"></el-amap-marker>
                    </el-amap>
                    <div class="searchBox">
                        <el-input v-model="inputValue" placeholder="搜索地名或者地址" id="tipinput" prefix-icon="el-icon-search"
                            class="searchInput"></el-input>
                        <div class="searchContainer">
                            <div class="searchItem" v-for="(item, index) in list" :key="item.id"
                                :style="activeIndex === index && 'background: #ecf5ff'" @click="itemChange(item, index)">
                                <div>{{ item.name }}</div>
                                <div style="color:#999;font-size:12px;">{{ item.address }}</div>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="hide">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { addressRequest } from '@/api/axios'
export default {
    name: "site",
    components: {},
    props: ["dialogShow", "primitiveData", "address"],
    data() {
        return {
            tabIndex: '',
            list: [],
            activeIndex: '',
            zoom: 12,
            center: [118.0900940000, 24.6249430000],
            searchOption: {
                citylimit: false
            },
            inputValue: '',
            searchResult: {
                address: '',
                latitude: '',
                longitude: '',
                name: '',
                type: '',
                country: '',
                province: '',
                city: '',
                area: '',
                township: '',
                street: '',
                neighborhood: '',
                locationName: ''
            },
            events: {
                // 地图上的点击事件
                click: (e) => {
                    this.$nextTick(() => {
                        let that = this
                        that.position = [e.lnglat.lng, e.lnglat.lat]
                        let geocoder = new AMap.Geocoder({});
                        geocoder.getAddress(that.position, function (status, result) {
                            if (status === 'complete' && result.info === 'OK') {
                                let obj = result.regeocode.addressComponent
                                that.inputValue = obj.province + obj.city + obj.district + obj.township + obj.street +
                                    obj.streetNumber + (obj.building || '')

                            }
                        });
                    })
                }
            }
        }
    },
    computed: {
    },
    watch: {
        dialogShow(val) {
            if (val) {
                this.inputValue = this.primitiveData.name
                this.list = []
            }
        },
        inputValue(value) {
            if (value) {
                // 监听输入内容
                this.initMapByInput()
            }
        }
    },
    mounted() {
        addressRequest({ address: this.address }).catch((response) => {
            if (response.status == 1) {
                var m = response.geocodes[0].location.split(",")
                this.center[0] = parseFloat(m[0])
                this.center[1] = parseFloat(m[1])
            }
        })
    },
    methods: {
        itemChange(n, index) {
            const that = this;
            that.activeIndex = index
            // 输入后搜索出来的，反地理编码出来的参数有所不同
            let lng = n.lng || n.longitude || n.location.lng
            let lat = n.lat || n.latitude || n.location.lat
            let name = n.name || ''
            that.inputValue = name
            that.zoom = 13
            that.position = [lng, lat]
            that.searchResult.address = n.address
            that.searchResult.latitude = lat
            that.searchResult.longitude = lng
            that.searchResult.name = name
            let geocoder = new AMap.Geocoder({});
            geocoder.getAddress(that.position, function (status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    let obj = result.regeocode.addressComponent
                    that.searchResult.locationName = obj.province + obj.city + obj.district + obj.township + obj.street +
                        obj.streetNumber + (n.address || obj.building || '')
                }
            });
        },
        initMapByInput() {
            let that = this
            // 自动搜索插件
            AMap.plugin('AMap.Autocomplete', () => {
                let autoOptions = {
                    city: '全国'
                };
                let autoComplete = new AMap.Autocomplete(autoOptions)
                autoComplete.search(that.inputValue, function (status, e) {
                    if (status === 'complete' && e.info === 'OK') {
                        if (e.tips && e.tips.length > 0) {
                            let tips = e.tips.filter((i) => {
                                return i.location && i.address.length > 0
                            })
                            let tip = tips[0]
                            that.center = [tip.location.lng, tip.location.lat]
                            that.zoom = 13
                            that.position = [tip.location.lng, tip.location.lat]
                            that.list = tips
                            that.searchResult.address = tip.address
                            that.searchResult.latitude = tip.location.lat
                            that.searchResult.longitude = tip.location.lng
                            that.searchResult.name = tip.name
                            let geocoder = new AMap.Geocoder({});
                            geocoder.getAddress(that.position, function (status, result) {
                                if (status === 'complete' && result.info === 'OK') {
                                    let obj = result.regeocode.addressComponent
                                    that.searchResult.locationName = obj.province + obj.city + obj.district + obj.township +
                                        obj.street + tip.address
                                }
                            });
                        } else {
                            that.list = []
                            that.searchResult = []
                        }
                    }
                });
            });
        },
        // 保存提交
        save() {
            this.$emit('locationSure', this.searchResult)
            this.$emit('update:primitiveData', this.searchResult)
            this.hide()

        },
        // 关闭弹框
        hide() {
            this.dataShow = false
            this.inputValue = ''
            this.$emit("update:dialogShow", false)
        },
    },
};
</script>
   
<style lang="scss" scoped>
ul,
dl {
    padding: 0;
    margin: 0;
    list-style-type: none;
}

::-webkit-scrollbar {
    display: none;
}

.amap-demo {
    width: 100%;
    height: 600px;
    position: relative;
}

.site {
    .el-dialog__body {
        padding: 0;
        border-bottom: 1px solid #E4E4E4;
    }

    .app-container {
        padding: 0;
    }

    .search-box {
        height: 35px;
        margin: 10px auto;
        width: calc(100% - 20px);
        // border-radius:16px;
        box-shadow: none;
        background: #ffff;
        border: 1px solid #e6e6e6;

        .search-box-wrapper {
            input {
                background: #fff;
                padding-left: 20px;
            }

            .search-btn {
                color: #2A67FE;
                width: 90px;
                height: 20px;
                box-sizing: border-box;
                border-left: 1px solid #D7D7D7;
            }
        }
    }
}

.searchBox {
    width: 100%;
    height: 230px;
    border-radius: 10px 10px 0 0;
    background: #fff;
    font-size: 13px;
    color: #333333;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 999;
    margin-top: 10px;
    overflow: hidden;

    .searchContainer {
        height: 180px;
        margin-top: 10px;
        overflow-y: auto;
        width: 100%;
        padding: 0 10px;
        box-sizing: border-box;
    }

    .searchItem {
        color: #333;
        font-size: 13px;
        text-align: left;
        padding: 7px 10px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #e6e6e6;
        cursor: pointer;
    }
}

::v-deep .el-vue-search-box-container .search-tips {
    width: 100%;
    top: 100%;
    max-height: 190px;
    overflow: auto;
}

.active {
    background: #DBE5F2;
}

.searchInput {
    margin: 0px 10px;
    background: #F7F8FA;
    border-radius: 16px;
    margin-top: 5px;
    height: 32px;
    width: calc(100% - 20px);
    box-sizing: border-box;
}
</style>