/* 
    区县所属人选择器
 */
<template>
    <div class="selectRegionsCounties dialogSelect">
        <div class="searchArea">
            <Row type="flex" align="middle" class="code-row-bg">
                <Col span="2">姓名：</Col>
                <Col span="4"><Input v-model="params.userName" style="width: 98%;"/></Col>
                <Col span="2">手机号码：</Col>
                <Col span="4"><Input v-model="params.mobilePhone" style="width: 98%;"/></Col>
                <Col span="2">账号名称：</Col>
                <Col span="4"><Input v-model="params.accountName" style="width: 98%;"/></Col>
                <Col span="2">代理城市：</Col>
                <Col span="4"><Input v-model="params.city" style="width: 98%;"/></Col>
                <Col span="2">代理区县：</Col>
                <Col span="4"><Input v-model="params.regionsAndCounties" style="width: 98%;"/></Col>
                <Col span="2"><span></span></Col>
                <Col span="4"><Button type="primary" @click="params.pageIndex=1;findByPage()">查询</Button></Col>
            </Row>
        </div>
        <Table 
            :max-height="300"
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
    </div>
</template>

<script>
    export default{
        name: 'selectRegionsCounties',
        props: ['isCityAgent','isAdmin','city'],
        data(){
            return{
                self: this,
                params:{
                    pageIndex: 1,
                    pageSize: 10,
                    userName: '',
                    mobilePhone: '',
                    accountName: '',
                    city: '',
                    regionsAndCounties: '',
                },
                tableData: [],
                selectRow: [],
                currentData: {},
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
                    {title: '姓名',key: 'userName',},
                    {title: '账号',key: 'accountName',},
                    {title: '手机号',key: 'mobilePhone', width: 100},
                    {title: '代理的城市',key: 'city',},
                    {title: '代理的区县',key: 'regionsAndCounties',},
                ]
            }
        },
        methods:{
            findByPage(){
                let url = ''
                if(this.isCityAgent){
                    url = '/cityAgentRegionsCounties/findByPage'
                }
                console.log(this.isAdmin);
                if(this.isAdmin){
                    url = '/adminRegionsCounties/findByPage'
                }
                this.axios.request({
                    params: this.params,
                    url,
                    method: 'get'
                }).then(res =>{
                    if(res.data.rows){
                        this.tableData = res.data
                    }
                }).catch(err =>{
                    console.log('网络异常')
                })
            },
            changePage(current){
                this.params.pageIndex = current
                this.findByPage()
            },
            setSelectRow(curRow){
                this.currentData = JSON.parse(JSON.stringify(curRow))   
            }
        },
        created(){
            if(this.city){
                this.params.city = this.city
            }
            this.findByPage()
        }
    }
</script>

<style lang="less" scoped>
    
</style>