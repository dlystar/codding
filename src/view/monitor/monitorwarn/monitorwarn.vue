<template>
    <div class="monitorwarn">
        <div class="searchArea">
            <!-- <Row type="flex" justify="center" align="middle" class="code-row-bg">
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
            </Row> -->
        </div>
        <tree-table 
            ref="tree" 
            :selectable="false" 
            :expand-type="false" 
            :columns="header"
            :data="tableData.rows"
            >
            <template slot="mark" slot-scope="scope">
                <div v-html="scope.row.mark" style="font-size: 10px;"></div>
            </template>
        </tree-table>
        <div class="page">
            <div style="float: right;">
                <Page 
                    show-total
                    show-elevator 
                    :total="tableData.records"
                    :page-size="pageSize"  
                    @on-change="changePage"></Page>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'monitorwarn',
        data() {
            return {
                name: '', //账号
                pageIndex: 1,
                pageSize: 6,
                header: [  //表头
                    {title: 'cpu使用率', key: 'cpuUsage',width: '100px'},
                    {title: '预设cpu使用率',key: 'setCpuUsage',width: '120px'},
                    {title: 'Jvm使用率',key: 'jvmUsage',width: '100px'},
                    {title: '预设Jvm使用率',key: 'setJvmUsage',width: '120px'},
                    {title: 'Ram使用率',key: 'ramUsage',width: '100px'},
                    {title: '预设Ram使用率',key: 'setRamUsage',width: '120px'},
                    {title: '发送的邮件',key: 'email',width: '100px'},
                    {title: '发送的时间',key: 'operTime',width: '100px'},
                    {title: '备注',key: 'mark',type:'template',template: 'mark'},
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
                    url: '/serverInfo/findByPage',
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
    .monitorwarn{
        .searchArea{
            margin-bottom: 10px;
        }
        .page{
            margin: 10px;overflow: hidden; position: absolute; bottom: 0; right: 0;
        }
    }
</style>



