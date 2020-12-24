<template>
    <!-- 品类管理-品类分类管理 -->
    <div class="shopAssistant">
        <div class="searchArea">
            
            <Row type="flex" align="middle" class="code-row-bg">
                <Col span="2">姓名：</Col>
                <Col span="4"><Input v-model="params.userName" style="width: 98%;"/></Col>
                <Col span="2">手机号：</Col>
                <Col span="4"><Input v-model="params.mobilePhone" style="width: 98%;"/></Col>
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
            title="添加店员"
            :mask-closable="false"
            width="60%">
            <detail v-if="isShowDetail" ref="detail" :title="detailTitle" :detail="currentData"></detail>
            <div slot="footer">
                <Button type="text" size="large" @click="isShowDetail = false">取消</Button>
                <Button :loading="dialogLoading" type="primary" size="large" @click="update()" v-show="detailTitle != '查看详情'">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import detail from './components/detail.vue'
    export default{
        components: {detail},
        data(){
            return{
                buttons: this.$store.state.user.currentMenuButtons,
                self: this,
                params:{
                    pageIndex: 1,
                    pageSize: 10,
                    userName: '',
                    mobilePhone: '',
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
                    {title: '手机号',key: 'mobilePhone', width: 100},
                    {title: '总收货金额',key: 'sumReceivingMoney',},
                    {title: '总收货次数',key: 'sumTradingVolume',},
                    {title: '总兑换次数',key: 'sumExchangeVolume',},
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
                    {title: '总收货金额',key: 'sumReceivingMoney',},
                    {title: '操作', key: 'sumReceivingMoney', width: 100,
                        render:(h, params)=>{
                            let  name = params.row.userStatus == '1' ? '禁用' : '启用'
                            return h('div',[
                                h('Button',{
                                    props:{type: name == '禁用' ? 'error' : 'info', size: 'small',},
                                    on:{
                                        click: ()=>{
                                            this.oprate(params.row)
                                        }
                                    }
                                },name),
                            ])
                        },
                    },
                ],
            }
        },
        methods:{
            findByPage(){
                this.axios.request({
                    params: this.params,
                    url: '/regionsCountiesShopAssistant/findMyShopAssistant',
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
                    case '添加店员':
                        this.isShowDetail = true
                        this.detailTitle = '添加店员'
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
                let url = '/regionsCountiesShopAssistant/add'
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
                    data: data
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
            oprate(item){
                let name = item.userStatus == '1' ? '禁用' : '启用'
                this.detailTitle = name
                this.$Modal.confirm({
                    title: '温馨提示',
                    content: `是否${name}该店员？`,
                    onOk: () => {
                        this.sendData('/regionsCountiesShopAssistant/disableOrEnableUser',{
                            id: item.id,
                            status: item.userStatus == '1' ? '2' : '1'
                        })
                    }
                });
            }
        },
        created(){
            this.findByPage()
        }
    }
</script>

<style lang="less" scoped>
    
</style>