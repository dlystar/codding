<template>
  <div class="role">
    <!--<div class="searchArea">-->
      <!--<Row type="flex" justify="center" align="middle" class="code-row-bg">-->
        <!--<Col span="7">-->
        <!--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;姓名：<Input v-model="name" style="width: 57%; margin-right: 10px;"/>-->
        <!--</Col>-->
        <!--<Col span="7">-->
        <!--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;电话：<Input v-model="phone" style="width: 57%; margin-right: 10px;"/>-->
        <!--</Col>-->
        <!--<Col span="7">-->
        <!--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;省份：<Input v-model="address" style="width: 57%; margin-right: 10px;"/>-->
        <!--</Col>-->
        <!--<Col span="3">-->

        <!--</Col>-->
      <!--</Row>-->
    <!--</div>-->
    <!--<div class="searchArea">-->
      <!--<Row type="flex" justify="center" align="middle" class="code-row-bg">-->
        <!--<Col span="7">-->
        <!--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;来源：<i-select style="width: 57%; margin-right: 10px;" v-model="sourceId" >-->
        <!--<i-option v-for="item in reslists" :value="item.id" >{{ item.sourceName }}</i-option>-->
      <!--</i-select>-->
        <!--</Col>-->
        <!--<Col span="7">-->
        <!--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;标签：<i-select style="width: 57%; margin-right: 10px;" v-model="categoryName" >-->
        <!--<i-option v-for="item in reslists2" :value="item.categoryName" >{{ item.categoryName }}</i-option>-->
      <!--</i-select>-->
        <!--</Col>-->
        <!--<Col span="7">-->
        <!--客户状态：<i-select style="width: 57%; margin-right: 10px;" v-model="status" >-->
        <!--<i-option v-for="item in reslists3" :value="item.id" >{{ item.name }}</i-option>-->
      <!--</i-select>-->
        <!--</Col>-->
        <!--<Col span="3">-->

        <!--</Col>-->
      <!--</Row>-->
    <!--</div>-->
    <!--<div class="searchArea">-->
      <!--<Row type="flex" justify="center" align="middle" class="code-row-bg">-->
        <!--<Col span="7">-->
        <!--操作者账号：<Input v-model="operationAccount" style="width: 57%; margin-right: 10px;"/>-->
        <!--</Col>-->
        <!--<Col span="7">-->
        <!--录入时间：<DatePicker-->
        <!--@on-change="changeTime"-->
        <!--format="yyyy-MM-dd HH:mm:ss"-->
        <!--type="datetimerange"-->
        <!--style="width: 57%;"-->
        <!--placement="bottom-end"></DatePicker>-->
        <!--</Col>-->
        <!--<Col span="10">-->
        <!--<Button type="primary" @click="getRoles()" v-no-more-click>查询</Button>-->
        <!--</Col>-->
      <!--</Row>-->
    <!--</div>-->
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
          <div class="name">姓名：</div>
          <div class="input">
            <Input placeholder="请输入姓名" v-model="selectedData.name" />
          </div>
        </div>
        <div class="row">
          <div class="name">电话：</div>
          <div class="input">
            <Input placeholder="请输入电话" v-model="selectedData.phone" />
          </div>
        </div>
        <div class="row">
          <div class="name">省份：</div>
          <div class="input">
            <Input placeholder="请输入省份" v-model="selectedData.address" />
          </div>
        </div>
        <div class="row">
          <div class="name">来源：</div>
          <div class="input">
            <i-select v-model="selectedData.sourceId" :label-in-value="true" @on-change="changeVal">
              <i-option v-for="item in reslists" :value="item.id" >{{ item.sourceName }}</i-option>
            </i-select>
          </div>
        </div>
        <div class="row">
          <div class="name">标签：</div>
          <div class="input">
            <i-select v-model="selectedData.categoryId" :label-in-value="true" @on-change="changeVal2">
              <i-option v-for="item in reslists2" :value="item.id" >{{ item.categoryName }}</i-option>
            </i-select>
          </div>
        </div>
        <div class="row2">
          <div class="name">身份证：</div>
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
  import upload from '@/view/components/upload/upload.vue'
  export default {
    name: 'publicResources',
    components:{
      upload
    },
    data() {
      return {
        buttons: this.$store.state.user.currentMenuButtons, //页面按钮
        name: '', //账号
        operationAccount: '',
        status: '',
        categoryName: '',
        sourceId: '',
        address: '',
        phone: '',
        pageIndex: 1,
        pageSize: 10,
        time: '', // 选择时间
        header: [  //表头
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {title: '姓名',key: 'name'},
          {title: '电话',key: 'phone',},
          {title: '省份',key: 'address'},
          {title: '来源',key: 'source'},
          {
            title: '汇总标签',
            key: 'category',
            render: (h, params) => {
              if(params.row.category == null){
                return h('Poptip', {
                  props: {
                    trigger: 'hover',
                    title: 0 + '个标签',
                    placement: 'right'
                  }
                }, [
                  h('Tag', 0)])
              }
              let data = params.row.category.split(",")
              return h('Poptip', {
                props: {
                  trigger: 'hover',
                  title: data.length + '个标签',
                  placement: 'right'
                }
              }, [
                h('Tag', data.length),
                h('div', {
                  slot: 'content',
                  style:{
                    width: '468px'
                  }
                }, [
                  h('span',{
                    style:{
                      width: '468px',
                      'word-wrap': 'break-word',
                      'word-break': 'break-all',
                      'white-space':'pre-wrap !important'
                    }
                  }, params.row.category)
                ])
              ]);
            }
          },
//          {title: '客户状态',key: 'status'},
          {title: '录入时间',key: 'createDate',width:'150px'},
          {title: '录入人',key: 'submitterAccount'},
          {title: '操作人',key: 'operationAccount'},
        ],
        tableData:{}, //表体

        selectedData: {
          name: '',
          phone: '',
          address: '',
          source: '',
          category: '',
          status: '',
          createDate: '',
          submitterAccount: '',
          operationAccount: '',
          sourceId: '',
          categoryId: '',
          cardEnclosure: ''
        }, //选中数据
        selectTableData:[], //表格选中的数据
        isShowModel: false, //显示弹窗变量
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
        sortfield: false,
        sortfieldTree: [],
        avator: [], //头像
        businessName: '客户管理-客户信息',
      }
    },
    methods:{
      tableSelectData (selection){
        this.selectTableData = selection
      },
      getRoles () {
        let data = {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          sortfield: 'create_date'
        }
        this.axios.request({
          data,
          url: '/customerInfo/getPublicCustomerResources',
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
            this.getReslists () // 加载下拉框
            this.selectedData = {
              name: '',
              phone: '',
              address: '',
              source: '',
              category: '',
              status: '',
              createDate: '',
              submitterAccount: '',
              operationAccount: '',
              sourceId: '',
              categoryId: '',
              cardEnclosure: ''
            }
            this.isShowModel = true
            this.businessName = '客户管理-客户信息-新增身份证图片'
            this.avator = []
            break
          case '编辑':
            if(selectedData.length == 1){
              this.isShowModel = true
//              this.selectedData = data[selectedData[0]]
              this.selectedData = selectedData[0]
              this.businessName = '客户管理-客户信息-修改身份证图片'
              if(this.selectedData.cardEnclosure){
                this.avator = [{name:'身份证图片',url:this.selectedData.cardEnclosure}]
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
          case '拉取资源':
            if(selectedData.length > 0){
//              let bodyData = this.$refs.tree.bodyData
//              let selectedData = this.$refs.tree.getCheckedProp()
              let selectedData = this.selectTableData
              let ids = []
              selectedData.forEach(item=> ids.push(item.id))
              let data = {
                ids: ids.join(',')
              }
              this.axios.request({
                data,
                url: '/customerInfo/updateGetRes',
                method: 'post'
              }).then(res => {
                if(res.data.result == 1){
                  this.$Message.success('拉取资源成功！');
                  this.getRoles('');
                  this.$refs['pages'].currentPage = 1;
                }else{
                  this.$Message.error(res.data.msg);
                }
              }).catch(err =>{
                this.$Message.error('拉取资源失败！');
              })
            }else{
              this.showAlert = true
              this.msg = '请选择要拉取的资源！'
            }
            break
          case '刷新':
            this.getRoles();
            break
        }
      },
      submit () {
        let submitData = {}
        let {
          cardEnclosure,name,phone,address,source,id,category,status,createDate,submitterAccount,operationAccount,sourceId,categoryId
        } = JSON.parse(JSON.stringify(this.selectedData));
        submitData = {
          cardEnclosure,name,phone,address,source,id,category,status,createDate,submitterAccount,operationAccount,sourceId,categoryId
        }
        console.log(submitData)
        let vaildData = {
          name: '姓名',
          phone: '电话',
          address: '省份',
          source: '来源'
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
          if(this.title == '新增'){
            this.axios.request({
              data: submitData,
              url: '/customerInfo/addEntity',
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
              url: '/customerInfo/editEntity',
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
            url: '/customerInfo/deleteEntity',
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
      getUploadMessage (file){
        this.selectedData.cardEnclosure = file.url
      },
      changeVal(data){
        if(data.value != 0) {
          this.selectedData.source = data.label
          this.selectedData.sourceId = data.value
        }
      },
      changeVal2(data){
        if(data.value != 0) {
          this.selectedData.category = data.label
          this.selectedData.categoryId = data.value
        }
      },

    },
    mounted(){
      this.getRoles();
      this.getReslists();
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
    width: 100%; margin-top: 10px; height: 60px;
  .name{line-height: 32px; width: 12%; text-align: right; float: left;}
  }
  }
  .treeContent{
    height: 300px;
    overflow-y: auto;
  }
</style>
