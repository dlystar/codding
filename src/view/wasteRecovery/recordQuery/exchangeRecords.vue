<template>
    <!-- 兑换记录-管理员和区县级代理 -->
    <div class="exchangeRecords">
        <div class="searchArea">
            <!-- 地区查询  -->
            <Row type="flex" align="middle" class="code-row-bg">
                <template v-if="isAdmin">
                    <Col span="2">选择店铺：</Col>
                    <Col span="4">
                        <Input v-model="params.shopName" style="width: 98%;" readonly clearable @on-clear="clearShop">
                            <Icon type="md-apps" slot="suffix" @click="showSelectShop" class="dly_select" />
                        </Input>
                    </Col>
                </template>
                <Col span="2">会员手机号：</Col>
                <Col span="4"><Input v-model="params.phone" style="width: 98%;"/></Col>
                <Col span="2"><span></span></Col>
                <Col span="4"><Button type="primary" @click="params.pageIndex=1;findByPage()">查询</Button></Col>
            </Row>
        </div>
        <div class="buttonArea">
            <Button v-for="item in buttons" :type="item.type" @click="showModel(item.name)">
                {{item.name}}
            </Button>
        </div>
        <Table ref="deviceTable" :content="self" :columns="header" :data="tableData.rows"></Table>
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
        <!-- 选择店铺 -->
        <Modal
            v-model="isShowSelectShop"
            :title="'选择店铺'"
            :mask-closable="false"
            width="60%">
            <selectShop :isAdmin="true" v-if="isShowSelectShop" ref="selectShop"></selectShop>
            <div slot="footer">
                <Button type="text" size="large" @click="isShowSelectShop = false">取消</Button>
                <Button :loading="dialogLoading" type="primary" size="large" @click="selectShop()">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import selectShop from '@com/selectShop.vue'
    import mixins from '@com/mixins'
    export default{
        components: {selectShop},
        mixins: [mixins],
        data(){
            return{
                buttons: this.$store.state.user.currentMenuButtons,
                self: this,
                params:{
                    pageIndex: 1,
                    pageSize: 10,
                    shopId: '',
                    shopName: '',
                    phone: '',
                },
                isShowDetail: false,
                detailTitle: '新增',
                tableData: {},
                selectRow: [],
                currentData: {},
                dialogLoading: false,
                isAdmin: this.$store.state.user.roleNames.indexOf('管理员')>-1,
                header: [
                    {title: '姓名',key: 'userName',},
                    {title: '手机号',key: 'mobilePhone', width: 100},
                    {title: '兑换积分',key: 'points',},
                    {title: '兑换信息',key: 'description',},
                    {title: '获取时间',key: 'createDate',},
                ]
            }
        },
        methods:{
            findByPage(){
                let url = ''
                if(this.isAdmin){
                    url = '/adminRecordQuery/findExchangeRecordsByPage'
                }else{
                    url = '/regionsCountiesRecordQuery/findExchangeRecordsByPage'
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
            changePage(current){
                this.params.pageIndex = current
                this.findByPage()
            },
        },
        created(){
            this.findByPage()
        }
    }
</script>

<style lang="less" scoped>
    
</style>