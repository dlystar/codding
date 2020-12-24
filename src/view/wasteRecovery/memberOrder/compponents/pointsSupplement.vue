<template>
    <div class="pointsSupplement">
        <Input v-model="phone" search enter-button="加载会员" placeholder="请输入会员手机号" @on-search="search" />
        <div v-show="memberInfo.id" style="margin-top: 20px; font-size: 16px;">
            <span>姓名：{{memberInfo.userName}}</span>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span>手机号：{{memberInfo.mobilePhone}}</span>
        </div>
    </div>
</template>

<script>
    export default{
        props:{
            detail: Object,
            title: String,
        },
        data(){
            return{
                phone: '',
                memberInfo: {},
            }
        },
        methods:{
            search(val){
                if(val == ''){
                    this.$Message.info('请输入会员手机号')
                    return
                }
                this.axios.request({
                    params: {mobilePhone: val},
                    url: '/regionsCountiesMemberManagement/findByPage',
                    method: 'get'
                }).then(res =>{
                    if(res.data.rows.length == 0){
                        this.$Message.info('改手机号不是会员，请输入正确的会员手机号')
                        return
                    }
                    this.memberInfo = res.data.rows[0]
                    this.detail.memberId = res.data.rows[0].id
                }).catch(err =>{
                    console.log('网络异常',err)
                })
            }
        },
        created(){
            
        }
    }
</script>

<style lang="less" scoped>
    .pointsSupplement{
        width: 400px;
        margin: 50px auto;
    }
</style>