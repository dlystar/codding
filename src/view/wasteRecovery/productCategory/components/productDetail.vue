<template>
    <div class="baseInfo">
        <Form :model="detail" ref="detail" :rules="rules" :label-width="150">
            <FormItem label="商品分类：" prop="categoryId">
                <Select v-model="detail.categoryId" clearable :disabled="isDisabled">
                    <Option v-for="item in allCategoryClass" :value="item.id">{{item.categoryName}}</Option>
                </Select>
            </FormItem>
            <FormItem label="商品名称：" prop="productName" >
                <Input v-model="detail.productName" :disabled="isDisabled"></Input>
            </FormItem>
            <FormItem label="商品简介：" prop="productInfo" >
                <Input type="textarea" v-model="detail.productInfo" :disabled="isDisabled"></Input>
            </FormItem>
            <FormItem label="商品单价（积分）：" prop="price" >
                <InputNumber v-model="detail.price" :disabled="isDisabled"></InputNumber>
            </FormItem>
            <FormItem label="商品数量：" prop="number" >
                <InputNumber v-model="detail.number" :disabled="isDisabled"></InputNumber>
            </FormItem>
            <FormItem label="排序值：" prop="sort" >
                <InputNumber v-model="detail.sort" :disabled="isDisabled"></InputNumber>
            </FormItem>
            <FormItem label="商品缩略图：" prop="productThumbnail">
                <upload
                    v-if="showUpload"
                    :imageList="productThumbnailList"
                    :businessId="detail.id"
                    :businessName="businessName"
                    :maxLen="1"
                    :disabled="isDisabled"
                    v-on:onUploadSuccess="getProductThumbnail"
                ></upload>
            </FormItem>
            <FormItem label="商品图片集合：" prop="productImages">
                <upload
                    v-if="showUpload"
                    :imageList="productImagesList"
                    :businessId="detail.id"
                    :businessName="businessName"
                    :maxLen="10"
                    :disabled="isDisabled"
                    v-on:onUploadSuccess="getProductImages"
                ></upload>
            </FormItem>
            <FormItem label="产品描述：" prop="productDescribe" style="overflow: hidden;">
                <ckeditor :editor="editor" @ready="onReady" v-model="detail.productDescribe" :config="editorConfig"></ckeditor>
            </FormItem>
            
        </Form>
    </div>
</template>
<script>
    import upload from '@/view/components/upload/upload'
    import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
    import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn'
    export default {
        name: 'baseInfo',
        components: {upload},
        props:{
            detail: Object,
            title: String,
            allCategoryClass: Array,
        },
        data(){
            const validateNum = (rule, value, callback) =>{
                if(value){
                    callback()
                }else{
                    return callback(new Error("请输入数字"))
                }
            }
            return {
                rules: {
                    categoryId: [{required: true,validator:validateNum, message: '请选择商品分类', trigger: 'blur'}],
                    productName: [{required: true, message: '请输入商品名称', trigger: 'blur'}],
                    price: [{required: true,validator:validateNum, message: '请输入商品单价', trigger: 'blur'}],
                    number: [{required: true,validator:validateNum, message: '请输入商品数量', trigger: 'blur'}],
                },
                isDisabled: this.title == '查看详情',
                noEdit: this.title == '编辑',
                isDetail: true,
                businessName: '广告位管理-广告列表',
                productThumbnailList: [],
                productImagesList: [],
                productImages: [],
                showUpload: false,
                isAdmin: this.$store.state.user.roleNames.indexOf('管理员')>-1,
                editor: DecoupledEditor,
                editorData: '<p>Content of the editor.</p>',
                editorConfig: {
                    toolbar:{
                        items:[
                        'heading',
                        '|',
                        'alignment',                                                 // <--- ADDED
                        'bold',
                        'italic',
                        'link',
                        'bulletedList',
                        'numberedList',
                        'imageUpload',
                        'blockQuote',
                        'insertTable',
                        'mediaEmbed',
                        'undo',
                        'redo',
                        'tableColumn',
                        'tableRow',
                        'mergeTableCells',
                        'imageStyle:full', 'imageStyle:alignLeft', 'imageStyle:alignRight','fontSize', 'highlight', 'highlight:yellowMarker', 'highlight:greenMarker', 'highlight:pinkMarker', 'highlight:blueMarker', 'fontFamily',
                        ]
                    },
                    language: 'zh-cn',
                    fontSize: {
                        options: [8,10,'default',14,16,18,20,22,24,26,28,32,48]
                    },
                },
            }
        },
        methods: {
            getProductThumbnail(file){
                this.detail.productThumbnail = file.url
            },
            getProductImages(file){
                this.productImages.push(file.url)
                this.detail.productImages = this.productImages.join(',')
            },
            onReady( editor )  {
                console.log(editor)
                // Insert the toolbar before the editable area.
                editor.ui.getEditableElement().parentElement.insertBefore(
                editor.ui.view.toolbar.element,
                editor.ui.getEditableElement()
                );
                editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
                    return new MyUploadAdapter( loader ,this.businessName,this.id,this);
                };
            },
        },
        mounted(){
            console.log(this.detail);
            if(this.isDisabled || this.noEdit){
                if(this.detail.productThumbnail){
                    this.productThumbnailList.push({url: this.detail.productThumbnail})
                }
                if(this.detail.productImages){
                    this.productImages =  this.detail.productImages.split(',')
                    this.productImagesList = this.productImages.map(item => {
                        return {url: item}
                    })
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