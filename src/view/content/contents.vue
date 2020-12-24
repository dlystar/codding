<template>
  <div class="role">
        <div class="searchArea">
          <Row type="flex" justify="center" align="middle" class="code-row-bg">
            <Col span="7">
              标题：<Input v-model="contentName" style="width: 57%; margin-right: 10px;"/>
            </Col>
            <Col span="7">
              导航：<i-select style="width: 57%; margin-right: 10px;" v-model="titleId" :label-in-value="true" @on-change="changeVal">
                <i-option v-for="item in reslists" :value="item.id" >{{ item.titleName }}</i-option>
              </i-select>
            </Col>
            <Col span="7">
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
      expand-key="name"
      ref="tree"
      :expand-type="false"
      :columns="header"
      :data="tableData.rows"
      @on-selection-change = "tableSelectData"
    >
      <template slot-scope="{ row, index }" slot="fileUrl">
        <Icon
          title="预览图片"
          style="cursor: pointer; font-size: 20px;"
          type="ios-eye-outline"
          @click.native="handleView(row)">
        </Icon>&nbsp;&nbsp;&nbsp;&nbsp;
        <Icon
          title="查看内容"
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
    <Modal title="查看内容" :loading="loading" ok-text = "更新文章" @on-ok="updataContent" width="65%" v-model="showContent">
      <ckeditor :editor="editor" @ready="onReady" v-model="editor2" :config="editorConfig"></ckeditor>
    </Modal>
    <Modal
      width="65%"
      :title="title"
      v-model="isShowModel"
      :mask-closable="false"
    >
      <div class="editArea">
        <div class="row">
          <div class="name">标题：</div>
          <div class="input">
            <Input placeholder="请输入内容标题" v-model="selectedData.contentName" />
          </div>
        </div>
        <div class="row">
          <div class="name">选择导航：</div>
          <div class="input">
            <i-select v-model="selectedData.titleId" :label-in-value="true" @on-change="changeVal">
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
          <div class="name">阅读量：</div>
          <div class="input">
            <Input placeholder="请输入导航标识" v-model="selectedData.readCount" />
          </div>
        </div>
        <div class="row">
          <div class="name">发布时间：</div>
          <div class="input">
            <DatePicker v-model="time2" @on-change="changeTime2" format="yyyy-MM-dd HH:mm:ss" type="date" :options="options1" placeholder="Select date" style="width: 200px"></DatePicker>
          </div>
        </div>
        <div class="row2">
          <div class="name">列表图片：</div>
          <div class="input">
            <upload
              v-if="isShowModel"
              :imageList="avator"
              :businessId="selectedData.id"
              :businessName="businessName"
              :maxLen="10"
              v-on:onUploadSuccess="getUploadMessage"
            ></upload>
          </div>
        </div>
        <div class="row">
          <div class="name">内容简介：</div>
          <div class="input">
            <Input v-model="selectedData.contentBrief" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入内容简介" />
          </div>
        </div>
        <div class="row3">
          <div class="name">内容CK：</div>
          <div class="input">
            <!-- <Input v-model="selectedData.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入内容" /> -->
            <ckeditor :editor="editor" @ready="onReady" v-model="selectedData.content" :config="editorConfig"></ckeditor>
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
    name: 'contents',
    components:{
      upload
    },
    data() {
      return {
        editor: DecoupledEditor,
        editorData: '<p>Content of the editor.</p>',
        editorConfig: {
          toolbar:{
            items:[
              'heading',
              '|',
              'alignment',                                                 // <--- ADDED
              'bold',
              'italic',
              'link',
              'bulletedList',
              'numberedList',
              'imageUpload',
              'blockQuote',
              'insertTable',
              'mediaEmbed',
              'undo',
              'redo',
              'tableColumn',
              'tableRow',
              'mergeTableCells',
              'imageStyle:full', 'imageStyle:alignLeft', 'imageStyle:alignRight','fontSize', 'highlight', 'highlight:yellowMarker', 'highlight:greenMarker', 'highlight:pinkMarker', 'highlight:blueMarker', 'fontFamily',
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
        pageSize: 10,
        visible: false,
        showContent: false,
        header: [  //表头
          {
            type: 'selection',
            width: 30,
            align: 'center'
          },
          {title: '所属导航',key: 'titleName'},
          {
              title: '标题',
              key: 'contentName',
              render: (h, params) => {
                let data = params.row.contentName
                if(data == null || data ==undefined){
                  return h('div','')
                }
                if(data.length>20){
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
          {title: '阅读量',key: 'readCount'},
          {title: '排序值',key: 'sort'},
          {title: '发布时间',key: 'createDate'},
          {
              title: '简介',
              key: 'contentBrief',
              render: (h, params) => {
                let data = params.row.contentBrief
                if(data == null || data ==undefined){
                  return h('div','')
                }
                if(data.length>20){
                  return h('Poptip', {
                    props: {
                      trigger: 'hover',
                      title: '',
                      placement: 'right'
                    }
                  }, [
                    h('div', data.substring(0,20)+'...'),
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
          {title: '操作',key: 'images',slot:'fileUrl'}
        ],
        tableData:{}, //表体
        time: '', // 选择时间
        selectedData: {
          titleId: '', // 导航ID
          titleName: '', // 导航名称
          contentName: '', // 内容标题
          readCount: '', // 阅读量
          sort: '', // 排序值
          createDate: '', // 创建时间
          contentBrief: '', // 内容简介
          images: '', // 图片
          content: '' //内容
        }, //选中数据
        isShowModel: false, //显示弹窗变量
        showAlert: false, //提示框
        msg: '',  //提示框信息
        title: '修改', //弹窗标题
        reslists: [], //上级导航
        sortfield: false,
        sortfieldTree: [],
        avator: [], //头像
        businessName: '内容管理-内容列表',
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
        let data = {
          name: this.name,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          titleId: this.titleId == 0 ? null : this.titleId,
          contentName: this.contentName,
          startDate: this.time[0],
          endDate: this.time[1],
          sortfield: 'create_date'
        }
        this.axios.request({
          data,
          url: '/content/findByPage',
          method: 'post'
        }).then(res =>{
          this.tableData = res.data
          this.pageIndex = res.data.pageIndex
        }).catch(err =>{
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
            this.getReslists () // 加载下拉框
            this.selectedData = {
              titleId: '', // 导航ID
              titleName: '', // 导航名称
              contentName: '', // 内容标题
              readCount: '', // 阅读量
              sort: '', // 排序值
              createDate: '', // 创建时间
              contentBrief: '', // 内容简介
              images: '', // 图片
              content: '' //内容
            }
            this.isShowModel = true
            this.businessName = '内容管理-内容列表-新增内容图片'
            this.avator = []
            break
          case '编辑':
            this.avator = []
            if(selectedData.length == 1){
              this.isShowModel = true
//              this.selectedData = data[selectedData[0]]
              this.selectedData = selectedData[0]
              this.time2 = this.selectedData.createDate
              let reg = new RegExp( 'src="' , "g" )
              this.selectedData.content = this.selectedData.content.replace(reg,'src="'+baseUrl)
              this.businessName = '内容管理-内容列表-修改内容图片'
              if(this.selectedData.images){
                //分隔图片
                let images = this.selectedData.images.split(",")
                if(images.length>1){
                  images.forEach(item=> this.avator.push({name:'内容图片',url:item}))
                }else{
                  this.avator = [{name:'内容图片',url:this.selectedData.images}]
                }
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
          titleId,titleName,contentName,readCount,sort,id,createDate,contentBrief,images,content
        } = JSON.parse(JSON.stringify(this.selectedData));
        submitData = {
          titleId,titleName,contentName,readCount,sort,id,createDate,contentBrief,images,content
        }
        console.log(submitData)
        let reg = new RegExp( 'src="'+baseUrl , "g" )
        submitData.content = submitData.content.replace(reg,'src="')
        let vaildData = {
          titleId: '请选择导航',
          contentName: '请输入标题'
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
              url: '/content/addEntity',
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
              url: '/content/editEntity',
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
            url: '/content/deleteEntity',
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
          url: '/title/getAlltitles',
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
        console.log(file)
        console.log(file.isRemove)
        if(file.isRemove != undefined && file.isRemove == 1){ //说明是删除
          this.selectedData.images = file.url
        }else{
          if(this.selectedData.images == null || this.selectedData.images=='' || this.selectedData.images == undefined){
            this.selectedData.images = file.url
          }else{
            this.selectedData.images = this.selectedData.images +","+file.url
          }
        }
      },
      changeVal(data){
        if(data != null && data.value != 0) {
          this.selectedData.titleName = data.label
          this.selectedData.titleId = data.value
        }
      },
      editContent(data){
          this.showContent = true
          let reg = new RegExp( 'src="' , "g" )
          this.editor2 = data.content.replace(reg,'src="'+baseUrl)
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
              content:content
          }
          this.axios.request({
            data,
            url: '/content/editEntity',
            method: 'post'
          }).then(res => {
            if(res.data.result == 1){
              this.showContent = false
              this.loading = false
              this.$Message.success('文章更新成功！');
              this.getRoles('');
              this.$refs['pages'].currentPage = 1;
            }else{
              this.$Message.error(res.data.msg);
            }
          }).catch(err =>{
            this.$Message.error('文章更新失败！');
          })
      }
    },
    mounted(){
      this.getRoles();
      this.getReslists();
//      this.initCKEditor();
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
