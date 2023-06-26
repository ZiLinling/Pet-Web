<template>
    <div class="contain">
        <div>
            <el-input v-model="location" placeholder="定位" readonly @click.native="siteDialog = true"></el-input>
        </div>
        <Site :dialogShow.sync="siteDialog" @locationSure="locationSure" :primitiveData="primitiveData" :address="address">
        </Site>
    </div>
</template>
   
<script>
import Site from '@/components/Map/site'
export default {
    name: 'AMapDemo',
    components: {
        Site
    },
    data() {
        return {
            location: '',
            siteDialog: false,
            primitiveData: {}
        }
    },
    props: ["address"],
    mounted() {
        this.location = this.address
    },
    methods: {
        locationSure(val) {
            // 定位地址
            this.location = val.locationName
            this.primitiveData = val
            this.$emit('locationSure', val)
        },
    }
}
</script>
<style lang="scss" scoped>
.el-input {
    width: 60%;
}
</style>
