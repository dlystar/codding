<template>
  <div class="role">
    <div class="searchArea">
      <Row type="flex" justify="center" align="middle" class="code-row-bg">
        <Col span="7">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;客户姓名：<Input v-model="customerName" style="width: 57%; margin-right: 10px;"/>
        </Col>
        <Col span="7">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;客户状态：<i-select style="width: 57%; margin-right: 10px;" v-model="operation" >
        <i-option v-for="item in reslists3" :value="item.id" >{{ item.name }}</i-option>
      </i-select>
        </Col>
        <Col span="7">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录入时间：<DatePicker
        @on-change="changeTime"
        format="yyyy-MM-dd HH:mm:ss"
        type="datetimerange"
        style="width: 57%;"
        placement="bottom-end"></DatePicker>
        </Col>
        <Col span="3">
        <Button type="primary" @click="getRoles()" v-no-more-click>查询</Button>
        </Col>
      </Row>
    </div>
    <div class="buttonArea">
      <Button v-for="item in buttons" :type="item.type" @click="showModel(item.name)">
        {{item.name}}
      </Button>
    </div>
    <Table
      expand-key="name"
      ref="tree"
      :expand-type="false"
      :columns="header"
      :data="tableData.rows"
      @on-selection-change = "tableSelectData"
    >
    </Table>
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
          <div class="name">标签：</div>
          <div class="input">
            <i-select v-model="selectedData.categoryId" :label-in-value="true" @on-change="changeVal2">
              <i-option v-for="item in reslists2" :value="item.id" >{{ item.categoryName }}</i-option>
            </i-select>
          </div>
        </div>
        <div class="row">
          <div class="name">客户状态：</div>
          <div class="input">
            <i-select placeholder="如果还是选择咨询中的状态，将生成下一条待录入信息" v-model="selectedData.operation" :label-in-value="true" @on-change="changeVal3">
              <i-option v-for="item in reslists3" :value="item.id" >{{ item.name }}</i-option>
            </i-select>
          </div>
        </div>
        <div class="row">
          <div class="name">客户评价：</div>
          <div class="input">
            <Input v-model="selectedData.assess" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入对客户的评价" />
          </div>
        </div>
        <div class="row2">
          <div class="name">通话内容：</div>
          <div class="input">
            <Input v-model="selectedData.callContent" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入本次回访内容" />
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" @click="submit()" v-no-more-click>提交</Button>
      </div>
    </Modal>
    <Modal
      scrollable
      width="600"
      :title="title"
      v-model="isShowModel2"
      :mask-closable="false"
    >
      <div class="editArea">
        <div class="row">
          <div class="name">姓名：</div>
          <div class="input">
            <Input placeholder="请输入姓名" v-model="name" />
          </div>
        </div>
        <div class="row">
          <div class="name">电话：</div>
          <div class="input">
            <Input placeholder="请输入电话" v-model="phone" />
          </div>
        </div>
        <div class="row">
          <div class="name">省份：</div>
          <div class="input">
            <i-select filterable v-model="address" :label-in-value="true" @on-change="changeVal4">
              <i-option v-for="item in reslists4" :value="item.value" >{{ item.name }}</i-option>
            </i-select>
          </div>
        </div>
        <div class="row">
          <div class="name">来源：</div>
          <div class="input">
            <i-select v-model="sourceId" :label-in-value="true" @on-change="changeVal">
              <i-option v-for="item in reslists" :value="item.id" >{{ item.sourceName }}</i-option>
            </i-select>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" @click="submit()" v-no-more-click>提交</Button>
      </div>
    </Modal>
    <Modal title="导入客户资源" v-model="upCustomer">
      <Upload
        type="drag"
        :headers="headers"
        :on-success="handleSuccess2"
        name="upload"
        :data="{'isAdmin':'0'}"
        :action="baseUrl2+'/customerInfo/upMyCustomer'">
        <div style="padding: 20px 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
          <p>点击或将文件拖拽到这里上传</p>
        </div>
      </Upload>
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
  import excel from '@/libs/excel'
  import { setToken, getToken } from '@/libs/util'
  import config from '@/config'
  const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
  export default {
    name: 'ordinaryCustomer',
    data() {
      return {
        buttons: this.$store.state.user.currentMenuButtons, //页面按钮
        upCustomer: false,
        headers:{
          'Authorization' : getToken(),
        },
        baseUrl2: baseUrl.replace(/\/$/,''),
        name: '',
        phone: '',
        address: '',
        sourceId: '',
        sourceName: '',
        customerName: '',
        callAccount: '',
        operation: '',
        pageIndex: 1,
        pageSize: 10,
        time: '', // 选择时间
        header: [  //表头
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {title: '客户姓名',key: 'customerName'},
          {title: '回访人员',key: 'callName'},
          {title: '回访账号',key: 'callAccount'},
          {title: '记录标签',key: 'categoryName'},
          {
            title: '记录操作',
            key: 'operation',
            render: (h, params) => {
              if(params.row.operation == 0){
                return h('div',"抛弃")
              }else if(params.row.operation == 1){
                return h('div',"成交")
              }else if(params.row.operation == 2){
                return h('div',"咨询中")
              }else{
                return h('div',"闲暇中")
              }
            }
          },
          {
            title: '客户评价',
            key: 'assess',
            render: (h, params) => {
              let data = params.row.assess
              if(data == null || data ==undefined){
                return h('div','')
              }
              if(data.length>4){
                return h('Poptip', {
                  props: {
                    trigger: 'hover',
                    title: '',
                    placement: 'left'
                  }
                }, [
                  h('div', data.substring(0,4)+'...'),
                  h('div', {
                    slot: 'content',
                    style:{
                      width: '600px'
                    }
                  }, [
                    h('span', {
                      style:{
                        width: '600px',
                        'word-wrap': 'break-word',
                        'word-break': 'break-all',
                        'white-space':'pre-wrap !important'
                      }
                    },data)
                  ])
                ]);
              }else{
                return h('div',data)
              }
            }
          },
          {
            title: '通话内容',
            key: 'callContent',
            render: (h, params) => {
              let data = params.row.callContent
              if(data == null || data ==undefined){
                return h('div','')
              }
              if(data.length>4){
                return h('Poptip', {
                  props: {
                    trigger: 'hover',
                    title: '',
                    placement: 'left'
                  }
                }, [
                  h('div', data.substring(0,4)+'...'),
                  h('div', {
                    slot: 'content',
                    style:{
                      width: '600px'
                    }
                  }, [
                    h('span', {
                      style:{
                        width: '600px',
                        'word-wrap': 'break-word',
                        'word-break': 'break-all',
                        'white-space':'pre-wrap !important'
                      }
                    },data)
                  ])
                ]);
              }else{
                return h('div',data)
              }
            }
          },
          {title: '记录时间',key: 'createDate',width:'150px'}
        ],
        tableData:{}, //表体
        selectTableData:[], //表格选中的数据
        selectedData: {
          customerName: '',
          callName: '',
          categoryName: '',
          operation: '',
          assess: '',
          createDate: '',
          callContent: ''
        }, //选中数据
        isShowModel: false, //显示弹窗变量
        isShowModel2: false, //显示弹窗变量
        showAlert: false, //提示框
        msg: '',  //提示框信息
        title: '修改', //弹窗标题
        reslists: [], //上级导航
        reslists2: [],
        reslists3: [ // 0、抛弃，2、咨询中，3、闲暇中，1、成交
          {'id':'','name':'---- 请选择 ----'},
          {'id':0,'name':'抛弃'},
          {'id':2,'name':'咨询中'},
          {'id':3,'name':'闲暇中'},
          {'id':1,'name':'成交'}
        ],
        reslists4: [
          {'name':'广东','value':'广东'},
          {'name':'北京','value':'北京'},
          {'name':'福建','value':'福建'},
          {'name':'浙江','value':'浙江'},
          {'name':'上海','value':'上海'},
          {'name':'湖北','value':'湖北'},
          {'name':'湖南','value':'湖南'},
          {'name':'江西','value':'江西'},
          {'name':'海南','value':'海南'},
          {'name':'天津','value':'天津'},
          {'name':'重庆','value':'重庆'},
          {'name':'河北','value':'河北'},
          {'name':'河南','value':'河南'},
          {'name':'安徽','value':'安徽'},
          {'name':'广西','value':'广西'},
          {'name':'四川','value':'四川'},
          {'name':'贵州','value':'贵州'},
          {'name':'山西','value':'山西'},
          {'name':'辽宁','value':'辽宁'},
          {'name':'吉林','value':'吉林'},
          {'name':'黑龙江','value':'黑龙江'},
          {'name':'江苏','value':'江苏'},
          {'name':'山东','value':'山东'},
          {'name':'云南','value':'云南'},
          {'name':'陕西','value':'陕西'},
          {'name':'甘肃','value':'甘肃'},
          {'name':'青海','value':'青海'},
          {'name':'台湾','value':'台湾'},
          {'name':'内蒙古','value':'内蒙古'},
          {'name':'宁夏','value':'宁夏'},
          {'name':'新疆','value':'新疆'},
          {'name':'西藏','value':'西藏'},
          {'name':'香港','value':'香港'},
          {'name':'澳门','value':'澳门'}
        ],
        sortfield: '',
        sortfieldTree: []
      }
    },
    methods:{
      tableSelectData (selection){
        this.selectTableData = selection
      },
      getRoles () {
        let data = {
          customerName: this.customerName,
          operation: this.operation,
          startDate: this.time[0],
          endDate: this.time[1],
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          sortfield: 'createDate',
          categoryName: '普通客户'
        }
        this.axios.request({
          data,
          url: '/callInfo/getMyResoucers',
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
//        let data = this.$refs.tree.bodyData
//        let selectedData = this.$refs.tree.getCheckedProp()
        let selectedData = this.selectTableData
        switch(title){
          case '新增':
            this.getReslists2 () // 加载下拉框
            this.selectedData = {
              customerName: '',
              callName: '',
              categoryName: '',
              operation: '',
              assess: '',
              createDate: '',
              callContent: ''
            }
            this.isShowModel = true
            break
          case '我的客户资源录入':
            this.getReslists () // 加载下拉框
            this.isShowModel2 = true
            break
          case '导入客户资源':
            this.upCustomer = true
            break
          case '回访信息录入':
            if(selectedData.length == 1){
//              this.selectedData = data[selectedData[0]]
              this.selectedData = selectedData[0]
              if(this.selectedData.categoryName == '' || this.selectedData.categoryName == null){
                this.getReslists2 () // 加载下拉框
                this.isShowModel = true
                this.selectedData.operation = ''
              }else{
                this.showAlert = true
                this.msg = '该条数据已经录入过！'
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
          case '下载客户模版':
            const params = {
              title: ['姓名', '电话', '省份', '来源'],
              key: ['name', 'phone', 'address','source'],
              data: [
                {'name':'张三','phone':'1234568','address':'河南','source':1},
                {'name':'张三','phone':'1234568','address':'河南','source':2},
                {'name':'张三','phone':'1234568','address':'河南','source':3},
                {'name':'张三','phone':'1234568','address':'河南','source':4},
                {'name':'张三','phone':'1234568','address':'河南','source':5},
                {'name':'张三','phone':'1234568','address':'河南','source':6},
                {'name':'张三','phone':'1234568','address':'河南','source':'查看来源管理'}
              ],
              autoWidth: true,
              filename: '模版'
            }
            excel.export_array_to_excel(params)
            break
        }
      },
      handleSuccess2 (response, file, fileList) {
        if(response.result=='1'){
          this.upCustomer = false
          this.$Message.success('上传成功！');
          this.getRoles('');
          this.$refs['pages'].currentPage = 1;
        }else{
          this.$Message.error('上传失败！');
        }
      },
      submit () {
        if(this.title == '回访信息录入'){
          let submitData = {}
          let {
            categoryName,operation,assess,callContent,categoryId,id
          } = JSON.parse(JSON.stringify(this.selectedData));
          submitData = {
            categoryName,operation,assess,callContent,categoryId,id
          }
          console.log(submitData)
          if(submitData.categoryId == 0 || submitData.categoryId == null){
            this.showAlert = true
            this.msg = '请选择标签'
            return
          }
          let vaildData = {
            categoryId: '请选择标签',
            operation: '请选择客户状态',
            assess: '请输入对客户的评价',
            callContent: '请输入回访内容'
          }
          //验证数据
          for (var key in vaildData) {
            if(submitData[key] === null ||submitData[key] === '' || submitData[key] === undefined){
              console.log(submitData[key] + '--' + key)
              this.showAlert = true
              this.msg = vaildData[key]
              return
            }
          }
          //验证是否存在该角色
          (async function(){
            this.axios.request({
              data: submitData,
              url: '/callInfo/insertCallMessage',
              method: 'post'
            }).then(res => {
              if(res.data.result == 1){
                this.isShowModel = false
                this.$Message.success('回访信息录入成功！');
                this.getRoles('');
                this.$refs['pages'].currentPage = 1;
              }else{
                this.$Message.error(res.data.msg);
              }
            }).catch(err =>{
              this.$Message.error('回访信息录入失败！');
            })
          }.bind(this))()
        }else if(this.title == '我的客户资源录入'){
          let submitData = {}
          submitData.name = this.name
          submitData.phone = this.phone
          submitData.address = this.address
          submitData.sourceId = this.sourceId
          submitData.source = this.sourceName
          console.log(submitData)
          let vaildData = {
            name: '姓名',
            phone: '电话',
            address: '省份',
            source: '来源'
          }
          //验证数据
          for (var key in vaildData) {
            if(submitData[key] === null || submitData[key] === '' || submitData[key] === undefined){
              console.log(submitData[key] + '--' + key)
              this.showAlert = true
              this.msg = '请输入'+vaildData[key]
              return
            }
          }
          //验证是否存在该角色
          (async function(){
            this.axios.request({
              data: submitData,
              url: '/customerInfo/insertMyCustomer',
              method: 'post'
            }).then(res => {
              if(res.data.result == 1){
                this.isShowModel2 = false
                this.$Message.success('我的客户资源录入成功！');
                this.getRoles('');
                this.$refs['pages'].currentPage = 1;
              }else{
                this.$Message.error(res.data.msg);
              }
            }).catch(err =>{
              this.$Message.error('我的客户资源录入失败！');
            })
          }.bind(this))()
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
            url: '/callInfo/deleteEntity',
            method: 'post'
          }).then(res =>{
            if(res.data.result == 1){
              this.$Message.success('删除成功！');
              this.getRoles('')
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
      changePage (current){
        this.pageIndex = current
        this.getRoles()
      },
      getReslists () {
        this.axios.request({
          url: '/source/findAll',
          method: 'post'
        }).then(res =>{
          let parentData = []
          let padata = {}
          padata.id = 0
          padata.sourceName = '---- 请选择 ----'
          parentData.push(padata)
          this.reslists = parentData.concat(res.data.rows)
        }).catch(err =>{
          console.log('网络异常')
        })
      },
      getReslists2 () {
        this.axios.request({
          url: '/category/findAll',
          method: 'post'
        }).then(res =>{
          let parentData = []
          let padata = {}
          padata.id = 0
          padata.categoryName = '---- 请选择 ----'
          parentData.push(padata)
          this.reslists2 = parentData.concat(res.data.rows)
        }).catch(err =>{
          console.log('网络异常')
        })
      },
      changeTime (time){
        this.time = time
      },
      changeVal2(data){
        if(data != null && data.value != 0) {
          this.selectedData.categoryName = data.label
          this.selectedData.categoryId = data.value
        }
      },
      changeVal3(data){
        if(data != null && data.value != '') {
          this.selectedData.operation = data.value
        }
      },
      changeVal(data){
        if(data != null && data.value != 0) {
          this.sourceName = data.label
          this.sourceId = data.value
        }
      },
      changeVal4(data){
        if(data != null && data.value != 0) {
          this.address = data.value
        }
      }

    },
    mounted(){
      this.getRoles();
      this.getReslists2();
    }
  }
</script>

<style scoped lang="less">
  .role{
  .searchArea{
    margin-bottom: 10px;
  }
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
  .row2{
    width: 100%; height: 50px; margin-top: 29px;
  .name{line-height: 32px; width: 12%; text-align: right; float: left;}
  .input{width: 80%; float: left; line-height: 32px;}
  }
  }
  .treeContent{
    height: 300px;
    overflow-y: auto;
  }
</style>
