<template>
    <div>
        <div class="demo-upload-list" v-for="item in uploadList">
            <template v-if="item.status === 'finished'">
                <img :src="item.url">
                <div class="demo-upload-list-cover" v-show="!disabled">
                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                </div>
            </template>
            <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
        </div>
        <Upload
            ref="upload"
            v-show="uploadList.length < maxLen && !disabled"
            :headers="headers"
            name="upload"
            :show-upload-list="false"
            :default-file-list="imageList"
            :on-success="handleSuccess"
            :format="['jpg','jpeg','png','ico']"
            :max-size="20480"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            type="drag"
            :action="baseUrl+'/admin/uploadImg'"
            :data="uploadData"
            style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="ios-camera" size="20"></Icon>
            </div>
        </Upload>
        <Modal title="预览图片" v-model="visible">
            <img :src="imgUrl" v-if="visible" style="width: 100%">
        </Modal>
    </div>
</template>
<script>
    import { setToken, getToken } from '@/libs/util'
    import config from '@/config'
    const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
    export default {
        props: { //父组件参数  maxLen：可上传的图片最大张数
            businessId: Number,
            businessName: String,
            maxLen: Number,
            imageList: Array,
            disabled: {
                default: false,
            },
        },
        data () {
            return {
                headers:{
                    'Authorization' : getToken(),
                },
                baseUrl: baseUrl.replace(/\/$/,''),
                uploadData:{
                    businessId: this.businessId || '',
                    businessName: this.businessName
                },
                defaultList: [{
                    'name': 'a42bdcc1178e62b4694c830f028db5c0',
                    'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
                }],
                imgUrl: '',
                visible: false,
                uploadList: []
            }
        },
        methods: {
            handleView (item) {
                this.imgUrl = item.url;
                this.visible = true;
            },
            handleRemove (file) {
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
                let temp = this.$refs.upload.fileList;
                if(temp.length == 0){
                  this.$emit('onUploadSuccess',{url:"",isRemove:1});
                }else {
                  let url = [];
                  let reg = new RegExp( this.baseUrl , "g" )
                  temp.forEach(item=> url.push(item.url.replace(reg,'')))
                  this.$emit('onUploadSuccess',{url:url.join(),isRemove:1});
                }
            },
            handleSuccess (res, file) {
                if(res.result == '0'){
                    this.$Message.error(res.msg);
                }else{
                    file.url = this.baseUrl+res.rows;
                    file.name = new Date().getTime();
                    this.$emit('onUploadSuccess',{url:res.rows});
                }
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: 'The file format is incorrect',
                    desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: 'Exceeding file size limit',
                    desc: 'File  ' + file.name + ' is too large, no more than 2M.'
                });
            },
            handleBeforeUpload () {
                const check = this.uploadList.length < 10;
                if (!check) {
                    this.$Notice.warning({
                        title: 'Up to ten pictures can be uploaded.'
                    });
                }
                return check;
            }
        },
        mounted () {
            this.uploadList = this.$refs.upload.fileList;
            this.imageList.forEach(item=> {
                if(item.url){
                    item.url = this.baseUrl + item.url
                }
            })
            console.log(this.imageList)
        }
    }
</script>
<style>
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>

