/* 
    城市所属人选择器
 */
<template>
    <div class="selectCityAgent dialogSelect">
        <div class="searchArea">
            <!-- 地区查询 批量绑定协会  -->
            <Row type="flex" align="middle" class="code-row-bg">
                <Col span="2">姓名：</Col>
                <Col span="4"><Input v-model="params.userName" style="width: 98%;"/></Col>
                <Col span="2">手机号码：</Col>
                <Col span="4"><Input v-model="params.mobilePhone" style="width: 98%;"/></Col>
                <Col span="2">账号名称：</Col>
                <Col span="4"><Input v-model="params.accountName" style="width: 98%;"/></Col>
                <Col span="2">代理省份：</Col>
                <Col span="4"><Input v-model="params.province" style="width: 98%;"/></Col>
                <Col span="2">代理市区：</Col>
                <Col span="4"><Input v-model="params.city" style="width: 98%;"/></Col>
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
        name: 'selectCityAgent',
        data(){
            return{
                self: this,
                params:{
                    pageIndex: 1,
                    pageSize: 10,
                    userName: '',
                    mobilePhone: '',
                    accountName: '',
                    province: '',
                    city: '',
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
                    {title: '代理的省份',key: 'province',},
                    {title: '代理的城市',key: 'city',},
                ]
            }
        },
        methods:{
            findByPage(){
                this.axios.request({
                    params: this.params,
                    url: '/adminCityAgent/findByPage',
                    method: 'get'
                }).then(res =>{
                    this.tableData = res.data
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
            this.findByPage()
        }
    }
</script>

<style lang="less" scoped>
    .selectCityAgent{
        .page{
            overflow: hidden;
            margin-top: 10px;
        }
    }
</style>