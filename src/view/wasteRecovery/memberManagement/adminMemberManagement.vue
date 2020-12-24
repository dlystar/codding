<template>
    <!-- 会员列表（管理员） -->
    <div class="adminMemberManagement">
        <div class="searchArea">
            <!-- 地区查询  -->
            <Row type="flex" align="middle" class="code-row-bg">
                <Col span="2">选择店铺：</Col>
                <Col span="4">
                    <Input v-model="params.shopName" style="width: 98%;" readonly clearable @on-clear="clearShop">
                        <Icon type="md-apps" slot="suffix" @click="showSelectShop" class="dly_select" />
                    </Input>
                </Col>
                <Col span="2">姓名：</Col>
                <Col span="4"><Input v-model="params.userName" style="width: 98%;"/></Col>
                <Col span="2">手机号：</Col>
                <Col span="4"><Input v-model="params.mobilePhone" style="width: 98%;"/></Col>
                <!-- <Col span="6"><span></span></Col> -->
                <Col span="2">总交易金额：</Col>
                <Col span="4">
                    <InputNumber v-model="params.minMoney"></InputNumber>
                        ——
                    <InputNumber v-model="params.maxMoney"></InputNumber>
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
                <Button :loading="dialogLoading" type="primary" size="large" @click="update()" v-show="detailTitle != '查看详情'">确定</Button>
            </div>
        </Modal>
        <!-- 选择店铺 -->
        <Modal
            v-model="isShowSelectShop"
            :title="'选择店铺'"
            :mask-closable="false"
            width="60%">
            <selectShop :isAdmin="true" v-if="isShowSelectShop" ref="selectShop"></selectShop>
            <div slot="footer">
                <Button type="text" size="large" @click="isShowSelectShop = false">取消</Button>
                <Button :loading="dialogLoading" type="primary" size="large" @click="selectShop()">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import detail from './components/memberDetai.vue'
    import selectShop from '@com/selectShop.vue'
    import mixins from '@com/mixins'
    export default{
        components: {detail,selectShop},
        mixins: [mixins],
        data(){
            return{
                buttons: this.$store.state.user.currentMenuButtons,
                self: this,
                params:{
                    pageIndex: 1,
                    pageSize: 10,
                    footprintShopId: '',
                    shopId: '',
                    shopName: '',
                    userName: '',
                    mobilePhone: '',
                    minMoney: null,
                    maxMoney: null,
                    createDate: '',
                    startCreateDate: '',
                    endCreateDate: '',
                },
                isShowDetail: false,
                detailTitle: '新增',
                tableData: [],
                selectRow: [],
                currentData: {},
                dialogLoading: false,
                allCategoryClass: [],
                header: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },  
                    // {title: '分类名称',key: 'categoryName',},
                    {title: '姓名',key: 'userName',},
                    {title: '微信昵称',key: 'nickName',},
                    {title: '手机号',key: 'mobilePhone', width: 100},
                    {title: '环保次数',key: 'numberOfOrders',},
                    {title: '总金额',key: 'totalMoney',},
                    {title: '总积分',key: 'totalPoints',},
                    {title: '剩余积分',key: 'balancePoints',},
                    {title: '线上余额',key: 'balance',},
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
            }
        },
        methods:{
            findByPage(){
                this.params.footprintShopId = this.params.shopId
                this.axios.request({
                    params: this.params,
                    url: '/adminMemberManagement/findByPage',
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
                let url = this.detailTitle == '新增' ? '/adminMemberManagement/add' : '/adminMemberManagement/update'
                let data = JSON.parse(JSON.stringify(this.currentData))
                let detail = this.$refs.detail.$refs.detail
                console.log(data);
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
            findAllCategoryClass(){
                //allCategoryClass
                this.axios.request({
                    params: this.params,
                    url: '/categoryClass/findAll',
                    method: 'get'
                }).then(res =>{
                    this.allCategoryClass = res.data.rows
                }).catch(err =>{
                    console.log('网络异常')
                })
            },
            showShop(){

            }
        },
        created(){
            this.findByPage()
            this.findAllCategoryClass()
        }
    }
</script>

<style lang="less" scoped>
    
</style>