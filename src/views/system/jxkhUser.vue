<template>
  <div class="main">
    <div class="show">
      <Tabs v-model="curentTab" @on-click="judgeButton">
        <TabPane :label="labelPlus" name="plus" v-if="role === 'ordinary'">
        <Form ref="plusForm" :model="plusForm" :rules="rule">
        <div class="ivu-table-wrapper" style="height: 460px;overflow-y: auto">
          <div class="ivu-table-header">
            <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;" class="ivu-table table">
              <thead>
                <tr>
                  <th class="ivu-table-column-center border">
                    <div class="ivu-table-cell">
                      <span>加分项</span>
                    </div>
                  </th>
                  <th class="ivu-table-column-center border">
                    <div class="ivu-table-cell">
                      <span>得分</span>
                    </div>
                  </th>
                  <th class="ivu-table-column-center">
                    <div class="ivu-table-cell">
                      <span>得分说明</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="ivu-table-tbody">
                <tr class="ivu-table-row" v-for="(item, index) in plusFormItem">
                  <td class="ivu-table-column-center border">
                    <div class="ivu-table-cell">
                      <Poptiprule :title="item.title" :select="item.select" :placement="item.placement" object="plus"></Poptiprule>
                    </div>
                  </td>
                  <td class="ivu-table-column-center border">
                    <div class="ivu-table-cell">
                      <Form-item :prop="item.select" :rules="rule.score">
                        <InputNumber v-if="item.select!=='workload'" v-model="plusForm[item.select]" 
                        :disabled="disable" :max="item.max" :min="item.min"></InputNumber>
                        <InputNumber v-else v-model="plusForm[item.select]" :disabled="true"></InputNumber>
                      </Form-item>
                    </div>
                  </td>
                  <td class="ivu-table-column-center">
                    <div class="ivu-table-cell">
                      <Form-item :prop="item.select" :rules="rule.explain">
                        <Input v-model="plusForm[item.select + 'Explain']" :disabled="disable"></Input>
                      </Form-item>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        </Form>
        </TabPane>

        <TabPane :label="labelReduce" name="reduce" v-if="role === 'ordinary'">
        <Form ref="reduceForm" :model="reduceForm" :rules="rule">
        <div class="ivu-table-wrapper" style="height: 460px;overflow-y: auto">
          <div class="ivu-table-header">
            <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;" class="ivu-table table">
              <thead>
                <tr>
                  <th class="ivu-table-column-center border">
                    <div class="ivu-table-cell">
                      <span>扣分项</span>
                    </div>
                  </th>
                  <th class="ivu-table-column-center border">
                    <div class="ivu-table-cell">
                      <span>扣分</span>
                    </div>
                  </th>
                  <th class="ivu-table-column-center">
                    <div class="ivu-table-cell">
                      <span>扣分说明</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="ivu-table-tbody">
                <tr class="ivu-table-row" v-for="(item, index) in reduceFormItem">
                  <td class="ivu-table-column-center border">
                    <div class="ivu-table-cell">
                      <Poptiprule :title="item.title" :select="item.select" :placement="item.placement" object="reduce"></Poptiprule>
                    </div>
                  </td>
                  <td class="ivu-table-column-center border">
                    <div class="ivu-table-cell">
                      <Form-item :prop="item.select" :rules="rule.score">
                        <InputNumber v-if="item.select!=='workload'" v-model="reduceForm[item.select]" 
                        :disabled="disable" :max="item.max" :min="item.min"></InputNumber>
                        <InputNumber v-else v-model="reduceForm[item.select]" :disabled="true"></InputNumber>
                      </Form-item>
                    </div>
                  </td>
                  <td class="ivu-table-column-center">
                    <div class="ivu-table-cell">
                      <Form-item :prop="item.select" :rules="rule.explain">
                        <Input v-model="reduceForm[item.select + 'Explain']" :disabled="disable"></Input>
                      </Form-item>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        </Form>
        </TabPane>

        <TabPane :label="labelQuali" name="quali">
          <div class="stripe" style="display: flex">
            <div class="ivu-table-wrapper">
              <div style="overflow: visible;" class="ivu-table-header">
                <table style="overflow: visible;" cellspacing="0" cellpadding="0" border="0" class="ivu-table table">
                  <thead>
                    <tr>
                      <th class="ivu-table-column-center border">
                        <div class="ivu-table-cell" style="width: 121px">
                          <span>评分项</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="ivu-table-tbody">
                    <tr class="ivu-table-row" v-for="(item, index) in qualiFormItem">
                      <td class="ivu-table-column-center border">
                        <div class="ivu-table-cell">
                          <Poptiprule :title="item.title" :select="item.select" :placement="item.placement" object="qualitative"></Poptiprule>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="ivu-table-wrapper">
              <div class="ivu-table-header" style="overflow: auto;" :style="{ 'max-width': maxWidth + 'px' }">
                <table cellspacing="0" cellpadding="0" border="0" class="ivu-table table">
                  <thead>
                    <tr>
                      <th v-for="(item, index) in qualitativeData" class="ivu-table-column-center border">
                        <div class="ivu-table-cell">
                          <span>{{ item.userName }}</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="ivu-table-tbody">
                    <tr v-for="(formItem, formindex) in qualiFormItem" class="ivu-table-row">
                      <td v-for="(item, index) in qualitativeData" class="ivu-table-column-center border">
                        <div class="ivu-table-cell">
                          <InputNumber v-if="formItem.select !== 'totalScore'" :disabled="disable"
                          @input="val => afterInput(qualitativeData[index], formItem.select, val)" 
                          :value="qualitativeData[index][formItem.select]"
                          :max="formItem.max" :min="formItem.min"></InputNumber>
                          <InputNumber v-else v-model="qualitativeData[index][formItem.select]" :disabled="true"></InputNumber>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TabPane>

        <span v-if="role === 'original'" slot="extra" style="margin-right:25px">当前项目：{{ pname }}</span>
        <Button slot="extra" style="margin-right:10px" type="primary" :disabled="qualiBtnDisable" @click="save">保存</Button>
        <Button slot="extra" type="primary" :loading="btnLoading"
        :disabled="disable" @click="submit" 
        style="margin-right:25px">提交</Button>
      </Tabs>
    </div>

  </div>
</template>
<script>
import { getStaff, submitPlus, submitReduce, submitQuali, getScore, getQualiScore } from '../../api/performStaff'
import Poptiprule from './Poptiprule'
export default {
  data () {
    const validateScore = (rule, value, callback) => {
      let formName = ''
      if (rule.field in this.plusForm) {
        formName = 'plusForm'
      } else if (rule.field in this.reduceForm) {
        formName = 'reduceForm'
      } else if (rule.field in this.qualitativeForm) {
        formName = 'qualitativeForm'
      } else {
        console.log('error in validate')
      }
      if (this[formName][rule.field] === 0 && this[formName][rule.field + 'Explain'] !== '' && rule.field !== 'workload') {
        callback(new Error('请填写分数'))
      } else {
        callback()
      }
    }
    const validateExplain = (rule, value, callback) => {
      let formName = ''
      if (rule.field in this.plusForm) {
        formName = 'plusForm'
      } else if (rule.field in this.reduceForm) {
        formName = 'reduceForm'
      } else if (rule.field in this.qualitativeForm) {
        formName = 'qualitativeForm'
      } else {
        console.log('error in validate')
      }
      this.$refs[formName].validateField(rule.field)
      if (this[formName][rule.field] !== 0 && this[formName][rule.field + 'Explain'] === '') {
        callback(new Error('请填写说明'))
      } else {
        callback()
      }
    }
    return {
      id: sessionStorage.getItem('id'),
      pid: sessionStorage.getItem('projectId'),
      pname: sessionStorage.getItem('projectName'),
      role: sessionStorage.getItem('role'),

      curentTab: 'plus',
      currentItem: undefined,
      qualitativeData: [],
      signal: {
        plus: '0',
        reduce: '0',
        quali: '0'
      },
      isEdit: true,
      maxWidth: 0,
      disable: true,
      qualiBtnDisable: true,
      btnLoading: false,

      labelPlus: (h) => {
        return h('div', [
          h('span', '加分项'),
          h('Icon', {
            props: {
              type: this.signal.plus !== '0' ? 'checkmark-circled' : ''
            }
          })
        ])
      },
      labelReduce: (h) => {
        return h('div', [
          h('span', '减分项'),
          h('Icon', {
            props: {
              type: this.signal.reduce !== '0' ? 'checkmark-circled' : ''
            }
          })
        ])
      },
      labelQuali: (h) => {
        return h('div', [
          h('span', '定性评分'),
          h('Icon', {
            props: {
              type: this.signal.quali !== '0' ? 'checkmark-circled' : ''
            }
          })
        ])
      },

      data: [],
      rule: {
        score: [{validator: validateScore, trigger: 'change'}],
        explain: [{validator: validateExplain, trigger: 'blur'}]
      },
      plusFormItem: [
        {select: 'suggest', title: '合理化建议', max: 5, min: 0},
        {select: 'setup', title: '公司知识库构建', max: 5, min: 0},
        {select: 'share', title: '部门知识共享', max: 5, min: 0},
        {select: 'propaganda', title: '宣传报道', max: 5, min: 0},
        {select: 'activity', title: '参加公司集体活动', max: 5, min: 0},
        {select: 'workload', title: '工作量', max: 10, min: 0},
        {select: 'build', title: '部门建设', max: 15, min: 0},
        {select: 'encourage', title: '项目实施激励', max: 15, min: 0},
        {select: 'support', title: '深夜维护支持', max: 15, min: 0, placement: 'top-start'}
      ],
      reduceFormItem: [
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
        {select: 'workload', title: '工作量', max: 10, min: 0, placement: 'top-start'},
        {select: 'execution', title: '项目执行情况', max: 5, min: 0, placement: 'top-start'}
      ],
      qualiFormItem: [
        {select: 'workDown', title: '工作完成情况(15分)', max: 15, min: 0},
        {select: 'uae', title: '理解与执行能力(15分)', max: 15, min: 0},
        {select: 'masterSpirit', title: '主人翁精神(10分)', max: 10, min: 0},
        {select: 'studySpirit', title: '钻研精神(10分)', max: 10, min: 0},
        {select: 'refineOnSpirit', title: '精益求精的精神(10分)', max: 10, min: 0},
        {select: 'mainRes', title: '责任主体意识(10分)', max: 10, min: 0},
        {select: 'service', title: '服务意识(10分)', max: 10, min: 0, placement: 'top-start'},
        {select: 'cac', title: '协调与配合(10分)', max: 10, min: 0, placement: 'top-start'},
        {select: 'groupAct', title: '团队活动(10分)', max: 10, min: 0, placement: 'top-start'},
        {select: 'totalScore', title: '总分', max: 100}
      ],
      plusForm: {
        suggest: 0,
        setup: 0,
        share: 0,
        propaganda: 0,
        activity: 0,
        workload: 0,
        build: 0,
        encourage: 0,
        support: 0,
        suggestExplain: '',
        setupExplain: '',
        shareExplain: '',
        propagandaExplain: '',
        activityExplain: '',
        workloadExplain: '',
        buildExplain: '',
        encourageExplain: '',
        supportExplain: ''
      },
      reduceForm: {
        productIn: 0,
        productOut: 0,
        integrity: 0,
        attendance: 0,
        appearance: 0,
        discipline: 0,
        reporte: 0,
        contract: 0,
        ccriticism: 0,
        gcriticism: 0,
        image: 0,
        departBuild: 0,
        complaint: 0,
        workload: 0,
        execution: 0,
        other: 0,
        productInExplain: '',
        productOutExplain: '',
        integrityExplain: '',
        attendanceExplain: '',
        appearanceExplain: '',
        disciplineExplain: '',
        reporteExplain: '',
        contractExplain: '',
        ccriticismExplain: '',
        gcriticismExplain: '',
        imageExplain: '',
        departBuildExplain: '',
        complaintExplain: '',
        workloadExplain: '',
        executionExplain: '',
        otherExplain: ''
      },
      qualitativeForm: {
        workDown: 0,
        uae: 0,
        masterSpirit: 0,
        studySpirit: 0,
        refineOnSpirit: 0,
        mainRes: 0,
        service: 0,
        cac: 0,
        groupAct: 0,
        totalScore: 0
      }
    }
  },
  components: {
    Poptiprule
  },
  methods: {
    afterInput (target, key, value) {
      this.$set(target, key, value)
      let totalScore = 0
      for (let key in this.qualitativeForm) {
        if (key === 'totalScore') continue
        totalScore += target[key]
      }
      this.$set(target, 'totalScore', totalScore)
      this.isEdit = true
    },
    /*
    manualUpload () {
      let params = {pid: this.pid, number: this.workload}
      axios.get('api/staff/upload', {params: params}).then(res => {
        this.modal = false
        if (res.data.ok === true) {
          this.getData()
          this.$Message.success({title: res.data.msg})
        } else {
          this.$Message.error({title: res.data.msg})
        }
      })
    },
    upload (event) {
      let formdata = new FormData()
      formdata.append('file', event.target.files[0])
      formdata.append('pid', this.pid)
      axios({
        url: 'api/staff/upload',
        method: 'post',
        data: formdata,
        headers: {'Content-Type': 'multipart/form-data'}
      }).then((res) => {
        this.modal = false
        if (res.data.ok === true) {
          this.getData()
          this.$Message.success({title: res.data.msg})
        } else {
          this.$Message.error({title: res.data.msg})
        }
      })
    },
    */
    calcIsOverScore (obj) {
      // debugger
      let sum = 0
      Object.values(obj).forEach(score => {
        if (typeof score === 'number') {
          sum += score
        }
      })
      sum -= obj['checkVersion']
      if (sum > 15) {
        this.$Message.warning({content: '您提交的分数已超过上限，将按15分计算', duration: 3})
      }
    },
    save () {
      localStorage.setItem('userQuali', JSON.stringify(this.qualitativeData))
      this.$Message.success('保存成功!')
    },
    fullMarks () {
      this.qualiFormItem.forEach(formItem => {
        this.qualitativeData.forEach(item => {
          if (formItem.max === 15) {
            item[formItem.select] = 12
          } else if (formItem.max === 10) {
            item[formItem.select] = 8
          } else if (formItem.max === 100) {
            item[formItem.select] = 80
          }
        })
      })
      this.$Message.success({
        content: '定性评分已写入默认值，请修改后提交',
        duration: 2
      })
    },
    judgeButton () {
      this.qualiBtnDisable = true
      if (this.curentTab === 'plus') {
        this.disable = (this.signal.plus === '1')
      } else if (this.curentTab === 'reduce') {
        this.disable = (this.signal.reduce === '1')
      } else if (this.curentTab === 'quali') {
        this.disable = (this.signal.quali === '1')
        this.qualiBtnDisable = (this.signal.quali === '1')
      }
    },
    submit () {
      this.btnLoading = true
      if (this.curentTab === 'plus') {
        this.$refs['plusForm'].validate((valid) => {
          if (valid) {
            let params = Object.assign({}, this.plusForm, {projectId: this.pid})
            submitPlus(params).then(res => {
              this.btnLoading = false
              this.getData()
              this.$Message.success('加分项提交成功')
              this.disable = true
              this.calcIsOverScore(this.plusForm)
            })
          } else {
            this.btnLoading = false
          }
        })
      } else if (this.curentTab === 'reduce') {
        this.$refs['reduceForm'].validate((valid) => {
          if (valid) {
            let params = Object.assign({}, this.reduceForm, {projectId: this.pid})
            submitReduce(params).then(res => {
              this.btnLoading = false
              this.getData()
              this.$Message.success('减分项提交成功')
              this.disable = true
              this.calcIsOverScore(this.reduceForm)
            })
          } else {
            this.btnLoading = false
          }
        })
      } else if (this.curentTab === 'quali') {
        if (this.isEdit) {
          submitQuali(this.qualitativeData).then(res => {
            this.btnLoading = false
            this.getData()
            this.$Message.success('定性评分提交成功')
            localStorage.removeItem('userQuali')
            this.disable = true
          })
        } else {
          this.btnLoading = false
          this.$Message.warning('请修改默认值之后再提交')
        }
      } else {
        console.log('error in submit')
      }
    },
    getData () {
      let params = {}
      if (this.role === 'bmfjl' || this.role === 'bmjl') {
        params = {pid: '0'}
      } else {
        params = {pid: this.pid}
      }
      getStaff(params).then(res => {
        console.log(res)
        this.signal.plus = res.result[0].isPlus
        this.signal.reduce = res.result[0].isReduct
        this.signal.quali = res.isfinished
        this.data = res.result
        this.qualitativeData = []
        if (localStorage.getItem('userQuali')) {
          this.qualitativeData = JSON.parse(localStorage.getItem('userQuali'))
          this.$Message.success('导入成功!')
        } else {
          getQualiScore({projectId: this.pid}).then(res => {
            if (this.signal.quali === '0' && res.qualitative.length === 0) {
              this.data.forEach(item => {
                this.qualitativeData.push(Object.assign({},
                  {
                    userId: item.id,
                    projectId: this.pid,
                    userName: item.realName
                  }, this.qualitativeForm))
              })
              this.fullMarks()
              this.isEdit = false
            } else {
              this.qualitativeData = res.qualitative
            }
          })
        }
        this.judgeButton()
        // console.log(this.qualitativeData)
      })
      getScore({uid: this.id}).then((res) => {
        if (res.plus) {
          this.plusForm = res.plus
        }
        if (res.reduct) {
          this.reduceForm = res.reduct
        }
        if (res.workload) {
          let workload = +res.workload.rate.replace('%', '')
          let formName = workload < 0 ? 'reduceForm' : 'plusForm'
          let topdown = workload < 0 ? '低于' : '高于'
          let percent = workload < 0 ? -workload : workload
          let score = 0
          if (percent < 15) {
            score = 0
            this[formName].workloadExplain = '与部门平均工作量基本持平'
          } else if (percent > 15 && percent <= 30) {
            score = 1
            this[formName].workloadExplain = topdown + '部门平均工作量15%'
          } else if (percent > 30 && percent <= 45) {
            score = 3
            this[formName].workloadExplain = topdown + '部门平均工作量30%'
          } else if (percent > 45 && percent <= 55) {
            score = 7
            this[formName].workloadExplain = topdown + '部门平均工作量45%'
          } else if (percent > 55) {
            score = 10
            this[formName].workloadExplain = topdown + '部门平均工作量55%'
          }
          this[formName].workload = score
        }
      })
    }
  },

  mounted () {
    this.maxWidth = this.$el.clientWidth - 180
    this.getData()
    if (this.role !== 'ordinary') { this.curentTab = 'quali' }
  }
}
</script>
<style lang='scss'>
.main{
  display: flex;
  height: 100%;
}
.show{
  height: 100%;
  width: 100%;
  .stripe{
    tr:nth-child(2n) {
      td{
        background-color: #eeeeee;
      }
    }
  }
  .ivu-input-number-input[disabled] {
    color: #000000;
  }
  .ivu-table:before {
    background-color: white
  }
  .ivu-table-tbody td{
    position: relative // 解决滚动之后Poptiprule跟随滚动的问题
  }
  .ivu-table-wrapper {
    border-bottom: 1px solid #e9eaec
  }
  .ivu-input[disabled] {
    color: #000000;
  }
  .ivu-table-header th{
    height: 32px
  }
  .ivu-table-row td{
    height: 40px
  }
  .border{
    border-right: 1px solid #e9eaec
  }
  // .ivu-tabs-tabpane{
  //   -webkit-column-count: 2; // 分为2列排列
  //   -webkit-column-gap: 0px; // 列间间隔
  // }
  .ivu-form-item-error-tip {
    position: absolute;
    top: 10px;
    padding-top: 0px;
    width: 60px;
    left: auto;
    right: -65px;
    line-height: 1;
    color: #ed3f14;
  }
  .ivu-input-number{
    width: 50px;
  }
  .ivu-input-wrapper{
     width: 250px;
  }
  .ivu-form-item{
    margin-bottom: 0px;
    display: inline-block;
  }
}
</style>
   