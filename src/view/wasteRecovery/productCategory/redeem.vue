<template>
    <!-- 广告位管理-管理员和城市代理人 -->
    <div class="redeem">
        <div class="searchArea">
            <!-- 地区查询 批量绑定协会  -->
            <Row type="flex" align="middle" justify="center" class="code-row-bg">
                <Col span="4" class-name="mr"><span style="font-size:16px;">请输入会员手机号：</span></Col>
                <Col span="7"><Input v-model="phone" style="width: 98%;"/></Col>
                <Col span="4"><Button type="primary" @click="getMemberInfo()">加载</Button></Col>
            </Row>
            <Row type="flex" align="middle" class="code-row-bg">
                <Col span="3" class-name="mr">会员姓名：</Col>
                <Col span="4"><Input v-model="memberInfo.userName" style="width: 98%;" disabled/></Col>
                <Col span="3" class-name="mr">会员手机号：</Col>
                <Col span="4"><Input v-model="memberInfo.phone" style="width: 98%;" disabled/></Col>
                <Col span="3" class-name="mr">本店铺可用积分：</Col>
                <Col span="4"><Input v-model="memberInfo.sumJifen" style="width: 98%;" disabled/></Col>
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
            title="商品兑换"
            :mask-closable="false"
            width="40%">
            <detail 
                :allCategoryClass="allCategoryClass"
                v-if="isShowDetail" ref="detail" :title="detailTitle" :detail="currentData"></detail>
            <div slot="footer">
                <Button type="text" size="large" @click="isShowDetail = false">取消</Button>
                <Button :loading="dialogLoading" type="primary" size="large" @click="update()" v-show="detailTitle != '兑换'">确定</Button>
            </div>
        </Modal>
        <Modal title="预览图片" v-model="visible">
            <img v-for="item in imageUrl" :src="item" v-if="visible" style="width: 100%">
        </Modal>
        <!-- 选择店铺 -->
        <Modal
            v-model="isShowSelectShop"
            :title="'选择店铺'"
            :mask-closable="false"
            width="70%">
            <selectShop v-if="isShowSelectShop" ref="selectShop"></selectShop>
            <div slot="footer">
                <Button type="text" size="large" @click="isShowSelectShop = false">取消</Button>
                <Button :loading="dialogLoading" type="primary" size="large" @click="selectShop()">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import detail from './components/exchangeStar.vue'
    import config from '@/config'
    import selectShop from '@com/selectShop.vue'
    import mixins from '@com/mixins'
    const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
    export default{
        name: 'redeem',
        components: {detail,selectShop},
        mixins: [mixins],
        data(){
            return{
                buttons: this.$store.state.user.currentMenuButtons,
                isAdmin: this.$store.state.user.roleNames.indexOf('管理员')>-1,
                self: this,
                params:{
                    pageIndex: 1,
                    pageSize: 10,
                    minPrice: null,
                    maxPrice: null,
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
                allCategoryClass: [],
                phone: '',
                memberInfo: {
                    userName: '',
                    phone: '',
                    sumJifen: '',
                },
                header: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },  
                    {title: '产品名称',key: 'productName',},
                    {title: '单价',key: 'price',},
                    {title: '剩余数量',key: 'number',},
                    {title: '排序值',key: 'sort',},
                    {title: '创建时间',key: 'createDate',},
                    // {title: '缩略图',key: 'productThumbnail',
                    //     render:(h, params)=>{
                    //         return h('Icon',{
                    //             props:{
                    //                 title: '预览图片',
                    //                 type: "ios-eye-outline",
                    //                 size: 20
                    //             },
                    //             on:{
                    //                 click: ()=>{
                    //                     this.handleView(params.row)
                    //                 }
                    //             }
                    //         },'')
                    //     },
                    // },
                    {title: '操作',key: 'createDate', width: 100,
                        render:(h, params)=>{
                            return h('Button',{
                                props:{type: 'primary'},
                                on:{
                                    click: ()=>{
                                        this.getDetail(params)
                                    }
                                }
                            },'兑换')
                        },
                    },
                ],
            }
        },
        methods:{
            findByPage(){
                let url = '/adminProduct/findByPage'
                if(!this.isAdmin){
                    url = '/regionsCountiesProduct/findByPage'
                }
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
                this.currentData.num = null
                this.isShowDetail = true
                this.detailTitle = '商品兑换'
            },
            showModel(name){
                switch(name){
                    case '新增':
                        this.isShowDetail = true
                        this.detailTitle = '新增'
                        this.currentData = {
                            categoryId: null,
                            price: null,
                            number: null,
                            sort: null
                        }
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
                let url = '/regionsCountiesProduct/redeem'
                let data = JSON.parse(JSON.stringify(this.currentData))
                data.phone = this.memberInfo.phone
                console.log(data);
                if(/^[0-9]+$/.test(data.num)){
                    this.sendData(url,data,'get')
                }else{
                    this.$Message.info('请填写兑换数量，且必须是整数')
                    return
                }
            },
            sendData(url,data,method='post'){
                this.dialogLoading = true
                this.axios.request({
                    url,
                    method,
                    params:data,
                }).then(res =>{
                    this.dialogLoading = false
                    if(res.data.result == 1){
                        this.isShowDetail = false
                        this.$Message.success(this.detailTitle + '成功')
                        this.params.pageIndex=1
                        this.getMemberInfo()
                        this.selectRow = []
                    }else{
                        this.$Message.error(res.data.msg) 
                    }
                }).catch(err =>{
                    this.dialogLoading = false
                    this.$Message.error('网络出现问题，请重试')
                })
            },
            findAllCategoryClass(){
                this.axios.request({
                    params: {},
                    url: '/productCategory/findAll',
                    method: 'get'
                }).then(res =>{
                    this.allCategoryClass = res.data.rows
                }).catch(err =>{
                    console.log('网络异常')
                })
            },
            handleView(params){
                console.log(params);
                this.imageUrl = []
                if(params.productThumbnail == null || params.productThumbnail == "" || params.productThumbnail == undefined ){
                    this.$Message.info('暂无缩略图')
                    this.imageUrl = []
                    return
                }else{
                    this.visible = true
                    params.productThumbnail.split(",").forEach(item=> this.imageUrl.push( baseUrl + item) )
                }
            },
            getMemberInfo(){
                this.axios.request({
                    params: {phone: this.phone},
                    url: '/regionsCountiesProduct/findMemberInfo',
                    method: 'get'
                }).then(res =>{
                    this.memberInfo = res.data.rows
                    this.params.minPrice = 0
                    this.params.maxPrice = this.memberInfo.sumJifen
                    this.findByPage()
                }).catch(err =>{
                    console.log('网络异常')
                })
            }
        },
        created(){
            // this.findByPage()
            // this.findAllCategoryClass()
        }
    }
</script>

<style lang="less" scoped>
    /deep/.mr{
        text-align: right;
    }
</style>