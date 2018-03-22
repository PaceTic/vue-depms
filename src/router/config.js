import Main from './../views/Main'
import Home from './../views/Home'
import Login from './../views/Login'
import NotFound from './../views/404'
import User from './../views/system/User'
import Role from './../views/system/Role'
import Depart from './../views/system/Depart'
import Project from './../views/system/Project'
import jxkh from './../views/system/jxkh'
import jxkhUser from './../views/system/jxkhUser'
import Table from './../views/system/table'
import Train from './../views/system/Train'
import Perform from './../views/system/trainInformation'
import Total from './../views/system/total'
import ScoreRules from './../views/system/scoreRules'
let routes = [
  {
    path: '/home',
    component: Main,
    name: '',
    leaf: true,
    iconCls: 'home',
    children: [
      { path: '/home', name: '首页', iconCls: 'home', component: Home }
    ]
  },
  {
    path: '/main',
    component: Main,
    name: '系统管理',
    iconCls: 'android-settings',
    children: [
      { path: '/users', name: '用户管理', hidden: false, iconCls: 'person', component: User },
      { path: '/roles', name: '角色管理', hidden: false, iconCls: 'person-stalker', component: Role },
      { path: '/departs', name: '部门管理', hidden: false, iconCls: 'ios-people', component: Depart },
      { path: '/scoreRules', name: '绩效评分维护', hidden: false, iconCls: 'settings', component: ScoreRules },
      { path: '/total', name: '月度考核汇总', hidden: false, iconCls: 'flag', component: Total },
      { path: '/train', name: '培训管理', hidden: false, iconCls: 'ios-book', component: Train },
      { path: '/projects', name: '项目管理', hidden: false, iconCls: 'briefcase', component: Project },
      { path: '/table', name: '绩效考核总分表', hidden: false, iconCls: 'document-text', component: Table },
      { path: '/perform', name: '绩效考核工时', hidden: false, iconCls: 'ios-timer', component: Perform }
    ]
  },
  {
    path: '/jxkh',
    hidden: true,
    component: Main,
    leaf: true,
    children: [
      { path: '/jxkh', component: jxkh, name: '绩效考核' }
    ]
  },
  {
    path: '/jxkhUser',
    hidden: true,
    component: Main,
    leaf: true,
    children: [
      { path: '/jxkhUser', component: jxkhUser, name: '绩效考核(项目成员)' }
    ]
  },
  {
    path: '/',
    component: Login,
    name: '登录',
    hidden: true
  },
  {
    path: '/404',
    component: NotFound,
    name: 'NotFound',
    hidden: true
  },
  {
    path: '*',
    hidden: true,
    redirect: { path: '/404' }
  }
]

export default routes
