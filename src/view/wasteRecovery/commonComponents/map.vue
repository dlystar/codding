<template>
    <div>
        <div class="map-search">
            <Row type="flex" align="middle" class="code-row-bg">
                <Col span="2" style="text-align: right;">位置搜索：</Col>
                <Col span="4"><Input v-model="searchArea" style="width: 98%;" /></Col>
                <!-- <Col span="4"><Button type="primary" @click="searchMap">查询</Button></Col> -->
            </Row>
        </div>
        <baidu-map 
            class="bm-view"
            ref="map" 
            ak="8BB7F0E5C9C77BD6B9B655DB928B74B6E2D838FD" 
            :center="center" :zoom="zoom"
            :scroll-wheel-zoom="true"
            @ready="handler"
            @click="getMapInfo"
            @zoomend="zoomendDo">
            <bm-marker 
                :position="center"  
                :dragging="true" 
                :title="'选择地址'"
                animation="BMAP_ANIMATION_BOUNCE">
            </bm-marker>
            <bm-local-search style="display: none;" :keyword="keyword" :auto-viewport="true" :location="location" zoom="12.8" ></bm-local-search>
            <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
        </baidu-map>
    </div>
</template>

<script>
    // 百度地图插件
    import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
    import bmLabel from 'vue-baidu-map/components/overlays/Label.vue'
    import bmMarker from 'vue-baidu-map/components/overlays/Marker.vue'
    import bmLocalSearch from 'vue-baidu-map/components/search/LocalSearch.vue'
    import bmNavigation from 'vue-baidu-map/components/controls/Navigation.vue'
    export default{
        components: {
            BaiduMap,
            bmMarker,
            bmLabel,
            bmLocalSearch,
            bmNavigation
        },
        props: ['isDisabled'],
        data(){
            return{
                center: {
                    lng: 0,
                    lat: 0
                },
                zoom: 12.8,
                location: '',
                keyword: '',
                searchArea: '',
            }
        },
        watch:{
            searchArea(newVal,oldVal){
                if(newVal.length > oldVal.length){
                    this.keyword = newVal
                }
            },
        },
        methods:{
            handler({
                BMap,
                map
            }) {
                [this.center.lng,this.center.lat] = [113.626862,34.752467]
                this.zoom = 12
            },
            getMapInfo(e){
                if (this.isDisabled) return
                // this.detail.longitude = e.point.lng
                // this.detail.latitude = e.point.lat
                this.$emit('clickHandel',e.point)
                this.center = e.point
                // let geocoder= new BMap.Geocoder();  //创建地址解析器的实例
                // geocoder.getLocation(e.point,rs=>{
                //     console.log(rs)
                //     this.detail.address = rs.address
                // });
            },
            zoomendDo(){
                // this.center.lng = this.detail.longitudeAndLatitude.split(',')[0]
                // this.center.lat = this.detail.longitudeAndLatitude.split(',')[0]
            },
        },
        created(){
            
        }
    }
</script>

<style lang="less" scoped>
    .map-search{
        position: absolute; width: 100%; z-index: 100;
        margin-top: 30px; color: #000; font-weight: bold;
    }
    .baseInfo{
        height: 410px; overflow: auto; position: relative;
    }
    .ivu-input-wrapper, .ivu-select,.ivu-cascader{
        width: 80%;
    }
    .bm-view{
        // width: 80%;
        height: 300px;
    }
</style>