<template>
  <div class="user-avatar-dropdown">
    <Dropdown @on-click="handleClick">
        <Badge :dot="!!messageUnreadCount">
            <Avatar :src="userAvatar"/>
        </Badge>
        <Icon :size="18" type="md-arrow-dropdown"></Icon>
        <DropdownMenu slot="list">
            <DropdownItem name="message">
                消息中心<Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>
            </DropdownItem>
            <DropdownItem name="updatePassword">更新密码</DropdownItem>
            <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <span class="userInfo">{{$store.state.user.userName}}：{{$store.state.user.accountName}}</span>
    <Modal
        scrollable
        width="600"
        title="重置密码"
        okText="提交"
        :mask-closable="false"
        v-model="isShowModel"
        @on-ok="updatePassword('formCustom')"
        >
        <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
            <FormItem label="原密码" prop="oldPasswd">
                <Input type="password" v-model="formCustom.oldPasswd"></Input>
            </FormItem>
            <FormItem label="新密码" prop="newPasswd">
                <Input type="password" v-model="formCustom.newPasswd"></Input>
            </FormItem>
            <FormItem label="确认密码" prop="passwdCheck">
                <Input type="password" v-model="formCustom.passwdCheck"></Input>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button size="large" @click="isShowModel=false">取消</Button>
            <Button type="primary" size="large" :loading="loading" @click="updatePassword('formCustom')">提交</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
import './user.less'
// import name from 'vuex'
// console.log(name)
import { mapActions } from 'vuex'
export default {
  name: 'User',
  props: {
    userAvatar: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  data (){
    const validateOldPasswd = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请输入原密码'));
        }else{
            callback();
        }
    };
    const validateNewPasswd = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请输入新密码'));
        }else if(value == this.formCustom.oldPasswd){
            callback(new Error('新密码不能与旧密码重复'));
        }else {
            if (this.formCustom.passwdCheck !== '') {
                // 对第二个密码框单独验证
                this.$refs.formCustom.validateField('passwdCheck');
            }
            callback();
        }
    };
    const validatePassCheck = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请再次输入密码'));
        } else if (value !== this.formCustom.newPasswd) {
            callback(new Error('两次密码输入不一致'));
        } else {
            callback();
        }
    };
    return{
        isShowModel: false,
        loading: false,
        formCustom: {
            oldPasswd: '',
            newPasswd: '',
            passwdCheck: '',
        },
        ruleCustom: {
            oldPasswd: [
                { validator: validateOldPasswd, trigger: 'blur' }
            ],
            newPasswd: [
                { validator: validateNewPasswd, trigger: 'blur' }
            ],
            passwdCheck: [
                { validator: validatePassCheck, trigger: 'blur' }
            ]
        }
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    message () {
      this.$router.push({
        name: 'message_page'
      })
    },
    updatePassword (name){
        this.$refs[name].validate((valid) => {
            if (valid) {
                this.loading = true
                let {userId,accountName} = this.$store.state.user
                let {oldPasswd,newPasswd} = this.formCustom
                let data = {
                    id: userId,
                    accountName: accountName,
                    oldpwd: oldPasswd,
                    password: newPasswd
                }
                this.axios.request({
                    data,
                    url: '/user/editPassword',
                    method: 'post'
                }).then( res =>{
                    this.loading = false
                    console.log(res)
                    if(res.data.result == '1'){
                        this.isShowModel = false
                        this.formCustom = {
                            oldPasswd: '',
                            newPasswd: '',
                            passwdCheck: '',
                        }
                        this.$Message.success('更新密码成功')
                    }else{
                        this.$Message.error(res.data.msg)
                    }
                }).catch(err =>{
                    this.loading = false
                    this.$Message.error('更新密码错误！')
                })
            }else{
                this.loading = false
            }
        })
    },
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout()
            break
        case 'message': this.message()
            break
        case 'updatePassword': this.isShowModel = true
            break
      }
    }
  }
}
</script>
