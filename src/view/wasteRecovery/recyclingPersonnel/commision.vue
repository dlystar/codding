<template>
    <!-- 回收人员管理-提成记录 -->
    <div class="commision">
        <div class="searchArea">
            <!-- 地区查询  -->
            <Row type="flex" align="middle" class="code-row-bg">
                <Col span="2">姓名：</Col>
                <Col span="4"><Input v-model="params.name" style="width: 98%;"/></Col>
                <Col span="2">手机号：</Col>
                <Col span="4"><Input v-model="params.phone" style="width: 98%;"/></Col>
                <Col span="2">订单编号：</Col>
                <Col span="4"><Input v-model="params.orderNum" style="width: 98%;"/></Col>
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
                    orderNum: '',
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
                    {title: '回收员姓名',key: 'name',},
                    {title: '回收员手机号',key: 'phone',},
                    {title: '利润',key: 'commission',},
                    {title: '线上订单编号',key: 'orderNum',},
                    {title: '创建时间',key: 'createDate',},
                ]
            }
        },
        methods:{
            findByPage(){
                let url = '/regionsCountiesRecyclerCommission/findByPage'
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
                                    this.sendData('/regionsCountiescommision/remove',{
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