<template>
    <div class="baseInfo">
        <Form :model="detail" ref="detail" :label-width="120">
            <FormItem label="商品名称：" prop="productName">
                <Input v-model="detail.productName" disabled></Input>
            </FormItem>
            <FormItem label="剩余数量：" prop="number" >
                <Input v-model="detail.number" disabled></Input>
            </FormItem>
            <FormItem label="兑换数量：" prop="num" >
                <InputNumber v-model="detail.num"></InputNumber>
            </FormItem>
        </Form>
    </div>
</template>
<script>
    import upload from '@/view/components/upload/upload'
    export default {
        name: 'baseInfo',
        components: {upload},
        props:{
            detail: Object,
            title: String,
        },
        data(){
            const validateNum = (rule, value, callback) =>{
                if(/^[0-9]+$/.test(value)){
                    callback()
                }else{
                    return callback(new Error("请输入大于0的数字"))
                }
            }
            return {
                isDisabled: this.title == '查看详情',
                noEdit: this.title == '编辑',
                isDetail: true,
                businessName: '广告位管理-广告列表',
                imageList: [],
                showUpload: false,
                isAdmin: this.$store.state.user.roleNames.indexOf('管理员')>-1,
            }
        },
        methods: {
            getUploadMessage(file){
                this.detail.categoryImages = file.url
            }
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