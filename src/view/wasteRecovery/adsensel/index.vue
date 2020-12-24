<template>
    <!-- 广告位管理-管理员和城市代理人 -->
    <div class="adsensel">
        <div class="searchArea">
            <!-- 地区查询 批量绑定协会  -->
            <Row type="flex" align="middle" class="code-row-bg">
                <template v-if="isAdmin">
                    <Col span="2">市级代理人：</Col>
                    <Col span="4">
                        <Input v-model="params.cityAgentName" style="width: 98%;" readonly clearable @on-clear="clearSelectCityAgent">
                            <Icon type="md-apps" slot="suffix" @click="showSelectCityAgent" class="dly_select" />
                        </Input>
                    </Col>
                    <Col span="2">城市：</Col>
                    <Col span="4"><Input v-model="params.city" style="width: 98%;"/></Col>
                </template>
                <Col span="2">投放地址：</Col>
                <Col span="4">
                    <!-- <Input v-model="params.shopName" style="width: 98%;"/> -->
                    <Select v-model="params.available" clearable style="width: 98%;">
                        <Option :value="1">全国</Option>
                        <Option :value="2">市级</Option>
                    </Select>
                </Col>
                <Col span="2">是否可用：</Col>
                <Col span="4">
                    <Select v-model="params.available" clearable style="width: 98%;">
                        <Option :value="1">可用</Option>
                        <Option :value="2">不可用</Option>
                    </Select>
                </Col>
                <Col span="2">创建日期：</Col>
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
            <detail v-if="isShowDetail" ref="detail" :title="detailTitle" :detail="currentData"></detail>
            <div slot="footer">
                <Button type="text" size="large" @click="isShowDetail = false">取消</Button>
                <Button :loading="dialogLoading" type="primary" size="large" @click="update()" v-show="detailTitle != '查看详情'">确定</Button>
            </div>
        </Modal>
        <!-- 选择区县所属人 -->
        <Modal
            v-model="isShowSelectCityAgent"
            title="选择区县所属人"
            :mask-closable="false"
            width="60%">
            <selectCityAgent v-if="isShowSelectCityAgent" ref="selectCityAgent"></selectCityAgent>
            <div slot="footer">
                <Button type="text" size="large" @click="isShowSelectCityAgent = false">取消</Button>
                <Button type="primary" size="large" @click="selectCityAgent()">确定</Button>
            </div>
        </Modal>
        <Modal title="预览图片" v-model="visible">
            <img v-for="item in imageUrl" :src="item" v-if="visible" style="width: 100%">
        </Modal>
    </div>
</template>

<script>
    import detail from './components/detail.vue'
    import selectCityAgent from '@com/selectCityAgent.vue'
    import mixins from '@com/mixins'
    import config from '@/config'
    const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
    export default{
        name: 'adsensel',
        components: {detail,selectCityAgent},
        mixins: [mixins],
        data(){
            return{
                buttons: this.$store.state.user.currentMenuButtons,
                isAdmin: this.$store.state.user.roleNames.indexOf('管理员')>-1,
                self: this,
                params:{
                    pageIndex: 1,
                    pageSize: 10,
                    cityAgentId: '',
                    cityAgentName: '',
                    city: '',
                    shopName: '',
                    available: '',
                    startCreateDate: '',
                    endCreateDate: '',
                },
                regionsCountiesUseForQuery: true,
                isShowDetail: false,
                detailTitle: '新增',
                tableData: [],
                selectRow: [],
                currentData: {},
                dialogLoading: false,
                visible: false,
                imageUrl: [],
                header: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },  
                    {title: '城市',key: 'city',},
                    {title: '图片地址',key: 'images',},
                    {title: '图片描述',key: 'des',},
                    {title: '图片链接',key: 'linkUrl',},
                    {title: '是否可用',key: 'available',
                        render:(h,params)=>{
                            return h('span',{},params.row.available == 1 ? '可用':'不可用')
                        }
                    },
                    {title: '排序值',key: 'sort',},
                    {title: '创建时间',key: 'createDate',},
                    {title: '预览',key: 'images',
                        render:(h, params)=>{
                            return h('Icon',{
                                props:{
                                    title: '预览图片',
                                    type: "ios-eye-outline",
                                    size: 20
                                },
                                on:{
                                    click: ()=>{
                                        this.handleView(params.row)
                                    }
                                }
                            },'')
                        },
                    },
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
                let url = ''
                if(this.isAdmin){
                    url = '/adminAdsensel/findByPage'
                }else{
                    url = '/cityAgentAdsensel/findByPage'
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
                    case '删除':
                        if(this.selectRow.length < 1){
                            this.$Message.info('请选择一条数据')
                            return
                        }else{
                            this.$Modal.confirm({
                                title: '温馨提示',
                                content: `是否删除选中的广告？`,
                                onOk: () => {
                                    this.detailTitle = '删除'
                                    let url = this.isAdmin ? '/adminAdsensel/remove' : '/adminAdsensel/remove'
                                    let params = {
                                        ids: this.selectRow.map(item => item.id).join(',')
                                    }
                                    // this.dialogLoading = true
                                    this.axios.request({
                                        url,
                                        method: 'get',
                                        params,
                                    }).then(res =>{
                                        this.dialogLoading = false
                                        if(res.data.result == 1){
                                            this.isShowDetail = false
                                            this.$Message.success(this.detailTitle + '成功')
                                            this.params.pageIndex=1
                                            this.findByPage()
                                            this.selectRow = []
                                        }else{
                                            this.$Message.error(res.data.msg) 
                                        }
                                    }).catch(err =>{
                                        this.dialogLoading = false
                                        this.$Message.error('网络出现问题，请重试')
                                    })
                                }
                            });
                        }
                    break;
                }
            },
            update(){
                let base = ''
                if(this.isAdmin){
                    base = '/adminAdsensel'
                }else{
                    base = '/cityAgentAdsensel'
                }
                let url = this.detailTitle == '新增' ? base+'/add' : base+'/update'
                let data = JSON.parse(JSON.stringify(this.currentData))
                let detail = this.$refs.detail.$refs.detail
                console.log(detail);
                if(this.detailTitle == '新增'){
                    data.regionsCountiesId = ''
                }
                // if(!data.cityAgentName){
                //     this.$Message.warning('请选择城市代理人')
                //     return
                // }
                detail.validate(valid =>{
                    if(valid){
                        this.sendData(url,data)
                    }
                })
            },
            sendData(url,data,method='post'){
                this.dialogLoading = true
                this.axios.request({
                    url,
                    method,
                    data: data || this.currentData
                }).then(res =>{
                    this.dialogLoading = false
                    if(res.data.result == 1){
                        this.isShowDetail = false
                        this.$Message.success(this.detailTitle + '成功')
                        this.params.pageIndex=1
                        this.findByPage()
                        this.selectRow = []
                    }else{
                        this.$Message.error(res.data.msg) 
                    }
                }).catch(err =>{
                    this.dialogLoading = false
                    this.$Message.error('网络出现问题，请重试')
                })
            },
            handleView(params){
                this.visible = true
                this.imageUrl = []
                if(params.images == null || params.images == "" || params.images == undefined ){
                    this.imageUrl = []
                }else{
                    params.images.split(",").forEach(item=> this.imageUrl.push( baseUrl + item) )
                }
            }
        },
        created(){
            this.findByPage()
        }
    }
</script>

<style lang="less" scoped>
    .adsensel{

    }
</style>