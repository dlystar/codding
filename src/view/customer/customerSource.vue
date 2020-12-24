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
          <div class="name">来源名称：</div>
          <div class="input">
            <Input placeholder="请输入来源名称" v-model="selectedData.sourceName" />
          </div>
        </div>
        <div class="row">
          <div class="name">来源网址：</div>
          <div class="input">
            <Input placeholder="请输入来源网址" v-model="selectedData.sourceUrl" />
          </div>
        </div>
        <div class="row">
          <div class="name">关键词：</div>
          <div class="input">
            <Input placeholder="请输入来源关键词" v-model="selectedData.sourceKey" />
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
    name: 'customerSource',
    data() {
      return {
        buttons: this.$store.state.user.currentMenuButtons, //页面按钮
        name: '', //账号
        pageIndex: 1,
        pageSize: 10,
        header: [  //表头
          {title: 'id',key: 'id'},
          {title: '来源名称',key: 'sourceName'},
          {title: '来源网址',key: 'sourceUrl'},
          {title: '来源关键词',key: 'sourceKey'},
        ],
        tableData:{}, //表体

        selectedData: {
          sourceName: '',
          sourceUrl: '',
          sourceKey: ''
        }, //选中数据
        isShowModel: false, //显示弹窗变量
        showAlert: false, //提示框
        msg: '',  //提示框信息
        title: '修改', //弹窗标题
        sortfield: false,
        sortfieldTree: [],
      }
    },
    methods:{
      getRoles () {
        let data = {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          sortfield: ''
        }
        this.axios.request({
          data,
          url: '/source/findByPage',
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
              sourceName: '',
              sourceUrl: '',
              sourceKey: ''
            }
            this.isShowModel = true
            break
          case '编辑':
            if(selectedData.length > 0){
              this.isShowModel = true
              this.selectedData = data[selectedData[0]]
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
          sourceName,id,sourceUrl,sourceKey
        } = JSON.parse(JSON.stringify(this.selectedData));
        submitData = {
          sourceName,id,sourceUrl,sourceKey
        }
        console.log(submitData)
        let vaildData = {
          sourceName: '来源名称'
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
              sourceName: submitData.sourceName,
              id: submitData.id
            },
            url: '/source/isExist',
            method: 'post',
          })
          if(existUser.data.result == 0){
            this.$Message.error(existUser.data.msg)
            return
          }
          if(!existUser.data.rows){
            this.$Message.error('该来源名称已存在！')
            return
          }
          if(this.title == '新增'){
            this.axios.request({
              data: submitData,
              url: '/source/addEntity',
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
              url: '/source/editEntity',
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
            url: '/source/deleteEntity',
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
    },
    mounted(){
      this.getRoles();
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
