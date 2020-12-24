<template>
  <div class="role">
<!--    <div class="searchArea">-->
<!--      <Row type="flex" justify="center" align="middle" class="code-row-bg">-->
<!--        <Col span="2">-->
<!--        角色名：-->
<!--        </Col>-->
<!--        <Col span="8">-->
<!--        <Input v-model="name" style="width: 98%;"/>-->
<!--        </Col>-->
<!--        <Col span="2">-->
<!--        <Button type="primary" @click="getRoles()" v-no-more-click>查询</Button>-->
<!--        </Col>-->
<!--        <Col span="12">-->
<!--        </Col>-->
<!--      </Row>-->
<!--    </div>-->
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
          <div class="name">导航名称：</div>
          <div class="input">
            <Input placeholder="请输入导航名称" v-model="selectedData.titleName" />
          </div>
        </div>
        <div class="row">
          <div class="name">上级导航：</div>
          <div class="input">
            <i-select v-model="selectedData.parentTitleId" :label-in-value="true" @on-change="changeVal">
              <i-option v-for="item in reslists" :value="item.id" >{{ item.titleName }}</i-option>
            </i-select>
          </div>
        </div>
        <div class="row">
          <div class="name">排序值：</div>
          <div class="input">
            <Input placeholder="请输入排序值" v-model="selectedData.sort" />
          </div>
        </div>
        <div class="row">
          <div class="name">导航标识：</div>
          <div class="input">
            <Input placeholder="请输入导航标识" v-model="selectedData.titleKey" />
          </div>
        </div>
        <div class="row2">
          <div class="name">导航图标：</div>
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
    name: 'titles',
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
          {title: '导航名称',key: 'titleName'},
          {title: '父导航名称',key: 'parentTitleName',},
          {title: '排序值',key: 'sort'},
          {title: '导航标识',key: 'titleKey'},
          {title: '导航图标',key: 'imagers'}
        ],
        tableData:{}, //表体

        selectedData: {
          titleName: '',
          parentTitleName: '',
          sort: '',
          titleKey: '',
          imagers: ''
        }, //选中数据
        isShowModel: false, //显示弹窗变量
        showAlert: false, //提示框
        msg: '',  //提示框信息
        title: '修改', //弹窗标题
        reslists: [], //上级导航
        sortfield: false,
        sortfieldTree: [],
        avator: [], //头像
        businessName: '导航管理-新增导航',
      }
    },
    methods:{
      getRoles () {
        let data = {
          name: this.name,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          sortfield: 'sort'
        }
        this.axios.request({
          data,
          url: '/title/findByPage',
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
            this.getReslists () // 加载下拉框
            this.selectedData = {
              name: '',
              roleKey: '',
              description: '',
              state: '',
            }
            this.isShowModel = true
            this.businessName = '导航管理-新增导航-新增导航图标'
            this.avator = []
            break
          case '编辑':
            if(selectedData.length > 0){
              this.isShowModel = true
              this.selectedData = data[selectedData[0]]
              this.businessName = '导航管理-修改导航-修改导航图标'
              if(this.selectedData.imagers){
                this.avator = [{name:'导航图标',url:this.selectedData.imagers}]
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
          titleName,parentTitleName,parentTitleId,sort,id,imagers,titleKey
        } = JSON.parse(JSON.stringify(this.selectedData));
        submitData = {
          titleName,parentTitleName,parentTitleId,sort,id,imagers,titleKey
        }
        console.log(submitData)
        let vaildData = {
          titleName: '导航名称',
          titleKey: '导航标识'
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
              titleName: submitData.titleName,
              id: submitData.id
            },
            url: '/title/isExist',
            method: 'post',
          })
          if(existUser.data.result == 0){
            this.$Message.error(existUser.data.msg)
            return
          }
          if(!existUser.data.rows){
            this.$Message.error('该导航名称已存在！')
            return
          }
          if(this.title == '新增'){
            this.axios.request({
              data: submitData,
              url: '/title/addEntity',
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
              url: '/title/editEntity',
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
            url: '/title/deleteEntity',
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
          url: '/title/getParentTitles',
          method: 'post'
        }).then(res =>{
          let parentData = []
          let padata = {}
          padata.id = 0
          padata.titleName = '---- 请选择 ----'
          parentData.push(padata)
          this.reslists = parentData.concat(res.data.rows)
        }).catch(err =>{
          console.log('网络异常')
        })
      },
      getUploadMessage (file){
        this.selectedData.imagers = file.url
      },
      changeVal(data){
        if(data.value != 0) {
          this.selectedData.parentTitleName = data.label
          this.selectedData.parentTitleId = data.value
        }
      },

    },
    mounted(){
      this.getRoles();
      this.getReslists();
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


