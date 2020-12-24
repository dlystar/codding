<template>
    <div class="welcome">
        <div style="margin-bottom: 20px;">
            <!-- <div class="welcome-title" v-if="isAgent || isMerchant || isSearch">{{pageTitle}}</div> -->
            <Row :gutter="20">
                <Col span="8" v-for="item in statistics" :key="item.name">
                    <div class="grid">
                        <div class="title" :style="{background: item.titleBg}">{{`${item.name}: ${item.total+item.unitName}`}}</div>
                        <div class="content" :style="{background: item.contentBg}">
                            <div class="item">
                                <div class="name">昨日{{item.unit}}</div>
                                <div class="value">{{item.yesToday+item.unitName}}</div>
                            </div>
                            <div class="item">
                                <div class="name">今日{{item.unit}}</div>
                                <div class="value">{{item.today+item.unitName}}</div>
                            </div>
                            <div class="item">
                                <div class="name">本月{{item.unit}}</div>
                                <div class="value">{{item.toMonth+item.unitName}}</div>
                            </div>
                            <div class="item">
                                <div class="name">本年{{item.unit}}</div>
                                <div class="value">{{item.toYear+item.unitName}}</div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
        <dataChart></dataChart>
    </div>
</template>
<script>
    import dataChart from './dataChart'
    export default {
        components: {dataChart},
        data(){
            return {
                statistics: [],
                isAdmin: this.$store.state.user.roleNames.indexOf('管理员')>-1,
                isCityAgent: this.$store.state.user.roleNames.indexOf('市级代理')>-1,
                isRegionsCounties: this.$store.state.user.roleNames.indexOf('区县级代理')>-1,
                isShopOp: this.$store.state.user.roleNames.indexOf('店员')>-1,
                '总收货金额': {},
                '总收货次数': {},
                '总卖货次数': {},
                '总收货个数': {},
                '总收货重量': {},
                '总利润': {},
                '总卖货个数': {},
                '总卖货金额': {},
                '总卖货重量': {},

            }
        },
        methods:{
            //总收货次数和卖货次数统计数据
            findIndexCount(){
                let url = ''
                if(this.isAdmin){
                    url = '/adminReceivingStatistics/findIndexCountByAdmin'
                }else if(this.isCityAgent){
                    url = '/cityAgentReceivingStatistics/findIndexCountByCtityAgent'
                }else if(this.isRegionsCounties || this.this.isShopOp){
                    url = '/regionsCountiesReceivingStatistics/findIndexCountByShop'
                }
                this.axios.request({
                    params: {},
                    url,
                    method: 'get'
                }).then(res =>{
                    let data = res.data.rows
                    this['总收货次数'] = {
                        name: '总收货次数',
                        total: data.orderNum,
                        yesToday: data.yesterdayOrderNum,
                        today: data.todayOrderNum,
                        toMonth: data.thisMonthOrderNum,
                        toYear: data.thisYearOrderNum,
                        unit: '次数',
                        unitName: '次'
                    }
                    this['总卖货次数'] = {
                        name: '总卖货次数',
                        total: data.sellingGoodsNum,
                        yesToday: data.yesterdaySellingGoodsNum,
                        today: data.todaySellingGoodsNum,
                        toMonth: data.thisMonthSellingGoodsNum,
                        toYear: data.thisYearSellingGoodsNum,
                        unit: '次数',
                        unitName: '次'
                    }
                    this.findIndexOrderSum()
                }).catch(err =>{
                    console.log('网络异常')
                })
            },
            //首页收货统计数据
            findIndexOrderSum(){
                let url = ''
                if(this.isAdmin){
                    url = '/adminReceivingStatistics/findIndexOrderSumByAdmin'
                }else if(this.isCityAgent){
                    url = '/cityAgentReceivingStatistics/findIndexOrderSumByCtityAgent'
                }else if(this.isRegionsCounties || this.isShopOp){
                    url = '/regionsCountiesReceivingStatistics/findIndexOrderSumByShop'
                }
                this.axios.request({
                    params: {},
                    url,
                    method: 'get'
                }).then(res =>{
                    let data = res.data.rows
                    this['总收货个数'] = {
                        name: '总收货个数',
                        total: data.sum_total_number,
                        yesToday: data.yesterday_sum_total_number,
                        today: data.today_sum_total_number,
                        toMonth: data.this_month_sum_total_number,
                        toYear: data.this_year_sum_total_number,
                        unit: '个数',
                        unitName: '个'
                    }
                    this['总收货金额'] = {
                        name: '总收货金额',
                        total: data.sum_money,
                        yesToday: data.yesterday_sum_money,
                        today: data.today_sum_money,
                        toMonth: data.this_month_sum_money,
                        toYear: data.this_year_sum_money,
                        unit: '金额',
                        unitName: '元'
                    }
                    this['总收货重量'] = {
                        name: '总收货重量',
                        total: data.sum_total_weight,
                        yesToday: data.yesterday_sum_total_weight,
                        today: data.today_sum_total_weight,
                        toMonth: data.this_month_sum_total_weight,
                        toYear: data.this_year_sum_total_weight,
                        unit: '重量',
                        unitName: '公斤'
                    }
                    this.findIndexProfitSum()
                }).catch(err =>{
                    console.log('网络异常')
                })
            },
            //首页总利润统计数据
            findIndexProfitSum(){
                let url = ''
                if(this.isAdmin){
                    url = '/adminReceivingStatistics/findIndexProfitSumByAdmin'
                }else if(this.isCityAgent){
                    url = '/cityAgentReceivingStatistics/findIndexProfitSumByCtityAgent'
                }else if(this.isRegionsCounties || this.isShopOp){
                    url = '/regionsCountiesReceivingStatistics/findIndexProfitSumByShop'
                }
                this.axios.request({
                    params: {},
                    url,
                    method: 'get'
                }).then(res =>{
                    let data = res.data.rows
                    this['总利润'] = {
                        name: '总利润',
                        total: data.profit,
                        yesToday: data.yesterdayProfit,
                        today: data.todayProfit,
                        toMonth: data.thisMonthProfit,
                        toYear: data.thisYearProfit,
                        unit: '利润',
                        unitName: '元'
                    }
                    this.findIndexSellingGoodsSum()
                }).catch(err =>{
                    console.log('网络异常')
                })
            },
            //首页总卖货统计数据
            findIndexSellingGoodsSum(){
                let url = ''
                if(this.isAdmin){
                    url = '/adminReceivingStatistics/findIndexSellingGoodsSumByAdmin'
                }else if(this.isCityAgent){
                    url = '/cityAgentReceivingStatistics/findIndexSellingGoodsSumByCtityAgent'
                }else if(this.isRegionsCounties || this.isShopOp){
                    url = '/regionsCountiesReceivingStatistics/findIndexSellingGoodsSumByShop'
                }
                this.axios.request({
                    params: {},
                    url,
                    method: 'get'
                }).then(res =>{
                    let data = res.data.rows
                    this['总卖货个数'] = {
                        name: '总卖货个数',
                        total: data.sum_total_number,
                        yesToday: data.yesterday_sum_total_number,
                        today: data.today_sum_total_number,
                        toMonth: data.this_month_sum_total_number,
                        toYear: data.this_year_sum_total_number,
                        unit: '个数',
                        unitName: '个'
                    }
                    this['总卖货金额'] = {
                        name: '总卖货金额',
                        total: data.sum_money,
                        yesToday: data.yesterday_sum_money,
                        today: data.today_sum_money,
                        toMonth: data.this_month_sum_money,
                        toYear: data.this_year_sum_money,
                        unit: '金额',
                        unitName: '元'
                    }
                    this['总卖货重量'] = {
                        name: '总卖货重量',
                        total: data.sum_total_weight,
                        yesToday: data.yesterday_sum_total_weight,
                        today: data.today_sum_total_weight,
                        toMonth: data.this_month_sum_total_weight,
                        toYear: data.this_year_sum_total_weight,
                        unit: '重量',
                        unitName: '公斤'
                    }
                    this.paixu()

                }).catch(err =>{
                    console.log('网络异常')
                })
            },
            paixu(){
                this.statistics.push(Object.assign(this['总收货金额'],{
                    titleBg: '#33CC33',
                    contentBg: '#99CCCC'
                }))
                this.statistics.push(Object.assign(this['总收货重量'],{
                    titleBg: '#99CC33',
                    contentBg: '#99CCCC'
                }))
                this.statistics.push(Object.assign(this['总收货个数'],{
                    titleBg: '#669933',
                    contentBg: '#99CCCC'
                }))

                this.statistics.push(Object.assign(this['总卖货金额'],{
                    titleBg: '#0099CC',
                    contentBg: '#99CCFF'
                }))
                this.statistics.push(Object.assign(this['总卖货重量'],{
                    titleBg: '#3366CC',
                    contentBg: '#99CCFF'
                }))
                this.statistics.push(Object.assign(this['总卖货个数'],{
                    titleBg: '#336699',
                    contentBg: '#99CCFF'
                }))

                this.statistics.push(Object.assign(this['总利润'],{
                    titleBg: '#009999',
                    contentBg: '#66CCCC'
                }))
                this.statistics.push(Object.assign(this['总收货次数'],{
                    titleBg: '#669999',
                    contentBg: '#66CCCC'
                }))
                this.statistics.push(Object.assign(this['总卖货次数'],{
                    titleBg: '#3399CC',
                    contentBg: '#66CCCC'
                }))
            }
        },
        created(){
            this.findIndexCount()
        },
        mounted(){
            
        }
    }
</script>
<style lang="less">
    .iwcs_modal{
        .ivu-modal-mask{
            background-color: rgba(55, 55, 55, 0) !important;
        }
        .ivu-modal-content{
            position: absolute; left: 0;
        }    
    }

    .welcome{
        position: relative;
        .map-search{
            position: absolute; width: 100%; z-index: 100;
            margin-top: 30px;
        }
        .welcome-title{
            height: 50px; line-height: 50px; font-size: 22px; font-weight: bold;
            padding-left: 30px; text-align: center;
        }
        .grid{
            color: #000; height: 130px; overflow: hidden; border-radius: 5px;
            /* border: 1px solid #ccc;  */background: #fff; margin-top: 20px;
            .title{height: 70px; text-align: center; font-size: 20px; line-height: 70px;}
            .content{
                display: flex;
                height: 60px;
                .item{
                    flex: 1;
                    // border-top: 1px solid #ccc;
                    text-align: center;
                    .name{
                        border-bottom: 1px solid #fff;
                        border-right: 2px solid #fff;
                        height: 30px;
                        line-height: 30px;
                    }
                    .value{
                        border-right: 2px solid #fff;
                        height: 30px;
                        line-height: 30px;
                    }
                    &:last-child{
                        .name,.value{
                            border-right: none;
                        }
                    }
                }
            }
        }
    }
</style>