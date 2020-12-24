<template>
    <!-- 订单管理（管理员和市级代理） -->
    <div class="adminMemberManagement">
        <div class="searchArea">
            <!-- 地区查询  -->
            <Row type="flex" align="middle" class="code-row-bg">
                <Col span="2">订单编号：</Col>
                <Col span="4"><Input v-model="params.orderNum" style="width: 98%;"/></Col>
                <Col span="2">会员姓名：</Col>
                <Col span="4"><Input v-model="params.userName" style="width: 98%;"/></Col>
                <Col span="2">会员手机号：</Col>
                <Col span="4"><Input v-model="params.mobilePhone" style="width: 98%;"/></Col>
                <Col span="2">总交易金额：</Col>
                <Col span="4">
                    <InputNumber v-model="params.minMoney"></InputNumber>
                        ——
                    <InputNumber v-model="params.maxMoney"></InputNumber>
                </Col>
                <Col span="2">回收哥姓名：</Col>
                <Col span="4"><Input v-model="params.recyclingPersonnelName" style="width: 98%;"/></Col>
                <Col span="2">回收哥手机号：</Col>
                <Col span="4"><Input v-model="params.recyclingPersonnelPhone" style="width: 98%;"/></Col>
                <Col span="2">支付类型：</Col>
                <Col span="4">
                    <Select v-model="params.payType" clearable style="width: 98%;">
                        <Option :value="'1'">线下支付</Option>
                        <Option :value="'2'">线上支付</Option>
                    </Select>
                </Col>
                <Col span="2">总重量：</Col>
                <Col span="4">
                    <InputNumber v-model="params.minTotalWeight"></InputNumber>
                        ——
                    <InputNumber v-model="params.maxTotalWeight"></InputNumber>
                </Col>
                <Col span="2">订单状态：</Col>
                <Col span="4">
                    <Select v-model="params.orderStatus" clearable style="width: 98%;">
                        <Option :value="'1'">完成</Option>
                        <Option :value="'2'">创建</Option>
                        <Option :value="'3'">取消</Option>
                    </Select>
                </Col>
                <Col span="2">接单状态：</Col>
                <Col span="4">
                    <Select v-model="params.orderReceivingStatus" clearable style="width: 98%;">
                        <Option :value="'1'">已完成</Option>
                        <Option :value="'2'">未接单</Option>
                        <Option :value="'3'">已接单</Option>
                    </Select>
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
            class="myTable"
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
            <ordetail v-if="isShowDetail && detailTitle=='订单明细'" ref="ordetail" :title="detailTitle" :detail="currentData"></ordetail>
            <onlieRecycle v-if="isShowDetail  && detailTitle=='回收到店'" ref="onlieRecycle" :detail="currentData"></onlieRecycle>
            <div slot="footer">
                <Button type="text" size="large" @click="isShowDetail = false">取消</Button>
                <Button :loading="dialogLoading" type="primary" size="large" @click="update()" v-show="detailTitle == '回收到店'">确定</Button>
            </div>
        </Modal>
        <!-- 分配回收员 -->
        <Modal
            v-model="isShowRecylePerson"
            title="分配回收员"
            :mask-closable="false"
            width="60%">
            <recylePerson v-if="isShowRecylePerson" ref="recylePerson"></recylePerson>
            <div slot="footer">
                <Button type="text" size="large" @click="isShowRecylePerson = false">取消</Button>
                <Button :loading="dialogLoading" type="primary" size="large" @click="selectRecylePerson()">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import recylePerson from './components/recylePerson.vue'
    import ordetail from './components/orderDetail.vue'
    import onlieRecycle from './components/onlieRecycle.vue'
    export default{
        components: {recylePerson,ordetail,onlieRecycle},
        data(){
            return{
                buttons: this.$store.state.user.currentMenuButtons,
                self: this,
                params:{
                    pageIndex: 1,
                    pageSize: 10,
                    orderNum: '',
                    userName: '',
                    mobilePhone: '',
                    minMoney: null,
                    maxMoney: null,
                    recyclingPersonnelName: '',
                    recyclingPersonnelPhone: '',
                    shopName: '',
                    minTotalWeight: null,
                    maxTotalWeight: null,
                    orderType: '',
                    orderStatus: '',
                    orderReceivingStatus: '',
                    minTotalNumber: null,
                    maxTotalNumber: null,
                    payType: '',
                    minTotalOther: null,
                    maxTotalOther: null,
                    startCreateDate: '',
                    endCreateDate: '',
                },
                isShowDetail: false,
                detailTitle: '新增',
                isShowRecylePerson: false,
                tableData: {
                    rows:[]
                },
                selectRow: [],
                currentData: {},
                dialogLoading: false,
                isAdmin: this.$store.state.user.roleNames.indexOf('管理员')>-1,
                header: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },  
                    {title: '姓名',key: 'userName',},
                    {title: '手机号',key: 'mobilePhone', width: 100},
                    {title: '订单编号',key: 'orderNum',  width: 80,
                        render:(h, params)=>{
                            let num = params.row.orderNum.substring(0,6) + '...'
                            return h('Poptip', {
                                props: {
                                    trigger: 'hover',
                                    content: params.row.orderNum
                                },
                            },num)
                        }
                    },
                    {title: '总金额',key: 'money',  maxWidth: 100,},
                    {title: '总重量',key: 'totalWeight',  maxWidth: 100,},
                    {title: '总个数',key: 'totalNumber',  maxWidth: 100,},
                    {title: '总其他数据',key: 'totalOther', maxWidth: 100,},
                    {title: '回收人',key: 'recyclingPersonnelName',},
                    {title: '回收人手机',key: 'recyclingPersonnelPhone', width: 100},
                    {title: '订单状态',key: 'orderStatus',
                        render:(h, params)=>{
                            try{
                                let statusName = this.statusObj.orderStatus[Number(params.row.orderStatus)]
                                let tagName = statusName == '' ? 'span' : 'Tag'
                                return h(tagName,{
                                    props: {color: this.colors[params.row.orderStatus]}
                                },statusName)
                            }catch(err){
                                return h('span',{},'')
                            }
                        }
                    },
                    {title: '接单状态',key: 'orderReceivingStatus',
                        render:(h, params)=>{
                            try{
                                let statusName = this.statusObj.orderReceivingStatus[Number(params.row.orderReceivingStatus)]
                                let tagName = statusName == '' ? 'span' : 'Tag'
                                return h(tagName,{
                                    props: {color: this.colors[params.row.orderReceivingStatus]}
                                },statusName)
                                return h('span',{},statusName)
                            }catch(err){
                                return h('span',{},'')
                            }
                        }
                    },
                    {title: '支付类型',key: 'payType',
                        render:(h, params)=>{
                            try{
                                let statusName = this.statusObj.payType[Number(params.row.payType)]
                                let tagName = statusName == '' ? 'span' : 'Tag'
                                return h(tagName,{
                                    props: {color: this.colors[params.row.payType]}
                                },statusName)
                                return h('span',{},statusName)
                            }catch(err){
                                return h('span',{},'')
                            }
                        }
                    },
                    {title: '创建时间',key: 'orderCreateDate',  minWidth: 75, maxWidth: 150},
                    {title: '操作',key: 'createDate', width: 100,
                        render:(h, params)=>{
                            return h('div',[
                                h('Button',{
                                    props:{type: 'primary', size: 'small',},
                                    on:{
                                        click: ()=>{
                                            this.getDetail(params,'订单明细')
                                        }
                                    }
                                },'订单明细'),
                            ])
                        },
                    },
                ],
                statusObj:{
                    orderType: ['','线下订单','线上订单'],
                    orderStatus: ['','完成','创建','取消'],
                    orderReceivingStatus: ['','已完成','未接单','已接单'],
                    payType: ['','线下支付','线上支付'],
                },
                colors: ['','success','blue','geekblue']
            }
        },
        methods:{
            findByPage(){
                let url = '/regionsCountiesOnlineRecycling/findMyByPage'
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
                this.selectRow = JSON.parse(JSON.stringify(curRow))   
            },
            async getDetail(params,title){
                this.currentData = JSON.parse(JSON.stringify(params.row))
                let res = await this.getOrderDetail()
                if(res.data.rows == null){
                    this.$Message.info('回收员暂未完成回收')
                    return
                }
                this.isShowDetail = true
                this.detailTitle = title
            },
            showModel(name){
                this.detailTitle = name
                switch(name){
                    case '分配回收员':
                        if(this.selectRow.length  == 1){
                            this.currentData = JSON.parse(JSON.stringify(this.selectRow[0]))
                            this.isShowRecylePerson = true
                        }else if(this.selectRow.length < 1){
                            this.$Message.info('请选择一条数据')
                        }else{
                            this.$Message.info('请选择一条数据进行编辑')
                        }
                    break;
                    case '回收到店':
                        if(this.selectRow.length  == 1){
                            this.currentData = JSON.parse(JSON.stringify(this.selectRow[0]))
                            this.isShowDetail = true
                        }else if(this.selectRow.length < 1){
                            this.$Message.info('请选择一条数据')
                        }else{
                            this.$Message.info('请选择一条数据进行编辑')
                        }
                    break;
                }
            },
            update(){
                let url = '/regionsCountiesOnlineRecycling/recycleToShop'
                let params = {}
                this.$refs.onlieRecycle.tableData.forEach(item =>{
                    if(item.index == '回收员利润'){
                        params.commission = item.money
                    }
                })
                params.memberOrderId = this.currentData.id
                console.log(params);
                this.sendData(url,params)
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
            getOrderDetail(){
                let url = ''
                if(this.isAdmin){
                    url = '/adminMemberOrder/findDetail'
                }else{
                    url = '/adminMemberOrder/findDetail'
                }
                return this.axios.request({
                    params: {
                        orderId: this.currentData.id+''
                    },
                    url,
                    method: 'get'
                })
            },
            selectRecylePerson(){
                console.log(this.$refs.recylePerson.currentData);
                if(!this.$refs.recylePerson.currentData.id){
                    this.$Message.warning('请选择回收员')
                    return 
                }
                this.dialogLoading = true
                this.axios.request({
                    url: '/regionsCountiesOnlineRecycling/assignRecyclers',
                    method: 'post',
                    data: {
                        memberOrderId: this.currentData.id,
                        recyclingPersonnelId: this.$refs.recylePerson.currentData.id
                    }
                }).then(res =>{
                    this.dialogLoading = false
                    if(res.data.result == 1){
                        this.isShowRecylePerson = false
                        this.$Message.success('分配回收员成功')
                        this.params.pageIndex=1
                        this.findByPage()
                    }else{
                        this.$Message.error(res.data.msg) 
                    }
                }).catch(err =>{
                    this.dialogLoading = false
                    this.$Message.error('网络出现问题，请重试')
                })
            }
        },
        created(){
            this.findByPage()
        }
    }
</script>

<style lang="less" scoped>
    .myTable{
        /deep/.ivu-table-cell{
            padding-left: 5px;
            padding-right: 5px;
        }
        /deep/.ivu-tag{
            padding: 0 3px;
        }
    }
</style>