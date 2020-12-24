<template>
    <!-- 订单管理（管理员和市级代理） -->
    <div class="recyclingPersonnel">
        <div class="searchArea">
            <!-- 地区查询  -->
            <Row type="flex" align="middle" class="code-row-bg">
                <template v-if="isAdmin">
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
                    <Col span="2">选择店铺：</Col>
                    <Col span="4">
                        <Input v-model="params.shopName" style="width: 98%;" readonly clearable @on-clear="clearShop">
                            <Icon type="md-apps" slot="suffix" @click="outShowSelectShop" class="dly_select" />
                        </Input>
                    </Col>
                </template>
                <Col span="2">姓名：</Col>
                <Col span="4"><Input v-model="params.name" style="width: 98%;"/></Col>
                <Col span="2">手机号：</Col>
                <Col span="4"><Input v-model="params.phone" style="width: 98%;"/></Col>
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
                <Button type="primary" size="large" @click="update()" v-show="detailTitle != '查看详情'">提交</Button>
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
    </div>
</template>

<script>
    import detail from './components/detail.vue'
    import selectCityAgent from '@com/selectCityAgent.vue'
    import selectRegionsCounties from '@com/selectRegionsCounties.vue'
    import selectShop from '@com/selectShop.vue'
    import mixins from '@com/mixins'
    export default{
        components: {detail,selectCityAgent,selectRegionsCounties,selectShop},
        mixins: [mixins],
        data(){
            return{
                buttons: this.$store.state.user.currentMenuButtons,
                self: this,
                params:{
                    pageIndex: 1,
                    pageSize: 10,
                    name: '',
                    phone: '',
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
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {title: '回收员姓名',key: 'name',},
                    {title: '回收员手机号',key: 'phone',},
                    {title: '账户余额',key: 'balance',},
                    {title: '佣金比例',key: 'commissionRate',},
                    {title: '状态',key: 'userStatus',
                        render:(h, params)=>{
                            try{
                                let statusName = params.row.userStatus == '1' ? '正常' : '锁定'
                                return h('span',{},statusName)
                            }catch(err){
                                return h('span',{},'')
                            }
                        }
                    },
                    {title: '创建时间',key: 'createDate',},
                    {title: '操作',key: 'createDate', width: 100,
                        render:(h, params)=>{
                            return h('div',[
                                h('Button',{
                                    props:{type: 'primary', size: 'small',},
                                    on:{
                                        click: ()=>{
                                            this.getDetail(params,'查看详情')
                                        }
                                    }
                                },'查看详情'),
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
                    url = '/adminRecyclingPersonnel/findByPage'
                }else{
                    url = '/regionsCountiesRecyclingPersonnel/findByPage'
                }
                let params = JSON.parse(JSON.stringify(this.params))
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
                    case '新增':
                        this.isShowDetail = true
                        this.detailTitle = '新增'
                        this.currentData = {
                            commissionRate: null
                        }
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
                    case '删除':
                        if(this.selectRow.length < 1){
                            this.$Message.info('请选择一条数据')
                        }else{
                            this.detailTitle = '删除'
                            this.$Modal.confirm({
                                title: '温馨提示',
                                content: `是否删除回收员？`,
                                onOk: () => {
                                    this.sendData('/regionsCountiesRecyclingPersonnel/remove',{
                                        ids: this.selectRow.map(item => item.id).join(','),
                                    },'get')
                                }
                            });
                        }
                    break;
                }
            },
            update(){
                let url = this.detailTitle == '新增' ? '/regionsCountiesRecyclingPersonnel/add' : '/regionsCountiesRecyclingPersonnel/update'
                let data = JSON.parse(JSON.stringify(this.currentData))
                let detail = this.$refs.detail.$refs.detail
                console.log(data);
                detail.validate(valid =>{
                    if(valid){
                        this.sendData(url,data)
                    }
                })
            },
            sendData(url,data,method='post'){
                this.dialogLoading = true
                let requestParams = {}
                if(method == 'get'){
                    requestParams = {
                        url,
                        method,
                        params: data
                    }
                }else{
                    requestParams = {
                        url,
                        method,
                        data: data
                    }
                }
                this.axios.request(requestParams).then(res =>{
                    this.dialogLoading = false
                    if(res.data.result == 1){
                        this.isShowDetail = false
                        this.$Message.success(`${this.detailTitle}成功`)
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
            this.findByPage()
        }
    }
</script>

<style lang="less" scoped>
    
</style>