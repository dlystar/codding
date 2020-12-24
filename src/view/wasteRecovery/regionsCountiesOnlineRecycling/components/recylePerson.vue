<template>
    <!-- 订单管理（管理员和市级代理） -->
    <div class="recyclingPersonnel">
        <div class="searchArea">
            <!-- 地区查询  -->
            <Row type="flex" align="middle" class="code-row-bg">
                <Col span="2">姓名：</Col>
                <Col span="4"><Input v-model="params.name" style="width: 98%;"/></Col>
                <Col span="2">手机号：</Col>
                <Col span="4"><Input v-model="params.phone" style="width: 98%;"/></Col>
                <Col span="2"><span></span></Col>
                <Col span="4"><Button type="primary" @click="params.pageIndex=1;findByPage()">查询</Button></Col>
            </Row>
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
    </div>
</template>

<script>
    export default{
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
                        // type: 'selection',
                        width: 60,
                        key: 'id',
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
                    // {title: '操作',key: 'createDate', width: 100,
                    //     render:(h, params)=>{
                    //         return h('div',[
                    //             h('Button',{
                    //                 props:{type: 'primary', size: 'small',},
                    //                 on:{
                    //                     click: ()=>{
                    //                         this.getDetail(params,'查看详情')
                    //                     }
                    //                 }
                    //             },'查看详情'),
                    //         ])
                    //     },
                    // },
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
                this.currentData = JSON.parse(JSON.stringify(curRow))
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
    .recyclingPersonnel{
        .page{
            overflow: hidden;
            margin-top: 10px;
        }
    }
</style>