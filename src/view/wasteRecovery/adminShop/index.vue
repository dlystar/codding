<template>
    <!-- 门店管理-管理员 -->
    <div class="adminShop">
        <div class="searchArea">
            <!-- 地区查询 批量绑定协会  -->
            <Row type="flex" align="middle" class="code-row-bg">
                <Col span="2">店铺名称：</Col>
                <Col span="4"><Input v-model="params.shopName" style="width: 98%;"/></Col>
                <Col span="2">省份：</Col>
                <Col span="4"><Input v-model="params.province" style="width: 98%;"/></Col>
                <Col span="2">城市：</Col>
                <Col span="4"><Input v-model="params.city" style="width: 98%;"/></Col>
                <Col span="2">区县：</Col>
                <Col span="4"><Input v-model="params.regionsAndCounties" style="width: 98%;"/></Col>
                <Col span="2">详细地址：</Col>
                <Col span="4"><Input v-model="params.address" style="width: 98%;"/></Col>
                <Col span="2">市级代理人：</Col>
                <Col span="4">
                    <Input v-model="params.cityAgentName" style="width: 98%;" clearable readonly @on-clear="clearSelectCityAgent">
                        <Icon type="md-apps" slot="suffix" @click="showSelectCityAgent" class="dly_select" />
                    </Input>
                </Col>
                <Col span="2">区县代理人：</Col>
                <Col span="4">
                    <Input v-model="params.regionsCountiesName" style="width: 98%;" clearable readonly @on-clear="clearSelectRegionsCounties">
                        <Icon type="md-apps" slot="suffix" @click="outShowSelectRegionsCounties" class="dly_select" />
                    </Input>
                </Col>
                <Col span="2">创建日期：</Col>
                <Col span="4">
                    <DatePicker @on-change="changeDate" format="yyyy-MM-dd HH:mm:ss" 
                        type="datetimerange" placeholder="请选择日期" style="width: 98%;">
                    </DatePicker>
                    <!-- <Input v-model="params.createDate" style="width: 98%;"/> -->
                </Col>
                <Col span="2"><span></span></Col>
                <Col span="4"><Button type="primary" @click="params.pageIndex=1;findByPage()">查询</Button></Col>
            </Row>
        </div>
        <div class="buttonArea">
            <Button v-for="item in buttons" :type="item.type" @click="showModel(item.name)">
                {{item.name}}
            </Button>
        </div>
        <Table 
            @on-selection-change="setSelectRow"
            ref="deviceTable" 
            :content="self" :columns="header" :data="tableData.rows"></Table>
        <div class="page">
            <div style="float: right;">
                <Page
                    ref="pages"
                    show-total
                    show-elevator
                    :page-size="params.pageSize" :current="params.pageIndex"
                    :total="tableData.records"
                    @on-change="changePage">
                </Page>
            </div>
        </div>
        <!-- 新增编辑 -->
        <Modal
            v-model="isShowDetail"
            :title="detailTitle"
            :mask-closable="false"
            width="60%">
            <detail v-if="isShowDetail" ref="detail" :title="detailTitle" :detail="currentData"></detail>
            <div slot="footer">
                <Button type="text" size="large" @click="isShowDetail = false">取消</Button>
                <Button type="primary" size="large" @click="update()" v-show="detailTitle != '查看详情'">确定</Button>
            </div>
        </Modal>
        <!-- 选择城市所属人 -->
        <Modal
            v-model="isShowSelectCityAgent"
            title="选择城市所属人"
            :mask-closable="false"
            width="60%">
            <selectCityAgent v-if="isShowSelectCityAgent" ref="selectCityAgent"></selectCityAgent>
            <div slot="footer">
                <Button type="text" size="large" @click="isShowSelectCityAgent = false">取消</Button>
                <Button :loading="dialogLoading" type="primary" size="large" @click="selectCityAgent()">确定</Button>
            </div>
        </Modal>
        <!-- 区县所属人 -->
        <Modal
            v-model="isShowSelectRegionsCounties"
            title="选择区县所属人"
            :mask-closable="false"
            width="60%">
            <selectRegionsCounties :city="params.city" :isAdmin="true" v-if="isShowSelectRegionsCounties" ref="selectRegionsCounties"></selectRegionsCounties>
            <div slot="footer">
                <Button type="text" size="large" @click="isShowSelectRegionsCounties = false">取消</Button>
                <Button :loading="dialogLoading" type="primary" size="large" @click="selectRegionsCounties()">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import detail from './components/detail.vue'
    import selectCityAgent from '@com/selectCityAgent.vue'
    import selectRegionsCounties from '@com/selectRegionsCounties.vue'
    import mixins from '@com/mixins'
    export default{
        name: 'adminShop',
        components: {detail,selectCityAgent,selectRegionsCounties},
        mixins: [mixins],
        data(){
            return{
                buttons: this.$store.state.user.currentMenuButtons,
                self: this,
                params:{
                    pageIndex: 1,
                    pageSize: 10,
                    shopName: '',
                    province: '',
                    city: '',
                    regionsAndCounties: '',
                    address: '',
                    cityAgentId: '',
                    cityAgentName: '',
                    adminId: '',
                    regionsCountiesId: '',
                    regionsCountiesName: '',
                    startCreateDate: '',
                    endCreateDate: '',
                },
                isShowDetail: false,
                detailTitle: '新增',
                tableData: [],
                selectRow: [],
                currentData: {},
                dialogLoading: false,
                header: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },  
                    {title: '店铺名称',key: 'shopName',},
                    {title: '店铺省份',key: 'province',},
                    {title: '店铺市',key: 'city',},
                    {title: '店铺区县',key: 'regionsAndCounties',},
                    {title: '具体地址',key: 'address',},
                    {title: '经度',key: 'latitude',},
                    {title: '纬度',key: 'longitude',},
                    {title: '创建时间',key: 'createDate',},
                    {title: '操作',key: 'createDate', width: 100,
                        render:(h, params)=>{
                            return h('Button',{
                                props:{type: 'primary'},
                                on:{
                                    click: ()=>{
                                        this.getDetail(params)
                                    }
                                }
                            },'查看详情')
                        },
                    },
                ],
                // 
                regionsCountiesUseForQuery: true,
            }
        },
        methods:{
            findByPage(){
                this.axios.request({
                    params: this.params,
                    url: '/adminShop/findByPage',
                    method: 'get'
                }).then(res =>{
                    this.tableData = res.data
                }).catch(err =>{
                    console.log('网络异常')
                })
            },
            changeDate(date){
                [this.params.startCreateDate,this.params.endCreateDate] = date
            },
            changePage(current){
                this.params.pageIndex = current
                this.findByPage()
            },
            setSelectRow(curRow){
                this.selectRow = JSON.parse(JSON.stringify(curRow))   
            },
            getDetail(params){
                this.currentData = JSON.parse(JSON.stringify(params.row))
                this.isShowDetail = true
                this.detailTitle = '查看详情'
            },
            showModel(name){
                switch(name){
                    case '新增':
                        this.isShowDetail = true
                        this.detailTitle = '新增'
                        this.currentData = {}
                    break;
                    case '编辑':
                        if(this.selectRow.length  == 1){
                            this.currentData = JSON.parse(JSON.stringify(this.selectRow[0]))
                            this.isShowDetail = true
                            this.detailTitle = '编辑'
                        }else if(this.selectRow.length < 1){
                            this.$Message.info('请选择一条数据')
                        }else{
                            this.$Message.info('请选择一条数据进行编辑')
                        }
                    break;
                }
            },
            update(){
                let url = this.detailTitle == '新增' ? '/adminShop/add' : '/adminShop/update'
                let data = JSON.parse(JSON.stringify(this.currentData))
                let detail = this.$refs.detail.$refs.detail
                console.log(data);
                if(data.cityData.length == 0){
                    this.$Message.warning('请选择店铺省市区县')
                    return
                }
                detail.validate(valid =>{
                    if(valid){
                        this.sendData(url,data)
                    }
                })
            },
            sendData(url,data){
                this.dialogLoading = true
                this.axios.request({
                    url,
                    method: 'post',
                    data: data || this.currentData
                }).then(res =>{
                    this.dialogLoading = false
                    if(res.data.result == 1){
                        this.isShowDetail = false
                        this.$Message.success(this.detailTitle + '成功')
                        this.params.pageIndex=1
                        this.findByPage()
                    }else{
                        this.$Message.error(res.data.msg) 
                    }
                }).catch(err =>{
                    this.dialogLoading = false
                    this.$Message.error('网络出现问题，请重试')
                })
            },
            outShowSelectRegionsCounties(){
                if(!this.params.cityAgentName){
                    this.$Message.info('请先选择城市代理人')
                    return
                }
                this.showSelectRegionsCounties()
            }
        },
        created(){
            this.findByPage()
        }
    }
</script>

<style lang="less" scoped>
    .adminShop{

    }
</style>