<template>
    <div class="orderList">
        <h3>清单：</h3>
        <Table 
            :columns="header" :data="showTableData">
        </Table>
        <h3>&nbsp;</h3>
        <div>
            <Input v-model="mobilePhone" number style="width:200px;" placeholder="请输入会员手机号"/>
            <Button type="primary" @click="queryMember()">加载会员</Button>
        </div>
        <div class="members" v-if="members.length > 0">
            <p>
                <span class="contents">姓名：{{members[0].userName}}</span>
                <span class="contents">姓名：{{members[0].mobilePhone}}</span>
            </p>
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
            }
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
    }
</style>