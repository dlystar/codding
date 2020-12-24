<template>
    <div class="baseInfo">
        <Form :model="detail" ref="detail" :rules="rules" :label-width="120">
            <FormItem label="分类名称：" prop="categoryName">
                <Input v-model="detail.categoryName"></Input>
            </FormItem>
            <FormItem label="排序：" prop="sort">
                <InputNumber v-model="detail.sort"></InputNumber>
            </FormItem>
            <FormItem label="图片：" prop="categoryImages">
                <!-- <InputNumber v-model="detail.categoryImages"></InputNumber> -->
                <upload
                    v-if="showUpload"
                    :imageList="imageList"
                    :businessId="detail.id"
                    :businessName="businessName"
                    :maxLen="1"
                    v-on:onUploadSuccess="getCategoryImages"
                ></upload>
            </FormItem>
            <FormItem label="描述：" prop="categoryDescribe">
                <Input v-model="detail.categoryDescribe"></Input>
            </FormItem>
        </Form>
    </div>
</template>
<script>
    import upload from '@/view/components/upload/upload'
    export default {
        name: 'baseInfo',
        props:{
            detail: Object,
            title: String,
        },
        components: {upload},
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
                    categoryName: [{required: true, message: '请输入分类名称', trigger: 'blur'}],
                    sort: [{required: true,validator:validateNum,  message: '请输入排序',  trigger: 'blur'}],
                    categoryImages: [{required: true, message: '请上传图片', trigger: 'blur'}],
                    categoryDescribe: [{required: true, message: '请输入描述', trigger: 'blur'}],
                },
                isDisabled: this.title == '查看详情',
                onlyAdd:  this.title != '新增',
                noEdit: this.title == '编辑',
                showUpload: false,
                businessName: '品类管理-品类分类管理',
                imageList: [],
            }
        },
        methods: {
            getCategoryImages(file){
                this.detail.categoryImages = file.url
            },
        },
        mounted(){
            console.log(this.detail);
            if(this.noEdit){
                this.imageList.push({url: this.detail.categoryImages})
            }else{
                this.$set(this.detail,'id','')
                this.$set(this.detail,'categoryName','')
                this.$set(this.detail,'sort',null)
                this.$set(this.detail,'categoryImages','')
                this.$set(this.detail,'categoryDescribe','')
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