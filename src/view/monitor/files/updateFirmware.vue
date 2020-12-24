<template>
    <div class="updateFirmware">
        <Form class="detailForm" ref="detailForm" :inline="true" :model="detail" :rules="rules" :label-width="120">
            <FormItem label="设备编号：" prop="deviceSn">
                <Input v-model="detail.deviceSn"></Input>
            </FormItem>
            <FormItem label="文件路径：" prop="newFileName">
                <Input number v-model="detail.newFileName" readonly></Input>
            </FormItem>
            <FormItem label="版本名称：" prop="versionName">
                <Input v-model="detail.versionName"></Input>
            </FormItem>
            <FormItem label="版本号：" prop="versionNo">
                <Input v-model="detail.versionNo"></Input>
            </FormItem>
        </Form>
    </div>
</template>
<script>
    export default{
        props: ['detail'],
        name: 'updateFirmware',
        data(){
            return {
                rules:{
                    deviceSn: [{required: true, message: '请输入设备编号'}],
                    newFileName: [{required: true, message: '请输入文件路径'}],
                    versionName: [{required: true, message: '请输入版本名称'}],
                    versionNo: [{required: true, message: '请输入版本号'}],
                }
            }
        },
        methods:{

        },
        created(){
            console.log(this.detail)
        }
    }
</script>
<style lang="less" scoped>
    .updateFirmware{

    }
</style>