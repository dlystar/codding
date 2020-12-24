<template>
  <div class="role">
    <div class="searchArea">
      <Row type="flex" justify="center" align="middle" class="code-row-bg">
        <Col span="7">
          客户姓名：<Input v-model="customerName" style="width: 57%; margin-right: 10px;"/>
        </Col>
        <Col span="7">
        订单金额：<InputNumber
          v-model="startMoney"
          :max="999999999"
          :active-change=true
          :formatter="value => `¥ ${value}`.replace(/B(?=(d{3})+(?!d))/g, ',')"
          :parser="value => value.replace(/¥s?|(,*)/g, '')"></InputNumber>&nbsp;～&nbsp;
        <InputNumber
          v-model="endMoney"
          :max="999999999"
          :active-change=true
          :formatter="value => `¥ ${value}`.replace(/B(?=(d{3})+(?!d))/g, ',')"
          :parser="value => value.replace(/¥s?|(,*)/g, '')"></InputNumber>
        </Col>
        <Col span="7">
          提交时间：<DatePicker
        @on-change="changeTime"
        format="yyyy-MM-dd HH:mm:ss"
        type="datetimerange"
        style="width: 57%;"
        placement="bottom-end"></DatePicker>
        </Col>
        <Col span="3">

        </Col>
      </Row>
    </div>
    <div class="searchArea">
      <Row type="flex" justify="center" align="middle" class="code-row-bg">
        <Col span="7">
          成交人员：<Input v-model="dealer" style="width: 57%; margin-right: 10px;"/>
        </Col>
        <Col span="7">
          合同编号：<Input v-model="contractNo" style="width: 57%; margin-right: 10px;"/>
        </Col>
        <Col span="7">
          产品名称：<Input v-model="product" style="width: 57%; margin-right: 10px;"/>
        </Col>
        <Col span="3">

        </Col>
      </Row>
    </div>
    <div class="searchArea">
      <Row type="flex" justify="center" align="middle" class="code-row-bg">
        <Col span="7">
          订单状态：<i-select style="width: 57%; margin-right: 10px;" v-model="status" >
        <i-option v-for="item in reslists3" :value="item.id" >{{ item.name }}</i-option>
      </i-select>
        </Col>
        <Col span="17">
        <!--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-->
        <!--</Col>-->
        <!--<Col span="7">-->
        <!---->
        <!--</Col>-->
        <!--<Col span="3">-->
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
      <template slot-scope="{ row, index }" slot="fileUrl" >
        <Icon
          title="合同附件"
          style="cursor: pointer; font-size: 20px;"
          type="ios-eye-outline"
          @click="handleView(row)">
        </Icon>
      </template>
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
    <Modal title="预览图片" v-model="visible">
      <img :src="imageUrl" v-if="visible" style="width: 100%">
    </Modal>
    <Modal
      scrollable
      width="600"
      :title="title"
      v-model="isShowModel"
      :mask-closable="false"
    >
      <div class="editArea">
        <div class="row">
          <div class="name">合同编号：</div>
          <div class="input">
            <Input placeholder="请输入合同编号" v-model="selectedData.contractNo" />
          </div>
        </div>
        <div class="row">
          <div class="name">购买产品：</div>
          <div class="input">
            <Input placeholder="请输入购买产品" v-model="selectedData.product" />
          </div>
        </div>
        <div class="row">
          <div class="name">产品数量：</div>
          <div class="input">
            <InputNumber :min="1" v-model="selectedData.productNumber"></InputNumber>
          </div>
        </div>
        <div class="row">
          <div class="name">订单金额：</div>
          <div class="input">
            <InputNumber
              v-model="selectedData.orderMoney"
              :max="999999999"
              :active-change=true
              :formatter="value => `¥ ${value}`.replace(/B(?=(d{3})+(?!d))/g, ',')"
              :parser="value => value.replace(/¥s?|(,*)/g, '')"></InputNumber>
          </div>
        </div>
        <div class="row">
        <div class="name">订单状态：</div>
          <div class="input">
            <i-select v-model="selectedData.status" :label-in-value="true" @on-change="changeVal3">
              <i-option v-for="item in reslists3" :value="item.id" >{{ item.name }}</i-option>
            </i-select>
          </div>
        </div>
        <div class="row2">
          <div class="name">合同附件：</div>
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
  import config from '@/config'
  import upload from '@/view/components/upload/upload.vue'
  const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
  export default {
    name: 'order',
    components:{
      upload
    },
    data() {
      return {
        buttons: this.$store.state.user.currentMenuButtons, //页面按钮
        customerName: '',
        startMoney: '',
        endMoney: '',
        dealer: '',
        contractNo: '',
        product: '',
        status: '',
        pageIndex: 1,
        pageSize: 10,
        time: '', // 选择时间
        visible: false,
        header: [  //表头
          {
            type: 'selection',
            width: '30px',
            align: 'center'
          },
          {title: '客户姓名',key: 'customerName',width: '90px'},
          {title: '成交人',key: 'dealer',width: '80px'},
//          {title: '提交人',key: 'submitterAccount',width: '80px'},
          {title: '合同编号',key: 'contractNo',width: '160px'},
          {
              title: '购买产品',
              key: 'product',
              width: '90px',
              render: (h, params) => {
                let data = params.row.product
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
          {title: '产品数量',key: 'productNumber',width: '90px'},
          {title: '订单金额',key: 'orderMoney',width: '90px'},
          {
            title: '订单状态',
            key: 'status',
            render: (h, params) => {
              if(params.row.status == 0){
                return h('div',"待录入")
              }else if(params.row.status == 1){
                return h('div',"已完成")
              }
            },
            align: 'center',
            width: '90px'
          },
          {title: '创建时间',key: 'createDate',width:'150px'},
          {
              title: '完成时间',
              key: 'updateDate',
              render: (h, params) => {
                if(params.row.status == 0){
                  return h('div',"")
                }else if(params.row.status == 1){
                  return h('div',params.row.updateDate)
                }
              },
              width:'150px'
          },
          {title: '合同附件',slot:'fileUrl',key: 'contractEnclosure',width: '90px'}
        ],
        tableData:{}, //表体
        selectTableData:[], //表格选中的数据
        selectedData: {
          customerName: '',
          dealer: '',
          submitterAccount: '',
          contractNo: '',
          product: '',
          productNumber: 0,
          orderMoney: 0,
          status: '',
          contractEnclosure: ''
        }, //选中数据
        isShowModel: false, //显示弹窗变量
        showAlert: false, //提示框
        msg: '',  //提示框信息
        title: '修改', //弹窗标题
        reslists: [], //上级导航
        reslists2: [],
        reslists3: [ // 0、待录入，1、已完成
          {'id':'','name':'---- 请选择 ----'},
          {'id':0,'name':'待录入'},
          {'id':1,'name':'已完成'}
        ],
        sortfield: '',
        sortfieldTree: [],
        avator: [], //合同附件
        businessName: '订单管理-订单列表',
      }
    },
    methods:{
      tableSelectData (selection){
        this.selectTableData = selection
      },
      getRoles () {
        let data = {
          customerName: this.customerName,
          startMoney: this.startMoney,
          endMoney: this.endMoney,
          dealer: this.dealer,
          contractNo: this.contractNo,
          product: this.product,
          status: this.status,
          startDate: this.time[0],
          endDate: this.time[1],
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          sortfield: 'create_date'
        }
        this.axios.request({
          data,
          url: '/order/findByPage',
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
            this.selectedData = {
              customerName: '',
              dealer: '',
              submitterAccount: '',
              contractNo: '',
              product: '',
              productNumber: '',
              callContent: '',
              orderMoney: '',
              status: '',
              contractEnclosure: ''
            }
            this.isShowModel = true
            break
          case '订单录入':
            if(selectedData.length == 1){

              this.isShowModel = true
//              this.selectedData = data[selectedData[0]]
              this.selectedData = selectedData[0]
              this.businessName = '订单管理-订单列表-合同附件'
              if(this.selectedData.contractEnclosure){
                this.avator = [{name:'合同附件',url:this.selectedData.contractEnclosure}]
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
        }
      },
      submit () {
        let submitData = {}
        let {
          contractNo,product,productNumber,orderMoney,status,id,contractEnclosure
        } = JSON.parse(JSON.stringify(this.selectedData));
        submitData = {
          contractNo,product,productNumber,orderMoney,status,id,contractEnclosure
        }
        let vaildData = {
          contractNo: '请输入合同号',
          product: '请输入购买产品',
          productNumber: '请输入购买产品数量',
          orderMoney: '请输入合同金额',
          status: '请选择订单状态'
        }
        //验证数据
        for (var key in vaildData) {
          if(submitData[key] === '' || submitData[key] === undefined){
            console.log(submitData[key] + '--' + key)
            this.showAlert = true
            this.msg = vaildData[key]
            return
          }
        }
        (async function(){
          if(this.title == '订单录入'){
            this.axios.request({
              data: submitData,
              url: '/order/editEntity',
              method: 'post'
            }).then(res => {
              if(res.data.result == 1){
                this.isShowModel = false
                this.$Message.success('订单录入成功！');
                this.getRoles('');
                this.$refs['pages'].currentPage = 1;
              }else{
                this.$Message.error(res.data.msg);
              }
            }).catch(err =>{
              this.$Message.error('订单录入失败！');
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
            url: '/order/deleteEntity',
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
      getUploadMessage (file){
        this.selectedData.contractEnclosure = file.url
      },
      changeTime (time){
        this.time = time
      },
      changeVal3(data){
        if(data.value != '') {
          this.selectedData.status = data.value
        }
      },
      handleView (img){
        this.visible = true
        this.imageUrl = baseUrl + img.contractEnclosure
      }

    },
    mounted(){
      this.getRoles();
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
