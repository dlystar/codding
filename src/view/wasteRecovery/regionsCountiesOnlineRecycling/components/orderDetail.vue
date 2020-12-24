<template>
    <div class="orderDetail">
        <h3>交易详情：</h3>
        <Table :columns="header" :data="tableData">
        </Table>
        <h3>其它信息：</h3>
        <div class="otherInfo">
            <p>
                <span class="title">描述：</span>
                <span>{{otherInfo.desc}}</span>
            </p>
            <p>
                <span class="title">操作者：</span>
                <span>{{otherInfo.operator}}</span>
            </p>
            <p>
                <span class="title">操作时间：</span>
                <span>{{otherInfo.createDate}}</span>
            </p>
        </div>
    </div>
</template>

<script>
    import {operation} from '@/libs/tools'
    export default{
        props:{
            detail: Object,
            title: String,
        },
        data(){
            return{
                isAdmin: this.$store.state.user.roleNames.indexOf('管理员')>-1,
                header: [
                    {title: '序号',key: 'index',
                        render:(h, params)=>{
                            let name = params.row.index == '合计' ? '合计' : params.row._index+1

                            return h('span',{},name)
                        }
                    },
                    {title: '品类',key: 'categoryName',},
                    {title: '数值（公斤或个）',key: 'numericalValue',},
                    {title: '单价',key: 'unitPrice',},
                    {title: '金额（元）',key: 'money',},
                ],
                tableData: [],
                otherInfo: {},
            }
        },
        methods:{
            getOrderDetail(){
                let url = ''
                if(this.isAdmin){
                    url = '/adminMemberOrder/findDetail'
                }else{
                    url = '/adminMemberOrder/findDetail'
                }
                this.axios.request({
                    params: {
                        orderId: this.detail.id+''
                    },
                    url,
                    method: 'get'
                }).then(res =>{
                    this.tableData = res.data.rows.detail
                    this.otherInfo = res.data.rows.otherInfo
                    let sum = this.tableData.map(item => item.money).reduce((n,m) => operation(n,m,'add'))
                    this.tableData.push({
                        index: '合计',
                        detailName: '',
                        numericalValue: '',
                        unitPrice: '',
                        money: sum,
                    })
                }).catch(err =>{
                    console.log('网络异常')
                })
            }
        },
        created(){
            this.getOrderDetail()
        }
    }
</script>

<style lang="less" scoped>
    .orderDetail{
        h3{
            color: red;
            margin: 20px 0;
        }
        .otherInfo{
            p{
                margin-top: 10px;
                .title{
                    display: inline-block;
                    width: 100px;
                    text-align: right;
                }
            }
        }
    }
</style>