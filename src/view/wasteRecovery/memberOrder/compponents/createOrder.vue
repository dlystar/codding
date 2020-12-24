<template>
    <!-- 品类管理-品类明细管理（区县管理） -->
    <div class="regionsCountiesCategoryDetail">
        <div class="temp" v-for="(item,index) in tableData" :key="index">
            <template>
                <div class="categoryName" v-show="handleStyle(item,index)">{{item.categoryName}}</div>
                <div class="content">
                    <div class="detailName">{{item.detailName}}</div>
                    <div class="unitPrice">
                        <InputNumber 
                            v-model="item.numericalValue" :placeholder="unitClasses[Number(item.unitClass)]"
                            :min="0"
                            style="width: 140px !important;"
                            @on-change="autoComputeMoney(item)">
                        </InputNumber>
                        &nbsp;&nbsp;*&nbsp;&nbsp;
                        <Input
                            v-model="item.unitPrice" 
                            placeholder="单价"
                            type="number"
                            style="width: 100px; float: right; margin-top: 3.5px;"
                            @on-change="autoComputeMoney(item)">
                            <span slot="append">/元</span>
                        </Input>
                    </div>
                    <!-- <div style="width: 100px;">
                        <span>{{`${item.unitName}`}}</span>
                    </div> -->
                    <div style="margin-left: 20px;">
                        共：<Input v-model="item.showMoney" disabled style="width: 100px;"/>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
    import {operation} from '@/libs/tools'
    export default{
        data(){
            return{
                buttons: this.$store.state.user.currentMenuButtons,
                tableData: [],
                shopId: '',
                unitClasses: ['','重量','个','其他类别'],
                buttonName: '编辑',
                allCategoryClass: [],
                otherId: '',
                noEdit: true,
                dialogLoading: false,
                
            }
        },
        methods:{
            findByPage(){
                this.axios.request({
                    params: {shopId: this.shopId},
                    url: '/adminCategoryDetail/findByShopIdOrAdminTemplate',
                    method: 'get'
                }).then(res =>{
                    res.data.rows.forEach(item =>{
                        if(item.categoryName == null){
                            item.categoryName = '其它类'
                        }
                        this.tableData.push({
                            money: null,
                            showMoney: null,
                            numericalValue: null,
                            unitName: item.unit,
                            categoryClassDetailId: item.id,
                            categoryName: item.categoryName,
                            unitPrice: item.unitPrice,
                            detailName: item.detailName,
                            unitClass: item.unitClass
                        })
                    })
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
                    if(item.categoryName == this.tableData[index-1].categoryName){
                        return false
                    }else{
                        return true
                    }
                }else{
                    return true
                }
            },
            autoComputeMoney(item){
                item.money = operation(item.unitPrice,item.numericalValue,'multiply')
                item.showMoney = item.money + '元'
            },
            formatNumber(value){
                console.log(value);
                return value + '/元'
            }
        },
        created(){
            this.findShop()
        }
    }
</script>

<style lang="less" scoped>
    .temp{
        // width: 700px;
        background: #fff;
        padding: 5px 20px;
        font-size: 16px;
        margin: 0 auto;
        // border-radius: 10px;
        // box-shadow: 5px 5px 5px #ccc;
        .categoryName{
            font-weight: bold;
        }
        .content{
            margin-left: 100px;
            // width: 700px;
            height: 40px;
            line-height: 40px;
            font-size: 15px;
            >div{
                float: left;
            }
            .detailName{
                width: 100px;
                margin-right: 20px;
            }
            .unitPrice{
                /deep/.ivu-input-number-input::placeholder{
                    color: #ebebeb;
                }
            }
        }
    }
</style>