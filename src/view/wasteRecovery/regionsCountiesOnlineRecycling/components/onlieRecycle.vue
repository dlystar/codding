<template>
    <div class="orderDetail">
        <Table :columns="header" :data="tableData">
            <template slot-scope="{ row,index }" slot="numericalValue">
                <div v-if="row.index != undefined"></div>
                <div v-else>
                    <InputNumber v-model="row.numericalValue" @on-change="computedMoney(index,'unitPrice',$event)"></InputNumber>
                </div>
            </template>
            <template slot-scope="{ row,index }" slot="unitPrice">
                <div v-if="row.index != undefined"></div>
                <div v-else>
                    <InputNumber v-model="row.unitPrice" @on-change="computedMoney(index,'numericalValue',$event)"></InputNumber>
                </div>
            </template>
        </Table>
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
                            let name = params.row.index != undefined ? params.row.index : params.row._index+1

                            return h('span',{},name)
                        }
                    },
                    {title: '品类',key: 'categoryName',},
                    {title: '数值（公斤或个）',key: 'numericalValue', slot:'numericalValue'},
                    {title: '单价',key: 'unitPrice', slot:'unitPrice'},
                    {title: '金额（元）',key: 'money',},
                ],
                tableData: [],
                otherInfo: {},
                onlineTotal: 0,
            }
        },
        methods:{
            computedMoney(index,name,event){
                console.log(index,name,event);
                this.$set(this.tableData[index],'money',operation(this.tableData[index][name],event,'multiply'))
                let sum = this.tableData.map(item => {
                    if(item.index == undefined){
                        return item.money
                    }else{
                        return 0
                    }
                }).reduce((n,m) => operation(n,m,'add'))
                this.tableData.forEach(item =>{
                    if(item.index == '到店合计金额'){
                        item.money = sum
                    }
                    if(item.index == '回收员利润'){
                        item.money = operation(sum,this.onlineTotal,'subtract')
                    }
                })
            },
            computedMoney1(){

            },
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
                    res.data.rows.detail.forEach(item =>{
                        item.numericalValue = Number(item.numericalValue)
                        item.unitPrice = Number(item.unitPrice)
                        item.money = Number(item.money)
                    })
                    this.tableData = res.data.rows.detail
                    this.otherInfo = res.data.rows.otherInfo
                    let sum = this.tableData.map(item => item.money).reduce((n,m) => operation(n,m,'add'))
                    this.onlineTotal = sum
                    this.tableData.push({
                        index: '线上合计金额',
                        detailName: '',
                        numericalValue: null,
                        unitPrice: null,
                        money: sum,
                    })
                    this.tableData.push({
                        index: '到店合计金额',
                        detailName: '',
                        numericalValue: null,
                        unitPrice: null,
                        money: sum,
                    })
                    this.tableData.push({
                        index: '回收员利润',
                        detailName: '',
                        numericalValue: null,
                        unitPrice: null,
                        money: 0,
                    })
                }).catch(err =>{
                    console.log('网络异常')
                })
            }
        },
        created(){
            console.log('回收到店');
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