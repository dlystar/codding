<template>
    <div class="baseInfo">
        <Form :model="detail" ref="detail" :rules="rules" :label-width="120">
            <FormItem label="分类名称：" prop="categoryName">
                <Input v-model="detail.categoryName" :disabled="isDisabled"></Input>
            </FormItem>
            <FormItem label="分类图片：" prop="categoryImages">
                <upload
                    v-if="showUpload"
                    :imageList="imageList"
                    :businessId="detail.id"
                    :businessName="businessName"
                    :maxLen="1"
                    v-on:onUploadSuccess="getUploadMessage"
                ></upload>
            </FormItem>
            <FormItem label="排序值：" prop="sort" >
                <Input v-model="detail.sort" :disabled="isDisabled"></Input>
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
            return {
                rules: {
                    cityAgentName: [{required: true, message: '请选择市级代理人', trigger: 'blur'}],
                    categoryImages: [{required: true, message: '请上传图片', trigger: 'blur'}],
                },
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
            console.log(this.detail);
            if(this.isDisabled || this.noEdit){
                this.imageList.push({url: this.detail.categoryImages})
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