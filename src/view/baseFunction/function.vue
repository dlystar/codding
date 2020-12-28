<template>
    <div>
        <iconPage v-if="$route.query.id == 'icons'"></iconPage>
        <treeSelect v-if="$route.query.id == '树状下拉选择器'"></treeSelect>
        <conutTo v-if="$route.query.id == '数字渐变'"></conutTo>
        <dragList v-if="$route.query.id == '拖拽列表'"></dragList>
        <dragDrawer v-if="$route.query.id == '可拖拽抽屉'"></dragDrawer>
        <orgTree v-if="$route.query.id == '组织结构树'"></orgTree>
        <treeTable v-if="$route.query.id == '树状表格'"></treeTable>
        <cropper v-if="$route.query.id == '图片裁剪'"></cropper>
        <splitPane v-if="$route.query.id == '分割窗口'"></splitPane>
    </div>
</template>

<script>
    import iconPage from '@/view/components/icons/icons'
    import treeSelect from '@/view/components/tree-select'
    import conutTo from '@/view/components/count-to/count-to'
    import dragList from '@/view/components/drag-list/drag-list'
    import dragDrawer from '@/view/components/drag-drawer'
    import orgTree from '@/view/components/org-tree'
    import treeTable from '@/view/components/tree-table/index.vue'
    import cropper from '@/view/components/cropper/cropper.vue'
    import splitPane from '@/view/components/split-pane/split-pane.vue'
    export default{
        name: 'one_function_page',
        components: {iconPage,treeSelect,conutTo,dragList,dragDrawer,orgTree,treeTable,
            cropper,splitPane
        },
        data(){
            return{
                
            }
        },
        methods:{
            
        },
        created(){
            console.log(this.$route.meta);
        }
    }
</script>

<style lang="less" scoped>
    
</style>