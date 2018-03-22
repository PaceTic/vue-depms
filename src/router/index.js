import Vue from 'vue'
import Router from 'vue-router'
import RouterConfig from './config'

Vue.use(Router)
/* export default new Router({
  routes: RouterConfig
}) */
var vueRouter = new Router({
  routes: RouterConfig
})
vueRouter.beforeEach((to, from, next) => {
  if (to.path === '/') {
    sessionStorage.clear()
    // localStorage.clear()
  }
  let user = sessionStorage.getItem('user')
  let menu = JSON.parse(sessionStorage.getItem('menu'))
  let router = ['/users', '/roles', '/total', '/departs', '/projects', '/train', '/perform', '/scoreRules']
  let request = -1
  router.forEach((item) => {
    if (item === to.path) {
      request = 1
    }
  })

  if (!user && to.path !== '/') {
    next({ path: '/' })
  } else if (request > 0) {
    menu.forEach((item) => {
      item === to.path ? next() : next(false)
    })
  } else {
    next()
  }
})
export default vueRouter
