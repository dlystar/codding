<template>
    <div class="cardList">
        <Row :gutter="5">
            <Col span="6" v-for="item in components" :key="item.name">
                <Card>
                    <p slot="title" style="text-align:center;">{{item.name}}</p>
                    <div class="cardItem" @click="go(item)">
                        <img :src="item.img" alt="" style="width:200px;">
                        <h6>{{item.desc}}</h6>
                    </div>
                </Card>
            </Col>
        </Row>
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
                        img: require('@/assets/images/icons/initIcon.png'),
                        route:{
                            name: 'one_function_page',
                            query: {id: '自定义图标'},
                            title: {name: '自定义icon图标'},
                        }
                    },
                    {
                        name: '树状下拉选择器',
                        desc: '树状下拉选择器',
                        img: require('@/assets/images/icons/treeSelect.png'),
                        route:{
                            name: 'one_function_page',
                            query: {id: '树状下拉选择器'},
                            title: {name: '树状下拉选择器'},
                        }
                    },
                    {
                        name: '数字渐变',
                        desc: '数字渐变',
                        img: require('@/assets/images/icons/treeSelect.png'),
                        route:{
                            name: 'one_function_page',
                            query: {id: '数字渐变'},
                            title: {name: '数字渐变'},
                        }
                    },
                    {
                        name: '拖拽列表',
                        desc: '拖拽列表',
                        img: require('@/assets/images/icons/treeSelect.png'),
                        route:{
                            name: 'one_function_page',
                            query: {id: '拖拽列表'},
                            title: {name: '拖拽列表'},
                        }
                    },
                    {
                        name: '可拖拽抽屉',
                        desc: '可拖拽抽屉',
                        img: require('@/assets/images/icons/treeSelect.png'),
                        route:{
                            name: 'one_function_page',
                            query: {id: '可拖拽抽屉'},
                            title: {name: '可拖拽抽屉'},
                        }
                    },
                    {
                        name: '组织结构树',
                        desc: '组织结构树',
                        img: require('@/assets/images/icons/treeSelect.png'),
                        route:{
                            name: 'one_function_page',
                            query: {id: '组织结构树'},
                            title: {name: '组织结构树'},
                        }
                    },
                    {
                        name: '树状表格',
                        desc: '树状表格',
                        img: require('@/assets/images/icons/treeSelect.png'),
                        route:{
                            name: 'one_function_page',
                            query: {id: '树状表格'},
                            title: {name: '树状表格'},
                        }
                    },
                    {
                        name: '图片裁剪',
                        desc: '图片裁剪',
                        img: require('@/assets/images/icons/treeSelect.png'),
                        route:{
                            name: 'one_function_page',
                            query: {id: '图片裁剪'},
                            title: {name: '图片裁剪'},
                        }
                    },
                    {
                        name: '分割窗口',
                        desc: '分割窗口',
                        img: require('@/assets/images/icons/treeSelect.png'),
                        route:{
                            name: 'one_function_page',
                            query: {id: '分割窗口'},
                            title: {name: '分割窗口'},
                        }
                    },
                    {
                        name: '全局打印',
                        desc: '全局打印',
                        img: require('@/assets/images/icons/treeSelect.png'),
                        route:{
                            name: 'one_function_page',
                            query: {id: '全局打印'},
                            title: {name: '全局打印'},
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
    .cardList{
        // display: flex;
        // flex-wrap: wrap;
        >div{
            margin: 5px;
        }
        .cardItem{
            text-align: center;
            cursor: pointer;
            h6{
                height: 36px;
                text-align: left;
                overflow : hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
        }
    }
</style>