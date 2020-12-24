<template>
    <div class="baseInfo">
        <Form :model="detail" ref="detail" :rules="rules" :label-width="120">
            <FormItem label="回收员姓名：" prop="name">
                <Input v-model="detail.name" :disabled="isDisabled"></Input>
            </FormItem>
            <FormItem label="回收员手机号：" prop="phone">
                <Input v-model="detail.phone" :disabled="isDisabled"></Input>
            </FormItem>
            <FormItem label="回收员身份证号：" prop="idCard">
                <Input v-model="detail.idCard" :disabled="isDisabled"></Input>
            </FormItem>
            <FormItem label="身份证正面照片：" prop="idCardFrontImg">
                <upload
                    v-if="showUpload"
                    :imageList="idCardFrontImgList"
                    :businessId="detail.id"
                    :businessName="businessName"
                    :maxLen="1"
                    :disabled="isDisabled"
                    v-on:onUploadSuccess="getIdCardFrontImg"
                ></upload>
            </FormItem>
            <FormItem label="身份证反面照片：" prop="idCardBackImg">
                <upload
                    v-if="showUpload"
                    :imageList="idCardBackImgList"
                    :businessId="detail.id"
                    :businessName="businessName"
                    :maxLen="1"
                    :disabled="isDisabled"
                    v-on:onUploadSuccess="getIdCardBackImg"
                ></upload>
            </FormItem>
            <FormItem label="回收员佣金比例：" prop="commissionRate">
                <InputNumber 
                    v-model="detail.commissionRate"
                    :step="0.1" 
                    :disabled="isDisabled" :min="0" :max="1"></InputNumber>
            </FormItem>
            <FormItem label="回收员状态：" prop="userStatus">
                <RadioGroup v-model="detail.userStatus" :disabled="isDisabled">
                    <Radio :label="'1'" :disabled="isDisabled">正常</Radio>
                    <Radio :label="'2'" :disabled="isDisabled">锁定</Radio>
                </RadioGroup>
            </FormItem>
            <template v-if="isDisabled">
                <FormItem label="回收员余额：" prop="balance">
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
    import {validPhone,validIdCard} from '@/libs/tools'
    import upload from '@/view/components/upload/upload'
    export default{
        props:{
            detail: Object,
            title: String,
        },
        components: {upload},
        data(){
            const validPhone1 = (rule, value, callback)=>{
                if(!validPhone(value)) return callback(new Error("请输入正确的手机号码"))
                return callback()
            }
            const validIdCard1 = (rule, value, callback) =>{
                if(value == '' || value == null || value == undefined) return callback()
                if(!validIdCard(value)) return callback(new Error("请输入正确的身份证号码"))
                return callback()
            }
            return{
                rules: {
                    name: [{required: true, message: '请输入回收员姓名', trigger: 'blur'}],
                    phone: [{required: true, validator: validPhone1,  trigger: 'blur'}],
                    commissionRate: [{type: 'number',required: true, message: '请输入回收员佣金比例',  trigger: 'blur'}],
                    idCard: [{validator: validIdCard1,  trigger: 'blur'}]
                },
                showUpload: false,
                businessName: '回收人员管理-回收人员',
                isDisabled: this.title == '查看详情',
                noEdit: this.title == '编辑',
                idCardFrontImgList: [],
                idCardBackImgList: [],
            }
        },
        methods:{
            getIdCardFrontImg(file){
                this.detail.idCardFrontImg = file.url
            },
            getIdCardBackImg(file){
                this.detail.idCardBackImg = file.url
            }
        },
        created(){
            if(this.isDisabled || this.noEdit){
                if(this.detail.idCardFrontImg){
                    this.idCardFrontImgList.push({url: this.detail.idCardFrontImg})
                }
                if(this.detail.idCardBackImg){
                    this.idCardBackImgList.push({url: this.detail.idCardBackImg})
                }   
            }
            setTimeout(()=>{
                this.showUpload = true
            },50)
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