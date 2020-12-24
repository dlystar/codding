<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="header">
      <div class="icon"><img src="../../assets/images/login-icon.png" alt=""></div>
      <div class="line"></div>
      <div class="name">后台管理</div>
    </div>
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录后台管理系统" :bordered="false">
        <div class="form-con">
          <login-form v-if="hackReset" @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">请输入用户名和密码</p>
        </div>
      </Card>
    </div>
    <div class="footer">
      	<!-- 违法信息举报：lvxiniu@126.com Copyright &copy; 2020  All Rights Reserved 豫ICP备18087777号 -->
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm
  },
  data () {
    return {
      hackReset : true
    }
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ userName, password }) {
      this.handleLogin({ userName, password }).then(res => {
        this.getUserInfo().then(res => {
          console.log(this.$router)
          this.$router.push({
            name: this.$config.homeName
          })
        })
      },message => {
          this.$Message.error(message)
          this.hackReset = false
          this.$nextTick(() => {
            this.hackReset = true
          })
      })
    }
  }
}
</script>