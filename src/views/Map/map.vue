<template>
    <div class="contain">
        <div v-if="primitiveData.locationName">
            搜索:{{ primitiveData.name }},详细地址为:{{ primitiveData.locationName }},经度:{{ primitiveData.longitude }},纬度:{{ primitiveData.latitude }}
        </div>
        <div>
            <el-input v-model="location" placeholder="定位" readonly @click.native="siteDialog = true"></el-input>
        </div>
        <Site :dialogShow.sync="siteDialog" @locationSure="locationSure" :primitiveData="primitiveData"></Site>
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
    methods: {
        locationSure(val) {
            // 定位地址
            console.log(val)
            this.location = val.name
            this.primitiveData = val
        },
    }
}
</script>
   
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.amap-demo {
    width: 100%;
    height: 600px;
    position: relative;
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
