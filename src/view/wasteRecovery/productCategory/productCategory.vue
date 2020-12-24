<template>
    <!-- 广告位管理-管理员和城市代理人 -->
    <div class="productCategory">
        <div class="searchArea">
            <!-- 地区查询 批量绑定协会  -->
            <Row type="flex" align="middle" class="code-row-bg">
                
            </Row>
        </div>
        <div class="buttonArea">
            <Button v-for="item in buttons" :type="item.type" @click="showModel(item.name)">
                {{item.name}}
            </Button>
        </div>
        <Table 
            @on-selection-change="setSelectRow"
            ref="deviceTable" 
            :content="self" :columns="header" :data="tableData.rows"></Table>
        <div class="page">
            <div style="float: right;">
                <Page
                    ref="pages"
                    show-total
                    show-elevator
                    :page-size="params.pageSize" :current="params.pageIndex"
                    :total="tableData.records"
                    @on-change="changePage">
                </Page>
            </div>
        </div>
        <!-- 新增编辑 -->
        <Modal
            v-model="isShowDetail"
            :title="detailTitle"
            :mask-closable="false"
            width="60%">
            <detail v-if="isShowDetail" ref="detail" :title="detailTitle" :detail="currentData"></detail>
            <div slot="footer">
                <Button type="text" size="large" @click="isShowDetail = false">取消</Button>
                <Button :loading="dialogLoading" type="primary" size="large" @click="update()" v-show="detailTitle != '查看详情'">确定</Button>
            </div>
        </Modal>
        <Modal title="预览图片" v-model="visible">
            <img v-for="item in imageUrl" :src="item" v-if="visible" style="width: 100%">
        </Modal>
    </div>
</template>

<script>
    import detail from './components/detail.vue'
    import config from '@/config'
    const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
    export default{
        name: 'productCategory',
        components: {detail},
        data(){
            return{
                buttons: this.$store.state.user.currentMenuButtons,
                isAdmin: this.$store.state.user.roleNames.indexOf('管理员')>-1,
                self: this,
                params:{
                    pageIndex: 1,
                    pageSize: 10,
                },
                regionsCountiesUseForQuery: true,
                isShowDetail: false,
                detailTitle: '新增',
                tableData: [],
                selectRow: [],
                currentData: {},
                dialogLoading: false,
                visible: false,
                imageUrl: [],
                header: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },  
                    {title: '分类名称',key: 'categoryName',},
                    {title: '排序',key: 'sort',},
                    {title: '创建时间',key: 'createDate',},
                    {title: '分类图片',key: 'categoryImages',
                        render:(h, params)=>{
                            return h('Icon',{
                                props:{
                                    title: '预览图片',
                                    type: "ios-eye-outline",
                                    size: 20
                                },
                                on:{
                                    click: ()=>{
                                        this.handleView(params.row)
                                    }
                                }
                            },'')
                        },
                    },
                    {title: '操作',key: 'createDate', width: 100,
                        render:(h, params)=>{
                            return h('Button',{
                                props:{type: 'primary'},
                                on:{
                                    click: ()=>{
                                        this.getDetail(params)
                                    }
                                }
                            },'查看详情')
                        },
                    },
                ],
            }
        },
        methods:{
            findByPage(){
                let url = '/productCategory/findByPage'
                this.axios.request({
                    params: this.params,
                    url,
                    method: 'get'
                }).then(res =>{
                    this.tableData = res.data
                }).catch(err =>{
                    console.log('网络异常')
                })
            },
            changeDate(date){
                [this.params.startCreateDate,this.params.endCreateDate] = date
            },
            changePage(current){
                this.params.pageIndex = current
                this.findByPage()
            },
            setSelectRow(curRow){
                this.selectRow = JSON.parse(JSON.stringify(curRow))   
            },
            getDetail(params){
                this.currentData = JSON.parse(JSON.stringify(params.row))
                this.isShowDetail = true
                this.detailTitle = '查看详情'
            },
            showModel(name){
                switch(name){
                    case '新增':
                        this.isShowDetail = true
                        this.detailTitle = '新增'
                        this.currentData = {}
                    break;
                    case '编辑':
                        if(this.selectRow.length  == 1){
                            this.currentData = JSON.parse(JSON.stringify(this.selectRow[0]))
                            this.isShowDetail = true
                            this.detailTitle = '编辑'
                        }else if(this.selectRow.length < 1){
                            this.$Message.info('请选择一条数据')
                        }else{
                            this.$Message.info('请选择一条数据进行编辑')
                        }
                    break;
                }
            },
            update(){
                let base = ''
                if(this.isAdmin){
                    base = '/productCategory'
                }else{
                    base = '/productCategory'
                }
                let url = this.detailTitle == '新增' ? base+'/add' : base+'/update'
                let data = JSON.parse(JSON.stringify(this.currentData))
                let detail = this.$refs.detail.$refs.detail
                if(this.detailTitle == '新增'){
                    data.regionsCountiesId = ''
                }
                console.log(data);
                detail.validate(valid =>{
                    if(valid){
                        this.sendData(url,data)
                    }
                })
            },
            sendData(url,data,method='post'){
                this.dialogLoading = true
                this.axios.request({
                    url,
                    method,
                    data: data || this.currentData
                }).then(res =>{
                    this.dialogLoading = false
                    if(res.data.result == 1){
                        this.isShowDetail = false
                        this.$Message.success(this.detailTitle + '成功')
                        this.params.pageIndex=1
                        this.findByPage()
                        this.selectRow = []
                    }else{
                        this.$Message.error(res.data.msg) 
                    }
                }).catch(err =>{
                    this.dialogLoading = false
                    this.$Message.error('网络出现问题，请重试')
                })
            },
            handleView(params){
                console.log(params);
                this.visible = true
                this.imageUrl = []
                if(params.categoryImages == null || params.categoryImages == "" || params.categoryImages == undefined ){
                    this.imageUrl = []
                }else{
                    params.categoryImages.split(",").forEach(item=> this.imageUrl.push( baseUrl + item) )
                }
            }
        },
        created(){
            this.findByPage()
        }
    }
</script>

<style lang="less" scoped>
    .productCategory{

    }
</style>