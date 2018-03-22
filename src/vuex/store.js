import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// 工作完成
let workFormItem = [
  {select: 'stability', title: '代码稳定性', max: 10, min: 0},
  {select: 'normative', title: '代码规范性', max: 15, min: 0},
  {select: 'maintainability', title: '代码可维护性', max: 15, min: 0},
  {select: 'bugNumber', title: '代码bug数量', max: 15, min: 0},
  {select: 'efficiency', title: '工作效率', max: 15, min: 0},
  {select: 'difficulty', title: '难度得分', max: 10, min: 0},
  {select: 'normativeB', title: '文档规范性', max: 5, min: 0},
  {select: 'structural', title: '文档结构性', max: 5, min: 0},
  {select: 'integrality', title: '文档完整性', max: 5, min: 0},
  {select: 'instructive', title: '文档指导性', max: 5, min: 0, placement: 'top-start'},
  {select: 'totalScore', title: '总分', max: 100, min: 0}
]
 // 加分tab
let plusFormItem = [
  {select: 'suggest', title: '合理化建议', max: 5, min: 0},
  // {select: 'study', title: '培训学习', max: 5, min: 0},
  {select: 'setup', title: '公司知识库构建', max: 5, min: 0},
  {select: 'share', title: '部门知识共享', max: 5, min: 0},
  {select: 'propaganda', title: '宣传报道', max: 5, min: 0},
  {select: 'activity', title: '参加公司集体活动', max: 5, min: 0},
  {select: 'workload', title: '工作量', max: 10, min: 0},
  {select: 'build', title: '部门建设', max: 15, min: 0},
  {select: 'encourage', title: '项目实施激励', max: 15, min: 0},
  {select: 'support', title: '深夜维护支持', max: 15, min: 0, placement: 'top-start'}
]
// 减分tab
let reductFormItem = [
  {select: 'productIn', title: '生产系统故障内部', max: 10, min: 0},
  {select: 'productOut', title: '生产系统故障外部', max: 10, min: 0},
  {select: 'integrity', title: '项目文档完整性', max: 3, min: 0},
  {select: 'attendance', title: '考勤管理', max: 10, min: 0},
  {select: 'appearance', title: '仪表仪容', max: 10, min: 0},
  {select: 'discipline', title: '会议纪律', max: 10, min: 0},
  {select: 'reporte', title: '及时填报', max: 10, min: 0},
  {select: 'contract', title: '合同编写', max: 10, min: 0},
  {select: 'ccriticism', title: '公司批评', max: 1, min: 0},
  {select: 'gcriticism', title: '集团批评', max: 2, min: 0},
  {select: 'image', title: '损害公司形象', max: 3, min: 0},
  {select: 'departBuild', title: '对部门建设造成不利影响', max: 2, min: 0},
  {select: 'complaint', title: '其他部门投诉', max: 5, min: 0},
  {select: 'workload', title: '工作量', max: 10, min: 0},
  {select: 'execution', title: '项目执行情况', max: 5, min: 0},
  {select: 'other', title: '其他方面', max: 15, min: 0, placement: 'top-start'}
]
// 定性
let qualiFormItem = [
  {select: 'workDown', title: '工作完成情况', max: 15, min: 0},
  {select: 'uae', title: '理解与执行能力', max: 15, min: 0},
  {select: 'masterSpirit', title: '主人翁精神', max: 10, min: 0},
  {select: 'studySpirit', title: '钻研精神', max: 10, min: 0},
  {select: 'refineOnSpirit', title: '精益求精的精神', max: 10, min: 0},
  {select: 'mainRes', title: '责任主体意识', max: 10, min: 0},
  {select: 'service', title: '服务意识', max: 10, min: 0},
  {select: 'cac', title: '协调与配合', max: 10, min: 0},
  {select: 'groupAct', title: '团队活动', max: 10, min: 0, placement: 'top-start'},
  {select: 'totalScore', title: '总分', max: 100, min: 0}
]
// 用户信息管理
let userData = [
  /* {prop: 'name', label: '用户名', dis: 'pd'},
  {prop: 'realName', label: '真实姓名', dis: 'pd'},
  {prop: 'password', label: '密码', dis: 'pd'},
  {prop: 'confirmPwd', label: '确定密码', dis: 'pd'}, */
  {prop: 'phone', label: '手机号码'},
  {prop: 'officePhone', label: '办公电话'},
  {prop: 'email', label: '邮箱'},
  {prop: 'birth', label: '出生日期'},
  {prop: 'sex', label: '性别'},
  {prop: 'joinDate', label: '入职时间'},
  {prop: 'status', label: '工作状态'},
  {prop: 'netAccount', label: '上网账号'},
  {prop: 'ipAddress', label: 'IP地址'},
  {prop: 'svnAccount', label: 'svn账号'},
  {prop: 'ztAccount', label: '禅道账号'},
  {prop: 'oaAccount', label: 'OA账号'},
  {prop: 'qq', label: 'QQ号'},
  {prop: 'wx', label: '微信号'},
  {prop: 'im', label: '其他IM账号'}
]
const state = {
  workData: workFormItem,
  plusData: plusFormItem,
  reductData: reductFormItem,
  quaData: qualiFormItem,
  userData: userData
}
export default new Vuex.Store({
  state
})
