<template>
  <section>
    <div class="heads">
      <span class="titles">研发中心员工绩效考核表</span>
      <span class="version">
        <span>当前考核月：</span>
        <Select :value="timeVersion" style="width:100px" @on-change="versionChange">
          <Option v-for="item in this.versionTime" :value="item.beginDate" :key="item.index">{{ item.beginDate }}</Option>
        </Select>
        <Button type="primary" icon="ios-download" @click="exportTotal">导出总表</Button>
      </span>
    </div>
    <Tabs type="card" v-model="value">
      <TabPane label="总体成员绩效" icon="person-stalker" name="total">
        <div class="info">双击用户进入绩效各项得分</div>
        <div class="zongGE">
        <Table :loading="totalLoad"  border  :row-class-name="rowClassName" @on-row-dblclick="choose" :columns='total' :data='totalData' :height="tableTotalHeight" size='small' ref='table'>
        </Table>
        </div>
      </TabPane>
      <TabPane label="个人绩效表" icon="person" name="personal">
        <div class="personalClass">
          <div class="msg">
            <span class="userName">员工姓名：{{this.userName}}</span>
            <span class="time">考核时间：{{this.monthTime}}</span>
          </div>
          <div class="zongGE">
          <Table border :columns='person' :data='personData' size='small' ref='personTable' :height="tablePersonHeight">
          </Table>
          </div>
          <div class="zong">
            <Button type="primary" @click="exportPerson()"><Icon type="ios-download-outline"></Icon>导出绩效考核表</Button>
            <span style="margin-left: 375px">绩效总分：{{this.totalScore}}</span>
          </div>
        </div>
      </TabPane>
      <TabPane label="个人月工作情况" icon="person" name="monthWork">
        <div class="msg">
          <span class="userName">员工姓名：{{this.userName}}</span>
          <span class="time">考核时间：{{this.monthTime}}月</span>
        </div>
        <div class="table">
        <Table highlight-row border  :columns='monthWork' :data='monthWorkData' size='small' :height="tableMonthHeight" ref='table'>
        </Table>
        </div>
        <div class="totalClass">
          <span>总计</span>
          <span style="margin-left:50px">
            <span style="margin-left:30px">预计时长：{{this.totalEstWork}}</span>
            <span style="margin-left:30px">实际时长：{{this.totalRealWork}}</span>
            <span style="margin-left:30px">偏差值：{{this.totalPcValue}}</span>
          </span>
        </div>
      </TabPane>
    </Tabs>
  </section>
</template>
<script>
import { getScore, getTotal, getMonth, checkVersionTime } from './../../api/project'
export default {
  data () {
    return {
      timeVersion: '',
      checkVersion: '',
      versionTime: [],
      tableTotalHeight: '400px',
      tablePersonHeight: '400px',
      tableMonthHeight: '400px',
      monthTime: '',
      user: '',
      userName: '',
      pName: [],
      totalScore: '',
      classNameS: 'demo-table-info-row',
      value: 'total',
      totalLoad: true,
      // 总计
      totalEstWork: '',
      totalRealWork: '',
      totalPcValue: '',
      // 总体绩效
      total: [
        {
          type: 'index',
          align: 'center',
          width: 100
        },
        {
          title: '姓名', align: 'center', key: 'realName'
        },
        {
          title: '所属项目组', align: 'center', key: 'projectName'
        },
        {
          title: '总分', align: 'center', key: 'totalScore', sortable: true, width: 300
        }
        // {
        //   title: '是否完成', align: 'center', key: 'isFinished', width: 150
        // }
      ],
      // 个人绩效
      person: [
        {
          title: '绩效指标', width: '180px', key: 'index'
        },
        {
          title: '指标定义', key: 'definition'
        },
        {
          title: '权重', width: '80px', align: 'center', key: 'weight'
        },
        {
          title: '分值', width: '80px', align: 'center', key: 'score', className: 'demo-table-info-column'
        },
        {
          title: '分项小计', width: '100px', align: 'center', key: 'subTotal'
        },
        {
          title: '备注', align: 'center', key: 'remarks', width: 300
        }
      ],
      // 月工作量
      monthWork: [
        {
          'title': '序号',
          'width': 70,
          align: 'center',
          render: (h, params) => {
            return h('span', {},
             params.index + 1
            )
          }
        },
        {
          title: '任务名称', key: 'taskName'
        },
        {
          title: '预计时长', align: 'center', key: 'estWork', width: '100'
        },
        {
          title: '实际时长', align: 'center', key: 'realWork', width: '100'
        },
        {
          title: '偏差值', align: 'center', key: 'pcValue', width: '100'
        },
        {
          title: '偏差率', align: 'center', key: 'pcRate', width: '100'
        },
        {
          title: '备注', align: 'center', key: 'remark', width: 100
        }
      ],
      monthWorkData: [],
      totalData: [],
      personData: [
        {
          index: '1、工作完成情况',
          definition: '1、考核员工完成任务的速度和质量。 ' + '2、提倡自己跟自己比，勇于挑战难度高的任务。' + '3、根据年度计划分解到月度计划，允许根据实际情况增加临时任务或者取消既定计划，但要在每月第三周之前跟项目经理沟通并确认。' + '4、本项由项目经理考核；未在项目的员工由部门副经理考核。',
          weight: '40%',
          score: '',
          subTotal: '0.00',
          remarks: ''
        },
        {
          index: '2、工作量',
          definition: '考核员工个人工作量。',
          weight: '20%',
          score: '',
          subTotal: '0.00',
          remarks: ''
        },
        {
          index: '3、绩效扣分',
          definition: '研发质量和生产安全、规范制度和工作效率。',
          weight: '15%',
          score: '',
          subTotal: '0.00',
          remarks: ''
        },
        {
          index: '4、绩效加分',
          definition: '培训学习、公司知识库构建、部门知识共享、宣传报道、参与公司集体活动、工作量效率、部门建设。',
          weight: '15%',
          score: '',
          subTotal: '0.00',
          remarks: ''
        },
        {
          index: '5、定性考评（季度）',
          definition: '考评工作能力、态度、团队等方面。未参加项目由部门副经理考核。',
          weight: '10%',
          score: '',
          subTotal: '0.00',
          remarks: ''
        },
        {
          index: '6、培训加分',
          definition: '考评参与培训学习的积极度。',
          weight: '100%',
          score: '',
          subTotal: '0.00',
          remarks: ''
        }
      ]
    }
  },
  methods: {
    versionChange (val) {
      this.versionTime.forEach(item => {
        if (item.beginDate === val) {
          this.checkVersion = item.checkVersion
        }
      })
      // console.log(this.checkVersion)
      this.getTotal()
    },
    choose (val) {
      let para = {
        account: val.account,
        projectId: val.projectId,
        userId: val.userId,
        checkVersion: this.checkVersion
      }
      this.userName = val.realName
      // 个人绩效考核
      getScore(para).then(res => {
        this.personData[0].score = res.score.workScore
        this.personData[1].score = res.score.workloadScore
        this.personData[2].score = res.score.reductScore
        this.personData[3].score = res.score.plusScore
        this.personData[4].score = res.score.qualitativeScore
        this.personData[5].score = res.score.trainScore
        this.personData[0].subTotal = res.workCount
        this.personData[1].subTotal = res.workloadCount
        this.personData[2].subTotal = res.reductCount
        this.personData[3].subTotal = res.plusCount
        this.personData[4].subTotal = res.qualitativeCount
        this.personData[5].subTotal = res.trainCount
        this.personData[1].remarks = res.score.workloadRemark
        this.personData[5].remarks = res.score.trainRemark
        this.totalScore = res.score.totalScore
        this.monthTime = res.monthTime
      })
      this.value = 'personal'
      // 月工作量
      getMonth(para).then(res => {
        if (res.maps) {
          this.monthWorkData = res.maps
          this.monthWorkData.forEach(item => {
            if (item.pcValue > 0) {
              this.$set(item, 'cellClassName', {pcValue: 'demo-table-info-cell-age'})
            }
          })
          this.totalEstWork = res.map2[0].totalEstWork
          this.totalRealWork = res.map2[0].totalRealWork
          this.totalPcValue = res.map2[0].totalPcValue
        }
      })
    },
    exportPerson () {
      location.href = 'api/staff/export/score?checkVersion=' + this.checkVersion + '&date=' + this.monthTime
    },
    exportTotal () {
      let date = this.timeVersion.replace('-', '年') + '月'
      let arr = []
      let manager = []
      let pname = ''
      this.totalData.forEach(item => { // 将同项目组的分为一个数组push到arr
        if (item.projectName !== pname) {
          pname = item.projectName
          arr.push([])
          arr[arr.length - 1].push({name: item.realName, score: item.totalScore})
        } else {
          arr[arr.length - 1].push({name: item.realName, score: item.totalScore})
        }
      })
      arr.forEach(item => { manager.push(item.shift()) }) // 将每个数组的第一位push到manager
      arr.forEach(item => { if (item.length === 0) { arr.splice(arr.indexOf(item), 1) } }) // 如果有空数组则去除
      arr.unshift(manager)
      location.href = 'api/staff/export/monthscore?arr=' + JSON.stringify(arr) + '&date=' + date
      // console.log(arr)
    },
    rowClassName (row, index) {
      for (var i = 0; i < this.pName.length; i++) {
        if (i % 2 === 0) {
          if (row.projectName === this.pName[i]) {
            return 'demo-table-error-row'
          }
        } else {
          if (row.projectName === this.pName[i]) {
            return 'demo-table-info-row'
          }
        }
      }
    },
    getTotal () {
      getTotal({checkVersion: this.checkVersion}).then(res => {
        this.totalData = res.maps
        // console.log(res.maps)
        this.totalData.forEach(item => {
          item.isFinished = item.isFinished === '1' ? '已完成' : '未完成'
        })
        this.pName = Array.from(new Set(this.totalData.map(item => item.projectName)))
        this.totalLoad = false
      })
    }
  },
  mounted () {
    let clientHeight = document.documentElement.clientHeight
    this.tableTotalHeight = clientHeight - this.$refs.table.$el.offsetTop - 200
    this.tablePersonHeight = clientHeight - this.$refs.table.$el.offsetTop - 257
    this.tableMonthHeight = clientHeight - this.$refs.table.$el.offsetTop - 240
    checkVersionTime().then(res => {
      if (res.maps[0]) {
        this.versionTime = res.maps
        // console.log(this.versionTime)
        this.versionTime.forEach(item => {
          item.beginDate = item.beginDate.substring(0, 7)
        })
        this.checkVersion = this.versionTime[0].checkVersion ? this.versionTime[0].checkVersion : ''
        this.timeVersion = this.versionTime[0].beginDate ? this.versionTime[0].beginDate : ''
      }
      this.getTotal()
    })
  }
}
</script>
<style lang="scss">
.heads {
  text-align: center;
  .titles {
    padding-left: 350px;
    font-size: 20px
  }
  .version{
    margin-left: 100px;
  }
}
 .ivu-table .demo-table-info-cell-age {
  color: red
}
.ivu-table td.demo-table-info-column{
  background-color: #2db7f5;
}
.msg {
  font-size: 15px;
}
.userName {
  margin-left: 50px;
}
.time {
  margin-left: 100px;
}
.zong {
  padding-top: 5px;
  display: flex;
  font-size: 16px;
  text-align: center;
}
.totalClass {
  margin-top: 10px;
  text-align: center;
  font-size: 14px
}
.ivu-table .demo-table-info-row td{
  background-color: #CAFF70
}
.ivu-table .demo-table-error-row td{
  background-color: #C6E2FF
}
.zongGE {
  tr.ivu-table-row-hover td {
    background-color: rgba(146, 231, 77, 0.75);
  }
}
.info {
  margin-top: -10px;
  color: #2db7f5;
  font-size: 13px;
  text-align: right
}
.table {
  tr.ivu-table-row-highlight td {
    background-color: rgba(146, 231, 77, 0.75);
  }
  tr.ivu-table-row-hover td {
    background-color: rgba(146, 231, 77, 0.75);
  }
  .ivu-table-body {
    height: 250px ;
    overflow: auto;
    overflow-x: hidden
  }
}
</style>
