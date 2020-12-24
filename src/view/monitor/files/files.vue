<template>
    <div class="files">
        <div class="searchArea">
            <Row type="flex" justify="center" align="middle" class="code-row-bg">
                <Col span="7">
                    上传者：<Input v-model="accountName" style="width: 57%; margin-right: 10px;"/>
                </Col>
                <Col span="7">
                    业务名称：<Input v-model="businessName" style="width: 57%; margin-right: 10px;"/>
                </Col>
                <Col span="7">
                    上传时间：<DatePicker 
                        @on-change="changeTime" 
                        format="yyyy-MM-dd HH:mm:ss"
                        type="datetimerange" 
                        style="width: 57%;" 
                        placement="bottom-end"></DatePicker>
                </Col>
                <Col span="3">
                    <Button type="primary" @click="pageIndex=1;getFiles()" v-no-more-click>查询</Button>
                </Col>
            </Row>
        </div>
        <div class="buttonArea">
            <Button v-for="item in buttons" :type="item.type" @click="showModel(item.name)">
                {{item.name}}
            </Button>
        </div>
        <tree-table 
            ref="tree" 
            :selectable="true" 
            :expand-type="false" 
            :columns="header"
            :data="tableData.rows"
            >
            <template slot="fileUrl" slot-scope="scope">
                <Icon 
                    title="预览图片"
                    style="cursor: pointer; font-size: 20px;" 
                    type="ios-eye-outline" 
                    @click.native="handleView(scope.row)">     
                </Icon>
            </template>
        </tree-table>
        <div class="page">
            <div style="float: right;">
                <Page 
                    show-total
                    show-elevator
                    :page-size="pageSize"  
                    :total="tableData.records" 
                    @on-change="changePage"></Page>
            </div>
        </div>
        <Modal title="预览图片" v-model="visible">
            <img :src="imageUrl" v-if="visible" style="width: 100%">
        </Modal>
        <Modal
            scrollable
            title="提示"
            v-model="showAlert"
            :mask-closable="false"
            width="300"
            >
            <p>{{msg}}</p>
            <div slot="footer">
                <Button size="large" @click="showAlert=false" v-show="msg=='确定要删除该数据吗？'">取消</Button>
                <Button type="primary" size="large" @click="closePrompt(msg)" v-no-more-click>确定</Button>
            </div>
        </Modal>
        <Modal
            scrollable
            title="固件升级"
            v-model="showUpdate"
            :mask-closable="false"
            >
            <update-firmware v-if="showUpdate" :detail="detail" ref="updateFirmware"></update-firmware>
            <div slot="footer">
                <Button size="large" @click="showUpdate=false">取消</Button>
                <Button type="primary" size="large" @click="prepareForUpgrade" v-no-more-click>确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import config from '@/config'
    import updateFirmware from './updateFirmware.vue'
    const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
    export default {
        name: 'files',
        components:{updateFirmware},
        data() {
            return {
                buttons: this.$store.state.user.currentMenuButtons,
                showAlert: false,
                msg: '',  //提示框信息
                title: '修改', //弹窗标题
                accountName: '', //上传者
                businessName: '', //业务名称
                time: [], //上传时间范围
                pageIndex: 1,
                pageSize: 6,
                header: [  //表头
                    {title: '文件名', key: 'newFileName',width: '150px'},
                    {title: '业务名称', key: 'businessName',width: '150px'},
                    {title: '上传者',key: 'accountName',width: '100px'},
                    {title: '上传时间',key: 'createTime',width: '120px'},
                    {title: '地址',key: 'fileUrl',width: '150px'},
                    {title: '预览',key: 'fileUrl',width: '50px',type:'template',template:'fileUrl'},
                ],
                tableData:{}, //表体
                visible: false,
                imageUrl: '',
                showUpdate: false,
                detail: {},
            }
        },
        methods:{
            getFiles () {
                let data = {
                    accountName: this.accountName,
                    businessName: this.businessName,
                    startTime: this.time[0],
                    endTime: this.time[1],
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize,
                }
                this.axios.request({
                    data,
                    url: '/files/findByPage',
                    method: 'post'
                }).then(res =>{
                    this.tableData = res.data
                    this.pageIndex = res.data.pageIndex
                }).catch(err =>{
                    console.log('网络异常')
                })
            },
            changePage (current){
                this.pageIndex = current
                this.getFiles()
            },
            changeTime (time){
                this.time = time
            },
            handleView (img){
                this.visible = true
                this.imageUrl = baseUrl + img.fileUrl
            },
            showModel (title) {
                this.title = title
                let data = this.$refs.tree.bodyData
                let selectedData = this.$refs.tree.getCheckedProp()
                switch(title){
                    case '删除': 
                        if(selectedData.length > 0){
                            this.showAlert = true
                            this.msg = '确定要删除该数据吗？'
                        }else{
                            this.showAlert = true
                            this.msg = '请选择要删除的数据！'
                        }
                    break
                    case '固件升级': 
                        if(selectedData.length == 1){
                            let index = selectedData[0]
                            let data = JSON.parse(JSON.stringify(this.tableData.rows[index]))
                            let files = data.newFileName.split('.')
                            if(files[files.length - 1] === 'bin'){
                                this.detail = data
                                this.showUpdate = true
                            }else{
                                this.showAlert = true
                                this.msg = '请选择bin文件升级'
                            }
                        }else{
                            this.showAlert = true
                            this.msg = '请选择一条数据'
                        }
                    break;
                }
            },
            closePrompt (msg) {
                this.showAlert = false;
                if(msg == '确定要删除该数据吗？'){
                    let bodyData = this.$refs.tree.bodyData
                    let selectedData = this.$refs.tree.getCheckedProp()
                    let ids = []
                    selectedData.forEach(item=> ids.push(bodyData[item].id))
                    let data = {
                        ids: ids.join(',')
                    }
                    this.axios.request({
                        data,
                        url: '/files/deleteEntity',
                        method: 'post'
                    }).then(res =>{
                        if(res.data.result == 1){
                            this.$Message.success('删除成功！');
                            this.getFiles('')
                        }else{
                            this.$Message.error(res.data.msg);
                        }
                    }).catch(err =>{
                        this.$Message.error('删除失败！');
                    })
                }
            },
            prepareForUpgrade(){
                let data = {
                    deviceSn: this.detail.deviceSn,
                    fileName: this.detail.newFileName,
                    versionName: this.detail.versionName,
                    versionNo: this.detail.versionNo,
                }
                const detailForm = this.$refs.updateFirmware.$refs.detailForm
                detailForm.validate(valid =>{
                    if(valid){
                        this.axios.request({
                            params: data,
                            url: '/device/prepareForUpgrade',
                            method: 'get'
                        }).then(res =>{
                            if(res.data.result == 1){
                                this.$Message.success('升级成功！');
                                this.getFiles('')
                                this.showUpdate = false
                            }else{
                                this.$Message.error(res.data.msg);
                            }
                        }).catch(err =>{
                            this.$Message.error('升级失败！');
                        })
                    }   
                })             
            }
        },
        mounted(){
            this.getFiles()
        }   
    }
</script>

<style scoped lang="less">
    .files{
        .searchArea{
            margin-bottom: 10px;
        }
        .page{
            margin: 10px;overflow: hidden; position: absolute; bottom: 0; right: 0;
        }
        .buttonArea{
            margin-top: 10px; margin-bottom: 10px;
            button{margin-right: 10px;}
        }
    }
</style>



