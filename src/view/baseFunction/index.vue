<template>
    <div>
        <Card style="width: 300px;" v-for="item in components" :key="item.name">
            <div class="cardItem" @click="go(item)">
                <Icon :type="item.icon" size="30" />
                <h5>{{item.name}}</h5>
                <h6>{{item.desc}}</h6>
            </div>
        </Card>
    </div>
</template>

<script>
    export default{
        data(){
            return{
                components:[
                    {
                        name: '自定义图标',
                        desc: '可以收录阿里的iconfont，点击可跳转至自定义图标页面',
                        icon: 'ios-flower',
                        route:{
                            name: 'one_function_page',
                            params: {id: '自定义图标'},
                            meta: {name: '自定义icon图标'},
                        }
                    }
                ]
            }
        },
        methods:{
            go(item){
                this.$router.push(item.route)
            }
        },
        created(){
            
        }
    }
</script>

<style lang="less" scoped>
    .cardItem{
        text-align: center;
    }
</style>