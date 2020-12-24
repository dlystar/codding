import {
  login,
  logout,
  getUserInfo,
  getMessage,
  getContentByMsgId,
  hasRead,
  removeReaded,
  restoreTrash,
  getUnreadCount,
  getMenuList
} from '@/api/user'
import { setToken, getToken , setUser , getUser } from '@/libs/util'
import routers from '@/router/routers'
import router from '@/router/index'
import Main from '@/components/main'
import { forEach } from '@/libs/tools'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
const staticMenuLen = routers.length
export default {
  state: {
    userName: '',
    userId: '',
    accountName: '',
    avatarImgPath: '',
    token: getToken(),
    access: '',
    hasGetInfo: false,
    unreadCount: 0,
    messageUnreadList: [],
    messageReadedList: [],
    messageTrashList: [],
    messageContentStore: {},
    rows:[],
    currentMenuButtons: [],
    roleNames: '',
    isAdmin: '',
  },
  mutations: {
    setAvatar (state, avatarPath) {
      state.avatarImgPath = baseUrl+avatarPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccountName (state, name){
      state.accountName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setMessageCount (state, count) {
      state.unreadCount = count
    },
    setMessageUnreadList (state, list) {
      list.forEach(item => item.class='')
      state.messageUnreadList = list
    },
    setMessageReadedList (state, list) {
      list.forEach(item => item.class='')
      state.messageReadedList = list
    },
    setMessageTrashList (state, list) {
      list.forEach(item => item.class='')
      state.messageTrashList = list
    },
    updateMessageContentStore (state, { msg_id, content }) {
      state.messageContentStore[msg_id] = content
    },
    moveMsg (state, { from, to, msg_id }) {
      setTimeout(()=>{
        const index = state[from].findIndex(_ => _.msgId === msg_id)
        const msgItem = state[from].splice(index, 1)[0]
        msgItem.loading = false
        state[to].unshift(msgItem)
      },200)
    },
    setRows (state, list){
      //  ;
      state.rows = list
      setUser(list.user)
    },
    //还原静态菜单
    rollBackMenu (state, list){
      let len = routers.length
      routers.splice(staticMenuLen,len-staticMenuLen)
    },
    setCurrentMenuButtons (state, menuName) {
      let menuList = [];
      if(localStorage.menuList) menuList = JSON.parse(localStorage.menuList)
      let menu = {}
      let buttons = []
      function filter(list){
        list.forEach((item,idx)=>{
          if(item.resKey == menuName){
            menu = item
            return false
          }
          if(item.children && item.children.length){
            filter(item.children);
          }
        })
      }
      filter(menuList)
      console.log(menu);
      if(menu.children && menu.children.length){
        menu.children.forEach((item,idx)=>{
          console.log(item.description);
          try{
            if(!item.ishide){
              buttons.push(JSON.parse(item.description))
            }
          }catch(e){
            console.log('button is not a json,please update data')
          }
        })
      }
      state.currentMenuButtons = buttons
    },
    setRoleNames(state, roleNames){
      state.roleNames = roleNames
      state.isAdmin = true
      if(roleNames.indexOf('商户') > -1){
        state.isAdmin = false
      }
      if(roleNames.indexOf('代理人') > -1){
        state.isAdmin = false
      }
    },
  },
  getters: {
    messageUnreadCount: state => state.messageUnreadList.length,
    messageReadedCount: state => state.messageReadedList.length,
    messageTrashCount: state => state.messageTrashList.length
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { userName, password }) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          userName,
          password
        }).then(res => {
          if(res.data.result==0){
            reject(res.data.msg)
            return
          }
          const data = res.data
          console.log(res);
          commit('setToken', data.rows.token);
          commit('setRows', data.rows);
          localStorage.menuList = JSON.stringify(data.rows.list)
          // 将菜单追加到路由信息里面去
          let routerData = []
          forEach(data.rows.list, item => {
            let menu = {}
            menu.path = '/'+item.resUrl;
            menu.name = item.resKey;
            let prop = {};
            prop.icon = item.icon;
            prop.title = item.name;
            prop.id = item.id;
            prop.showAlways= true;
            menu.meta = prop;
            menu.component = Main;
            let children = [];
            forEach(item.children, childrenItem => {
              let temp = {};
              temp.path = childrenItem.resKey;
              temp.name = childrenItem.resKey;
              let prop2 = {};
              prop2.icon = childrenItem.icon;
              prop2.title = childrenItem.name;
              prop2.id = childrenItem.id;
              temp.meta = prop2;
              // temp.component = resolve2 => require([childrenItem.resUrl], resolve2 );
              let filePath = childrenItem.resUrl.replace('@/view','')
              temp.component = resolve2 => require(['@/view' + filePath], resolve2);
              children.push(temp);
            })
            menu.children = children;
            menu.isResgisted = false;
            console.log(menu);
            routerData.push(menu);
            routers.push(menu);
          })
          router.addRoutes(routerData);
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('setToken', '')
          commit('setAccess', [])
          commit('rollBackMenu')
          resolve()
        }).catch(err => {
          reject(err)
        })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          let data = state.rows
          console.log(data)
          if(data.length==0){
            data = getUser();
            // 从持久化里面获取菜单信息
            let menuLists = JSON.parse(localStorage.getItem("menuList"))
            console.log(menuLists)
            // 将菜单追加到路由信息里面去
            let routerData = []
            forEach(menuLists, item => {
              let menu = {}
              menu.path = '/'+item.resUrl;
              menu.name = item.resKey;
              let prop = {};
              prop.icon = item.icon;
              prop.title = item.name;
              prop.showAlways= true;
              menu.meta = prop;
              menu.component = Main;
              let children = [];
              forEach(item.children, childrenItem => {
                let temp = {};
                temp.path = childrenItem.resKey;
                temp.name = childrenItem.resKey;
                let prop2 = {};
                prop2.icon = childrenItem.icon;
                prop2.title = childrenItem.name;
                temp.meta = prop2;
                temp.url = childrenItem.resUrl;
                // temp.component = resolve2 => require([childrenItem.resUrl], resolve2 );
                // temp.component = require([childrenItem.resUrl]).default
                // temp.component = _import(childrenItem.resUrl)
                let filePath = childrenItem.resUrl.replace('@/view','')
                temp.component = resolve2 => require(['@/view' + filePath], resolve2);
                children.push(temp);
              })
              menu.children = children;
              menu.isResgisted = false;
              routerData.push(menu);
              routers.push(menu)
            })
            router.addRoutes(routerData);
            console.log(data)
            commit('setAvatar', data.imageUrl)
            commit('setUserName', data.userName)
            commit('setRoleNames', data.roleName)
            commit('setUserId', data.id)
            commit('setAccountName', data.accountName)
            commit('setAccess', '')
            commit('setHasGetInfo', true)
            data.router = routerData
            resolve(data)
          }else{
            data = data.user;
            commit('setAvatar', data.imageUrl)
            commit('setUserName', data.userName)
            commit('setRoleNames', data.roleName)
            commit('setAccountName', data.accountName)
            commit('setUserId', data.id)
            commit('setAccess', '')
            commit('setHasGetInfo', true)
            resolve(data)
          }
        } catch (error) {
          reject(error)
        }
      })
    },
    // 此方法用来获取未读消息条数，接口只返回数值，不返回消息列表
    getUnreadMessageCount ({ state, commit }) {
      getUnreadCount().then(res => {
        const { data } = res
        commit('setMessageCount', data)
      })
    },
    // 获取消息列表，其中包含未读、已读、回收站三个列表
    getMessageList ({ state, commit }) {
      return new Promise((resolve, reject) => {
        getMessage().then(res => {
          if(res.data.result!=1){
              return
          }
          console.log(res.data.rows)
          const { unread, readed, trash } = res.data.rows
          console.log(unread)
          console.log(readed)
          console.log(trash)
          commit('setMessageUnreadList', unread.sort((a, b) => new Date(b.createTime) - new Date(a.createTime)))
          commit('setMessageReadedList', readed.map(_ => {
            _.loading = false
            return _
          }).sort((a, b) => new Date(b.createTime) - new Date(a.createTime)))
          commit('setMessageTrashList', trash.map(_ => {
            _.loading = false
            return _
          }).sort((a, b) => new Date(b.createTime) - new Date(a.createTime)))
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 根据当前点击的消息的id获取内容
    getContentByMsgId ({ state, commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        let contentItem = state.messageContentStore[msg_id]
        if (contentItem) {
          resolve(contentItem)
        } else {
          getContentByMsgId(msg_id).then(res => {
            if (res.data.result==0) {
              reject(res.data.msg)
              return
            }
            const content = res.data.rows.content
            commit('updateMessageContentStore', { msg_id, content })
            resolve(content)
          })
        }
      })
    },
    // 把一个未读消息标记为已读
    hasRead ({ state, commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        hasRead(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageUnreadList',
            to: 'messageReadedList',
            msg_id
          })
          commit('setMessageCount', state.unreadCount - 1)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 删除一个已读消息到回收站
    removeReaded ({ commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        removeReaded(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageReadedList',
            to: 'messageTrashList',
            msg_id
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 还原一个已删除消息到已读消息
    restoreTrash ({ commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        restoreTrash(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageTrashList',
            to: 'messageReadedList',
            msg_id
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
