<template>
    <div class="dataChart">
        <Tabs type="card"  @on-click="clickTab">
            <TabPane label="收货统计">
                <!-- 近一个月收货情况 -->
                <chart ref="shouhuoLine" style="width: 100%;" :options="shouhuoLine" :auto-resize="true"></chart>
                <!-- 查询条件 -->
                <div class="searchArea">
                    <Row type="flex" align="middle" class="code-row-bg">
                        <Col span="2">日期查询：</Col>
                        <Col span="6"><DatePicker type="date" :value="shouhuoParams.date" placeholder="请选择日期" @on-change="changeDate" style="width: 98%;"/></DatePicker></Col>
                        <Col span="2"><Button type="primary" @click="findOrderIndividualStatistics('shouhuoParams','date')">查询</Button></Col>
                        <Col span="2"><span></span></Col>

                        <Col span="2">月份查询：</Col>
                        <Col span="6"><DatePicker type="month" placeholder="请选择月份" @on-change="changeDate" style="width: 98%;"/></DatePicker></Col>
                        <Col span="2"><Button type="primary" @click="findOrderIndividualStatistics('shouhuoParams','yearAndMonth')">查询</Button></Col>
                        <Col span="2"><span></span></Col>

                        <Col span="2">年份查询：</Col>
                        <Col span="6"><DatePicker type="year" placeholder="请选择年份" @on-change="changeDate" style="width: 98%;"/></DatePicker></Col>
                        <Col span="2"><Button type="primary" @click="findOrderIndividualStatistics('shouhuoParams','year')">查询</Button></Col>
                        <Col span="2"><span></span></Col>

                        <Col span="2">间隔查询：</Col>
                        <Col span="6"><DatePicker type="daterange" placeholder="请选择间隔" format="yyyy-MM-dd HH:mm:ss" @on-change="changeDate" style="width: 98%;"/></DatePicker></Col>
                        <Col span="2"><Button type="primary" @click="findOrderIndividualStatistics('shouhuoParams','during')">查询</Button></Col>
                        <Col span="2"><span></span></Col>
                    </Row>
                </div>
                <!-- 数据显示 -->
                <div class="tabData">
                    <div>收货金额：<span>{{shouhuoData.memberOrderMoney}}</span>元</div>
                    <div>交易量：<span>{{shouhuoData.num}}</span>笔</div>
                    <div>总重量：<span>{{shouhuoData.sumTotalWeight}}</span>公斤</div>
                    <div>总个数：<span>{{shouhuoData.sumTotalNumber}}</span>个</div>
                    <div>总其他：<span>{{shouhuoData.sumTotalOther}}</span></div>
                </div>
                <!-- 金额饼图 -->
                <chart ref="shouhuoMeneyCircle" style="width: 100%; margin-top: 20px;" :options="shouhuoMeneyCircle" :auto-resize="true"></chart>
                <!-- 重量饼图 -->
                <chart ref="shouhuoWeightCircle" style="width: 100%; margin-top: 20px;" :options="shouhuoWeightCircle" :auto-resize="true"></chart>
                <!-- 个数饼图 -->
                <chart ref="shouhuoNumberCircle" style="width: 100%; margin-top: 20px;" :options="shouhuoNumberCircle" :auto-resize="true"></chart>
                <!-- 其它饼图 -->
                <chart ref="shouhuoOtherCircle" style="width: 100%; margin-top: 20px;" :options="shouhuoOtherCircle" :auto-resize="true"></chart>
            </TabPane>
            <TabPane label="卖货统计">
                <!-- 近一个月收货情况 -->
                <chart ref="maihuoLine" style="width: 100%;" :options="maihuoLine" :auto-resize="true"></chart>
                <!-- 查询条件 -->
                <div class="searchArea">
                    <Row type="flex" align="middle" class="code-row-bg">
                        <Col span="2">日期查询：</Col>
                        <Col span="6"><DatePicker type="date" :value="maihuoParams.date" placeholder="请选择日期" @on-change="changeDate" style="width: 98%;"/></DatePicker></Col>
                        <Col span="2"><Button type="primary" @click="findOrderIndividualStatistics('maihuoParams','date')">查询</Button></Col>
                        <Col span="2"><span></span></Col>

                        <Col span="2">月份查询：</Col>
                        <Col span="6"><DatePicker type="month" placeholder="请选择月份" @on-change="changeDate" style="width: 98%;"/></DatePicker></Col>
                        <Col span="2"><Button type="primary" @click="findOrderIndividualStatistics('maihuoParams','yearAndMonth')">查询</Button></Col>
                        <Col span="2"><span></span></Col>

                        <Col span="2">年份查询：</Col>
                        <Col span="6"><DatePicker type="year" placeholder="请选择年份" @on-change="changeDate" style="width: 98%;"/></DatePicker></Col>
                        <Col span="2"><Button type="primary" @click="findOrderIndividualStatistics('maihuoParams','year')">查询</Button></Col>
                        <Col span="2"><span></span></Col>

                        <Col span="2">间隔查询：</Col>
                        <Col span="6"><DatePicker type="daterange" placeholder="请选择间隔" format="yyyy-MM-dd HH:mm:ss" @on-change="changeDate" style="width: 98%;"/></DatePicker></Col>
                        <Col span="2"><Button type="primary" @click="findOrderIndividualStatistics('maihuoParams','during')">查询</Button></Col>
                        <Col span="2"><span></span></Col>
                    </Row>
                </div>
                <!-- 数据显示 -->
                <div class="tabData">
                    <div>卖货金额：<span>{{maihuoData.sellingGoodsMoney}}</span>元</div>
                    <div>交易量：<span>{{maihuoData.num}}</span>笔</div>
                    <div>总重量：<span>{{maihuoData.sumTotalWeight}}</span>公斤</div>
                    <div>总个数：<span>{{maihuoData.sumTotalNumber}}</span>个</div>
                    <div>总其他：<span>{{maihuoData.sumTotalOther}}</span></div>
                </div>
                <!-- 金额饼图 -->
                <chart ref="maihuoMeneyCircle" style="width: 100%; margin-top: 20px;" :options="maihuoMeneyCircle" :auto-resize="true"></chart>
                <!-- 重量饼图 -->
                <chart ref="maihuoWeightCircle" style="width: 100%; margin-top: 20px;" :options="maihuoWeightCircle" :auto-resize="true"></chart>
                <!-- 个数饼图 -->
                <chart ref="maihuoNumberCircle" style="width: 100%; margin-top: 20px;" :options="maihuoNumberCircle" :auto-resize="true"></chart>
                <!-- 其它饼图 -->
                <chart ref="maihuoOtherCircle" style="width: 100%; margin-top: 20px;" :options="maihuoOtherCircle" :auto-resize="true"></chart>
            </TabPane>
            <TabPane label="利润统计">
                <!-- 近一个月收货情况 -->
                <chart ref="lirunLine" style="width: 100%;" :options="lirunLine" :auto-resize="true"></chart>
                <!-- 查询条件 -->
                <div class="searchArea">
                    <Row type="flex" align="middle" class="code-row-bg">
                        <Col span="2">日期查询：</Col>
                        <Col span="6"><DatePicker type="date" :value="lirunParams.date" placeholder="请选择日期" @on-change="changeDate" style="width: 98%;"/></DatePicker></Col>
                        <Col span="2"><Button type="primary" @click="findOrderIndividualStatistics('lirunParams','date')">查询</Button></Col>
                        <Col span="2"><span></span></Col>

                        <Col span="2">月份查询：</Col>
                        <Col span="6"><DatePicker type="month" placeholder="请选择月份" @on-change="changeDate" style="width: 98%;"/></DatePicker></Col>
                        <Col span="2"><Button type="primary" @click="findOrderIndividualStatistics('lirunParams','yearAndMonth')">查询</Button></Col>
                        <Col span="2"><span></span></Col>

                        <Col span="2">年份查询：</Col>
                        <Col span="6"><DatePicker type="year" placeholder="请选择年份" @on-change="changeDate" style="width: 98%;"/></DatePicker></Col>
                        <Col span="2"><Button type="primary" @click="findOrderIndividualStatistics('lirunParams','year')">查询</Button></Col>
                        <Col span="2"><span></span></Col>

                        <Col span="2">间隔查询：</Col>
                        <Col span="6"><DatePicker type="daterange" placeholder="请选择间隔" format="yyyy-MM-dd HH:mm:ss" @on-change="changeDate" style="width: 98%;"/></DatePicker></Col>
                        <Col span="2"><Button type="primary" @click="findOrderIndividualStatistics('lirunParams','during')">查询</Button></Col>
                        <Col span="2"><span></span></Col>
                    </Row>
                </div>
                <chart ref="lirunTree" style="width: 100%;" :options="lirunTree" :auto-resize="true"></chart>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
    import {operation} from '@/libs/tools'
    export default{
        data(){
            return{
                tabIndex: 0,
                isAdmin: this.$store.state.user.roleNames.indexOf('管理员')>-1,
                isCityAgent: this.$store.state.user.roleNames.indexOf('市级代理')>-1,
                isRegionsCounties: this.$store.state.user.roleNames.indexOf('区县级代理')>-1,
                isShopOp: this.$store.state.user.roleNames.indexOf('店员')>-1,  

                shouhuoLine: {},
                shouhuoParams: {
                    date: undefined,                
                    yearAndMonth: undefined,                
                    year: undefined,                
                    during: undefined,                   
                },
                shouhuoData: {},
                shouhuoMeneyCircle: {},
                shouhuoWeightCircle: {},
                shouhuoNumberCircle: {},
                shouhuoOtherCircle: {},

                maihuoLine: {},
                maihuoParams: {
                    date: undefined,                
                    yearAndMonth: undefined,                
                    year: undefined,                
                    during: undefined,
                },
                maihuoData: {},
                maihuoMeneyCircle: {},
                maihuoWeightCircle: {},
                maihuoNumberCircle: {},
                maihuoOtherCircle: {},

                lirunParams: {
                    date: undefined,                
                    yearAndMonth: undefined,                
                    year: undefined,                
                    during: undefined,
                },
                lirunLine: {},
                lirunTree: {},
            }
        },
        methods:{
            clickTab(name){
                this.tabIndex = name
                if(this.tabIndex == 1 && this.maihuoMeneyCircle.title == undefined){
                    this.findOrderIndividualStatistics('maihuoParams','date')
                    this.getshouhuoLine('maihuoLine')
                    this.getshouhuoMeneyCircle('maihuoMeneyCircle',{})
                    this.getshouhuoWeightCircle('maihuoWeightCircle',{})
                    this.getshouhuoNumberCircle('maihuoNumberCircle',{})
                    this.getshouhuoOtherCircle('maihuoOtherCircle',{})
                }
                if(this.tabIndex == 2 && this.lirunLine.title == undefined){
                    this.getlirunLine('lirunLine')
                    this.findOrderIndividualStatistics('lirunParams','date')
                }
            },
            //收货/卖货-近一个月收货情况
            getshouhuoLine(options){
                let url = ''
                if(options == 'shouhuoLine'){
                    if(this.isAdmin){
                        url = '/adminReceivingStatistics/findNearOneMonthDateByAdmin'
                    }else if(this.isCityAgent){
                        url = '/cityAgentReceivingStatistics/findNearOneMonthDateByCtityAgent'
                    }else if(this.isRegionsCounties || this.isShopOp){
                        url = '/regionsCountiesReceivingStatistics/findNearOneMonthDateByShop'
                    }
                }
  
                if(options == 'maihuoLine'){
                    if(this.isAdmin){
                        url = '/adminReceivingStatistics/findNearOneMonthDateByAdminForSellingGoods'
                    }else if(this.isCityAgent){
                        url = '/cityAgentReceivingStatistics/findNearOneMonthDateByCtityAgentForSellingGoods'
                    }else if(this.isRegionsCounties || this.isShopOp){
                        url = '/regionsCountiesReceivingStatistics/findNearOneMonthDateByShopForSellingGoods'
                    }
                }

                this.axios.request({
                    params: {},
                    url,
                    method: 'get'
                }).then(res =>{
                    let chartData = res.data.rows
                    let xData = []
                    let money  = [] //消费
                    let weight  = [] //水费
                    let num  = [] //电费
                    chartData.forEach(item =>{
                        xData.push(item.date)
                        money.push(item.sum_money)
                        weight.push(item.sum_weight_value)
                        num.push(item.sum_number_value)
                    })
                    this[options] = {
                        tooltip: {
                            trigger: 'axis',
                        },
                        title: {
                            text: "近一月收货情况"
                        },
                        legend: {
                            data:['价钱（元）','重量（公斤）','数量（个）']
                        },
                        xAxis: {
                            type: 'category',
                            data: xData,
                            name: '日期',
                            // boundaryGap: false,
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [
                            {
                                name:'价钱（元）',
                                type:'line',
                                data:money
                            },
                            {
                                name:'重量（公斤）',
                                type:'line',
                                data:weight
                            },
                            {
                                name:'数量（个）',
                                type:'line',
                                data:num
                            },
                        ]
                    }
                    this.$refs[options].resize()
                }).catch(err =>{
                    console.log('网络异常')
                })
            },
            changeDate(date,type){
                console.log(this.tabIndex);
                console.log(date,type);
                let serchParamsName = ''
                let searchType = []
                //收货
                if(this.tabIndex == 0){
                    serchParamsName = 'shouhuoParams'
                }else if(this.tabIndex == 1){
                    serchParamsName = 'maihuoParams'
                }else{
                    serchParamsName = 'lirunParams'
                }
                if(type == 'date'){
                    searchType = ['date']
                }else if(type == 'month'){
                    searchType = ['yearAndMonth']
                }else if(type == 'year'){
                    searchType = ['year']
                }else{
                    searchType = ['during']
                }
                for (const key in this[serchParamsName]) {
                    if(searchType.indexOf(key) > -1){
                        if(typeof date == 'string'){
                            searchType.forEach(item =>{
                                this[serchParamsName][item] = date
                            })
                        }else{
                            this[serchParamsName].during = date
                        }
                    }
                    // else{
                    //     this[serchParamsName][key] = undefined
                    // }
                }
                console.log(this[serchParamsName]);
            },
            //收货-条件查询
            findOrderIndividualStatistics(serchParamsName,type){
                let url = ''
                let params = {}
                if(serchParamsName == 'shouhuoParams'){
                    if(this.isAdmin){
                        url = '/adminReceivingStatistics/findOrderIndividualStatisticsByAdmin'
                    }else if(this.isCityAgent){
                        url = '/cityAgentReceivingStatistics/findOrderIndividualStatisticsByCityAgent'
                    }else if(this.isRegionsCounties || this.isShopOp){
                        url = '/regionsCountiesReceivingStatistics/findOrderIndividualStatisticsByShop'
                    }
                }
  
                if(serchParamsName == 'maihuoParams'){
                    if(this.isAdmin){
                        url = '/adminReceivingStatistics/findSellingGoodsIndividualStatisticsByAdmin'
                    }else if(this.isCityAgent){
                        url = '/cityAgentReceivingStatistics/findSellingGoodsIndividualStatisticsByCityAgent'
                    }else if(this.isRegionsCounties || this.isShopOp){
                        url = '/regionsCountiesReceivingStatistics/findSellingGoodsIndividualStatisticsByShop'
                    }
                }
                if(serchParamsName == 'lirunParams'){
                    if(this.isAdmin){
                        url = '/adminReceivingStatistics/findProfitMoneyChartByAdmin'
                    }else if(this.isCityAgent){
                        url = '/cityAgentReceivingStatistics/findProfitMoneyChartByCityAgent'
                    }else if(this.isRegionsCounties || this.isShopOp){
                        url = '/regionsCountiesReceivingStatistics/findProfitMoneyChartByShop'
                    }
                }
                if(type == 'during' && this[serchParamsName].during){
                    this[serchParamsName].startCreateDate = this[serchParamsName].during[0]
                    this[serchParamsName].endCreateDate = this[serchParamsName].during[1]
                }
                if(type == 'during'){
                    params.startCreateDate = this[serchParamsName].startCreateDate
                    params.endCreateDate = this[serchParamsName].endCreateDate
                }else{
                    params[type] = this[serchParamsName][type]
                    
                }
                this.axios.request({
                    params,
                    url,
                    method: 'get'
                }).then(res =>{
                    console.log(this.tabIndex);
                    if(this.tabIndex == 0){
                        this.shouhuoData = res.data.rows
                        this.findWhenSearch(params)
                    }else if(this.tabIndex == 1){
                        this.maihuoData = res.data.rows
                        this.findWhenSearch(params)
                    }else{
                        this.setlirunTree('lirunTree',res.data.rows)
                    }
                })
            },
            //查询饼图数据
            findWhenSearch(params){
                let options = ''
                if(this.tabIndex == 0){
                    this.getshouhuoMeneyCircle('shouhuoMeneyCircle',params)
                    this.getshouhuoWeightCircle('shouhuoWeightCircle',params)
                    this.getshouhuoNumberCircle('shouhuoNumberCircle',params)
                    this.getshouhuoOtherCircle('shouhuoOtherCircle',params)
                }else if(this.tabIndex == 1){
                    this.getshouhuoMeneyCircle('maihuoMeneyCircle',params)
                    this.getshouhuoWeightCircle('maihuoWeightCircle',params)
                    this.getshouhuoNumberCircle('maihuoNumberCircle',params)
                    this.getshouhuoOtherCircle('maihuoOtherCircle',params)
                }
            },
            //收货/卖货-金额饼图
            getshouhuoMeneyCircle(options,params){
                let url = ''
                if(options == 'shouhuoMeneyCircle'){
                    if(this.isAdmin){
                        url = '/adminReceivingStatistics/findMoneyChartByAdmin'
                    }else if(this.isCityAgent){
                        url = '/cityAgentReceivingStatistics/findMoneyChartByCtityAgent'
                    }else if(this.isRegionsCounties || this.isShopOp){
                        url = '/regionsCountiesReceivingStatistics/findMoneyChartByShop'
                    }
                }
  
                if(options == 'maihuoMeneyCircle'){
                    if(this.isAdmin){
                        url = '/adminReceivingStatistics/findMoneyChartByAdminForSellingGoods'
                    }else if(this.isCityAgent){
                        url = '/cityAgentReceivingStatistics/findMoneyChartByCtityAgentForSellingGoods'
                    }else if(this.isRegionsCounties || this.isShopOp){
                        url = '/regionsCountiesReceivingStatistics/findMoneyChartByShopForSellingGoods'
                    }
                }
                this.axios.request({
                    params,
                    url,
                    method: 'get'
                }).then(res =>{
                    let chartData = res.data.rows
                    console.log(chartData);
                    let legendData = []
                    let seriesData = []
                    let total = 0
                    chartData.forEach(item =>{
                        legendData.push(item.detail_name)
                        seriesData.push({
                            name: item.detail_name,
                            value: item.sum_money
                        })
                        total = operation(total,item.sum_money,'add')
                        // total+=item.sum_money
                    })
                    this[options] = {
                        title: {
                            text: '金额统计（元）',
                            subtext: '收货金额'+total+'元',
                            left: 'center'
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: '{a} <br/>{b} : {c}元 ({d}%)'
                        },
                        legend: {
                            // type: 'scroll',
                            orient: 'vertical',
                            right: 10,
                            top: 20,
                            bottom: 20,
                            data: legendData,
                        },
                        series: [
                            {
                                name: '统计',
                                type: 'pie',
                                radius: '55%',
                                center: ['40%', '50%'],
                                data: seriesData,
                                emphasis: {
                                    itemStyle: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    }
                    this.$refs[options].resize()
                }).catch(err =>{
                    console.log('网络异常')
                })
            },
            //收货/卖货-重量
            getshouhuoWeightCircle(options,params){
                let url = ''
                if(options == 'shouhuoWeightCircle'){
                    if(this.isAdmin){
                        url = '/adminReceivingStatistics/findWeightChartByAdmin'
                    }else if(this.isCityAgent){
                        url = '/cityAgentReceivingStatistics/findWeightChartByCtityAgent'
                    }else if(this.isRegionsCounties || this.isShopOp){
                        url = '/regionsCountiesReceivingStatistics/findWeightChartByShop'
                    }
                }
  
                if(options == 'maihuoWeightCircle'){
                    if(this.isAdmin){
                        url = '/adminReceivingStatistics/findWeightChartByAdminForSellingGoods'
                    }else if(this.isCityAgent){
                        url = '/cityAgentReceivingStatistics/findWeightChartByCtityAgentForSellingGoods'
                    }else if(this.isRegionsCounties || this.isShopOp){
                        url = '/regionsCountiesReceivingStatistics/findWeightChartByShopForSellingGoods'
                    }
                }
                this.axios.request({
                    params,
                    url,
                    method: 'get'
                }).then(res =>{
                    let chartData = res.data.rows
                    console.log(chartData);
                    let legendData = []
                    let seriesData = []
                    let total = 0
                    chartData.forEach(item =>{
                        legendData.push(item.detail_name)
                        seriesData.push({
                            name: item.detail_name,
                            value: item.sum_numerical_value
                        })
                        total = operation(total,item.sum_numerical_value,'add')
                        // total+=item.sum_numerical_value
                    })
                    this[options] = {
                        title: {
                            text: '重量统计（公斤）',
                            subtext: '收货量'+total+'公斤',
                            left: 'center'
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: '{a} <br/>{b} : {c}公斤 ({d}%)'
                        },
                        legend: {
                            // type: 'scroll',
                            orient: 'vertical',
                            right: 10,
                            top: 20,
                            bottom: 20,
                            data: legendData,
                        },
                        series: [
                            {
                                name: '统计',
                                type: 'pie',
                                radius: '55%',
                                center: ['40%', '50%'],
                                data: seriesData,
                                emphasis: {
                                    itemStyle: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    }
                    this.$refs[options].resize()
                })
            },
            //收货/卖货-数量
            getshouhuoNumberCircle(options,params){
                let url = ''
                if(options == 'shouhuoNumberCircle'){
                    if(this.isAdmin){
                        url = '/adminReceivingStatistics/findNumChartByAdmin'
                    }else if(this.isCityAgent){
                        url = '/cityAgentReceivingStatistics/findNumChartByCtityAgent'
                    }else if(this.isRegionsCounties || this.isShopOp){
                        url = '/regionsCountiesReceivingStatistics/findNumChartByShop'
                    }
                }
  
                if(options == 'maihuoNumberCircle'){
                    if(this.isAdmin){
                        url = '/adminReceivingStatistics/findNumChartByAdminForSellingGoods'
                    }else if(this.isCityAgent){
                        url = '/cityAgentReceivingStatistics/findNumChartByCtityAgentForSellingGoods'
                    }else if(this.isRegionsCounties || this.isShopOp){
                        url = '/regionsCountiesReceivingStatistics/findNumChartByShopForSellingGoods'
                    }
                }
                this.axios.request({
                    params,
                    url,
                    method: 'get'
                }).then(res =>{
                    let chartData = res.data.rows
                    console.log(chartData);
                    let legendData = []
                    let seriesData = []
                    let total = 0
                    chartData.forEach(item =>{
                        legendData.push(item.detail_name)
                        seriesData.push({
                            name: item.detail_name,
                            value: item.sum_numerical_value
                        })
                        total = operation(total,item.sum_numerical_value,'add')
                        // total+=item.sum_numerical_value
                    })
                    this[options] = {
                        title: {
                            text: '数量统计（个）',
                            subtext: '收货量'+total+'个',
                            left: 'center'
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: '{a} <br/>{b} : {c}个 ({d}%)'
                        },
                        legend: {
                            // type: 'scroll',
                            orient: 'vertical',
                            right: 10,
                            top: 20,
                            bottom: 20,
                            data: legendData,
                        },
                        series: [
                            {
                                name: '统计',
                                type: 'pie',
                                radius: '55%',
                                center: ['40%', '50%'],
                                data: seriesData,
                                emphasis: {
                                    itemStyle: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    }
                    this.$refs[options].resize()
                })
            },
            //收货/卖货-其它
            getshouhuoOtherCircle(options,params){
                let url = ''
                if(options == 'shouhuoOtherCircle'){
                    if(this.isAdmin){
                        url = '/adminReceivingStatistics/findOtherNumChartByAdmin'
                    }else if(this.isCityAgent){
                        url = '/cityAgentReceivingStatistics/findOtherNumChartByCtityAgent'
                    }else if(this.isRegionsCounties || this.isShopOp){
                        url = '/regionsCountiesReceivingStatistics/findOtherNumChartByShop'
                    }
                }
  
                if(options == 'maihuoOtherCircle'){
                    if(this.isAdmin){
                        url = '/adminReceivingStatistics/findOtherNumChartByAdminForSellingGoods'
                    }else if(this.isCityAgent){
                        url = '/cityAgentReceivingStatistics/findOtherNumChartByCtityAgentForSellingGoods'
                    }else if(this.isRegionsCounties || this.isShopOp){
                        url = '/regionsCountiesReceivingStatistics/findOtherNumChartByShopForSellingGoods'
                    }
                }
                this.axios.request({
                    params,
                    url,
                    method: 'get'
                }).then(res =>{
                    let chartData = res.data.rows
                    console.log(chartData);
                    let legendData = []
                    let seriesData = []
                    let total = 0
                    chartData.forEach(item =>{
                        legendData.push(item.detail_name)
                        seriesData.push({
                            name: item.detail_name,
                            value: item.sum_numerical_value
                        })
                        total = operation(total,item.sum_numerical_value,'add')
                        // total+=item.sum_numerical_value
                    })
                    this[options] = {
                        title: {
                            text: '其他统计',
                            subtext: '收货量'+total+'个',
                            left: 'center'
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: '{a} <br/>{b} : {c}个 ({d}%)'
                        },
                        legend: {
                            // type: 'scroll',
                            orient: 'vertical',
                            right: 10,
                            top: 20,
                            bottom: 20,
                            data: legendData,
                        },
                        series: [
                            {
                                name: '统计',
                                type: 'pie',
                                radius: '55%',
                                center: ['40%', '50%'],
                                data: seriesData,
                                emphasis: {
                                    itemStyle: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    }
                    this.$refs[options].resize()
                })
            },
            //利润折线图-近一个月收货情况
            getlirunLine(options){
                let url = ''
                if(options == 'lirunLine'){
                    if(this.isAdmin){
                        url = '/adminReceivingStatistics/findNearOneMonthProfitMoneyByAdmin'
                    }else if(this.isCityAgent){
                        url = '/cityAgentReceivingStatistics/findNearOneMonthProfitMoneyByCityAgent'
                    }else if(this.isRegionsCounties || this.isShopOp){
                        url = '/regionsCountiesReceivingStatistics/findNearOneMonthProfitMoneyByShop'
                    }
                }
                this.axios.request({
                    params: {},
                    url,
                    method: 'get'
                }).then(res =>{
                    let chartData = res.data.rows
                    let xData = []
                    let money  = [] //收货
                    let selling  = [] //卖货
                    let profit  = [] //利润
                    chartData.forEach(item =>{
                        xData.push(item.date)
                        money.push(item.sum_money)
                        selling.push(item.sum_selling_goods_money)
                        profit.push(item.sum_profit_money)
                    })
                    this[options] = {
                        tooltip: {
                            trigger: 'axis',
                        },
                        title: {
                            text: "近一月利润情况"
                        },
                        legend: {
                            data:['利润金额','收货金额','卖货金额']
                        },
                        xAxis: {
                            type: 'category',
                            data: xData,
                            name: '日期',
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [
                            {
                                name:'利润金额',
                                type:'line',
                                data:profit
                            },
                            {
                                name:'收货金额',
                                type:'line',
                                data:money
                            },
                            {
                                name:'卖货金额',
                                type:'line',
                                data:selling
                            },
                        ]
                    }
                    this.$refs[options].resize()
                }).catch(err =>{
                    console.log('网络异常')
                })
            },
            setlirunTree(options,data){
                this[options] = {
                    tooltip: {
                        trigger: 'axis',
                    },
                    xAxis: {
                        type: 'category',
                        data: ['卖货金额', '收货金额', '利润']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: [data.sellingGoodsMoney,data.memberOrderMoney,data.profitMoney],
                        type: 'bar',
                        showBackground: true,
                        backgroundStyle: {
                            color: 'rgba(220, 220, 220, 0.8)'
                        }
                    }]
                }
                this.$refs[options].resize()
            }
        },
        created(){
            //当天
            let date = new Date().toLocaleString().split(' ')[0].split('/').map(a => a<10?'0'+a:a).join('-')
            this.shouhuoParams.date = date
            this.maihuoParams.date = date
            this.lirunParams.date = date
            this.findOrderIndividualStatistics('shouhuoParams','date')
            this.getshouhuoLine('shouhuoLine')
            this.getshouhuoMeneyCircle('shouhuoMeneyCircle',{})
            this.getshouhuoWeightCircle('shouhuoWeightCircle',{})
            this.getshouhuoNumberCircle('shouhuoNumberCircle',{})
            this.getshouhuoOtherCircle('shouhuoOtherCircle',{})
        }
    }
</script>

<style lang="less" scoped>
    .tabData{
        display: flex;
        padding-left: 30px;
        &>div{
            margin-right: 20px;
            background: #f0f0f0;
            border-radius: 10px;
            padding: 10px;
            margin-top: 20px;
            span{
                color: red;
            }
        }
    }
</style>