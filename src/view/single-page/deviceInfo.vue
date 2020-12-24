<template>
    <!-- :style="iwcsStyle" -->
    <div class="deviceInfo"> 
        <div class="title">{{detail.deviceSn}}</div>
        <div class="content">
           <!--  <div>
                <span class="name">设备编号：</span>
                <span class="value">{{detail.deviceSn}}</span>
            </div> -->
            <div>
                <span class="name">设备别名：</span>
                <span class="value">{{detail.deviceAlias}}</span>
            </div>
            <div>
                <span class="name">设备地址全名称：</span>
                <span class="value">{{detail.address}}</span>
            </div>
            <div>
                <span class="name">归属协会：</span>
                <span class="value">{{detail.belongToUserName}}</span>
            </div>
            <!-- <div>
                <span class="name">设备密码：</span>
                <span class="value">{{detail.devicePwd}}</span>
            </div> -->
            <div>
                <span class="name">电表编号：</span>
                <span class="value">{{detail.electricityMeterSn}}</span>
            </div>
            <div>
                <span class="name">年最大用水量：</span>
                <span class="value">{{detail.maxYearWaterQuantity}}</span>
            </div>
            <!-- <div>
                <span class="name">最低支付金额：</span>
                <span class="value">{{detail.minPayMoney}}</span>
            </div> -->
            <div>
                <span class="name">水泵功率：</span>
                <span class="value">{{detail.pumpPower}}</span>
            </div>
            <!-- <div>
                <span class="name">排序值：</span>
                <span class="value">{{detail.sort}}</span>
            </div> -->
            <div>
                <span class="name">水表编号：</span>
                <span class="value">{{detail.waterMeterSn}}</span>
            </div>
            <div>
                <span class="name">水情编号：</span>
                <span class="value">{{detail.waterRegimeSn}}</span>
            </div>
            <div>
                <span class="name">绑定设备模板：</span>
                <span class="value">{{detail.billId}}</span>
            </div>
            <div>
                <span class="name">设备类型</span>
                <span class="value">{{detail.deviceType}}</span>
            </div>
            <div>
                <span class="name">设备状态</span>
                <span class="value">{{detail.devicesStatus}}</span>
            </div>
            <div>
                <span class="name">在线状态</span>
                <span class="value">{{detail.deviceInline}}</span>
            </div>
            <div>
                <span class="name">故障状态</span>
                <span class="value">{{detail.wrong}}</span>
            </div>
            <div>
                <span class="name">设备经纬度</span>
                <span class="value">{{detail.longitudeAndLatitude}}</span>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props:{
            detail: Object,
            myevent: Object,
        },
        data(){
            return {
                iwcsStyle:{}
            }
        },
        methods:{

        },
        created(){
            console.log(this.myevent)
            this.iwcsStyle = {
                position: 'fixed',
                left: this.myevent.clientX+'px',
                top: (this.myevent.clientY  - 180) +'px'
            }
        },
        mounted(){

        }
    }
</script>
<style scoped lang="less">
    .deviceInfo{
        // background: #fff; width: 400px; height: 300px; overflow-y: scroll;
        .title{
            height: 30px; line-height: 30px; border: 1px solid #ccc;
            background: #eee; font-size: 20px; color: #000;
            padding-left: 20px;
        }
        .content{
            padding: 0 20px 20px;
        }
    }
</style>