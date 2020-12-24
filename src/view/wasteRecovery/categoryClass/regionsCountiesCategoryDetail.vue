<template>
    <!-- 品类管理-品类明细管理（区县管理） -->
    <div class="regionsCountiesCategoryDetail">
        <div class="buttonArea" style="position: absolute;">
            <Button v-for="item in buttons" :type="item.type" @click="showModel()">
                {{buttonName}}
            </Button>
            <Button v-show="!noEdit" @click="cancel">取消</Button>
        </div>
        <div class="temp">
            <div class="categoryName"></div>
            <div class="content">
                <div class="detailName">类别</div>
                <div class="unit" style="width: 100px;">单价</div>
                <div class="unitPrice" style="width: 100px;">单位</div>
                <div class="unitClass" style="width: 100px;">单位类别</div>
            </div>
        </div>
        <div class="temp" v-for="(item,index) in tableData.rows">
            <template v-if="item.categoryName!='其它类'">
                <div class="categoryName" v-show="handleStyle(item,index)">{{item.categoryName}}</div>
                <div class="content">
                    <div class="detailName">{{item.detailName}}</div>
                    <div class="unitPrice">
                        <Input v-model="item.unitPrice" :disabled="noEdit">
                            <div slot="suffix">{{`${item.unit}/${unitClasses[item.unitClass]}`}}</div>
                        </Input>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="categoryName" v-show="handleStyle(item,index)">{{item.categoryName}}</div>
                <div class="content">
                    <div class="detailName">
                        <Input v-model="item.detailName" placeholder="请输入品类类别" :disabled="canEdit(item)"></Input>
                    </div>
                    <div class="unitPrice" style="width: 100px;">
                        <Input v-model="item.unitPrice" placeholder="请输入单价" :disabled="noEdit"></Input>
                    </div>
                    <div class="unit" style="width: 100px;">
                        <Input v-model="item.unit" placeholder="请输入单位" :disabled="canEdit(item)"></Input>
                    </div>
                    <div class="unitClass" style="width: 100px;">
                        <Select v-model="item.unitClass" :disabled="canEdit(item)">
                            <Option value="1">公斤数类别</Option>
                            <Option value="2">个数类别</Option>
                            <Option value="3">其他类别</Option>
                        </Select>
                    </div>
                    <div class="add">
                        <Button 
                            type="error" @click="delOther(item,index)" 
                            v-show="item.isAdd || item.creator == accountName" 
                            style="margin: 0 10px;" :disabled="noEdit">删除</Button>
                        <Button 
                            type="primary" @click="addOther(item)" 
                            v-show="index == tableData.rows.length-1" 
                            style="margin: 0 10px;" :disabled="noEdit">新增</Button>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
    import detail from './components/addCate.vue'
    export default{
        components: {detail},
        data(){
            return{
                buttons: this.$store.state.user.currentMenuButtons,
                tableData: [],
                shopId: '',
                unitClasses: ['','公斤','个','其他类别'],
                buttonName: '编辑',
                allCategoryClass: [],
                otherId: '',
                noEdit: true,
                firstOtherIndex: 0,
                accountName: this.$store.state.user.accountName,
            }
        },
        methods:{
            findByPage(){
                this.axios.request({
                    params: {shopId: this.shopId},
                    url: '/adminCategoryDetail/findByShopIdOrAdminTemplate',
                    method: 'get'
                }).then(res =>{
                    this.tableData = res.data
                    let hasOther = false
                    this.tableData.rows.forEach(item =>{
                        if(item.shopId == null){
                            item.shopId = this.shopId
                        }
                        if(item.categoryName == '其它类' || item.categoryName == null){
                            hasOther = true
                            item.categoryName = '其它类'
                        }
                    })
                    if(!hasOther){
                        this.tableData.rows.push({
                            categoryName: '其它类',
                            detailName: '',
                            unitPrice: '',
                            unit: '',
                            unitClass: 0,
                            shopId: this.shopId,
                            categoryId: this.otherId,
                            isAdd: true,
                        })
                    }
                    this.firstOtherIndex = this.tableData.rows.length
                }).catch(err =>{
                    console.log('网络异常')
                })
            },
            showModel(){
                if(this.buttonName == '编辑'){
                    this.buttonName = '确认'
                    this.noEdit = false
                    this.buttons[0].type = 'primary'
                }else{
                    //接口
                    let canSubmit = true
                    this.tableData.rows.forEach(item =>{
                        if(item.categoryName == '其它类'){
                            if(this.isEmpty(item.detailName) 
                                || this.isEmpty(item.unitPrice) 
                                || this.isEmpty(item.unit) 
                                || this.isEmpty(item.unitClass)){
                                canSubmit = false
                            }
                        }else{
                            if(item.unitPrice == ''){
                                canSubmit = false
                            }
                        }
                    })
                    if(!canSubmit){
                        this.$Message.info("请检查数据是否输入完整再提交！")
                        return
                    }

                    this.axios.request({
                        data: {
                            catagoryDetailJsonArray: JSON.stringify(this.tableData.rows)
                        },
                        url: '/regionsCountiesCategoryDetail/add',
                        method: 'post'
                    }).then(res =>{
                        this.buttonName = '编辑'
                        this.noEdit = true
                        this.buttons[0].type = 'success'
                        this.$Message.success('编辑成功')
                        this.findByPage()
                    }).catch(err =>{
                        this.buttonName = '编辑'
                        this.noEdit = true
                        this.buttons[0].type = 'success'
                        console.log('网络异常')
                    })
                }
            },
            isEmpty(value){
                console.log(value);
                if(value == '' || value == undefined || value == null){
                    return true
                }
                return false
            },
            findShop(){
                this.axios.request({
                    params: this.params,
                    url: '/cityAgentShop/findMyShop',
                    method: 'get'
                }).then(res =>{
                    this.shopId = res.data.rows.id
                    this.findAllCategoryClass()
                }).catch(err =>{
                    console.log('网络异常')
                })
            },
            findAllCategoryClass(){
                //allCategoryClass
                this.axios.request({
                    params: this.params,
                    url: '/categoryClass/findAll',
                    method: 'get'
                }).then(res =>{
                    this.allCategoryClass = res.data.rows
                    this.allCategoryClass.forEach(item =>{
                        if(item.categoryName == '其它类'){
                            this.otherId = item.id
                        }
                    })
                    this.findByPage()
                }).catch(err =>{
                    console.log('网络异常')
                })
            },
            handleStyle(item,index){
                if(index > 0){
                    if(item.categoryName == this.tableData.rows[index-1].categoryName){
                        return false
                    }else{
                        return true
                    }
                }else{
                    return true
                }
            },
            addOther(item){
                if(item.detailName && item.unitPrice && item.unit && item.unitClass){

                }else{
                    this.$Message.info('请填写完整后再新增')
                    return
                }
                this.tableData.rows.push({
                    categoryName: '其它类',
                    detailName: '',
                    unitPrice: '',
                    unit: '',
                    unitClass: 0,
                    shopId: this.shopId,
                    categoryId: this.otherId,
                    isAdd: true,
                })
            },
            delOther(item,index){
                let isAddNum = 0
                this.tableData.rows.forEach(item =>{
                    if(item.isAdd) isAddNum++
                })
                if(item.creator != this.accountName && isAddNum == 0){
                    this.$Message.info('该项不允许删除')
                    
                }
                this.tableData.rows.splice(index,1)

                let hasOther = false
                this.tableData.rows.forEach(item =>{
                    if(item.categoryName == '其它类' || item.categoryName == null){
                        hasOther = true
                    }
                })
                if(!hasOther){
                    this.tableData.rows.push({
                        categoryName: '其它类',
                        detailName: '',
                        unitPrice: '',
                        unit: '',
                        unitClass: 0,
                        shopId: this.shopId,
                        categoryId: this.otherId,
                        isAdd: true,
                    })
                }
            },
            cancel(){
                this.buttonName = '编辑'
                this.noEdit = true
                this.buttons[0].type = 'success'
            },
            canEdit(item){
                if(!this.noEdit){
                    if(item.isAdd){
                        return false
                    }else{
                        return true
                    }
                }else{
                    return true
                }
            }
        },
        created(){
            this.findShop()
        },
        mounted(){
            // let el = document.getElementsByClassName('regionsCountiesCategoryDetail')[0]
            // let contentH = el.parentElement.offsetHeight
            // el.style.height = contentH + 'px'
        }
    }
</script>

<style lang="less" scoped>
    // .regionsCountiesCategoryDetail{
    //     overflow-y: auto;
    // }
    .temp{
        width: 700px;
        background: #fff;
        padding: 5px 20px;
        font-size: 16px;
        margin: 0 auto;
        border-radius: 10px;
        box-shadow: 5px 5px 5px #ccc;
        .categoryName{
            font-weight: bold;
        }
        .content{
            margin-left: 100px;
            width: 700px;
            height: 40px;
            line-height: 40px;
            font-size: 14px;
            >div{
                float: left;
            }
            .detailName{
                width: 100px;
                margin-right: 20px;
            }
            .unitPrice{
                width: 200px;
                /deep/.ivu-input-suffix{
                    font-size: 12px;
                    width: 100px;
                    line-height: 30px;
                    background: #ccc;
                    text-align: left;
                    padding-left: 5px;
                }
            }
        }
    }
</style>