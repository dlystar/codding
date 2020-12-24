<template>
    <div class="baseInfo">
        <Form :model="detail" ref="detail" :rules="rules" :label-width="120">
            <!-- <FormItem label="店铺类型：" prop="shopType">
                <Input v-model="detail.shopType" :disabled="onlyAdd"></Input>
            </FormItem> -->
            <FormItem label="城市代理人：" prop="cityAgentName">
                <Input v-model="detail.cityAgentName" :disabled="onlyAdd" readonly @on-clear="clearSelectCityAgent">
                    <Icon type="md-apps" slot="suffix" @click="showSelectCityAgent" class="dly_select" />
                </Input>
            </FormItem>
            <FormItem label="区县代理人：" prop="regionsCountiesName">
                <Input v-model="detail.regionsCountiesName" :disabled="onlyAdd" readonly @on-clear="clearSelectRegionsCounties">
                    <Icon type="md-apps" slot="suffix" @click="showSelectRegionsCounties" class="dly_select" />
                </Input>
            </FormItem>
            <FormItem label="店铺名称：" prop="shopName">
                <Input v-model="detail.shopName" :disabled="isDisabled"></Input>
            </FormItem>
            <FormItem label="店铺省市区县：" prop="cityData" ref="cityDataForm">
                <!-- <Cascader v-model="detail.cityData" :data="cityData" filterable @on-change="cascaderChange" :disabled="onlyAdd"></Cascader> -->
                <Cascader 
                    v-model="detail.cityData" ref="cascader" 
                    :data="cityData" filterable @on-change="cascaderChange" 
                    @on-visible-change="cascaderBlur"
                    :disabled="onlyAdd || cityDataDisabled">
                </Cascader>
            </FormItem>
            <FormItem label="店铺具体地址：" prop="address">
                <Input v-model="detail.address" :disabled="isDisabled"></Input>
            </FormItem>
            <FormItem label="经度：" prop="latitude">
                <Input v-model="detail.latitude" :disabled="isDisabled"></Input>
            </FormItem>
            <FormItem label="纬度：" prop="longitude">
                <Input v-model="detail.longitude" :disabled="isDisabled"></Input>
            </FormItem>
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
        </Form>
        <!-- 选择城市所属人 -->
        <Modal
            v-model="isShowSelectCityAgent"
            title="选择城市所属人"
            :mask-closable="false"
            width="60%">
            <selectCityAgent v-if="isShowSelectCityAgent" ref="selectCityAgent"></selectCityAgent>
            <div slot="footer">
                <Button type="text" size="large" @click="isShowSelectCityAgent = false">取消</Button>
                <Button type="primary" size="large" @click="selectCityAgent()">确定</Button>
            </div>
        </Modal>
        <!-- 选择区县所属人 -->
        <Modal
            v-model="isShowSelectRegionsCounties"
            title="选择区县所属人"
            :mask-closable="false"
            width="60%">
            <selectRegionsCounties 
                v-if="isShowSelectRegionsCounties"
                :city="detail.city" 
                :isAdmin="true" ref="selectRegionsCounties"></selectRegionsCounties>
            <div slot="footer">
                <Button type="text" size="large" @click="isShowSelectRegionsCounties = false">取消</Button>
                <Button type="primary" size="large" @click="selectRegionsCounties()">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import selectCityAgent from '@com/selectCityAgent.vue'
    import selectRegionsCounties from '@com/selectRegionsCounties.vue'
    import cityData from "@/libs/city";
    // 百度地图插件
    import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
    import bmLabel from 'vue-baidu-map/components/overlays/Label.vue'
    import bmMarker from 'vue-baidu-map/components/overlays/Marker.vue'
    import bmLocalSearch from 'vue-baidu-map/components/search/LocalSearch.vue'
    import bmNavigation from 'vue-baidu-map/components/controls/Navigation.vue'
    export default {
        name: 'baseInfo',
        props:{
            detail: Object,
            title: String,
        },
        components: {selectCityAgent,selectRegionsCounties,
            BaiduMap,
            bmMarker,
            bmLabel,
            bmLocalSearch,
            bmNavigation
        },
        data(){
            const validateArray = (rule, value, callback) => {
                if(value.length == 0){
                    return callback(new Error("请选择店铺省市区县"))
                }else{
                    callback()
                }
            }
            const validateNum = (rule, value, callback) =>{
                if(value){
                    callback()
                }else{
                    return callback(new Error("请选择经纬度"))
                }
            }
            return {
                rules: {
                    shopType: [{required: true, message: '请输入店铺类型', trigger: 'blur'}],
                    shopName: [{required: true, message: '请输入店铺名称',  trigger: 'blur'}],
                    // cityData: [{required: true,validator: validateArray, message: '请选择店铺省市区县',  trigger: 'change'}],
                    address: [{required: true, message: '请输入店铺具体地址',  trigger: 'blur'}],
                    cityAgentName: [{required: true, message: '请选择城市代理人',  trigger: 'blur'}],
                    regionsCountiesId: [{required: true, message: '请选择区县代理人',  trigger: 'blur'}],
                    latitude: [{required: true,validator: validateNum, message: '请输入经度',  trigger: 'blur'}],
                    longitude: [{required: true,validator: validateNum, message: '请输入纬度',  trigger: 'blur'}],
                },
                isDisabled: this.title == '查看详情',
                onlyAdd:  this.title != '新增',
                isShowSelectCityAgent: false,
                isShowSelectRegionsCounties: false,
                cityData: cityData,

                center: {
                    lng: 0,
                    lat: 0
                },
                zoom: 12.8,
                location: '',
                keyword: '',
                searchArea: '',
                cityDataDisabled: false,
            }
        },
        watch:{
            searchArea(newVal,oldVal){
                if(newVal.length > oldVal.length){
                    this.keyword = newVal
                }
            },
        },
        methods: {
             handler({
                BMap,
                map
            }) {
                [this.center.lng,this.center.lat] = [113.626862,34.752467]
                this.zoom = 12
            },
            getMapInfo(e){
                if (this.isDisabled) return
                this.detail.longitude = e.point.lng
                this.detail.latitude = e.point.lat
                this.center = e.point
                this.$forceUpdate()
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
            showSelectCityAgent() {
                if(this.onlyAdd){
                    return
                }
                this.isShowSelectCityAgent = true
            },
            selectCityAgent() {
                if(!this.$refs.selectCityAgent.currentData.id){
                    this.$Message.warning('请选择市级代理人')
                    return 
                }
                if(!this.detail.regionsCountiesId){
                    this.detail.adminId = this.$refs.selectCityAgent.currentData.id
                }
                this.detail.cityAgentId = this.$refs.selectCityAgent.currentData.id
                this.detail.cityAgentName = this.$refs.selectCityAgent.currentData.userName
                this.detail.city = this.$refs.selectCityAgent.currentData.city
                // this.detail.city = this.$refs.selectCityAgent.currentData.userName
                this.isShowSelectCityAgent = false
            },
            clearSelectCityAgent(){
                this.detail.cityAgentId = ''
                this.detail.cityAgentName = ''
            },
            showSelectRegionsCounties() {
                if(this.onlyAdd){
                    return
                }
                if(!this.detail.adminId){
                    this.$Message.warning('请选先择市级代理人')
                    return 
                }
                this.isShowSelectRegionsCounties = true
            },
            selectRegionsCounties() {
                if(!this.$refs.selectRegionsCounties.currentData.id){
                    this.$Message.warning('请选择区县代理人')
                    return 
                }
                this.detail.adminId = this.$refs.selectRegionsCounties.currentData.id
                this.detail.regionsCountiesId = this.$refs.selectRegionsCounties.currentData.id
                this.detail.regionsCountiesName = this.$refs.selectRegionsCounties.currentData.userName

                //赋值省市区
                this.detail.province = this.$refs.selectRegionsCounties.currentData.province
                this.detail.city = this.$refs.selectRegionsCounties.currentData.city
                this.detail.regionsAndCounties = this.$refs.selectRegionsCounties.currentData.regionsAndCounties
                this.isShowSelectRegionsCounties = false
                this.cityDataDisabled = true
                this.matchCity()
            },
            clearSelectRegionsCounties(){
                this.detail.adminId = ''
                this.detail.regionsCountiesId = ''
                this.detail.regionsCountiesName = ''
                this.detail.province = ''
                this.detail.city = ''
                this.detail.regionsAndCounties = ''
                this.cityDataDisabled = false

            },
            cascaderChange(value, selectedData){
                if(selectedData.length == 1){
                    this.detail.province = selectedData[0].label
                    this.detail.city = selectedData[0].label
                    this.detail.regionsAndCounties = selectedData[0].label
                }else if(selectedData.length == 2){
                    this.detail.province = selectedData[0].label
                    this.detail.city = selectedData[0].label
                    this.detail.regionsAndCounties = selectedData[1].label
                }else if(selectedData.length == 3){
                    this.detail.province = selectedData[0].label
                    this.detail.city = selectedData[1].label
                    this.detail.regionsAndCounties = selectedData[2].label
                }
                if(selectedData.length == 0){
                    this.detail.cityData = []
                }
            },
            cascaderBlur(isShow){
                console.log(isShow);
                if(isShow){
                    this.$refs.cascader.query = this.detail.city
                }else{
                    this.$refs.cascader.query = ''
                }
            },
            findAgent(){
                this.axios.request({
                    params: {
                        id: this.detail.adminId
                    },
                    url: '/adminRegionsCounties/findRegionsCountiesById',
                    method: 'get'
                }).then(res =>{
                    console.log('区县代理',res);
                    this.$set(this.detail,'cityAgentId',res.data.rows.cityAgent.id)
                    this.$set(this.detail,'cityAgentName',res.data.rows.cityAgent.userName)
                    this.$set(this.detail,'regionsCountiesId',res.data.rows.regionsCounties.id)
                    this.$set(this.detail,'regionsCountiesName',res.data.rows.regionsCounties.userName)
                }).catch(err =>{
                    console.log('网络异常')
                })
            },
            matchCity(){
                this.cityData.forEach(item =>{
                    if(item.label == this.detail.province){
                        this.detail.cityData.push(item.value)
                        if(item.children.length > 0){
                            item.children.forEach(jtem =>{
                                if(jtem.label == this.detail.city || jtem.label == this.detail.regionsAndCounties){
                                    this.detail.cityData.push(jtem.value)
                                    if(jtem.children && jtem.children.length > 0){
                                        jtem.children.forEach(ktem =>{
                                            if(ktem.label == this.detail.regionsAndCounties){
                                                this.detail.cityData.push(ktem.value)
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    }
                })
                this.$forceUpdate()
            }
        },
        mounted(){
            console.log(this.detail);
            this.detail.shopType = 2
            this.detail.cityData = []
            if(!this.detail.city){
                this.$set(this.detail,'cityAgentName','')
                this.$set(this.detail,'city','')
                this.$set(this.detail,'longitude','')
                this.$set(this.detail,'latitude','')
            }
            if(this.onlyAdd){   
                this.findAgent()
                this.matchCity()
            }
            console.log(this.$refs.cityDataForm);
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