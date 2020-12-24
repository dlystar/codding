<template>
    <div class="sysmonitor">
        <!-- <chart ref="chart1" :options="orgOptions" :auto-resize="true"></chart> -->
        <Row>
            <Col span="10">
                <Card style="width: 95%; height: 325px;">
                    <p slot="title">
                        <Icon type="ios-apps" />服务器信息
                    </p>
                    <Row>
                        <Col span="10">ip地址</Col>
                        <Col span="14">{{systemInfo.hostIp}}</Col>
                    </Row>
                    <Row>
                        <Col span="10">主机名</Col>
                        <Col span="14">{{systemInfo.hostName}}</Col>
                    </Row>
                    <Row>
                        <Col span="10">操作系统的名称</Col>
                        <Col span="14">{{systemInfo.osName}}</Col>
                    </Row>
                    <Row>
                        <Col span="10">操作系统的构架</Col>
                        <Col span="14">{{systemInfo.arch}}</Col>
                    </Row>
                    <Row>
                        <Col span="10">操作系统的版本</Col>
                        <Col span="14">{{systemInfo.osVersion}}</Col>
                    </Row>
                    <Row>
                        <Col span="10">处理器个数</Col>
                        <Col span="14">{{systemInfo.processors}}</Col>
                    </Row>
                    <Row>
                        <Col span="10">Java的运行环境版本</Col>
                        <Col span="14">{{systemInfo.javaVersion}}</Col>
                    </Row>
                    <Row>
                        <Col span="10">Java供应商的URL</Col>
                        <Col span="14">{{systemInfo.javaUrl}}</Col>
                    </Row>
                    <Row>
                        <Col span="10">Java的安装路径</Col>
                        <Col span="14">{{systemInfo.javaHome}}</Col>
                    </Row>
                    <Row>
                        <Col span="10">临时文件路径</Col>
                        <Col span="14">{{systemInfo.hostIp}}</Col>
                    </Row>
                </Card>
            </Col>
            <Col span="14">
                <Card style="width: 95%; height: 325px;">
                    <p slot="title">
                        <Icon type="ios-timer-outline" />实时监控
                    </p>
                    <Row>
                        <Col span="24" style="height: 240px;">
                            <chart style="height: 240px;" ref="chart1" :options="orgOptions" :auto-resize="true"></chart>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        <div class="line"></div>
        <Row>
            <Col span="24">
                <Card style="width: 97%; height: 350px; overflow: hidden;">
                    <p slot="title">
                        <Icon type="ios-timer-outline" />实时监控
                    </p>
                    <Row>
                        <Col span="7">
                            <chart style="width: 100%; height: 300px;" ref="gauge1" :options="gauge1" :auto-resize="true"></chart>
                        </Col>
                        <Col span="10">
                            <chart style="width: 100%; height: 500px;" ref="gauge2" :options="gauge2" :auto-resize="true"></chart>
                        </Col>
                        <Col span="7">
                            <chart style="width: 100%; height: 300px;" ref="gauge3" :options="gauge3" :auto-resize="true"></chart>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
  export default {
    name: 'sysmonitor',
    data () {
        return {
            systemInfo:{},
            orgOptions: {},
            gauge1: {},
            gauge2: {},
            gauge3: {},
        }
    },
    methods:{
        initEcharts (){
            let now = new Date();
            let xAxisData = [];
            let len = 20;
            while (len--) {
                let time = now.toLocaleTimeString().replace(/^\D*/, '');
                time = time.substr(time.indexOf(":") + 1);
                xAxisData.unshift(time);
                now = new Date(now - 3000);
            }
            this.orgOptions = {
                legend: {
                    top: '0px',
                    data: ['jvm内存使用率', '物理内存使用率', 'cpu使用率' ]
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function(params){
                        let show = ''
                        params.forEach((item,idx)=>{
                            if(idx == 0) show+=item.axisValue+'<br/>'
                            show = show + (item.seriesName+' : '+item.value+'%<br/>')
                        })
                        return show
                    }
                },
                grid: {
                    x:40,y:20,x2:30,y2:30,borderWidth: 0,borderColor: "#FFFFFF"
                },
                xAxis: [ {
                    axisLabel: {
                        rotate: 40,
                    },
                    type: 'category',// 坐标轴类型，横轴默认为类目型'category'，纵轴默认为数值型'value'
                    data: xAxisData
                } ],
                yAxis: [ {
                    min: 0,
                    max: 100,
                    axisLabel: {
                        formatter: '{value}%'
                    }
                } ],
                series: [
                    {
                        name: 'jvm内存使用率',
                        type: 'line',
                        data: [ 
                            12, 25, 31, 11, 45, 50, 11, 9, 28, 35, 40, 24,
                            28, 39, 23, 31, 14, 18, 8, 36 
                        ]
                    },
                    {
                        name: '物理内存使用率',
                        type: 'line',
                        data: [ 
                            55, 41, 10, 23, 15, 44, 29, 41, 27, 5, 12, 25,
                            31, 11, 45, 50, 11, 9, 28, 35 
                        ]
                    },
                    {
                        name: 'cpu使用率',
                        type: 'line',
                        data: [ 
                            40, 24, 28, 39, 23, 31, 14, 18, 8, 36, 55, 41,
                            10, 23, 15, 44, 29, 41, 27, 5 
                        ]
                    } 
                ]
            };
            this.gauge1 = {
                tooltip : {
                    formatter: function(params){
                        return '监控指标<br/>'+params.data.name+' : '+params.data.value+'%'
                    }
                },
                series: [
                    {
                        name: 'jvm使用率',
                        type: 'gauge',
                        startAngle:210,
                        endAngle:-30,
                        detail: {
                            offsetCenter: [0,'40%'],
                            formatter: function(params){
                                return params+'%'
                            }
                        },
                        title: {
                            offsetCenter: [0,'60%']
                        },
                        itemStyle:{
                            color: '#c23531',
                            opacity: .5,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            shadowBlur: 10
                        },
                        axisLine:{
                            lineStyle:{
                                color: [[0.2, '#228b22'], [0.8, '#4488bb'], [1, '#ff4500']]
                            }
                        },
                        data: [{value: 50, name: 'jvm使用率'}]
                    }
                ]
            };
            this.gauge2 = {
                tooltip : {
                    // position: [40,30],
                    formatter: function(params){
                        return '监控指标<br/>'+params.data.name+' : '+params.data.value+'%'
                    }
                },
                series: [
                    {
                        name: 'cpu使用率',
                        type: 'gauge',
                        startAngle:180,
                        endAngle:0,
                        center: ["50%", "40%"],
                        title: {
                            offsetCenter: [0,'10%']
                        },
                        itemStyle:{
                            color: '#2f4554',
                            opacity: .5,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            shadowBlur: 10
                        },
                        axisTick: { // 坐标轴小标记
                            splitNumber: 10, // 每份split细分多少段
                            length: 12, // 属性length控制线长
                        },
                        pointer: {
                            show: true,
                            width: 7,
                        },
                        detail: {
                            offsetCenter: [0,'-10%'],
                            fontSize: 18,
                            color: '#228b22',
                            formatter: function(params){
                                return params+'%'
                            }
                        },
                        axisLine:{
                            lineStyle:{
                                color: [[0.2, '#228b22'], [0.8, '#4488bb'], [1, '#ff4500']]
                            }
                        },
                        data: [{value: 50, name: 'cpu使用率'}]
                    }
                ]
            };
            this.gauge3 = {
                tooltip : {
                    formatter: function(params){
                        return '监控指标<br/>'+params.data.name+' : '+params.data.value+'%'
                    }
                },
                series: [
                    {
                        name: '内存使用率',
                        type: 'gauge',
                        startAngle:210,
                        endAngle:-30,
                        detail: {
                            offsetCenter: [0,'40%'],
                            formatter: function(params){
                                return params+'%'
                            }
                        },
                        title: {
                            offsetCenter: [0,'60%']
                        },
                        itemStyle:{
                            color: '#61a0a8',
                            opacity: .5,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            shadowBlur: 10
                        },
                        axisLine:{
                            lineStyle:{
                                color: [[0.2, '#228b22'], [0.8, '#4488bb'], [1, '#ff4500']]
                            }
                        },
                        data: [{value: 50, name: '内存使用率'}]
                    }
                ]
            };
        },
        getSystemInfo (){
            this.axios.request({
                data:{},
                url: '/serverInfo/systemInfo',
                method: 'post'
            }).then(res =>{
                this.systemInfo = res.data.rows
            })
        },
        getUsage (){
            return this.axios.request({
                data:{},
                url: '/serverInfo/usage',
                method: 'post'
            })
        },

    },
    mounted() {
        this.getUsage()
        this.getSystemInfo()
        this.initEcharts()
        //系统每隔三秒发送请求实时数据
        let axisData,timer
        clearInterval(timer)
        const start = ()=>{
            timer = setInterval(()=>{
                axisData = (new Date()).toLocaleTimeString().replace(/^\D*/, '');
                axisData = axisData.substr(axisData.indexOf(":") + 1);
                this.getUsage().then(res =>{
                    let rows = res.data.rows
                    this.orgOptions.xAxis[0].data.shift()
                    this.orgOptions.xAxis[0].data.push(axisData)

                    this.orgOptions.series[0].data.shift()
                    this.orgOptions.series[0].data.push(rows.jvmUsage)

                    this.orgOptions.series[1].data.shift()
                    this.orgOptions.series[1].data.push(rows.ramUsage)

                    this.orgOptions.series[2].data.shift()
                    this.orgOptions.series[2].data.push(rows.cpuUsage)

                    this.gauge1.series[0].data[0].value = rows.jvmUsage
                    this.gauge2.series[0].data[0].value = rows.cpuUsage
                    this.gauge3.series[0].data[0].value = rows.ramUsage
                }).catch(err=>{
                    console.log(err)
                })
            },3000)
        }
        start()
        this.$router.afterEach((to,from) =>{
            if(to.name == 'sysmonitor'){
                start()
            }
            if(from.name == 'sysmonitor'){
                clearInterval(timer)
            }
        })
    }
  }
</script>
<style scoped lang="less">
    .sysmonitor{
        .line{
            margin-top: 10px;
        }
    }
</style>