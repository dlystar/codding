<template>
    <div class="resouce">
        <div class="searchArea">
            <Row type="flex" justify="center" align="middle" class="code-row-bg">
                <Col span="2">
                    菜单名：
                </Col>
                <Col span="8">
                    <Input v-model="searchName" style="width: 98%;"/>
                </Col>
                <Col span="2">
                    <Button type="primary" @click="getMenu()">查询</Button>
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
            :data="body"
            >
            <template slot="type" slot-scope="scope">
                <div>{{scope.row.type=='0' ? '目录' : (scope.row.type == '1' ? '菜单' : '按钮')}}</div>
            </template>
            <template slot="ishide" slot-scope="scope">
                <span>{{scope.row.ishide ==0 ? '否' : '是'}}</span>
            </template>
        </tree-table>
        <Modal
            scrollable
            width="600"
            :title="title"
            v-model="isShowModel"
            :mask-closable="false"
            >
            <div class="editArea">
                <div class="row">
                    <div class="name">菜单名称：</div>
                    <div class="input">
                        <Input placeholder="请输入菜单名称" v-model="selectedData.name" />
                    </div>
                </div>
                <div class="row">
                    <div class="name">菜单标识：</div>
                    <div class="input">
                        <Input placeholder="请输入菜单标识" v-model="selectedData.resKey" />
                    </div>
                </div>
                <div class="row">
                    <div class="name">菜单url：</div>
                    <div class="input">
                        <Input placeholder="请输入菜单url" v-model="selectedData.resUrl" />
                    </div>
                </div>
                <div class="row">
                    <div class="name">上级菜单：</div>
                    <div class="input">
                        <i-select v-model="selectedData.parentId">
                            <i-option v-for="item in reslists" :value="item.id">
                                {{ item.name }}
                            </i-option>
                        </i-select>
                    </div>
                </div>
                <div class="row">
                    <div class="name">菜单类型：</div>
                    <div class="input">
                        <i-select v-model="selectedData.type">
                            <i-option value="0">目录</i-option>
                            <i-option value="1">菜单</i-option>
                            <i-option value="2">按钮</i-option>
                        </i-select>
                    </div>
                </div>
                <div class="row" v-if="selectedData.type == 2">
                    <div class="name">按钮功能：</div>
                    <div class="input">
                        <Button v-for="item in chooseButtons" :type="item.type" style="margin-right: 5px;"
                            @click="selectedData.description = JSON.stringify(item)">
                            {{item.name}}
                        </Button>
                    </div>
                </div>
                <div class="row">
                    <div class="name">图标：</div>
                    <div class="input">
                        <Input placeholder="请输入icon" v-model="selectedData.icon" />
                    </div>
                </div>
                <div class="row">
                    <div class="name">是否隐藏：</div>
                    <div class="input">
                        <Checkbox @on-change="checkIsHide" v-model="ishide2" :checked.sync="ishide2"></Checkbox>
                    </div>
                </div>
                <div class="row">
                    <div class="name">菜单描述：</div>
                    <div class="input">
                        <Input placeholder="请输入菜单描述" v-model="selectedData.description" />
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
    </div>
</template>
<script>
    export default {
        name: 'resouce',
        data() {
            return {
                ishide2 : false,
                header:[
                    {title: '菜单名称',key: 'name',width: '150px'},
                    {title: '类型',key: 'type',width: '100px',type: 'template',template: 'type'},
                    {title: '图标',key: 'icon',width: '100px'},
                    {title: '唯一KEY',key: 'resKey',width: '100px'},
                    {title: 'URL地址',key: 'resUrl',width: '100px'},
                    {title: '是否隐藏',key: 'ishide',width: '100px',type: 'template',template: 'ishide'},
                    {title: '描述',key: 'description',width: '100px'},
                ], //表头数据
                body:[], //表格数据
                selectedData: {
                    name: '',
                    resKey: '',
                    resUrl: '',
                    parentId: '',
                    type: '',
                    icon: '',
                    ishide: '',
                    description: '',
                }, //选中数据
                isShowModel: false, //显示弹窗变量
                showAlert: false, //提示框
                msg: '',  //提示框信息
                title: '修改', //弹窗标题
                buttons: this.$store.state.user.currentMenuButtons, //页面按钮
                searchName: '', //搜索字段
                reslists: [], //上级菜单
                chooseButtons: [  //可供选择的按钮
                    {name: '新增', type: 'primary', code: 'add'},
                    {name: '编辑', type: 'success', code: 'add'},
                    {name: '删除', type: 'error', code: 'add'},
                    {name: '上传', type: 'primary', code: 'add'},
                    {name: '下载', type: 'primary', code: 'add'},
                    {name: '上移', type: 'default', code: 'add'},
                    {name: '下移', type: 'default', code: 'add'},
                    {name: '分配权限', type: 'info', code: 'add'},
                ],
            }
        },
        methods:{
            getMenu (name) {
                let data = {
                    name: this.searchName
                }
                this.axios.request({
                    data,
                    url: '/resources/treelists',
                    method: 'post'
                }).then(res =>{
                    if (res.data.result != '0') {
                      this.body = res.data.rows
                    }else {
                      this.body = [];
                    }
                }).catch(err =>{
                    console.log('网络异常')
                })
            },
            getReslists () {
                this.axios.request({
                    url: '/resources/reslists',
                    method: 'post'
                }).then(res =>{
                    this.reslists = res.data.rows
                    console.log(this.reslists)
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
                            resKey: '',
                            resUrl: '',
                            parentId: '',
                            type: '',
                            icon: '',
                            ishide: '',
                            description: '',
                        }
                        this.isShowModel = true
                        this.getReslists()
                    break
                    case '编辑':
                        if(selectedData.length > 0){
                            this.isShowModel = true
                            this.selectedData = data[selectedData[0]]
//                            this.selectedData.ishide = this.selectedData ? true : false
                            this.ishide2 = this.selectedData.ishide == 0 ? false : true
                            console.log(this.ishide2)
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
                }
            },
            submit () {
                let submitData = {}
                let {
                    name,resKey,resUrl,parentId,type,icon,ishide,description,id
                } = JSON.parse(JSON.stringify(this.selectedData));
                submitData = {
                    name,resKey,resUrl,parentId,type,icon,ishide,description,id
                }
                if(this.ishide2){
                  submitData.ishide = 1
                }else{
                  submitData.ishide = 0
                }
//                submitData.ishide = submitData.ishide ? 1 : 0
                console.log(submitData)
                let vaildData = {
                    name: '菜单名称',
                    resKey: '唯一KEY',
                    resUrl: '路径',
                    parentId: '上级菜单',
                    type: '菜单类型',
                    description: '描述',
                }
                if(submitData.parentId == '2'){
                    delete vaildData.icon
                }
                if(submitData.type == 0)  submitData.parentId = 0
                //验证数据
                for (var key in vaildData) {
                    if(submitData[key] === '' || submitData[key] === undefined){
                        console.log(submitData[key] + '--' + key)
                        this.showAlert = true
                        this.msg = '请输入'+vaildData[key]
                        return
                    }
                }
                if(this.title == '新增'){
                    this.axios.request({
                        data: submitData,
                        url: '/resources/addEntity',
                        method: 'post'
                    }).then(res => {
                        this.isShowModel = false
                        this.$Message.success('添加成功！')
                        this.getMenu('');
                    }).catch(err =>{
                        this.$Message.error('添加失败！');
                    })
                }else if(this.title == '编辑'){
                    this.axios.request({
                        data: submitData,
                        url: '/resources/editEntity',
                        method: 'post'
                    }).then(res => {
                        if(res.data.result == 1){
                            this.isShowModel = false
                            this.$Message.success('修改成功！')
                            this.getMenu('');
                        }else{
                            this.$Message.error(res.data.msg);
                        }
                    }).catch(err =>{
                        this.$Message.error('修改失败！');
                    })
                }
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
                        url: '/resources/deleteEntity',
                        method: 'post'
                    }).then(res =>{
                        if(res.data.result == 1){
                            this.$Message.success('删除成功！')
                            this.getMenu('')
                        }else{
                            this.$Message.error(res.data.msg);
                        }
                    }).catch(err =>{
                        this.$Message.error('删除失败！');
                    })
                }
            },
            checkIsHide(data){
                this.ishide2 = data;
                if(data){
                  this.selectedData.ishide = 1
                }else{
                  this.selectedData.ishide = 0
                }
            }
        },
        mounted(){
            this.getMenu('');
            this.getReslists();
        }
    }
</script>

<style scoped lang="less">
    .resouce{
        .buttonArea{
            margin-top: 10px; margin-bottom: 10px;
            button{margin-right: 10px;}
        }
    }
    .editArea{
        .row{
            width: 100%; margin-top: 10px; height: 32px;
            .name{line-height: 32px; width: 12%; text-align: right; float: left;}
            .input{width: 80%; float: left; line-height: 32px;}
        }
    }
</style>
