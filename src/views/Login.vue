<template>
  <section>
    <div class="login-container">
      <Form :model="loginForm" ref="loginForm" :rules="ruleValidate">
        <h2 class="title">绩效考核系统</h2>
        <div>
          <FormItem prop="account">
            <i-input type="text" :autofocus="act" v-model="loginForm.account" placeholder="用户名">
              <Icon type="ios-person-outline" slot="prepend"></Icon>
            </i-input>
          </FormItem>
          <FormItem prop="checkPass">
            <i-input type="password" :autofocus="pwd" @keyup.13.native="handleSubmit" v-model="loginForm.checkPass" placeholder="密码">
              <Icon type="ios-locked-outline" slot="prepend"></Icon>
            </i-input>
            <span>
              <Checkbox style="float:right" class="remember" v-model="loginForm.rememberMe">记住密码</Checkbox>
            </span>
          </FormItem>
        </div>
        <FormItem>
          <Button type="primary" style="width:30%" @click="handleReset">重置</Button>
          <Button type="primary" :loading="loading" style="width:30%;float:right"  @click="handleSubmit">登录</Button>
        </FormItem>
      </Form>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
/* import {loginMsg} from './../api/login' */
export default {
  data () {
    return {
      loading: false,
      act: true,
      pwd: false,
      loginForm: {
        account: '',
        checkPass: '',
        rememberMe: false
      },
      ruleValidate: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleReset () {
      this.$refs.loginForm.resetFields()
    },
    handleSubmit () {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          localStorage.setItem('username', this.loginForm.account)
          localStorage.setItem('password', this.loginForm.checkPass)
          localStorage.setItem('rememberMe', this.loginForm.rememberMe)
          axios.post('/api/user/login', {
            username: this.loginForm.account,
            password: this.loginForm.checkPass,
            rememberMe: this.loginForm.rememberMe}
          ).then((res) => {
            console.log(res)
            this.loading = false
            if (res.data.attr !== null) {
              this.$Notice.success({
                title: res.data.msg
              })
              res.data.attr.user.roles.forEach(item => {
                if (item.name.indexOf('admin') !== -1) {
                  sessionStorage.setItem('isadmin', true)
                }
                if (item.name.indexOf('xmjl') !== -1) {
                  sessionStorage.setItem('isxmjl', true)
                }
              })
              sessionStorage.setItem('menu', JSON.stringify(res.data.attr.menu))
              sessionStorage.setItem('role', res.data.attr.user.roles[0].name)
              sessionStorage.setItem('checkVersion', res.data.attr.user.checkVersion)
              sessionStorage.setItem('userName', res.data.attr.user.realName)
              sessionStorage.setItem('user', res.data.attr.user.name)
              sessionStorage.setItem('id', res.data.attr.user.id)
              if (res.data.attr.user.project) {
                sessionStorage.setItem('projectId', res.data.attr.user.project.id)
                sessionStorage.setItem('projectName', res.data.attr.user.project.name)
              }
              sessionStorage.setItem('token', res.data.attr.at)
              sessionStorage.setItem('account', res.data.attr.user.account)
              this.$router.push('/home')
            } else {
              this.$Notice.error({
                title: res.data.msg
              })
            }
          })
        } else {
          this.$Notice.error({
            title: '提交错误'
          })
        }
      })
    },
    setLoginBackground () {
      document.body.style.backgroundImage = 'url(../../static/images/bg.jpg)'
      document.body.style.backgroundSize = '100% 200%'
    }
  },
  mounted () {
    this.setLoginBackground()
    if (localStorage.getItem('rememberMe') === 'true') {
      this.loginForm.account = localStorage.getItem('username')
      this.loginForm.checkPass = localStorage.getItem('password')
      this.loginForm.rememberMe = !!localStorage.getItem('rememberMe')
      this.act = false
      this.pwd = true
    } else {
      localStorage.clear()
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  -webkit-animation:fadeIn 3.5s 1;
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
  background-color: #ADD8E6;
  opacity:1;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin-bottom: 20px;
  margin: 100px auto;
  // border: 1px solid #8492A6;
  width: 420px;
  padding: 35px 35px 25px 35px;
  box-shadow: 10px 10px 5px #888888;
  .title {
    font-size: 28px;
    font-family: '微软雅黑';
    margin: 0px auto 40px auto;
    text-align: center;
     color: black;
  }
  .remember {
    margin: 0px 0px -10px 0px;
  }
}
</style>
