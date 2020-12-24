<template>
    <div class="baseInfo">
        <Form :model="detail" ref="detail" :rules="rules" :label-width="120">
            <FormItem label="市级代理人：" prop="cityAgentName">
                <Input v-model="detail.cityAgentName" ref="cityAgentName" :disabled="noEdit || isDisabled" readonly>
                    <Icon 
                        v-show="isAdmin"
                        type="md-apps" slot="suffix" @click="showSelectCityAgent" 
                        :disabled="noEdit || isDisabled" class="dly_select" 
                        :style="{'pointer-events':(noEdit || isDisabled)?'none':''}"/>
                </Input>
            </FormItem>
            <FormItem label="城市：" prop="city">
                <Input v-model="detail.city" disabled></Input>
            </FormItem>
            <FormItem label="图片地址：" prop="images">
                <!-- <Input v-model="detail.images" :disabled="noEdit || isDisabled"></Input> -->
                <upload
                    v-if="showUpload"
                    :imageList="imageList"
                    :businessId="detail.id"
                    :businessName="businessName"
                    :maxLen="1"
                    v-on:onUploadSuccess="getUploadMessage"
                ></upload>
            </FormItem>
            <FormItem label="图片链接地址：" prop="linkUrl">
                <Input v-model="detail.linkUrl" :disabled="isDisabled"></Input>
            </FormItem>
            <FormItem label="是否可用：" prop="available" >
                <Select v-model="detail.available" clearable :disabled="isDisabled">
                    <Option value="1">可用</Option>
                    <Option value="2">不可用</Option>
                </Select>
            </FormItem>
            <FormItem label="描述：" prop="des" >
                <Input v-model="detail.des" :disabled="isDisabled"></Input>
            </FormItem>
            <FormItem label="排序值：" prop="sort" >
                <Input v-model="detail.sort" :disabled="isDisabled"></Input>
            </FormItem>
        </Form>
        <!-- 选择城市所属人 -->
        <Modal
            v-model="isShowSelectCityAgent"
            title="选择城市所属人"
            :mask-closable="false"
            width="60%">
            <selectCityAgent v-if="isShowSelectCityAgent" ref="selectCityAgent"></selectCityAgent>
            <div slot="footer">
                <Button type="text" size="large" @click="isShowSelectCityAgent = false">取消</Button>
                <Button type="primary" size="large" @click="selectCityAgent()">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import upload from '@/view/components/upload/upload'
    import selectCityAgent from '@com/selectCityAgent.vue'
    import mixins from '@com/mixins'
    export default {
        name: 'baseInfo',
        components: {selectCityAgent,upload},
        props:{
            detail: Object,
            title: String,
        },
        mixins: [mixins],
        data(){
            return {
                rules: {
                    // cityAgentName: [{required: true, message: '请选择市级代理人', trigger: 'blur'}],
                    images: [{required: true, message: '请上传图片', trigger: 'blur'}],
                    // linkUrl: [{required: true, message: '请输入图片地址', trigger: 'blur'}],
                    // available: [{required: true, message: '请选择是否可用', trigger: 'blur'}],
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
                this.detail.images = file.url
            },
            getCity(){
                let url = this.isAdmin ? '/adminCityAgent/findCityAgentById' : '/adminCityAgent/findCityAgentByUserId'
                let params = {}
                if(this.isAdmin){
                    params.id = this.detail.cityAgentId
                }else{
                    params.userId = this.$store.state.user.userId
                }
                this.axios.request({
                    params: params,
                    url,
                    method: 'get'
                }).then(res =>{
                    // this.detail.cityAgentName = res.data.rows.userName
                    this.$set(this.detail,'cityAgentName',res.data.rows.userName)
                    if(!this.isAdmin){
                        this.$set(this.detail,'cityAgentId',res.data.rows.id)
                        this.$set(this.detail,'city',res.data.rows.city)
                    }
                }).catch(err =>{
                    console.log('网络异常')
                })
            }
        },
        mounted(){
            console.log(this.detail);
            if(this.isDisabled || this.noEdit){
                this.imageList.push({url: this.detail.images})
                this.getCity()
            }else{
                this.$set(this.detail,'images','')
            }
            if(!this.isAdmin){
                this.getCity()
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