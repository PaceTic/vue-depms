<template>
  <div class="layout">
    <Row type="flex" justify="end">
      <i-col :xs="layout.left.xs" :sm="layout.left.sm" :md="layout.left.md" :lg="layout.left.lg"  class="layout-menu-left layout-menu-flex-column" :class="{'collapse': layout.leftCollapse, 'theme': !isTheme}">
        <div class="layout-logo-left">{{'MANAGER'}}</div>
        <!-- 增加判断children的hidden属性后 菜单不会默认展开 在此设置open-names展开 -->
        <Menu :theme="theme":active-name="$route.path" :open-names="['系统管理']" width="auto" @on-select="handleMenuClick" class="layout-menu-left-list">
          <div v-for="item in $router.options.routes" :key="item.path">
            <Menu-item v-if="item.leaf && !item.hidden" :name="item.children[0].path">
              <Icon :type="item.iconCls" :size="iconSize"></Icon>
              <span>{{ item.children ? item.children[0].name : item.name }}</span>
            </Menu-item>
            <Submenu v-else-if="!item.leaf && !item.hidden" :name="item.name">
              <template slot="title">
                <Icon :type="item.iconCls" :size="iconSize"></Icon>
                <span>{{ item.name }}</span>
              </template>
              <template v-for="subItem in item.children">
                <Menu-item v-if="!subItem.hidden" :key="subItem.path" :name="subItem.path">
                  <Icon :type="subItem.iconCls" :size="iconSize"></Icon>
                  <span>{{ subItem.name }}</span>
                </Menu-item>
              </template>
            </Submenu>
          </div>
        </Menu>
      </i-col>
      <i-col :xs="getRightPX(layout.left.xs)" :sm="getRightPX(layout.left.sm)" :md="getRightPX(layout.left.md)" :lg="getRightPX(layout.left.lg)" class="layout-menu-right"
      :style="{
        height: `${layout.height}px`
      }">
        <div class="layout-menu-right-body" >
          <div class="layout-header">
            <span class="navBtn">
              <i-button type="text" @click="toggleClick">
                <Icon type="navicon" size="32"></Icon>
              </i-button>
            </span>
            <span class="breadcrumb">
              <Breadcrumb>
                <BreadcrumbItem v-for="(item, index) in breadcrumb" :key="index">
                  <router-link :to="item.path">{{item.name}}</router-link>
                <Icon :type="item.iconCls" :size="iconSize"/>
                </BreadcrumbItem>
              </Breadcrumb>
            </span>
            <div class="head">
              <span style="margin-right:10px;">
                <Tooltip content="主题更换" placement="bottom">
                  <i-switch size="large" v-model="isTheme">
                    <span slot="open">light</span>
                    <span slot="close">dark</span>
                  </i-switch>
                </Tooltip>
              </span>
              <span class="fontUser">欢迎{{user}}</span>
              <Dropdown>
                <img :src="require('@/assets/11.gif')" ><br><br>
                <DropdownMenu slot="list">
                    <DropdownItem>我的消息</DropdownItem>
                    <DropdownItem @click.native="openModel">修改密码</DropdownItem>
                    <DropdownItem @click.native="logout">退出登录</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <!-- <img :src="require('@/assets/logo.png')" width="25%" > -->
            </div>
          </div>
          <div class="layout-content">
            <div class="layout-content-main">
              <router-view></router-view>
            </div>
          </div>
          <div class="layout-copy">
            2017 &copy; depManager
          </div>
        </div>
      </i-col>
    </Row>

    <Modal v-model="pswModel" title="修改密码" width="400px">
      <Form :model="form" :rules="rule" ref="form" :label-width="80">
        <FormItem label="原密码" prop="oldPsw">
          <Input type="password" v-model="form.oldPsw" placeholder="请输入原密码"></Input>
        </FormItem>
        <FormItem label="新密码" prop="newPsw">
          <Input type="password" v-model="form.newPsw" placeholder="请输入密码"></Input>
        </FormItem>
        <FormItem label="确认密码" prop="newPswCheck">
          <Input type="password" v-model="form.newPswCheck" placeholder="请输入密码"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="pwdSubmit('cancel')">取消</Button>
        <Button type="primary" @click="pwdSubmit('submit')">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import debounce from 'throttle-debounce/debounce'
import { updatePsw } from '../api/user'
export default {
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.form.newPswCheck !== '') {
          // 对第二个密码框单独验证
          this.$refs.form.validateField('newPswCheck')
        }
        callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.newPsw) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      user: '',
      pswModel: false,
      isTheme: true,
      theme: 'light',
      layout: {
        // xs, sm, md lg
        left: { xs: 8, sm: 6, md: 4, lg: 4 },
        leftCollapse: false,
        height: 0
      },
      form: {
        oldPsw: '',
        newPsw: '',
        newPswCheck: ''
      },
      rule: {
        oldPsw: [
          { required: true, trigger: 'blur' }
        ],
        newPsw: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        newPswCheck: [
          { required: true, validator: validatePassCheck, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    '$route' (val) {
      this.clearBackground()
    },
    'isTheme' (val) {
      this.theme = val === true ? 'light' : 'dark'
      console.log(val)
    }
  },
  computed: {
    iconSize () {
      return this.layout.leftCollapse ? 24 : 24
    },
    breadcrumb () {
      let routes = this.$route.matched
      let result = routes.map(item => {
        return {
          path: item.path,
          name: item.name
        }
      })
      return result
    }
  },
  methods: {
    logout () {
      sessionStorage.removeItem('user')
      this.$router.push('/')
    },
    getUser (val) {
      this.user = sessionStorage.getItem('userName')
    },
    clearBackground () {
      document.body.style.backgroundImage = 'none'
    },
    getRightPX (left) {
      return 24 - (this.layout.leftCollapse ? 0 : left)
    },
    toggleClick () {
      this.layout.leftCollapse = !this.layout.leftCollapse
    },
    handleMenuClick (path) {
      if (!path) {
        return
      }
      this.$router.push(path)
    },
    calcHeight () {
      let clientHeight = document.documentElement.clientHeight
      this.layout.height = clientHeight
    },
    openModel () {
      this.$refs.form.resetFields()
      this.pswModel = true
    },
    pwdSubmit (type) {
      if (type === 'cancel') {
        this.$refs.form.resetFields()
        this.pswModel = false
      } else {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let para = {
              id: sessionStorage.getItem('id'),
              password: this.form.oldPsw,
              new: this.form.newPsw
            }
            updatePsw(para).then((res) => {
              if (res.ok) {
                this.$Notice.success({title: res.msg})
              } else {
                this.$Notice.error({title: res.msg})
              }
              this.pswModel = false
              this.$refs.form.resetFields()
            }).catch(() => {
              this.$Notice.error({title: '密码修改失败'})
            })
          }
        })
      }
    }
  },
  mounted () {
    let menu = JSON.parse(sessionStorage.getItem('menu'))
    // 根据菜单权限列表设置children的hidden属性
    let routes = this.$router.options.routes
    routes.forEach((item) => {
      if (item.children) {
        item.children.forEach((child) => {
          child.hidden = (menu.indexOf(child.path) === -1)
        })
      }
    })
    this.getUser()
    this.$nextTick(() => {
      this.clearBackground()
      window.addEventListener('resize', debounce(200, this.calcHeight))
      this.calcHeight()
    })
  }
}
</script>
<style lang="scss">
html, body {
  overflow: hidden;
}
section {
  padding: 8px;
}
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  border-radius: 4px;
  height: 100%;
  .layout-menu-left {
    background: #fff;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    overflow: auto;
    z-index: 4;
    transform: translateZ(0);
    visibility: visible;
    &:after {
      content: '';
      display: block;
      width: 1px;
      height: 100%;
      background: #dddee1;
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      z-index: 1;
    }
    &.theme {
      background: #495060;
      color: rgba(255,255,255,.7);
    }
    &.collapse {
      transform: translate3d(-100%, 0, 0);
      visibility: hidden;
    }
    &.layout-menu-flex-column {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }
    .layout-logo-left {
      width: 90%;
      border-radius: 3px;
      height: 60px;
      line-height: 60px;
      font-size: 24px;
      margin: 0 auto;
    }
    .layout-menu-left-list {
      flex: 1;
      overflow:auto;
      &::-webkit-scrollbar {
        display: none!important;
        width: 0!important;
        height: 0!important;
        -webkit-appearance: none;
        opacity: 0!important;
      }
    }
  }
  .layout-menu-right {
    background: #f5f7f9;
    overflow: hidden;
    height: 580px;
    min-height: 500px;
    .layout-menu-right-body {
      height: 100%;
      display: flex;
      flex-direction: column;
      .layout-header {
        width: 100%;
        height: 50px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
      }

      .layout-content {
        position:relative;
        flex:1;
        margin: 15px;
        background: #fff;
        border-radius: 4px;
        overflow:hidden;
        .layout-content-main {
          position: relative;
          height: 100%;
          padding: 10px;
        }
      }

      .layout-copy {
        text-align: center;
        height: 25px;
        padding: 0 0 5px;
        color: #9ea7b4;
      }
    }

  }
}

.layout-ceiling-main a {
  color: #9ba7b5;
}

.ivu-col {
  transition: all .65s cubic-bezier(.23,1,.32,1);
}
.fontUser {
  position: relative;
  font-size: 15px;
  right: 0px
}
.head {
    padding-right: 35px;
    float: right;
    img {
      width: 40px;
      height: 40px;
      border-radius: 20px;
      margin: 5px 0px 10px 10px;
      float: right;
    }
}
.breadcrumb {
  float: left;
  margin-top: 13px
}
.navBtn {
  float: left
}
</style>
