<template>
  <div class="role">
    <div class="searchArea">
      <Row type="flex" justify="center" align="middle" class="code-row-bg">
        <Col span="21">
          创建时间：<DatePicker
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
      :loading="table_loading"
      expand-key="name"
      ref="tree"
      :expand-type="false"
      :columns="header"
      :data="tableData.rows"
      @on-selection-change = "tableSelectData"
    >
      <template slot-scope="{ row, index }" slot="fileUrl">
        <Icon
          title="查看招聘详情"
          style="cursor: pointer; font-size: 20px;"
          type="ios-create-outline"
          @click.native="editContent(row)">
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
      <img v-for="item in imageUrl" :src="item" v-if="visible" style="width: 100%">
    </Modal>
    <Modal title="查看内容" :loading="loading" ok-text = "更新招聘详情" @on-ok="updataContent" width="65%" v-model="showContent">
      <ckeditor :editor="editor" @ready="onReady" v-model="editor2" :config="editorConfig"></ckeditor>
    </Modal>
    <Modal
      width="50%"
      :title="title"
      v-model="isShowModel"
      :mask-closable="false"
    >
      <div class="editArea">
        <div class="row">
          <div class="name">职位名称：</div>
          <div class="input">
            <Input placeholder="请输入职位名称" v-model="selectedData.jobTitle" />
          </div>
        </div>
        <div class="row">
          <div class="name">招聘部门：</div>
          <div class="input">
            <Input placeholder="请输入招聘部门" v-model="selectedData.dept" />
          </div>
        </div>
        <div class="row">
          <div class="name">招聘人数：</div>
          <div class="input">
            <Input placeholder="请输入招聘人数" v-model="selectedData.peopleNumber" />
          </div>
        </div>
        <div class="row">
          <div class="name">工作地点：</div>
          <div class="input">
            <Input placeholder="请输入工作地点" v-model="selectedData.place" />
          </div>
        </div>
        <div class="row">
          <div class="name">排序值：</div>
          <div class="input">
            <Input placeholder="请输入排序值" v-model="selectedData.sort" />
          </div>
        </div>
        <div class="row">
          <div class="name">发布时间：</div>
          <div class="input">
            <DatePicker v-model="time2" @on-change="changeTime2" format="yyyy-MM-dd HH:mm:ss" type="date" :options="options1" placeholder="Select date" style="width: 200px"></DatePicker>
          </div>
        </div>
        <div class="row3">
          <div class="name">招聘详情：</div>
          <div class="input">
            <!-- <Input v-model="selectedData.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入内容" /> -->
            <ckeditor :editor="editor" @ready="onReady" v-model="selectedData.info" :config="editorConfig"></ckeditor>
          </div>
          <div class="clear"></div>
        </div>
      </div>
      <div slot="footer" style="border: none;">
        <Button style="margin-top: 10px;" type="primary" size="large" @click="submit()" v-no-more-click>提交</Button>
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
  import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
  import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn'
  import { setToken, getToken } from '@/libs/util'
  import axios2 from 'axios'
  const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
  export default {
    name: 'recruit',
    components:{
      upload
    },
    data() {
      return {
        table_loading: true,
        editor: DecoupledEditor,
        editorData: '<p>Content of the editor.</p>',
        editorConfig: {
          image: {
            toolbar: [
              'imageStyle:full',
              'imageStyle:side',
              '|',
              'imageTextAlternative'
            ]
          },
          language: 'zh-cn',
          fontSize: {
            options: [8,10,'default',14,16,18,20,22,24,26,28,32,48]
          },
          // fontFamily: {
          //   options: ["宋体","仿宋","微软雅黑","黑体","仿宋_GB2312","楷体","隶书","幼圆"]
          // }
        },
        imageUrl: [],
        loading: true,
        id: '',//更新文章的id
        time2: '',
        editor2:null,//编辑器内容
        selectTableData: '',
        buttons: this.$store.state.user.currentMenuButtons, //页面按钮
        name: '', //账号
        titleId: '',
        contentName: '',
        pageIndex: 1,
        pageSize: 6,
        visible: false,
        showContent: false,
        header: [  //表头
          {
            type: 'selection',
            width: 30,
            align: 'center'
          },
          {title: '职位名称',key: 'jobTitle'},
          {
            title: '招聘部门',
            key: 'dept'
          },
          {title: '招聘人数',key: 'peopleNumber'},
          {title: '工作地点',key: 'place'},
          {title: '发布时间',key: 'createDate'},
          {title: '排序值',key: 'sort'},
//          {
//            title: '招聘详情',
//            key: 'info',
//            render: (h, params) => {
//              let data = params.row.info
//              if(data == null || data ==undefined){
//                return h('div','')
//              }
//              if(data.length>20){
//                return h('Poptip', {
//                  props: {
//                    trigger: 'hover',
//                    title: '',
//                    placement: 'right'
//                  }
//                }, [
//                  h('div', data.substring(0,20)+'...'),
//                  h('div', {
//                    slot: 'content',
//                    style:{
//                      width: '600px'
//                    }
//                  }, [
//                    h('span', {
//                      style:{
//                        width: '600px',
//                        'word-wrap': 'break-word',
//                        'word-break': 'break-all',
//                        'white-space':'pre-wrap !important'
//                      }
//                    },data)
//                  ])
//                ]);
//              }else{
//                return h('div',data)
//              }
//            }
//          },
          {title: '操作',key: 'images',width: '115px',slot:'fileUrl'}
        ],
        tableData:{}, //表体
        time: '', // 选择时间
        selectedData: {
          jobTitle: '', // 导航ID
          dept: '', // 导航名称
          peopleNumber: '', // 内容标题
          place: '', // 阅读量
          sort: '', // 排序值
          createDate: '', // 创建时间
          info: '', // 内容简介
        }, //选中数据
        isShowModel: false, //显示弹窗变量
        showAlert: false, //提示框
        msg: '',  //提示框信息
        title: '修改', //弹窗标题
        reslists: [], //上级导航
        sortfield: false,
        sortfieldTree: [],
        avator: [], //头像
        businessName: '人才招聘-内容列表',
        options1: {
          shortcuts: [
            {
              text: 'Today',
              value () {
                return new Date();
              }
            },
            {
              text: 'Yesterday',
              value () {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24);
                return date;
              }
            },
            {
              text: 'One week',
              value () {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                return date;
              }
            }
          ]
        }
      }
    },
    methods:{
      tableSelectData (selection){
        this.selectTableData = selection
      },
      getRoles () {
        this.table_loading = true
        let data = {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          startDate: this.time[0],
          endDate: this.time[1],
          sortfield: 'sort'
        }
        this.axios.request({
          data,
          url: '/recruit/findByPage',
          method: 'post'
        }).then(res =>{
          this.table_loading = false
          this.tableData = res.data
          this.pageIndex = res.data.pageIndex
        }).catch(err =>{
          this.table_loading = false
          console.log('网络异常')
        })
      },
      changeTime (time){
        this.time = time
      },
      changeTime2 (time){
        this.selectedData.createDate = time+""
      },
      handleView (img){
        this.visible = true
        this.imageUrl = []
        if(img.images == null || img.images == "" || img.images == undefined ){
          this.imageUrl = []
        }else{
          img.images.split(",").forEach(item=> this.imageUrl.push( baseUrl + item) )
        }
//        this.imageUrl = baseUrl + img.images
      },
      showModel (title) {
        this.title = title
//        let data = this.$refs.tree.bodyData
//        let selectedData = this.$refs.tree.getCheckedProp()
        let selectedData = this.selectTableData
        switch(title){
          case '新增':
            this.selectedData = {
              jobTitle: '', // 导航ID
              dept: '', // 导航名称
              peopleNumber: '', // 内容标题
              place: '', // 阅读量
              sort: '', // 排序值
              createDate: '', // 创建时间
              info: '', // 内容简介
            }
            this.isShowModel = true
            break
          case '编辑':
            this.avator = []
            if(selectedData.length == 1){
              this.isShowModel = true
//              this.selectedData = data[selectedData[0]]
              this.selectedData = selectedData[0]
              this.time2 = this.selectedData.createDate
              let reg = new RegExp( 'src="' , "g" )
              this.selectedData.info = this.selectedData.info.replace(reg,'src="'+baseUrl)
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
          jobTitle,dept,peopleNumber,place,sort,createDate,info,id
        } = JSON.parse(JSON.stringify(this.selectedData));
        submitData = {
          jobTitle,dept,peopleNumber,place,sort,createDate,info,id
        }
        console.log(submitData)
        let reg = new RegExp( 'src="'+baseUrl , "g" )
        submitData.info = submitData.info.replace(reg,'src="')
        let vaildData = {
          jobTitle: '请输入职位名称',
          dept: '请输入招聘部门',
          peopleNumber: '请输入招聘人数',
          place: '请输入工作地点',
          sort: '请输入排序值',
          info: '请输入招聘详情'
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
              url: '/recruit/addEntity',
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
              url: '/recruit/editEntity',
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
//          let bodyData = this.$refs.tree.bodyData
//          let selectedData = this.$refs.tree.getCheckedProp()
//          let ids = []
//          selectedData.forEach(item=> ids.push(bodyData[item].id))
          let selectedData = this.selectTableData
          let ids = []
          selectedData.forEach(item=> ids.push(item.id))
          let data = {
            ids: ids.join(',')
          }
          this.axios.request({
            data,
            url: '/recruit/deleteEntity',
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
      changePage (current){
        this.pageIndex = current
        this.getRoles()
      },
      changeVal(data){
//        if(data != null && data.value != 0) {
//          this.selectedData.titleName = data.label
//          this.selectedData.titleId = data.value
//        }
      },
      editContent(data){
        this.showContent = true
        let reg = new RegExp( 'src="' , "g" )
        this.editor2 = data.info.replace(reg,'src="'+baseUrl)
        this.id = data.id
        console.log(data)
      },
      onReady( editor )  {
        console.log(editor)
        // Insert the toolbar before the editable area.
        editor.ui.getEditableElement().parentElement.insertBefore(
          editor.ui.view.toolbar.element,
          editor.ui.getEditableElement()
        );
        editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
//            return {
//                upload: async function () {
//                    return await loader.file.then(f => {
//                        const F = new FileReader();
//                        F.readAsArrayBuffer(f);
//                        return new Promise(resolve => {
//                            F.onload = function () {
//                              return new MyUploadAdapter( loader ,this.businessName,this.id,this);
//                            }
//                        })
//                      }
//
//                    )
//                }
//            }
          return new MyUploadAdapter( loader ,this.businessName,this.id,this);
        };
      },
      updataContent(){
        let reg = new RegExp( 'src="'+baseUrl , "g" )
        let content = this.editor2.replace(reg,'src="')
        console.log(content)
        let data = {
          id:this.id,
          info:content
        }
        this.axios.request({
          data,
          url: '/recruit/editEntity',
          method: 'post'
        }).then(res => {
          if(res.data.result == 1){
            this.showContent = false
            this.loading = false
            this.$Message.success('招聘详情更新成功！');
            this.getRoles('');
            this.$refs['pages'].currentPage = 1;
          }else{
            this.$Message.error(res.data.msg);
          }
        }).catch(err =>{
          this.$Message.error('招聘详情更新失败！');
        })
      }
    },
    mounted(){
      this.getRoles();
    }
  }
  class MyUploadAdapter {
    constructor( loader ,businessName,id,object) {
      // Save Loader instance to update upload progress.
      this.loader = loader;
      this.businessName = businessName;
      this.id = id;
    }
    async upload() {
      const data = new FormData();
      data.append('typeOption', 'upload_image');
      data.append('upload', await this.loader.file);
      data.append('businessName', this.businessName);
      data.append('businessId', this.id);
      console.log(data)
      return new Promise((resolve, reject) => {
        axios2({
          data,
          url: baseUrl+'/admin/uploadImg',
          method: 'post',
          headers:{
            'Authorization' : getToken()
          }
        }).then(res => {
          var resData = res.data;
          resData.default = baseUrl+res.data.rows;
          resolve(resData);
        }).catch(error => {
          reject(error)
        });
      });
    }
    abort() {
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
    .row3{
      width: 100%; height: auto; margin-top: 50px;
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
