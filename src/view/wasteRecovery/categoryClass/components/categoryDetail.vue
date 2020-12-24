<template>
    <div class="baseInfo">
        <Form :model="detail" ref="detail" :rules="rules" :label-width="120">
            <FormItem label="品类分类：" prop="categoryId">
                <Select v-model="detail.categoryId" clearable @on-change="getName" :disabled="isDisabled">
                    <Option v-for="item in $parent.$parent.allCategoryClass" :value="item.id">{{item.categoryName}}</Option>
                </Select>
            </FormItem>
            <FormItem label="品类名称：" prop="detailName">
                <Input v-model="detail.detailName" :disabled="isDisabled"></Input>
            </FormItem>
            <FormItem label="单位类别：" prop="unitClass">
                <Select v-model="detail.unitClass" clearable :disabled="isDisabled">
                    <Option value="1">公斤数类别</Option>
                    <Option value="2">个数类别</Option>
                    <Option value="3">其他类别</Option>
                </Select>
            </FormItem>
            <FormItem label="单位：" prop="unit">
                <Input v-model="detail.unit" :disabled="isDisabled"></Input>
            </FormItem>
            <FormItem label="单价：" prop="unitPrice">
                <InputNumber v-model="detail.unitPrice" :disabled="isDisabled"></InputNumber>
            </FormItem>
            <FormItem label="排序：" prop="sort">
                <InputNumber v-model="detail.sort" :disabled="isDisabled"></InputNumber>
            </FormItem>
        </Form>
    </div>
</template>
<script>
    export default {
        name: 'baseInfo',
        props:{
            detail: Object,
            title: String,
        },
        data(){
            const validateArray = (rule, value, callback) => {
                if(value.length == 0){
                    return callback(new Error("请选择店铺省市区县"))
                }else{
                    callback()
                }
            }
            const validateNum = (rule, value, callback) =>{
                if(value){
                    callback()
                }else{
                    return callback(new Error("请输入数字"))
                }
            }
            return {
                rules: {
                    categoryName: [{required: true, message: '请选择品类分类', trigger: 'change'}],
                    detailName: [{required: true, message: '请输入品类名称', trigger: 'blur'}],
                    unitClass: [{required: true, message: '请选择单位类别', trigger: 'change'}],
                    unit: [{required: true, message: '请输入单位', trigger: 'blur'}],
                    unitPrice: [
                        {required: true,validator:validateNum, message: '请输入单价', trigger: 'blur'},
                    ],
                    // sort: [{required: true,validator:validateNum,  message: '请输入排序',  trigger: 'blur'}],
                },
                isDisabled: this.title == '查看详情',
                onlyAdd:  this.title != '新增',
            }
        },
        methods: {
            getName(value){
                if(value == undefined){
                    return
                }
                this.detail.categoryName = this.$parent.$parent.allCategoryClass.filter(item => item.id == value)[0].categoryName
            }
        },
        mounted(){
            console.log(this.$parent);
        }
    }
</script>
<style lang="less" scoped>
    .map-search{
        position: absolute; width: 100%; z-index: 100;
        margin-top: 30px; color: #000; font-weight: bold;
    }
    .baseInfo{
        max-height: 410px; overflow: auto; position: relative;
    }
    .ivu-input-wrapper, .ivu-select,.ivu-cascader{
        width: 80%;
    }
    .bm-view{
        // width: 80%;
        height: 300px;
    }
</style>