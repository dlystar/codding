<template>
    <div class="orderList">
        <h3>清单：</h3>
        <Table 
            :columns="header" :data="showTableData">
        </Table>
        <h3>&nbsp;</h3>
        <div class="sellingInfo">
            <div style="display: flex; margin-top: 10px;">
                <div class="name">卖货日期：</div>
                <div>
                    <DatePicker @on-change="changeDate" format="yyyy-MM-dd HH:mm:ss" 
                        type="date" placeholder="请选择日期" style="width: 98%;">
                    </DatePicker>
                </div>
            </div>
            <div style="display: flex; margin-top: 10px;">
                <div class="name">备注信息：</div>
                <div>
                    <Input v-model="sellingInfo.remarks" type="textarea"></Input>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {operation} from '@/libs/tools'
    export default{
        props: ['tableData'],
        data(){
            return{
                header:[
                    {title: '序号',key: 'index',
                        render:(h, params)=>{
                            console.log(params.row);
                            let name = params.row.index == '合计' ? '合计' : params.row._index+1

                            return h('span',{},name)
                        }
                    },
                    {title: '品类',key: 'detailName',},
                    {title: '重量/个数/其他',key: 'numericalValue',},
                    {title: '单价',key: 'unitPrice',},
                    {title: '金额',key: 'money',},
                ],
                mobilePhone: '',
                memberId: '',
                members: [],
                showTableData: [],
                sellingInfo:{
                    saleDate: '',
                    remarks: '',
                }
            }
        },
        methods:{
            queryMember(){
                this.axios.request({
                    params: {mobilePhone: this.mobilePhone},
                    url: '/regionsCountiesMemberManagement/findByPage',
                    method: 'get'
                }).then(res =>{
                    console.log(res);
                    this.members = res.data.rows
                }).catch(err =>{
                    console.log('网络异常')
                })
            },
            changeDate(date){
                console.log(date);
                this.sellingInfo.saleDate = date
            },
        },
        created(){
            this.showTableData = JSON.parse(JSON.stringify(this.tableData))
            let sum = this.showTableData.map(item => item.money).reduce((n,m) => operation(n,m,'add'))
            this.showTableData.push({
                index: '合计',
                detailName: '',
                numericalValue: '',
                unitPrice: '',
                money: sum,
            })
        }
    }
</script>

<style lang="less" scoped>
    .orderList{
        h3{
            margin: 10px 0;
        }
        .members{
            margin-top: 20px;
            font-size: 16px;
            p{
                margin-bottom: 20px;
            }
            .contents{
                margin-right: 20px;
            }
        }
        .sellingInfo{
            width: 300px;
            .name{
                width: 100px;
                line-height: 30px;
            }
        }
    }
</style>