<template>
    <div class="account">
        <div class="searchArea">
            <Row type="flex" justify="center" align="middle" class="code-row-bg">
                <Col span="1">
                    账号：
                </Col>
                <Col span="9">
                    <Input v-model="name" style="width: 98%;"/>
                </Col>
                <Col span="2">
                    <Button type="primary" @click="pageIndex=1;getUser()" v-no-more-click>查询</Button>
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
            <template slot="locked" slot-scope="scope">
                <div>{{scope.row.locked == '1' ? '未锁定' : '锁定'}}</div>
            </template>
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
                    <div class="name">用户名：</div>
                    <div class="input">
                        <Input placeholder="请输入用户名" v-model="selectedData.userName" />
                    </div>
                </div>
                <div class="row">
                    <div class="name">账号：</div>
                    <div class="input">
                        <Input placeholder="请输入账号" v-model="selectedData.accountName" />
                    </div>
                </div>
                <div class="row">
                    <div class="name">头像：</div>
                    <div class="input">
                        <upload
                            v-if="isShowModel"
                            :imageList="avator"
                            :businessId="selectedData.id"
                            :businessName="businessName"
                            :maxLen="1"
                            v-on:onUploadSuccess="getUploadMessage"
                        ></upload>
                    </div>
                </div>
                <div class="row" style="height: auto;">
                    <div class="name">角色：</div>
                    <div>
                        <Transfer
                            :titles="['可角色','已角色']"
                            :data="transferData"
                            :target-keys="transferKeys"
                            @on-change="transferChange">
                        </Transfer>
                    </div>
                </div>
                <div class="row">
                    <div class="name">是否锁定：</div>
                    <div class="input">
                        <i-select v-model="selectedData.locked">
                            <i-option value="2">是</i-option>
                            <i-option value="1">否</i-option>
                        </i-select>
                    </div>
                </div>
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
                <Tree :data="sortfieldTree" show-checkbox></Tree>
            </div>
            <div slot="footer">
                <Button size="large" @click="sortfield=false">取消</Button>
                <Button :loading="confirmLoading" type="primary" size="large" @click="saveSortfield()" v-no-more-click>保存</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import upload from '@/view/components/upload/upload.vue'
    export default {
        name: 'role',
        components:{
            upload
        },
        data() {
            return {
                buttons: this.$store.state.user.currentMenuButtons, //页面按钮
                name: '', //账号
                pageIndex: 1,
                pageSize: 6,
                header: [  //表头
                    {title: 'id', key: 'id'},
                    {title: '用户名',key: 'userName'},
                    {title: '账号',key: 'accountName'},
                    {title: '所属角色',key: 'roleName'},
                    {title: '账号状态',key: 'locked',type:'template',template: 'locked'},
                    {title: '描述',key: 'description'},
                    {title: '创建时间',key: 'createTime'},
                    // {title: '头像',key: 'imageUrl',width:0},
                    // {title: '操作',key: 'name'},
                ],
                tableData:{}, //表体
                businessName: '系统基础管理-用户管理',
                selectedData: {
                    userName: '',
                    accountName: '',
                    locked: '',
                    roleName: '',
                    imageUrl: '',
                }, //选中数据
                isShowModel: false, //显示弹窗变量
                showAlert: false, //提示框
                msg: '',  //提示框信息
                title: '修改', //弹窗标题

                sortfield: false, //分配权限显示变量
                sortfieldTree: [], //树形
                password:{ 
                    old: '', new: '', confirm: ''
                },
                transferData:[],
                transferKeys: [],
                avator: [], //头像

                confirmLoading: false,
            }
        },
        methods:{
            getUser () {
                let data = {
                    accountName: this.name,
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize,
                }
                this.axios.request({
                    data,
                    url: '/user/findByPage',
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
                            userName: '',
                            accountName: '',
                            locked: '',
                            roleName: '',
                            imageUrl: '',
                        }
                        this.isShowModel = true
                        this.businessName = '系统基础管理-用户管理-新增用户头像'
                        this.avator = []
                        this.getCurrentRoles()
                    break
                    case '编辑': 
                        if(selectedData.length > 0){
                            this.getCurrentRoles()
                            this.selectedData = data[selectedData[0]]
                            this.selectedData.ishide = this.selectedData ? true : false
                            this.isShowModel = true
                            this.businessName = '系统基础管理-用户管理-修改用户头像'
                            if(this.selectedData.imageUrl){
                                this.avator = [{name:'头像',url:this.selectedData.imageUrl}]
                            }else{
                                this.avator = []
                            }
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
                        if(selectedData.length > 0){
                            this.selectedData = data[selectedData[0]]
                            this.sortfield = true
                            this.getMenu(this.selectedData.id)
                        }else{
                            this.showAlert = true
                            this.msg = '请选择一条数据！'
                        }
                        
                    break
                    case '重置密码':
                        if(selectedData.length == '1'){
                            this.selectedData = data[selectedData[0]]
                            let submitData = {
                                id: this.selectedData.id,
                                accountName: this.selectedData.accountName
                            }
                            this.axios.request({
                                data:submitData,
                                url: '/user/resetPassword',
                                method: 'post'
                            }).then(res =>{
                                if(res.data.result){
                                    this.$Message.success('重置密码成功！');
                                    this.$refs['pages'].currentPage = 1;
                                }else{
                                    this.$Message.error(res.data.msg);
                                }   
                            }).catch(err =>{
                               this.$Message.error('重置密码失败！');
                            })
                        }else{
                            this.showAlert = true
                            this.msg = '请选择一条数据！'
                        }
                    break
                }
            },
            submit () {
                let submitData = {}
                console.log(this.selectedData)
                let {
                    userName,accountName,locked,id,imageUrl
                } = JSON.parse(JSON.stringify(this.selectedData));
                submitData = {
                    userName,accountName,locked,id,imageUrl
                }
                submitData.txtGroupsSelect = this.transferKeys.join(',')
                let vaildData = {
                    userName: '用户名',
                    accountName: '账号',
                    locked: '是否禁用',
                    imageUrl: '头像',
                }
                //验证数据
                for (var key in vaildData) {
                    console.log(key+'--'+submitData[key])
                    if(submitData[key] === '' || submitData[key] === undefined){
                        if(key == 'imageUrl'){                            
                            this.msg = '请上传'+vaildData[key]                           
                        }else{
                            this.msg = '请输入'+vaildData[key]   
                        }
                        this.showAlert = true
                        return 
                    }
                }
                (async function(){
                    let existUser = await this.axios.request({
                        data: {
                            name: submitData.accountName,
                            id: submitData.id
                        },
                        url: '/user/isExist',
                        method: 'post',
                    })
                    if(!existUser.data.rows){
                       this.$Message.error('用户已存在！')
                       return  
                    }
                    if(this.title == '新增'){
                        this.axios.request({
                            data: submitData,
                            url: '/user/addEntity',
                            method: 'post'
                        }).then(res => {
                            if(res.data.result == 1){
                                this.isShowModel = false
                                this.$Message.success('新增成功！');
                                this.getUser('');
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
                            url: '/user/editEntity',
                            method: 'post'
                        }).then(res => {
                            if(res.data.result == 1){
                                this.isShowModel = false
                                this.$Message.success('修改成功！');
                                this.getUser('');
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
                        url: '/user/deleteEntity',
                        method: 'post'
                    }).then(res =>{
                        if(res.data.result == 1){
                            this.$Message.success('删除成功！');
                            this.getUser('')
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
                        data: {userId: id},url: '/resources/findRes',method: 'post'
                    });
                    let menu = await this.axios.request({
                        url: '/resources/treelists',method: 'post'
                    });
                    each(menu.data.rows)
                    console.log(menu.data.rows)
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
                    userId: this.selectedData.id,
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
            getCurrentRoles () {
                this.transferData = []
                this.transferKeys = []
                this.axios.request({
                    data:{
                        name: '',
                        pageIndex: '1',
                        pageSize: '-1',
                    },
                    url: '/role/findByPage',
                    method: 'post'
                }).then(res =>{
                    res.data.rows.forEach(item => {
                        this.transferData.push({
                            key: item.id,
                            label: item.name
                        })
                        if(this.selectedData.roleName.split(',').indexOf(item.name) > -1){
                            this.transferKeys.push(item.id)
                        }
                    })
                }).catch(err =>{
                    console.log(err)
                })
            },
            transferChange (newTargetKeys) {
                this.transferKeys = newTargetKeys
            },
            getUploadMessage (file){
                this.selectedData.imageUrl = file.url
            },
            changePage (current){
                this.pageIndex = current
                console.log(this.pageIndex)
                this.getUser()
            }
        },
        mounted(){
            this.getUser()
        }   
    }
</script>

<style scoped lang="less">
    .account{
        .buttonArea{
            margin-top: 10px; margin-bottom: 10px;
            button{margin-right: 10px;}
        }
        .page{
            margin: 10px;overflow: hidden; position: absolute; bottom: 0; right: 0;
        }
    }
    .editArea{
        height: 380px; overflow-y: auto;
        .row{
            width: 100%; margin-top: 10px; height: 32px;
            .name{line-height: 32px; width: 12%; text-align: right; float: left;}
            .input{width: 80%; float: left; line-height: 32px;}
        }
    }
    .ivu-page-item-active{
        background: #3399ff;
    }
    .treeContent{
        height: 300px;
        overflow-y: auto;
    }
</style>

