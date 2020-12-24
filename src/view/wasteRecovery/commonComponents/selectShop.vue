<template>
    <!-- 门店管理-管理员 -->
    <div class="adminShop dialogSelect">
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
                <Col span="2"><span></span></Col>
                <Col span="4"><Button type="primary" @click="params.pageIndex=1;findByPage()">查询</Button></Col>
            </Row>
        </div>
        <Table 
            @on-selection-change="setSelectRow"
            @on-row-click="setSelectRow"
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
        <!-- 选择城市所属人 -->
        <Modal
            v-model="isShowSelectCityAgent"
            title="选择城市所属人"
            :mask-closable="false"
            width="60%">
            <selectCityAgent v-if="isShowSelectCityAgent" ref="selectCityAgent"></selectCityAgent>
            <div slot="footer">
                <Button type="text" size="large" @click="isShowSelectCityAgent = false">取消</Button>
                <Button :loading="dialogLoading" type="primary" size="large" @click="selectCityAgent()" v-show="detailTitle != '查看详情'">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import selectCityAgent from '@com/selectCityAgent.vue'
    export default{
        name: 'adminShop',
        components: {selectCityAgent},
        props:['isCityAgent','isAdmin','adminId'],
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
                    regionsCountiesId: '',
                    startCreateDate: '',
                    endCreateDate: '',
                    adminId: '',
                },
                isShowDetail: false,
                detailTitle: '新增',
                tableData: [],
                selectRow: [],
                currentData: {},
                dialogLoading: false,
                header: [
                    {
                        // type: 'selection',
                        width: 60,
                        align: 'center',
                        render: (h, params) => {
                            let data = params.row;
                            let flag = false;
                            if (this.currentData.id === data.id) {
                                flag = true
                            } else {
                                flag = false
                            }
                            let self = this
                            return h('div', [
                                h('Radio', {
                                    props: {
                                        value: flag
                                    },
                                    on: {
                                        'on-change': () => {
                                            self.currentData = data;
                                        }
                                    }
                                })
                            ])
                        }
                    },  
                    {title: '店铺名称',key: 'shopName',},
                    {title: '店铺省份',key: 'province',},
                    {title: '店铺市',key: 'city',},
                    {title: '店铺区县',key: 'regionsAndCounties',},
                    {title: '具体地址',key: 'address',},
                    {title: '创建时间',key: 'createDate',},
                ],
                isShowSelectCityAgent: false
            }
        },
        methods:{
            findByPage(){
                let url = '/cityAgentShop/findMyShop'
                if(this.isCityAgent){
                    url = '/cityAgentShop/findByPage'
                }
                if(this.isAdmin){
                    url = '/adminShop/findByPage'
                }
                this.axios.request({
                    params: this.params,
                    url,
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
                this.currentData = JSON.parse(JSON.stringify(curRow))   
            },
            getDetail(params){
                this.currentData = JSON.parse(JSON.stringify(params.row))
                this.isShowDetail = true
                this.detailTitle = '查看详情'
            }
        },
        created(){
            if(this.adminId){
                this.params.adminId = this.adminId
            }
            this.findByPage()
        }
    }
</script>

<style lang="less" scoped>
    .adminShop{

    }
</style>