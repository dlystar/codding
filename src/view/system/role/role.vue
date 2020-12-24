<template>
    <div class="role">
        <div class="searchArea">
            <Row type="flex" justify="center" align="middle" class="code-row-bg">
                <Col span="2">
                    角色名：
                </Col>
                <Col span="8">
                    <Input v-model="name" style="width: 98%;"/>
                </Col>
                <Col span="2">
                    <Button type="primary" @click="getRoles()" v-no-more-click>查询</Button>
                </Col>
                <Col span="12">
                </Col>
            </Row>
        </div>
        <div class="buttonArea">
            <Button v-for="item in buttons" :type="item.type" @click="showModel(item.name)">
                {{item.name}}
            </Button>
        </div>
        <tree-table 
            expand-key="name"
            ref="tree" 
            :expand-type="false" 
            :selectable="true" 
            :columns="header" 
            :data="tableData.rows"
            >
        </tree-table>
        <div class="page">
            <div style="float: right;">
                <Page
                    ref="pages"
                    show-total
                    show-elevator
                    :page-size="pageSize"  
                    :total="tableData.records" 
                    @on-change="changePage"></Page>
            </div>
        </div>
        <Modal
            scrollable
            width="600"
            :title="title"
            v-model="isShowModel"
            :mask-closable="false"
            >
            <div class="editArea">
                <div class="row">
                    <div class="name">角色名：</div>
                    <div class="input">
                        <Input placeholder="请输入角色名" v-model="selectedData.name" />
                    </div>
                </div>
                <div class="row">
                    <div class="name">roleKey：</div>
                    <div class="input">
                        <Input placeholder="请输入roleKey" v-model="selectedData.roleKey" />
                    </div>
                </div>
                <div class="row">
                    <div class="name">描述：</div>
                    <div class="input">
                        <Input placeholder="请输入描述" v-model="selectedData.description" />
                    </div>
                </div>
<!--                <div class="row">-->
<!--                    <div class="name">角色状态：</div>-->
<!--                    <div class="input">-->
<!--                        <i-select v-model="selectedData.state">-->
<!--                            <i-option value="1">是</i-option>-->
<!--                            <i-option value="0">否</i-option>-->
<!--                        </i-select>-->
<!--                    </div>-->
<!--                </div>-->
            </div>
            <div slot="footer">
                <Button type="primary" size="large" @click="submit()" v-no-more-click>提交</Button>
            </div>
        </Modal>
        <Modal
            scrollable
            title="提示"
            v-model="showAlert"
            :mask-closable="false"
            width="300"
            >
            <p>{{msg}}</p>
            <div slot="footer">
                <Button size="large" @click="showAlert=false" v-show="msg=='确定要删除该数据吗？'">取消</Button>
                <Button type="primary" size="large" @click="closePrompt(msg)" v-no-more-click>确定</Button>
            </div>
        </Modal>
        <Modal
            title="分配权限"
            v-model="sortfield"
            :mask-closable="false"
            width="400"

            >
            <div class="treeContent">
                <Tree :data="sortfieldTree" :check-strictly="true" show-checkbox></Tree>
            </div>
            <div slot="footer">
                <Button size="large" @click="sortfield=false">取消</Button>
                <Button :loading="confirmLoading" type="primary" size="large" @click="saveSortfield()" v-no-more-click>保存</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    export default {
        name: 'role',
        data() {
            return {
                buttons: this.$store.state.user.currentMenuButtons, //页面按钮
                name: '', //账号
                pageIndex: 1,
                pageSize: 6,
                header: [  //表头
                    {title: '角色名',key: 'name'},
                    {title: 'roleKey',key: 'roleKey'},
                    {title: '描述',key: 'description'},
                ],
                tableData:{}, //表体

                selectedData: {
                    name: '',
                    roleKey: '',
                    description: '',
                    state: '0',
                }, //选中数据
                isShowModel: false, //显示弹窗变量
                showAlert: false, //提示框
                msg: '',  //提示框信息
                title: '修改', //弹窗标题

                sortfield: false,
                sortfieldTree: [],

                confirmLoading: false,
            }
        },
        methods:{
            getRoles () {
                let data = {
                    name: this.name,
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize,
                }
                this.axios.request({
                    data,
                    url: '/role/findByPage',
                    method: 'post'
                }).then(res =>{
                    this.tableData = res.data
                    this.pageIndex = res.data.pageIndex
                }).catch(err =>{
                    console.log('网络异常')
                })
            },
            showModel (title) {
                this.title = title
                let data = this.$refs.tree.bodyData
                let selectedData = this.$refs.tree.getCheckedProp()
                switch(title){
                    case '新增': 
                        this.selectedData = {
                            name: '',
                            roleKey: '',
                            description: '',
                            state: '',
                        }
                        this.isShowModel = true
                    break
                    case '编辑': 
                        if(selectedData.length > 0){
                            this.isShowModel = true
                            this.selectedData = data[selectedData[0]]
                            this.selectedData.ishide = this.selectedData ? true : false
                        }else{
                            this.showAlert = true
                            this.msg = '请选择一条数据！'
                        }
                    break
                    case '删除': 
                        if(selectedData.length > 0){
                            this.showAlert = true
                            this.msg = '确定要删除该数据吗？'
                        }else{
                            this.showAlert = true
                            this.msg = '请选择要删除的数据！'
                        }
                    break
                    case '分配权限':
                        if(selectedData.length == 1){
                            this.selectedData = data[selectedData[0]]
                            this.sortfield = true
                            this.getMenu(this.selectedData.id)
                        }else{
                            this.showAlert = true
                            this.msg = '请选择一条数据！'
                        }
                        
                    break
                }
            },
            submit () {
                let submitData = {}
                let {
                    name,roleKey,description,state,id
                } = JSON.parse(JSON.stringify(this.selectedData));
                submitData = {
                    name,roleKey,description,state,id
                }
                console.log(submitData)
                let vaildData = {
                    name: '角色名',
                    roleKey: 'roleKey',
                    description: '描述'
                }
                //验证数据
                for (var key in vaildData) {
                    if(submitData[key] === '' || submitData[key] === undefined){
                        console.log(submitData[key] + '--' + key)
                        this.showAlert = true
                        this.msg = '请输入'+vaildData[key]
                        return 
                    }
                }
                //验证是否存在该角色
                (async function(){
                    let existUser = await this.axios.request({
                        data: {
                            name: submitData.name,
                            id: submitData.id
                        },
                        url: '/role/isExist',
                        method: 'post',
                    })
                    if(!existUser.data.rows){
                        this.$Message.error('该角色已存在！')
                        return
                    }
                    if(this.title == '新增'){
                        this.axios.request({
                            data: submitData,
                            url: '/role/addEntity',
                            method: 'post'
                        }).then(res => {
                            if(res.data.result == 1){
                                this.isShowModel = false
                                this.$Message.success('新增成功！');
                                this.getRoles('');
                                this.$refs['pages'].currentPage = 1;
                            }else{
                                this.$Message.error(res.data.msg);
                            }
                        }).catch(err =>{
                            this.$Message.error('新增失败！');
                        })
                    }else if(this.title == '编辑'){
                        this.axios.request({
                            data: submitData,
                            url: '/role/editEntity',
                            method: 'post'
                        }).then(res => {
                            if(res.data.result == 1){
                                this.isShowModel = false
                                this.$Message.success('修改成功！');
                                this.getRoles('');
                                this.$refs['pages'].currentPage = 1;
                            }else{
                                this.$Message.error(res.data.msg);
                            }
                        }).catch(err =>{
                            this.$Message.error('修改失败！');
                        }) 
                    }
                }.bind(this))()  
            },
            closePrompt (msg) {
                this.showAlert = false;
                if(msg == '确定要删除该数据吗？'){
                    let bodyData = this.$refs.tree.bodyData
                    let selectedData = this.$refs.tree.getCheckedProp()
                    let ids = []
                    selectedData.forEach(item=> ids.push(bodyData[item].id))
                    let data = {
                        ids: ids.join(',')
                    }
                    this.axios.request({
                        data,
                        url: '/role/deleteEntity',
                        method: 'post'
                    }).then(res =>{
                        if(res.data.result == 1){
                            this.$Message.success('删除成功！');
                            this.getRoles('');
                            this.$refs['pages'].currentPage = 1;
                        }else{
                            this.$Message.error(res.data.msg);
                        }
                    }).catch(err =>{
                        this.$Message.error('删除失败！');
                    })
                }
            },
            getMenu (id) {
                (async function(){
                    let existedTree = await this.axios.request({
                        data: {roleId: id},url: '/resources/findRes',method: 'post'
                    });
                    let menu = await this.axios.request({
                        url: '/resources/treelists',method: 'post'
                    });
                    each(menu.data.rows)
                    this.sortfieldTree = menu.data.rows
                    function each(arr){
                        arr.forEach(item =>{
                            for (var key in item) {
                                if(['name','children','id','parentId'].indexOf(key) < 0){
                                    delete item[key]
                                }
                            }
                            item.checked = false
                            item.title = item.name
                            item.expand = true
                            existedTree.data.rows.forEach(jtem =>{
                                if(item.id == jtem.id){
                                    item.checked = true
                                }
                            })
                            if(item.children && item.children.length > 0){
                                each(item.children)
                            }else{
                                if(!item.checked){
                                    setParentCheckedValue(item.parentId,menu.data.rows)
                                }
                            }
                        })
                    }
                    function setParentCheckedValue(parentId,arr){
                        arr.forEach(item=>{
                            if(item.children && item.children.length > 0){
                                if(item.id == parentId){
                                    setParentCheckedValue(item.parentId,menu.data.rows)
                                    item.checked = false
                                }else{
                                    setParentCheckedValue(parentId,item.children)
                                }
                            }
                        })
                    }
                }.bind(this))()
            },
            saveSortfield () {
                let sortfieldTree = JSON.parse(JSON.stringify(this.sortfieldTree)) //对象拷贝
                let resArray = []
                let resId = []
                dimensionArray(sortfieldTree) //数组降维
                resArray.forEach(item=>{ //父节点选择
                    resArray.forEach(jtem=>{
                        if(item.id == jtem.parentId && jtem.checked){
                            item.checked = true
                        }
                    })
                    if(item.checked) resId.unshift(item.id)
                    
                })
                let data = {
                    roleId: this.selectedData.id,
                    resId: resId.join(',')
                }
                this.confirmLoading = true
                this.axios.request({
                    data,
                    url: '/resources/addUserRes',
                    method: 'post'
                }).then(res => {
                    this.confirmLoading = false
                    if(res.data.result == 1){
                        this.$Message.success('分配权限成功！');
                        this.sortfield = false
                    }else{
                        this.$Message.error(res.data.msg);
                    }
                }).catch(err =>{
                    this.confirmLoading = false
                    this.$Message.error('分配权限失败！');
                })

                function dimensionArray(arr){
                    arr.forEach(item => {
                        resArray.unshift(item)
                        if(item.children && item.children.length > 0){
                            dimensionArray(item.children)
                        }
                    })    
                }
            },
            changePage (current){
                this.pageIndex = current
                this.getRoles()
            }
        },
        mounted(){
            this.getRoles()
        }   
    }
</script>

<style scoped lang="less">
    .role{
        .buttonArea{
            margin-top: 10px; margin-bottom: 10px;
            button{margin-right: 10px;}
        }
        .page{
            margin: 10px;overflow: hidden; position: absolute; bottom: 0; right: 0;
        }
    }
    .editArea{
        .row{
            width: 100%; margin-top: 10px; height: 32px;
            .name{line-height: 32px; width: 12%; text-align: right; float: left;}
            .input{width: 80%; float: left; line-height: 32px;}
        }
    }
    .treeContent{
        height: 300px;
        overflow-y: auto;
    }
</style>

