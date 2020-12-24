<template>
    <div class="baseInfo">
        <Form :model="detail" ref="detail" :rules="rules" :label-width="120">
            <FormItem label="用户姓名：" prop="userName">
                <Input v-model="detail.userName"></Input>
            </FormItem>
            <FormItem label="账号：" prop="accountName">
                <Input v-model="detail.accountName"></Input>
            </FormItem>
            <FormItem label="手机号码：" prop="mobilePhone">
                <Input v-model="detail.mobilePhone"></Input>
            </FormItem>
            <FormItem label="用户状态：" prop="userStatus">
                <Select v-model="detail.userStatus" clearable>
                        <Option :value="'1'">正常</Option>
                        <Option :value="'2'">锁定</Option>
                    </Select>
            </FormItem>
        </Form>
    </div>
</template>
<script>
    export default {
        name: 'baseInfo',
        props:{
            detail: Object,
            title: String,
        },
        data(){
            const validateArray = (rule, value, callback) => {
                if(value.length == 0){
                    return callback(new Error("请选择店铺省市区县"))
                }else{
                    callback()
                }
            }
            const validateNum = (rule, value, callback) =>{
                if(value){
                    callback()
                }else{
                    return callback(new Error("请输入排序"))
                }
            }
            return {
                rules: {
                    userName: [{required: true, message: '请输入用户姓名：', trigger: 'blur'}],
                    accountName: [{required: true, message: '请输入账号：', trigger: 'blur'}],
                    mobilePhone: [{required: true, message: '请输入手机号码：', trigger: 'blur'}],
                    userStatus: [{required: true, message: '请选择用户状态：', trigger: 'blur'}],
                },
            }
        },
        methods: {
            
        },
        mounted(){
            
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