<template>
    <!-- 订单管理（管理员和市级代理） -->
    <div class="sellingGoods">
        <div class="searchArea">
            <!-- 地区查询  -->
            <Row type="flex" align="middle" class="code-row-bg">
                <Col span="2">卖货单号：</Col>
                <Col span="4"><Input v-model="params.saleNum" style="width: 98%;"/></Col>

                <template v-if="isAdmin">
                    <Col span="2">市级代理人：</Col>
                    <Col span="4">
                        <Input v-model="params.cityAgentName" style="width: 98%;" clearable readonly @on-clear="clearSelectCityAgent">
                            <Icon type="md-apps" slot="suffix" @click="showSelectCityAgent" class="dly_select" />
                        </Input>
                    </Col>
                </template>
                <template v-if="isAdmin || isCityAgent">
                    <Col span="2">区县代理人：</Col>
                    <Col span="4">
                        <Input v-model="params.regionsCountiesName" style="width: 98%;" clearable readonly @on-clear="clearSelectRegionsCounties">
                            <Icon type="md-apps" slot="suffix" @click="outShowSelectRegionsCounties" class="dly_select" />
                        </Input>
                    </Col>
                    <Col span="2">选择店铺：</Col>
                    <Col span="4">
                        <Input v-model="params.shopName" style="width: 98%;" readonly clearable @on-clear="clearShop">
                            <Icon type="md-apps" slot="suffix" @click="outShowSelectShop" class="dly_select" />
                        </Input>
                    </Col>
                </template>
                <Col span="2">总交易金额：</Col>
                <Col span="4">
                    <InputNumber v-model="params.minMoney"></InputNumber>
                        ——
                    <InputNumber v-model="params.maxMoney"></InputNumber>
                </Col>
                <Col span="2">总重量：</Col>
                <Col span="4">
                    <InputNumber v-model="params.minTotalWeight"></InputNumber>
                        ——
                    <InputNumber v-model="params.maxTotalWeight"></InputNumber>
                </Col>

                <Col span="2">总个数：</Col>
                <Col span="4">
                    <InputNumber v-model="params.minTotalNumber"></InputNumber>
                        ——
                    <InputNumber v-model="params.maxTotalNumber"></InputNumber>
                </Col>
                <Col span="2">总其他数值：</Col>
                <Col span="4">
                    <InputNumber v-model="params.minTotalOther"></InputNumber>
                        ——
                    <InputNumber v-model="params.maxTotalOther"></InputNumber>
                </Col>
                <Col span="2">创建时间：</Col>
                <Col span="4">
                    <DatePicker @on-change="changeDate" format="yyyy-MM-dd HH:mm:ss" 
                        type="datetimerange" placeholder="请选择日期" style="width: 98%;">
                    </DatePicker>
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
            <ordetail v-if="isShowDetail && detailTitle=='卖货明细'" ref="ordetail" :title="detailTitle" :detail="currentData"></ordetail>
            <createOrder v-if="isShowDetail && detailTitle=='卖货'" ref="createOrder" :title="detailTitle" :detail="currentData"></createOrder>
            <div slot="footer">
                <Button type="text" size="large" @click="isShowDetail = false">取消</Button>
                <Button type="primary" size="large" @click="confirmOrder()" v-show="detailTitle == '卖货'">提交</Button>
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
            <selectRegionsCounties 
                :isCityAgent="isCityAgent"
                :city="params.city" 
                :isAdmin="isAdmin" 
                v-if="isShowSelectRegionsCounties" ref="selectRegionsCounties"></selectRegionsCounties>
            <div slot="footer">
                <Button type="text" size="large" @click="isShowSelectRegionsCounties = false">取消</Button>
                <Button :loading="dialogLoading" type="primary" size="large" @click="selectRegionsCounties()">确定</Button>
            </div>
        </Modal>
        <!-- 选择店铺 -->
        <Modal
            v-model="isShowSelectShop"
            :title="'选择店铺'"
            :mask-closable="false"
            width="60%">
            <selectShop 
                :isCityAgent="isCityAgent"
                :adminId="params.regionsCountiesId" 
                :isAdmin="isAdmin"
                v-if="isShowSelectShop" ref="selectShop">
            </selectShop>
            <div slot="footer">
                <Button type="text" size="large" @click="isShowSelectShop = false">取消</Button>
                <Button :loading="dialogLoading" type="primary" size="large" @click="selectShop()">确定</Button>
            </div>
        </Modal>
        <!-- 清单 -->
        <Modal
            v-model="isShowOrderList"
            title="卖货确认"
            :mask-closable="false"
            width="60%">
            <orderList v-if="isShowOrderList" ref="orderList" :tableData="orderList"></orderList>
            <div slot="footer">
                <Button type="text" size="large" @click="isShowOrderList = false">取消</Button>
                <Button :loading="dialogLoading" type="primary" size="large" @click="submitOrder()">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import ordetail from './components/ordetail.vue'
    import createOrder from './components/createOrder.vue'
    import orderList from './components/createOrderList.vue'
    import selectCityAgent from '@com/selectCityAgent.vue'
    import selectRegionsCounties from '@com/selectRegionsCounties.vue'
    import selectShop from '@com/selectShop.vue'
    import mixins from '@com/mixins'
    export default{
        components: {ordetail,selectCityAgent,selectRegionsCounties,selectShop,createOrder,orderList},
        mixins: [mixins],
        data(){
            return{
                buttons: this.$store.state.user.currentMenuButtons,
                self: this,
                params:{
                    pageIndex: 1,
                    pageSize: 10,
                    saleNum: '',
                    minMoney: null,
                    maxMoney: null,
                    minTotalWeight: null,
                    maxTotalWeight: null,
                    minTotalNumber: null,
                    maxTotalNumber: null,
                    minTotalOther: null,
                    maxTotalOther: null,
                    startCreateDate: '',
                    endCreateDate: '',
                    cityAgentId: '',
                    cityAgentName: '',
                    regionsCountiesId: '',
                    regionsCountiesName: '',
                    shopId: '',
                    shopName: '',
                    //额外参数，
                    city: '',
                },
                isShowDetail: false,
                detailTitle: '新增',
                isShowOrderList: false,
                tableData: {},
                selectRow: [],
                currentData: {},
                dialogLoading: false,
                isAdmin: this.$store.state.user.roleNames.indexOf('管理员')>-1,
                isCityAgent: this.$store.state.user.roleNames.indexOf('市级代理')>-1,
                regionsCountiesUseForQuery: true,
                header: [
                    {title: '卖货单号',key: 'saleNum',
                        render:(h, params)=>{
                            let num = params.row.saleNum.substring(0,6) + '...'
                            return h('Poptip', {
                                props: {
                                    trigger: 'hover',
                                    content: params.row.saleNum,
                                    transfer: true
                                },
                            },num)
                        }
                    },
                    {title: '市级代理人',key: 'cityAgentUserName',},
                    {title: '区县级代理人',key: 'regionsCountiesUserName',},
                    {title: '店铺名称',key: 'shopName',},
                    {title: '卖货金额',key: 'money',},
                    {title: '总重量',key: 'totalWeight',},
                    {title: '总个数',key: 'totalNumber',},
                    {title: '总其它',key: 'totalOther',},
                    {title: '卖货时间',key: 'saleDate',},
                    {title: '创建时间',key: 'orderCreateDate',},
                    {title: '操作',key: 'createDate', width: 100,
                        render:(h, params)=>{
                            return h('div',[
                                h('Button',{
                                    props:{type: 'primary', size: 'small',},
                                    on:{
                                        click: ()=>{
                                            this.getDetail(params,'卖货明细')
                                        }
                                    }
                                },'卖货明细'),
                            ])
                        },
                    },
                ]
            }
        },
        methods:{
            findByPage(){
                let url = ''
                if(this.isAdmin){
                    url = '/adminSellingGoods/findMyByPage'
                }else if(this.isCityAgent){
                    url = '/cityAgentSellingGoods/findMyByPage'
                }else{
                    url = '/regionsCountiesSellingGoods/findMyByPage'
                }
                let params = JSON.parse(JSON.stringify(this.params))
                params.myCityAgentId = this.params.cityAgentId
                params.cityAgentUserName = this.params.cityAgentName
                params.myRegionsCountiesId = this.params.regionsCountiesId
                params.regionsCountiesUserName = this.params.regionsCountiesName
                this.axios.request({
                    params,
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
                this.selectRow = JSON.parse(JSON.stringify(curRow))   
            },
            getDetail(params,title){
                this.currentData = JSON.parse(JSON.stringify(params.row))
                this.isShowDetail = true
                this.detailTitle = title
            },
            showModel(name){
                switch(name){
                    case '卖货':
                        this.isShowDetail = true
                        this.detailTitle = '卖货'
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
            validNum(value){
                if(value == '' || value == undefined || value == null || value <= 0){
                    return true
                }else{
                    return false
                }
            },
            confirmOrder(){
                this.orderList = this.$refs.createOrder.tableData
                let isAllEmpty = true
                this.orderList.forEach(item =>{
                    console.log(this.validNum(item.unitPrice),this.validNum(item.numericalValue));
                    if(!this.validNum(item.unitPrice) 
                        && !this.validNum(item.numericalValue) 
                        && !this.validNum(item.money)){
                        isAllEmpty = false
                    }
                })
                if(isAllEmpty){
                    this.$Message.warning('请至少填写一项卖货信息')
                    return
                }
                this.orderList = this.orderList.filter((item,index) =>{
                    return (!this.validNum(item.unitPrice) && !this.validNum(item.numericalValue) && !this.validNum(item.money))
                })
                console.log(this.orderList);
                this.isShowOrderList = true
            },
            submitOrder(){
                let sellingInfo = this.$refs.orderList.sellingInfo
                let params = Object.assign({},sellingInfo)
                params.money = 0
                if(params.saleDate == '' || params.saleDate == null){
                    this.$Message.warning('请先选择卖货日期')
                    return
                }
                this.orderList.forEach((item,index) =>{
                    item.categoryName = item.detailName
                    for(let key in item){
                        params[`listDetails[${index}].${key}`] = item[key]
                    }
                    params.money += Number(item.money)
                })
                this.sendData('/regionsCountiesSellingGoods/sellingGoods',params)
            },
            sendData(url,data){
                this.dialogLoading = true
                this.axios.request({
                    url,
                    method: 'post',
                    data: data
                }).then(res =>{
                    this.dialogLoading = false
                    if(res.data.result == 1){
                        this.isShowDetail = false
                        this.$Message.success('卖货成功')
                        this.params.pageIndex=1
                        this.isShowOrderList = false
                        this.isShowDetail = false
                        this.findByPage()
                    }else{
                        this.$Message.error(res.data.msg)
                        this.isShowOrderList = false 
                    }
                }).catch(err =>{
                    this.dialogLoading = false
                    this.$Message.error('网络出现问题，请重试')
                    this.isShowOrderList = false 
                })
            },
            outShowSelectRegionsCounties(){
                if(!this.params.cityAgentName && this.isAdmin){
                    this.$Message.info('请先选择城市代理人')
                    return
                }
                this.showSelectRegionsCounties()
            },
            outShowSelectShop(){
                if(!this.params.regionsCountiesName){
                    this.$Message.info('请先选择区县代理人')
                    return
                }
                this.showSelectShop()
            }
        },
        created(){
            if(this.isAdmin){
                
            }else if(this.isCityAgent){
                this.header.splice(1,1)
            }else{
                this.header.splice(1,3)
            }
            this.findByPage()
        }
    }
</script>

<style lang="less" scoped>
    
</style>