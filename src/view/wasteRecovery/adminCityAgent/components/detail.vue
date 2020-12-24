<template>
    <div class="baseInfo">
        <Form :model="detail" ref="detail" :rules="rules" :label-width="120">
            <FormItem label="用户姓名：" prop="userName">
                <Input v-model="detail.userName" :disabled="noEdit || isDisabled"></Input>
            </FormItem>
            <FormItem label="账号名称：" prop="accountName">
                <Input v-model="detail.accountName" :disabled="noEdit || isDisabled"></Input>
            </FormItem>
            <FormItem label="手机号码：" prop="mobilePhone">
                <Input v-model="detail.mobilePhone" :disabled="isDisabled"></Input>
            </FormItem>
            <FormItem label="邮箱：" prop="email" >
                <Input v-model="detail.email" :disabled="isDisabled"></Input>
            </FormItem>
            <FormItem label="身份证号码：" prop="idCard">
                <Input number v-model="detail.idCard" :disabled="isDisabled"></Input>
            </FormItem>
            <FormItem label="开户人姓名：" prop="openAccountName">
                <Input v-model="detail.openAccountName" :disabled="isDisabled"></Input>
            </FormItem>
            <FormItem label="银行卡号：" prop="bankCard">
                <Input v-model="detail.bankCard" :disabled="isDisabled"></Input>
            </FormItem>
            <FormItem label="银行地址：" prop="bankAddr">
                <Input v-model="detail.bankAddr" :disabled="isDisabled"></Input>
            </FormItem>
            <FormItem label="开户行：" prop="bankName">
                <Input v-model="detail.bankName" :disabled="isDisabled"></Input>
            </FormItem>
            <FormItem label="商户抬头：" prop="merchantRise">
                <Input v-model="detail.merchantRise" :disabled="isDisabled"></Input>
            </FormItem>
            <FormItem label="账户余额：" prop="accountBalance">
                <Input v-model="detail.accountBalance" :disabled="isDisabled"></Input>
            </FormItem>
            <FormItem label="手续费比例：" prop="brokerage">
                <Input number v-model="detail.brokerage" :disabled="isDisabled">
                </Input>
            </FormItem>
            <FormItem label="佣金比例：" prop="commissionRate">
                <Input v-model="detail.commissionRate" :disabled="isDisabled"></Input>
            </FormItem>
            <FormItem label="代理省市：" prop="cityData">
                <Cascader v-model="detail.cityData" :data="cityData" filterable @on-change="cascaderChange" :disabled="noEdit || isDisabled"></Cascader>
            </FormItem>
            <!-- <FormItem label="代理的省份：" prop="province">
                <Input v-model="detail.province" :disabled="noEdit || isDisabled"></Input>
            </FormItem>
            <FormItem label="代理的市区：" prop="city">
                <Input v-model="detail.city" :disabled="noEdit || isDisabled"></Input>
            </FormItem> -->
            <FormItem label="用户状态" prop="userStatus">
                <RadioGroup v-model="detail.userStatus" :disabled="isDisabled">
                    <Radio :label="'1'" :disabled="isDisabled">正常</Radio>
                    <Radio :label="'2'" :disabled="isDisabled">锁定</Radio>
                </RadioGroup>
            </FormItem>

            <template v-if="title == '修改'">
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
            <FormItem label="经度：" prop="latitude">
                <Input v-model="detail.latitude" :disabled="isDisabled"></Input>
            </FormItem>
            <FormItem label="纬度：" prop="longitude">
                <Input v-model="detail.longitude" :disabled="isDisabled"></Input>
            </FormItem>
            <myMap :isDisabled="isDisabled" @clickHandel="setCenter"></myMap>
        </Form>
    </div>
</template>
<script>
    import {validPhone} from '@/libs/tools'
    import cityData from "@/libs/city";
    let onlyCity = JSON.parse(JSON.stringify(cityData))
    onlyCity.forEach(item =>{
        if(item.children && item.children.length > 0){
            item.children.forEach(jtem =>{
                if(jtem.children && jtem.children.length > 0){
                    delete jtem.children
                }
            })
            if('北京,天津,上海,重庆'.indexOf(item.label) > -1){
                delete item.children
            }
        }
    })
    import myMap from '@com/map'
    import mixins from '@com/mixins'
    export default {
        name: 'baseInfo',
        components: {myMap},
        mixins: [mixins],
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
            const validateArr = (rule, value, callback) =>{
                console.log('代理省市',this.detail.cityData);
                if(this.detail.cityData && this.detail.cityData.length > 0){
                    callback()
                }else{
                    return callback(new Error("请选择代理省市"))
                }
            }
            return {
                rules: {
                    userName: [{required: true, message: '请输入用户姓名', trigger: 'blur'}],
                    accountName: [{required: true, message: '请输入账号名称', trigger: 'blur'}],
                    mobilePhone: [{required: true, validator: validPhone1,  trigger: 'blur'}],
                    openAccountName: [{required: true, message: '开户人姓名',  trigger: 'blur'}],
                    province: [{required: true, message: '请输入代理的省份',  trigger: 'blur'}],
                    city: [{required: true, message: '请输入代理的市区',  trigger: 'blur'}],
                    latitude: [{required: true,validator: validateNum,  trigger: 'blur'}],
                    longitude: [{required: true, validator: validateNum,  trigger: 'blur'}],
                    userStatus: [{required: true, message: '请选择用户状态',  trigger: 'blur'}],
                    cityData: [{required: true,validator: validateArr,message: '请选择代理省市',  trigger: 'blur'}]
                },
                isDisabled: this.title == '查看详情',
                noEdit: this.title == '编辑',
                cityData: onlyCity,
            }
        },
        methods: {
            setCenter(data){
                this.detail.longitude = data.lng
                this.detail.latitude = data.lat
            },
            cascaderChange(value, selectedData){
                if(selectedData.length == 1){
                    this.detail.province = selectedData[0].label
                    this.detail.city = selectedData[0].label
                    this.detail.regionsAndCounties = selectedData[0].label
                }else if(selectedData.length == 2){
                    this.detail.province = selectedData[0].label
                    this.detail.city = selectedData[1].label
                    this.detail.regionsAndCounties = selectedData[1].label
                }else if(selectedData.length == 3){
                    this.detail.province = selectedData[0].label
                    this.detail.city = selectedData[1].label
                    this.detail.regionsAndCounties = selectedData[2].label
                }
                if(selectedData.length == 0){
                    this.detail.cityData = []
                }
            }
        },
        mounted(){
            console.log(this.detail);
            if(this.detail.longitude == undefined){
                this.$set(this.detail,'longitude','')
                this.$set(this.detail,'latitude','')
            }
            if(this.detail.city){
                this.matchCity()
            }
        }
    }
</script>
<style lang="less" scoped>
    .map-search{
        position: absolute; width: 100%; z-index: 100;
        margin-top: 30px; color: #000; font-weight: bold;
    }
    .baseInfo{
        height: 410px; overflow: auto; position: relative;
    }
    .ivu-input-wrapper, .ivu-select,.ivu-cascader{
        width: 80%;
    }
    
    .bm-view{
        // width: 80%;
        height: 300px;
    }
</style>