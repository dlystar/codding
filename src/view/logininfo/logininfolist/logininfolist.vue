<template>
    <div class="loginInfoList">
        <div class="searchArea">
            <Row type="flex" justify="center" align="middle" class="code-row-bg">
                <Col span="1">
                    账号：
                </Col>
                <Col span="9">
                    <Input v-model="name" style="width: 98%;"/>
                </Col>
                <Col span="2">
                    <Button type="primary" @click="pageIndex=1;getMessage()" v-no-more-click>查询</Button>
                </Col>
                <Col span="12">
                </Col>
            </Row>
        </div>
        <tree-table 
            ref="tree" 
            :selectable="false" 
            :expand-type="false" 
            :columns="header"
            :data="tableData.rows"
            >
        </tree-table>
        <div class="page">
            <div style="float: right;">
                <Page 
                    show-total
                    show-elevator
                    :page-size="pageSize"  
                    :total="tableData.records" 
                    @on-change="changePage"></Page>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'loginInfoList',
        data() {
            return {
                name: '', //账号
                pageIndex: 1,
                pageSize: 6,
                header: [  //表头
                    {title: '账号', key: 'accountName'},
                    {title: '登入时间',key: 'loginTime'},
                    {title: '登入IP',key: 'loginIP'},
                ],
                tableData:{}, //表体
            }
        },
        methods:{
            getMessage () {
                let data = {
                    accountName: this.name,
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize,
                }
                this.axios.request({
                    data,
                    url: '/userlogin/findByPage',
                    method: 'post'
                }).then(res =>{
                    this.tableData = res.data
                    this.pageIndex = res.data.pageIndex
                }).catch(err =>{
                    console.log('网络异常')
                })
            },
            changePage (current){
                this.pageIndex = current
                this.getMessage()
            }
        },
        mounted(){
            this.getMessage()
        }   
    }
</script>

<style scoped lang="less">
    .loginInfoList{
        .searchArea{
            margin-bottom: 10px;
        }
        .page{
            margin: 10px;overflow: hidden; position: absolute; bottom: 0; right: 0;
        }
    }
</style>



