<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="12" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie style="height: 300px;" v-if="flag" :value="pieData" text="获客渠道占比"></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="12" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar style="height: 300px;" v-if="flag" :value="barData" text="客户地区统计"/>
        </Card>
      </i-col>
    </Row>
    <Row>
      <Card shadow>
        <example style="height: 310px;"/>
      </Card>
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import Example from './example.vue'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  data () {
    return {
      flag:false,
      inforCardData: [
        // { title: '客户总数', icon: 'md-person-add', count: 803, color: '#2d8cf0' },
        // { title: '电销总数', icon: 'md-call', count: 232, color: '#19be6b' },
        // { title: '订单总数', icon: 'md-locate', count: 142, color: '#ff9900' },
        // { title: '网站流量', icon: 'ios-paw', count: 657, color: '#ed3f14' },
        // { title: '新增互动', icon: 'md-chatbubbles', count: 12, color: '#E46CBB' },
        // { title: '新增页面', icon: 'md-map', count: 14, color: '#9A66E4' }
      ],
      pieData: [
        // { value: 335, name: '直接访问' },
        // { value: 310, name: '邮件营销' },
        // { value: 234, name: '联盟广告' },
        // { value: 135, name: '视频广告' },
        // { value: 1548, name: '搜索引擎' }
      ],
      barData: {
        // Mon: 13253,
        // Tue: 34235,
        // Wed: 26321,
        // Thu: 12340,
        // Fri: 24643,
        // Sat: 1322,
        // Sun: 1324
      }
    }
  },
  methods:{
    getHomeCount(){
        this.axios.request({
          url: '/admin/homeCount',
          method: 'post'
        }).then(res => {
          if(res.data.result == 1){
              let data = res.data.rows;
              this.barData = data.barData;
              this.pieData = data.pieData;
              let info = data.inforCardData;
              let temp = [
                { title: '网站流量', icon: 'ios-paw', count: 657, color: '#ed3f14' },
                { title: '新增互动', icon: 'md-chatbubbles', count: 12, color: '#E46CBB' },
                { title: '新增页面', icon: 'md-map', count: 14, color: '#9A66E4' },
              ]
              this.inforCardData = info.concat(temp)
              this.flag = true
          }
        }).catch(err =>{
          console.info(err)
          this.$Message.error('系统异常');
        })
    }
  },
  mounted(){
    this.getHomeCount()
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
  .myHome{
    width: 100%;
    height: 100%;
    background-image: url('../../../assets/images/login-bg_4.jpg');
    background-size: cover;
    background-position: center;
    position: relative;
  }
</style>
