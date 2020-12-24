<template>
    <!--  区县级代理（市级代理） -->
    <div class="cityAgentRegionsCounties">
        <div class="searchArea">
            <!-- 地区查询 批量绑定协会  -->
            <Row type="flex" align="middle" class="code-row-bg">
                <Col span="2">姓名：</Col>
                <Col span="4"><Input v-model="params.userName" style="width: 98%;"/></Col>
                <Col span="2">账号名称：</Col>
                <Col span="4"><Input v-model="params.accountName" style="width: 98%;"/></Col>
                <Col span="2">手机号码：</Col>
                <Col span="4"><Input v-model="params.mobilePhone" style="width: 98%;"/></Col>
                <Col span="2">代理区县：</Col>
                <Col span="4"><Input v-model="params.regionsAndCounties" style="width: 98%;"/></Col>
                <Col span="2">代理人状态：</Col>
                <Col span="4">
                    <Select v-model="params.userStatus" clearable style="width: 98%;">
                        <Option :value="1">正常</Option>
                        <Option :value="2">锁定</Option>
                    </Select>
                </Col>
                <Col span="2">创建日期：</Col>
                <Col span="4">
                    <DatePicker @on-change="changeDate" format="yyyy-MM-dd HH:mm:ss" 
                        type="datetimerange" placeholder="请选择日期" style="width: 98%;">
                    </DatePicker>
                </Col>
                <!-- <Col span="2">市级代理人：</Col>
                <Col span="4">
                    <Input v-model="params.cityAgentName" style="width: 98%;" readonly >
                        <Icon type="md-apps" slot="suffix" @click="showSelectCityAgent" class="dly_select" />
                    </Input>
                </Col> -->
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
        <!-- 选择城市所属人 -->
        <Modal
            v-model="isShowSelectCityAgent"
            title="选择城市所属人"
            :mask-closable="false"
            width="60%">
            <selectCityAgent v-if="isShowSelectCityAgent" ref="selectCityAgent"></selectCityAgent>
            <div slot="footer">
                <Button type="text" size="large" @click="isShowSelectCityAgent = false">取消</Button>
                <Button type="primary" size="large" @click="selectCityAgent()" v-show="detailTitle != '查看详情'">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import detail from './components/detail.vue'
    import selectCityAgent from '@com/selectCityAgent.vue'
    import mixins from '@com/mixins'
    export default{
        name: 'cityAgentRegionsCounties',
        components: {detail,selectCityAgent},
        mixins: [mixins],
        data(){
            return{
                buttons: this.$store.state.user.currentMenuButtons,
                self: this,
                params:{
                    pageIndex: 1,
                    pageSize: 10,
                    userName: '',
                    accountName: '',
                    mobilePhone: '',
                    province: '',
                    city: '',
                    regionsAndCounties: '',
                    userStatus: '',
                    startCreateDate: '',
                    endCreateDate: '',
                    cityAgentId: '',
                    cityAgentName: ''
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
                    {title: '姓名',key: 'userName',},
                    {title: '账号',key: 'accountName',},
                    {title: '手机号',key: 'mobilePhone', width: 100},
                    {title: '代理地址',key: 'address',},
                    {title: '账户余额',key: 'accountBalance',},
                    // {title: '代理的市区',key: 'city',},
                    // {title: '代理的区县',key: 'regionsAndCounties',},
                    {title: '手续费比例',key: 'brokerage',},
                    {title: '佣金比例',key: 'commissionRate',},
                    {title: '状态',key: 'userStatus',
                        render:(h, params)=>{
                            let status = '锁定'
                            if(params.row.userStatus == 1) status = '正常'
                            return h('Tag',{
                                props:{color: params.row.userStatus == 1 ? 'success' : 'error'},
                            },status)
                        }
                    },
                    {title: '创建时间',key: 'createDate',},
                    {title: '操作',key: 'oprate', width: 100,
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
                ]
            }
        },
        methods:{
            findByPage(){
                this.axios.request({
                    params: this.params,
                    url: '/cityAgentRegionsCounties/findByPage',
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
                let url = this.detailTitle == '新增' ? '/cityAgentRegionsCounties/add' : '/cityAgentRegionsCounties/update'
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
        },
        created(){
            this.findByPage()
        }
    }
</script>

<style lang="less" scoped>
    .cityAgentRegionsCounties{

    }
</style>