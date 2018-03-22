<template>
  <div class="trainInfo">
    <div class="row">
      <div>
        <div class="col"><DatePicker type="daterange" placement="bottom-start" placeholder="选择查看数据的时间"  @on-change="timeGet" :value="date" ></DatePicker></div>
        <div class="col"><AutoComplete v-model="nameValue" :data="optionArray" clearable @on-search="handleSearch" style="width:150px" @on-select="search" @on-change="searchChange" placeholder="请输入姓名名或禅道账号"></AutoComplete></div>
        <div class="col">
          <Dropdown >
            <Button :type="assessmentItem === '结束考核' ? 'error' : 'primary'">{{assessmentItem === '结束考核' ? '考核完成情况' : '考核已完成'}}</Button>
            <DropdownMenu slot="list" v-if="assessmentItem === '结束考核'">
              <DropdownItem v-for="items in datas.unAssessment" :key="items.id">
                <Poptip placement="right-start" width="400" trigger="hover" v-if="assessmentItem === '结束考核'">
                  <div @click="stopPropagation" style="width: 100%;height: 100%;padding: 7px 0px 7px 16px;">
                    <div style="width: 80px;height: 100%;display: inline-block;">{{items.name}}</div>
                    <div class="badge"><Badge :count="items.users.length > 9 ? items.users.length : '0' + items.users.length" ></Badge></div>
                  </div>
                  <div slot="content">
                    <Table :columns="columns3" :data="items.users" border width="350" size="small"></Table>
                  </div>
                </Poptip>
              </DropdownItem>
              <DropdownItem v-for="(item,key) in datas.manager" :key="item" v-if="isAdmin">
                <div @click="switchClick(key)" style="width: 100%;height: 100%; padding: 7px 16px;">
                  <div style="width: 80px;height: 20px;display: inline-block;" >{{key === 'isBmjl' ? '部门经理' : '部门副经理'}}</div>
                  <div style="display: inline-block;margin:auto; padding-left:1px;" ><i-switch size="small" :value="item"></i-switch></div>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div class="col">
          <Button type="error" @click="rest = true" v-if="assessmentItem === '结束考核' && isAdmin">重置考核</Button>
        </div>
        <div class="col">
          <Button type="primary" @click="noWorkDis = true" v-if="isAdmin">无工时人员</Button>
        </div>
      </div>
      <div class="colR">
        <Button type="primary" v-if="role === 'bmjl' && assessmentItem === '结束考核'" @click="$router.push('/jxkhUser')">定性评分入口</Button>
        <Button type="primary" v-if="role === 'bmfjl' && assessmentItem === '结束考核'" @click="$router.push('/jxkhUser')" style="margin-right: 10px;">定性评分入口</Button>
        <Button type="primary" @click="jxkhClick" v-if="!isAdmin && assessmentItem === '结束考核' && role !== 'bmjl'" :disabled="getCheckVersion()" >{{role === 'bmfjl' ? '无项目人员绩效评分' : '进入绩效考核'}}</Button>
        <Badge v-if="isAdmin" :count="assessmentItem !== '结束考核' ? assessmentArray.data.length : 0" class-name="blue">
           <Button v-if="isAdmin" :type="assessmentItem !== '结束考核' ? 'primary' : 'error'" @click="assessmentBegin(assessmentItem)" :disabled="datas.uncount ? false : false" >{{assessmentItem === '' ? '开始考核' : assessmentItem}}</Button>   
        </Badge>
      </div>
      <Modal width="300px" v-model="assessmentModal" class-name="mymodal">
        <p slot="header" style="color:#f60;text-align:center">
          <Icon type="information-circled"></Icon>
          <span>警告</span>
        </p>
        <div style="text-align:center">
            <p>是否结束考核</p>
        </div>
        <div slot="footer" style="text-align: center;">
          <Button type="text" @click="assessmentModal = false">取消</Button>
          <Button type="primary" @click="finish">结束</Button>
        </div>
      </Modal>
      <Modal width="300px" v-model="rest" class-name="mymodal">
        <p slot="header" style="color:#f60;text-align:center">
          <Icon type="information-circled"></Icon>
          <span>警告</span>
        </p>
        <div style="text-align:center">
            <p>是否重置考核</p>
        </div>
        <div slot="footer" style="text-align: center;">
          <Button type="text" @click="rest = false">取消</Button>
          <Button type="primary" @click="axiosUrl(2)">重置</Button>
        </div>
      </Modal>
       <Modal
          v-model="noWorkDis"
          title="无工时人员"
          width="400px">
          <Card style="width: 350px" dis-hover>
              <div style="display: flex;justify-content: space-between;">
                <div style="width: 150px; text-align: center" v-for="(items, index) in 3" :key="index">
                  <Tag type="dot" :color="item.able ? 'green' : 'red'" v-for="(item, index) in noWorkDate" :key="index" v-if="index % 3 === items - 1" @click.native="noWorkDate[index].able = !noWorkDate[index].able">{{item.name}}</Tag>
                </div> 
              </div>
              <input type="text" style="position: absolute;top: -99999px;" class="copyContent" :value="noWorkDate.map((element) => element.name)">
          </Card>
          <div slot="footer">
            <i-button type="primary"  @click="copy">复制</i-button>
        </div>
      </Modal>
    </div>
    <div class="row2">
      <Tabs :value="name" @on-click="clickName">
        <TabPane label="工时统计" name="tabOne" >
          <Table  :columns="columns" :data="totalDatas" border @on-row-dblclick="dblclick" :loading="loading" @on-selection-change="select" :row-class-name="rowClassName"></Table>
          <br>
          <h2 style="display: inline-block;color:white;background-color: #2d8cf0;padding: 0 10px;border-radius: 5px;">此页面的工时统计与任务清单可以通过双击切换</h2>
          <Page style="float: right;" :total="datas.pageTotal" v-if="datas.pageTotal" @on-change="pageChange" :page-size="datas.pageSize" :current="datas.currentPage" show-sizer :page-size-opts="[7,10,20,50,100]" show-elevator placement='top' @on-page-size-change="sizeChange"></Page>
        </TabPane>
          <TabPane label="任务清单" name="tabSec">
          <Table no-data-text="很抱歉，没有任务记录"  :columns="columns2" :data="datas2.data" border @on-row-dblclick="dblclick"></Table>
          <br>
          <Page style="float: right;" :total="datas2.pageTotal" @on-change="pageChange2" v-if="datas2.pageTotal" :page-size="datas2.pageSize" :current="datas2.currentPage" show-sizer :page-size-opts="[7,10,20,50,100]" show-elevator placement='top' @on-page-size-change="sizeChange2"></Page>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>
<script>
import {TotalData, WorkData, manager, saveAll, finish, noFinish, Return, returnItBmjl, returnItBmfjl, reset} from './../../api/trainInfo'
export default {
  data () {
    return {
      datas: {totalData: [], pageTotal: 0, currentPage: 1, pageSize: 100, unAssessment: [], uncount: 0, manager: {isBmfjl: 0, isBmjl: 0}},
      arrayBegin: 0,
      arrayEnd: 7,
      totalData: [],
      datas2: {data: [], pageTotal: 0, currentPage: 1, pageSize: 50},
      columns: [
        {width: 60, type: 'selection', align: 'center'},
        {type: 'index', width: 60, align: 'center'},
        {title: '姓名', align: 'center', key: 'realName'},
        {key: 'estWork', align: 'center', renderHeader: this.mRenderHeader},
        {key: 'realWork', align: 'center', renderHeader: this.mRenderHeader},
        {key: 'rate', align: 'center', renderHeader: this.mRenderHeader},
        {title: '打分人', key: 'projectManager', align: 'center', render: this.render}
      ],
      columns2: [
        {title: '姓名', key: 'realName', align: 'center'},
        {title: 'TASK_ID', key: 'taskId', align: 'center', width: 90},
        {title: '任务名', key: 'taskName', align: 'center', width: 450},
        {title: '预计工时', key: 'estWork', align: 'center', width: 90},
        {title: '实际工时', key: 'realWork', align: 'center', width: 90},
        {title: '完成时间', key: 'finishedDate', align: 'center'}
      ],
      columns3: [
        {title: '姓名', key: 'realName', align: 'center'},
        {title: '项目成员', key: 'profile', align: 'center', render: this.render2},
        {title: '项目经理', key: 'isReviewed', align: 'center', render: this.render2},
        {title: '是否回滚', key: 'isReview', align: 'center', render: this.render3}
      ],
      rest: false,
      name: 'tabOne',
      userName: sessionStorage.getItem('userName'),
      date: [],
      icon: {estWork: 'chevron-down', realWork: 'minus-round', rate: 'minus-round'},
      oldColumn: '',
      title: {estWork: '预计工时 ', realWork: '实际工时 ', rate: '对比部门平均工作量 '},
      id: '',
      nameValue: '',
      loading: true,
      modal: false,
      assessmentArray: {
        data: [],
        rate: 0
      },
      fromChild: [],
      assessmentItem: '',
      assessmentModal: false,
      optionArray: [],
      role: sessionStorage.getItem('role'),
      activeConfigNum: '',
      noWorkDate: [],
      noWorkDis: false,
      isAdmin: false
    }
  },
  methods: {
    copy (e) {
      let textItem = document.querySelector('.copyContent')
      let content = this.noWorkDate.map((element) => {
        if (element.able) {
          return element.name
        }
      })
      content = content.filter((element) => element !== undefined)
      textItem.value = content
      textItem.focus()
      textItem.select()
      if (document.execCommand('copy', false, null)) {
        this.$Message.info({
          content: '复制成功',
          duration: 1
        })
      } else {
        this.$Message.info({
          content: '复制失败',
          duration: 1
        })
      }
      this.noWorkDis = false
    },
    rowClassName (row) {
      if (row.realName === this.userName) {
        return 'blue'
      }
    },
    stopPropagation (e) {
      e.stopPropagation()
    },
    switchClick (val) {
      window.event.stopPropagation()
      this.datas.manager[val] = !this.datas.manager[val]
      if (val === 'isBmjl') {
        returnItBmjl()
      } else {
        returnItBmfjl()
      }
    },
    search (val) {
      this.nameValue = val
      for (var i in this.datas.totalData) {
        if (this.datas.totalData[i].realName === this.nameValue) {
          this.datas.currentPage = 1
          this.datas.pageTotal = 1
          this.arrayBegin = i - '0'
          this.arrayEnd = (i - '0') + 1
          this.optionArray = [this.nameValue]
        }
      }
      this.name = 'tabOne'
    },
    searchChange () {
      if (this.nameValue === '') {
        this.datas.currentPage = 1
        this.arrayBegin = 0
        this.arrayEnd = this.datas.pageSize
        this.name = 'tabOne'
        this.optionArray = []
        this.datas.pageTotal = this.datas.totalData.length
        return
      }
    },
    handleSearch () {
      this.optionArray = []
      for (var i in this.datas.totalData) {
        if (this.datas.totalData[i].realName.indexOf(this.nameValue) !== -1 || this.datas.totalData[i].account.indexOf(this.nameValue) !== -1) {
          this.optionArray.push(this.datas.totalData[i].realName)
        }
      }
      if (!this.optionArray.length) {
        this.optionArray = ['查无此人']
      }
    },
    dblclick (data) {
      if (this.id !== data.id) {
        this.id = data.id
        this.datas2.currentPage = 1
        this.axiosUrl(1)
      }
      this.name = this.name === 'tabOne' ? 'tabSec' : 'tabOne'
    },
    clickName (val) {
      this.name = val
    },
    compare (str) {
      var that = this
      return function (a, b) {
        if (!a[str]) {
          return 1
        } else if (!b[str]) {
          return -1
        }
        if (that.icon[str] === 'chevron-up') {
          return parseFloat(a[str]) - parseFloat(b[str])
        } else {
          return parseFloat(b[str]) - parseFloat(a[str])
        }
      }
    },
    timeGet (val) {
      this.date = val
      this.icon = {estWork: 'chevron-down', realWork: 'minus-round', rate: 'minus-round'}
      this.datas.currentPage = 1
      this.arrayBegin = 0
      this.arrayEnd = this.datas.pageSize
      this.loading = true
      this.axiosUrl(0)
      if (this.id) {
        this.datas2.currentPage = 1
        this.axiosUrl(1)
      }
    },
    pageChange (val) {
      this.datas.currentPage = val
      this.arrayBegin = (val - 1) * this.datas.pageSize
      if (val * this.datas.pageSize > this.datas.totalData.length) {
        this.arrayEnd = this.datas.totalData.length
      } else {
        this.arrayEnd = val * this.datas.pageSize
      }
    },
    pageChange2 (val) {
      this.datas2.currentPage = val
      this.axiosUrl(1)
    },
    sizeChange (val) {
      this.datas.pageSize = val
      this.datas.currentPage = 1
      this.arrayBegin = 0
      this.arrayEnd = val > this.datas.totalData.length ? this.datas.totalData.length : val
    },
    sizeChange2 (val) {
      this.datas2.pageSize = val
      this.datas2.currentPage = 1
      this.axiosUrl(1)
    },
    select (val) {
      this.assessmentArray.data = []
      this.assessmentArray.rate = 0
      var strVal = JSON.stringify(val)
      for (var i in this.datas.totalData) {
        if (strVal.indexOf(JSON.stringify(this.datas.totalData[i])) === -1) {
          this.$set(this.datas.totalData[i], '_checked', false)
          this.datas.totalData[i].rate = ''
        } else {
          this.$set(this.datas.totalData[i], '_checked', true)
          this.assessmentArray.data.push(this.datas.totalData[i])
          this.assessmentArray.rate += this.datas.totalData[i].estWork
        }
      }
      this.assessmentArray.rate /= (this.assessmentArray.data.length)
      for (var j in this.assessmentArray.data) {
        var num = (this.assessmentArray.data[j].estWork - this.assessmentArray.rate) / this.assessmentArray.rate * 100
        this.assessmentArray.data[j].rate = num.toFixed(2) + '%'
      }
    },
    mRenderHeader (h, params) {
      return h('div', {
        style: {
          cursor: 'pointer'
        },
        on: {
          click: () => {
            if (!this.datas.totalData.length || (this.nameValue && this.arrayEnd - this.arrayBegin === 1)) { // 判断是否搜索
              return 0
            }
            if (this.oldColumn !== params.column.key) {
              this.icon[this.oldColumn] = 'minus-round'
              this.oldColumn = params.column.key
            }
            this.icon[params.column.key] = this.icon[params.column.key] === 'chevron-down' ? 'chevron-up' : 'chevron-down'
            this.datas.totalData.sort(this.compare(params.column.key))
            this.datas.currentPage = 1
          }
        }
      },
        [
          h('span', this.title[params.column.key]),
          h('i', {
            'class': 'ivu-icon ivu-icon-' + this.icon[params.column.key]
          })
        ])
    },
    render (h, params) {
      var that = this
      return h('div', {
        on: {
          dblclick: (e) => {
            e.stopPropagation()
          }
        }
      }, [
        h('Select', {
          props: {
            value: this.datas.totalData[this.arrayBegin + params.index].managerName
          },
          on: {
            'on-change': (val) => {
              for (var i in params.row.managers) {
                if (params.row.managers[i].realName === val) {
                  manager({account: params.row.account, id: params.row.managers[i].id}).then(() => {
                    noFinish().then((res) => {
                      this.datas.unAssessment = res.data.users
                      this.datas.uncount = 0
                      for (var j in this.datas.unAssessment) {
                        this.datas.uncount += this.datas.unAssessment[j].users.length
                        this.datas.unAssessment[j].users.sort(this.finishSort)
                      }
                    })
                  })
                  this.datas.totalData[this.arrayBegin + params.index].managerName = params.row.managers[i].realName
                }
              }
            }
          }
        }, params.row.managers.map(function (item) {
          return h('Option', {props: {value: item.realName, disabled: !that.isAdmin}}, item.realName)
        }))
      ])
    },
    render2 (h, params) {
      return h('div', {
        style: {
          display: 'flex',
          'justify-content': 'center'
        }
      }, [
        h('img', {
          attrs: {
            height: '24px',
            width: '24px',
            src: require(params.column.key === 'profile' ? (parseInt(params.row.isPlus) && parseInt(params.row.isQuali) && parseInt(params.row.isReduct) ? './../../assets/finish.png' : './../../assets/unfinish.png') : (params.row[params.column.key] === '1' ? './../../assets/finish.png' : './../../assets/unfinish.png'))
          }
        })
      ])
    },
    render3 (h, params) {
      return h('div', {
        style: {
          display: 'flex',
          'justify-content': 'center'
        }}, [h('Button', { on: { click: (e) => {
          e.stopPropagation()
          Return({projectId: params.row.projectId, userId: params.row.id}).then(() => {
            noFinish().then((res) => {
              this.datas.unAssessment = res.data.users
              this.datas.uncount = 0
              for (var j in this.datas.unAssessment) {
                this.datas.uncount += this.datas.unAssessment[j].users.length
                this.datas.unAssessment[j].users.sort(this.finishSort)
              }
            })
          })
        }} }, '回滚')]
      )
    },
    axiosUrl (val) {
      switch (val) {
        case 0: TotalData({beginDate: this.date[0], endDate: this.date[1]}).then(res => {
          this.datas.totalData = res.result
          if (this.isAdmin) {
            this.assessmentArray.data = []
            if (res.needCheck.length) {
              for (let i in this.datas.totalData) {
                if (JSON.stringify(res.needCheck).includes(this.datas.totalData[i].account)) {
                  this.$set(this.datas.totalData[i], '_checked', true)
                  this.assessmentArray.data.push(this.datas.totalData[i])
                }
              }
              this.select(this.assessmentArray.data)
            } else {
              for (let i in this.datas.totalData) {
                this.$set(this.datas.totalData[i], '_checked', true)
                this.assessmentArray.data.push(this.datas.totalData[i])
              }
            }
          } else {
            if (res.needCheck.length) {
              this.datas.totalData = res.result.filter((element) => {
                return JSON.stringify(res.needCheck).includes(element.account)
              })
              this.select(this.datas.totalData)
            }
          }
          let noWorkDate = res.names
          setTimeout(() => {
            this.noWorkDate = []
            noWorkDate.forEach(element => {
              this.noWorkDate.push({name: element, able: true})
            })
          })
          this.arrayEnd = this.datas.totalData.length
          this.activeConfigNum = res.activeConfigNum
          if (res.bmfjl.isBmfjl === '0') {
            this.datas.manager.isBmfjl = false
          } else {
            this.datas.manager.isBmfjl = true
          }
          if (res.bmjl.isBmjl === '0') {
            this.datas.manager.isBmjl = false
          } else {
            this.datas.manager.isBmjl = true
          }
          this.datas.pageTotal = this.datas.totalData.length
          this.datas.unAssessment = res.users
          this.datas.uncount = 0
          for (var j in this.datas.unAssessment) {
            this.datas.uncount += this.datas.unAssessment[j].users.length
            this.datas.unAssessment[j].users.sort(this.finishSort)
          }
          if (this.assessmentItem === '') {
            this.datas2.data = res.worklist
            this.datas2.pageTotal = this.datas2.data.length
            if (res.isBegin === '1') {
              this.assessmentItem = '结束考核'
            } else {
              this.assessmentItem = '开始考核'
            }
          }
          this.search(this.nameValue)
          this.loading = false
          this.$Message.info({content: '数据加载完成', duration: 2})
        })
          break
        case 1:WorkData({beginDate: this.date[0], endDate: this.date[1], pageNumber: this.datas2.currentPage, pageSize: this.datas2.pageSize, uid: this.id}).then(res => {
          this.datas2.data = res.list
          this.datas2.pageTotal = res.pager.recordCount
        })
          break
        case 2: reset({checkVersion: this.datas.unAssessment[0].users[0].checkVersion}).then(res => {
          this.rest = false
          this.$Message.info({
            content: '考核重置成功，1秒后刷新页面',
            duration: 1
          })
          setTimeout(() => {
            location.reload(true)
          }, 1)
        })
      }
    },
    assessmentBegin (val) {
      var that = this
      if (val === '') {
        this.$Message.info({
          content: '请稍等，数据加载中',
          duration: 1
        })
        return
      }
      if (val === '开始考核') {
        if (!this.assessmentArray.data.length) {
          this.$Message.info({
            content: '请先选择考核人员',
            duration: 1
          })
        } else if (this.activeConfigNum !== 1) {
          this.$Message.info({
            content: '当前生效配置数不正常，请管理员进绩效评分维护模块进行维护',
            duration: 3
          })
        } else {
          this.assessmentItem = '结束考核'
          saveAll({workloads: this.assessmentArray.data, beginDate: this.date[0], endDate: this.date[1]})
          this.$Message.info({
            content: '考核已经开始，1秒后跳转到培训界面',
            duration: 1
          })
          setTimeout(function () {
            that.$router.push('/train')
          }, 1000)
        }
      } else {
        this.assessmentModal = true
      }
    },
    finishSort (a, b) {
      if (parseInt(a.isPlus) && parseInt(a.isQuali) && parseInt(a.isReduct)) {
        return 1
      } else if (parseInt(b.isPlus) && parseInt(b.isQuali) && parseInt(b.isReduct)) {
        return -1
      }
    },
    finish () {
      this.assessmentModal = false
      this.$Spin.show({
        render: (h) => {
          return h('div', {
            style: {
              position: 'relative'
            }
          }, [
            h('img', {
              attrs: {
                src: require('./../../assets/loading.gif')
              },
              style: {
                'border-radius': '50%'
              }
            }),
            h('h2', {
              style: {
                color: '#2d8cf0',
                position: 'absolute',
                top: '70%',
                left: '25%',
                'z-index': 10000
              }
            }, '正在处理数据中，请稍等...')
          ])
        }
      })
      setTimeout(() => {
        document.querySelector('.ivu-spin.ivu-spin-fix.ivu-spin-show-text.ivu-spin-fullscreen').style.backgroundColor = 'rgba(0,0,0,0.5)'
      }, 0)
      finish().then(() => {
        localStorage.removeItem('userQuali')
        this.assessmentItem = '开始考核'
        this.$Spin.hide()
        this.datas.unAssessment = []
        this.datas.uncount = 0
      })
    },
    getCheckVersion () {
      if (sessionStorage.getItem('checkVersion') === '0') {
        return true
      } else {
        return false
      }
    },
    jxkhClick () {
      if (this.role === 'xmjl' || this.role === 'bmfjl') {
        this.$router.push('/jxkh')
      } else {
        this.$router.push('/jxkhUser')
      }
    }
  },
  computed: {
    totalDatas () {
      return this.datas.totalData.slice(this.arrayBegin, this.arrayEnd)
    }
  },
  mounted () {
    if (new Date().getMonth() === 0) {
      this.date = [(new Date().getFullYear() - 1) + '-' + 12 + '-' + '01', new Date().getFullYear() + '-1-' + '01']
    } else {
      this.date = [new Date().getFullYear() + '-' + new Date().getMonth() + '-' + '01', new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + '01']
    }
    if (sessionStorage.getItem('isadmin')) {
      this.isAdmin = true
    } else {
      this.isAdmin = false
    }
    if (!this.isAdmin) {
      this.columns3.splice(3)
      this.columns.splice(0, 1)
    }
    this.axiosUrl(0)
    this.$Message.info({content: '加载数据中，请稍等', duration: 2})
  }
}
</script>
<style lang="scss">

.trainInfo{
  margin: 15px;
  height: 100%;
  display: flex;
  flex-direction: column;
  .ivu-tag-text{
      width: 120px;
    }
  .row{
    height: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .col{
      display: inline-block;
      margin-left: 10px;
      .ivu-table-body {
        max-height: 200px;
        overflow-x: hidden;
      }
      .ivu-dropdown-item{
        padding: 0;      
      }
      
      .ivu-switch{
        border: 1px solid red;
        background-color: red;
      }
      .ivu-switch-checked{
        border-color: #5cb85c;
        background-color: #5cb85c;
      }
      .badge{
        margin: 0;
        padding: 0;
        padding-right: 16px;
        display: inline-block;
        position: relative;
      }
      .ivu-badge-count{
        background: #2d8cf0;
      }
    }
    .show{
      display: block;
      position: absolute;
      background-color: red;
      top: -10px;
      left: 25px;
      width: 487px;
      height: 416px;
      z-index: 1;
      border-radius: 5px;
    }
    .colR{
      display: flex;
      align-items: center;
      .blue{
           background: #2d8cf0;
        }
    }
    
  
  }
  .row2{
    flex: 1;
    .ivu-tabs{
      height: 100%;
      .ivu-table-body {
        height: 288px;
        overflow-x: hidden;
      }
      .ivu-table .blue td{
        background-color: rgba($color: #1c2438, $alpha: 0.8);
        color:white;
      }
    }
      .ivu-select-dropdown{
        max-height: 90px;
        
      }
  }
  
}
.mymodal{
  .ivu-modal{
    top:20px;
    left: 900px;
    margin: 0;
   
  }
  .ivu-modal-footer{
      text-align: center;
      border-top: 0;
      padding: 10px 18px;
      
    }
  .ivu-modal-header{
      border-bottom: 0;
      padding: 10px 18px;
      
    }
}

</style>

