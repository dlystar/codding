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
      <template slot="fileUrl" slot-scope="scope">
        <Icon
          title="预览图片"
          style="cursor: pointer; font-size: 20px;"
          type="ios-eye-outline"
          @click.native="handleView(scope.row)">
        </Icon>
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
          <div class="name">显示内容：</div>
          <div class="input">
            <Input placeholder="请输入显示内容" v-model="selectedData.describeContent" />
          </div>
        </div>
        <div class="row">
          <div class="name">选择分类：</div>
          <div class="input">
            <i-select v-model="selectedData.otherClassId" :label-in-value="true" @on-change="changeVal">
              <i-option v-for="item in reslists" :value="item.id" >{{ item.otherClassName }}</i-option>
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
          <div class="name">链接地址：</div>
          <div class="input">
            <Input placeholder="请输入链接地址" v-model="selectedData.linkUrl" />
          </div>
        </div>
        <div class="row2">
          <div class="name">上传图片：</div>
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
        <div class="row3">
          <div class="name">上传视频：</div>
          <div class="input">
            <Upload
              type="drag"
              :headers="headers"
              :on-success="handleSuccess2"
              name="upload"
              :data="{'businessId':'','businessName':'视频上传'}"
              :action="baseUrl2+'/admin/uploadImg'">
              <div style="padding: 20px 0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>点击或将文件拖拽到这里上传</p>
              </div>
            </Upload>
          </div>
          <div class="clear"></div>
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
  import { setToken, getToken } from '@/libs/util'
  const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
  export default {
    name: 'titles',
    components:{
      upload
    },
    data() {
      return {
        headers:{
          'Authorization' : getToken(),
        },
        baseUrl2: baseUrl.replace(/\/$/,''),
        buttons: this.$store.state.user.currentMenuButtons, //页面按钮
        name: '', //账号
        pageIndex: 1,
        pageSize: 6,
        header: [  //表头
          {title: '内容',key: 'describeContent'},
          {title: '链接',key: 'linkUrl'},
          {title: '排序值',key: 'sort'},
          {title: '分类名称',key: 'describe'},
          {title: '图片',key: 'images'},
          {title: '预览',key: 'images',width: '50px',type:'template',template:'fileUrl'}
        ],
        tableData:{}, //表体
        visible: false,
        selectedData: {
          describeContent: '',
          images: '',
          sort: '',
          linkUrl: '',
          describe: ''
        }, //选中数据
        isShowModel: false, //显示弹窗变量
        showAlert: false, //提示框
        msg: '',  //提示框信息
        title: '修改', //弹窗标题
        reslists: [], //上级导航
        sortfield: false,
        sortfieldTree: [],
        avator: [], //头像
        businessName: '其他管理-分类元素管理',
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
          url: '/others/findByPage',
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
              describeContent: '',
              images: '',
              sort: '',
              linkUrl: '',
              describe: ''
            }
            this.isShowModel = true
            this.businessName = '其他管理-分类元素管理-新增元素图片'
            this.avator = []
            break
          case '编辑':
            if(selectedData.length > 0){
              this.isShowModel = true
              this.selectedData = data[selectedData[0]]
              this.businessName = '其他管理-分类元素管理-修改元素图片'
              if(this.selectedData.images){
                this.avator = [{name:'元素图片',url:this.selectedData.images}]
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
          describeContent,images,linkUrl,sort,id,describe,otherClassId
        } = JSON.parse(JSON.stringify(this.selectedData));
        submitData = {
          describeContent,images,linkUrl,sort,id,describe,otherClassId
        }
        console.log(submitData)
        let vaildData = {
          otherClassId: '请选择其他分类'
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
        //验证是否存在该角色
        (async function(){
          if(this.title == '新增'){
            this.axios.request({
              data: submitData,
              url: '/others/addEntity',
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
              url: '/others/editEntity',
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
      handleSuccess2 (response, file, fileList) {
        if(response.result=='1'){
          this.$Message.success('视频上传成功！');
          // 将视频地址赋值到链接地址上面
          this.selectedData.linkUrl = response.rows
        }else{
          this.$Message.error('视频上传失败！');
          this.selectedData.linkUrl = ''
        }
      },
      handleView (img){
        this.visible = true
        this.imageUrl = baseUrl + img.images
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
            url: '/others/deleteEntity',
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
          url: '/otherClass/getAllOtherClass',
          method: 'post'
        }).then(res =>{
          let parentData = []
          let padata = {}
          padata.id = ''
          padata.otherClassName = '---- 请选择 ----'
          parentData.push(padata)
          this.reslists = parentData.concat(res.data.rows)
        }).catch(err =>{
          console.log('网络异常')
        })
      },
      getUploadMessage (file){
        this.selectedData.images = file.url
      },
      changeVal(data){
        if(data.value != '' && data.value != undefined) {
          this.selectedData.describe = data.label
          this.selectedData.otherClassId = data.value
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
  .row3{
    width: 100%; height: auto; margin-top: 30px;
  .name{ height: auto;width: 12%; text-align: right; float: left;}
  .input{width: 80%; float: left; }
  .clear{
    clear: both;
  }
  }
  }
  .treeContent{
    height: 300px;
    overflow-y: auto;
  }
</style>
