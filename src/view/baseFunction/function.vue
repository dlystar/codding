<template>
    <div>
        <iconPage v-if="$route.query.id == 'icons'"></iconPage>
    </div>
</template>

<script>
    import iconPage from '@/view/components/icons/icons'
    export default{
        name: 'one_function_page',
        components: {iconPage},
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