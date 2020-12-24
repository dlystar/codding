<template>
    <div class="baseInfo">
        <Form :model="detail" ref="detail" :rules="rules" :label-width="120">
            <FormItem label="姓名：" prop="userName">
                <Input v-model="detail.userName" :disabled="isDisabled"></Input>
            </FormItem>
            <FormItem label="手机号：" prop="mobilePhone">
                <Input v-model="detail.mobilePhone" :disabled="isDisabled"></Input>
            </FormItem>
            <FormItem label="用户状态：" prop="userStatus" v-if="noEdit">
                <RadioGroup v-model="detail.userStatus" :disabled="isDisabled">
                    <Radio :label="'1'" :disabled="isDisabled">正常</Radio>
                    <Radio :label="'2'" :disabled="isDisabled">锁定</Radio>
                </RadioGroup>
            </FormItem>

            <template v-if="isDisabled">
                <FormItem label="订单数：" prop="numberOfOrders">
                    <Input v-model="detail.numberOfOrders" :disabled="isDisabled"></Input>
                </FormItem>
                <FormItem label="总积分：" prop="totalPoints">
                    <Input v-model="detail.totalPoints" :disabled="isDisabled"></Input>
                </FormItem>
                <FormItem label="剩余积分：" prop="balancePoints">
                    <Input v-model="detail.balancePoints" :disabled="isDisabled"></Input>
                </FormItem>
                <FormItem label="交易总金额：" prop="totalMoney">
                    <Input v-model="detail.totalMoney" :disabled="isDisabled"></Input>
                </FormItem>
                <FormItem label="余额：" prop="balance">
                    <Input v-model="detail.balance" :disabled="isDisabled"></Input>
                </FormItem>
                <FormItem label="微信昵称：" prop="nickName">
                    <Input v-model="detail.nickName" :disabled="isDisabled"></Input>
                </FormItem>
                <FormItem label="微信openid：" prop="openid">
                    <Input v-model="detail.openid" :disabled="isDisabled"></Input>
                </FormItem>
                <FormItem label="微信unionid：" prop="unionid">
                    <Input v-model="detail.unionid" :disabled="isDisabled"></Input>
                </FormItem>
                <FormItem label="微信sessionKey：" prop="sessionKey">
                    <Input v-model="detail.sessionKey" :disabled="isDisabled"></Input>
                </FormItem>
            </template>
        </Form>
    </div>
</template>

<script>
    import {validPhone} from '@/libs/tools'
    export default{
        props:{
            detail: Object,
            title: String,
        },
        data(){
            const validPhone1 = (rule, value, callback)=>{
                if(!validPhone(value)) return callback(new Error("请输入正确的手机号码"))
                return callback()
            }
            const validateNum = (rule, value, callback) =>{
                if(value){
                    callback()
                }else{
                    return callback(new Error("请选择经纬度"))
                }
            }
            return{
                rules: {
                    userName: [{required: true, message: '请输入用户姓名', trigger: 'blur'}],
                    mobilePhone: [{required: true, validator: validPhone1,  trigger: 'blur'}],
                    userStatus: [{required: true, message: '请选择用户状态',  trigger: 'blur'}],
                },
                isDisabled: this.title == '查看详情',
                noEdit: this.title == '编辑',
                onlyAdd: this.title == '新增',
            }
        },
        methods:{
            
        },
        created(){
            
        }
    }
</script>

<style lang="less" scoped>
    .map-search{
        position: absolute; width: 100%; z-index: 100;
        margin-top: 30px; color: #000; font-weight: bold;
    }
    .baseInfo{
        max-height: 410px; overflow: auto; position: relative;
    }
    .ivu-input-wrapper, .ivu-select,.ivu-cascader{
        width: 80%;
    }
    .bm-view{
        // width: 80%;
        height: 300px;
    }
</style>