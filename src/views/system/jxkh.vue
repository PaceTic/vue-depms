<template>
  <section class="jxkh">
    <div class="jxkhHead">
      <div class="tableClass">
        <p class="projectUser"><span class="checkMark"><Icon type="checkmark-circled"></Icon>已评人数:{{this.finishRate}} </span>
          &nbsp &nbsp <span class="information"><Icon type="information-circled"></Icon>剩余人数:{{queryData.length - this.finishRate}}</span>
        </p>
      <Table highlight-row border @on-current-change="chooseRows" :height="tableHeight" width="280" size='small' ref='table' :columns="columns" :data="queryData" :loading="tableLoad">
      </Table>
      <div style="text-align: center;margin-top:5px">
        当前被评人为: <span style="color:red;font-weight:bold;">{{this.selData.realName}}</span>
      </div>
      </div>
      <div class="caoz">
        <Tabs type="card" v-model="tabValue">
          <!-- 工作完成情况 -->
          <TabPane :label="labelWork" name="work">
            <div class="stripe" style="display: flex;">
              <div class="ivu-table-wrapper">
                <div class="ivu-table-header" style="overflow:visible">
                  <table cellspacing="0" cellpadding="0" border="0" class="ivu-table table" style="overflow:visible">
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
                      <tr class="ivu-table-row" v-for="(item, index) in $store.state.workData" :key="item.index">
                        <td class="ivu-table-column-center border">
                          <div class="ivu-table-cell">
                            <Poptiprule :title="item.title" :select="item.select" :placement="item.placement" object="work"></Poptiprule>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="ivu-table-wrapper" style="position: relative;">
                <Spin fix v-if="workShow">
                  <Icon type="load-c" size="large" class="demo-spin-icon-load"></Icon>
                  <div>正在提交数据,请稍等...</div>
                </Spin>
                <div class="ivu-table-header" style="max-width: 670px;overflow: auto;">
                  <table cellspacing="0" cellpadding="0" border="0" class="ivu-table table">
                    <thead>
                      <tr>
                        <th v-for="(item, index) in workData" class="ivu-table-column-center border" :key="item.index">
                          <div class="ivu-table-cell">
                            <span>{{ item.userName }}</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody class="ivu-table-tbody">
                      <tr v-for="(item, index) in $store.state.workData" class="ivu-table-row" :key="item.index">
                        <td v-for="(item2, index2) in workData" class="ivu-table-column-center border" :key="item2.index2">
                          <div class="ivu-table-cell" v-if="item.select === 'totalScore'">
                            <InputNumber ref="test" @input="val => afterInput(workData[index2], item.select, val)" :value="workData[index2][item.select]" :disabled="true"></InputNumber>
                          </div>
                          <div class="ivu-table-cell" v-else>
                            <InputNumber ref="test" @input="val => afterInput(workData[index2], item.select, val)" :value="workData[index2][item.select]" :disabled="workDisable"
                            :max="item.max" :min="item.min"></InputNumber>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabPane>
           <!-- 定性评分 -->
          <TabPane :label="labelQuali" name="quali" v-if="quaRoleIf !== 'bmfjl'" >
            <div class="stripe" style="display: flex">
              <div class="ivu-table-wrapper">
                <div class="ivu-table-header"  style="overflow:visible">
                  <table cellspacing="0" cellpadding="0" border="0" class="ivu-table table"  style="overflow:visible">
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
                      <tr class="ivu-table-row" v-for="(item, index) in $store.state.quaData" :key="item.index">
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
              <div class="ivu-table-wrapper" style="position: relative;">
                <Spin fix v-if="quaShow">
                  <Icon type="load-c" size="large" class="demo-spin-icon-load"></Icon>
                  <div>正在提交数据,请稍等...</div>
                </Spin>
                <div class="ivu-table-header" style="max-width: 670px;overflow: auto;">
                  <table cellspacing="0" cellpadding="0" border="0" class="ivu-table table">
                    <thead>
                      <tr>
                        <th v-for="(item, index) in qualitativeData" class="ivu-table-column-center border" :key="item.index">
                          <div class="ivu-table-cell">
                            <span>{{ item.userName }}</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody class="ivu-table-tbody">
                      <tr v-for="(item, index) in $store.state.quaData" class="ivu-table-row" :key="item.index">
                        <td v-for="(item2, index) in qualitativeData" class="ivu-table-column-center border" :key="item2.index">
                          <div class="ivu-table-cell"  v-if="item.select === 'totalScore'">
                            <InputNumber @input="val => afterInput(qualitativeData[index], item.select, val)" :value="qualitativeData[index][item.select]" :disabled="true"></InputNumber>
                          </div>
                          <div class="ivu-table-cell"  v-else>
                            <InputNumber @input="val => afterInput(qualitativeData[index], item.select, val)" :value="qualitativeData[index][item.select]" :disabled="quaDisable"
                            :max="item.max" :min="item.min"></InputNumber>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabPane>
          <!-- 绩效加分 -->
          <TabPane :label="labelPlus" name="plus">
              <Form ref="plusForm" :model="plusForm" :rules="rule">
                <div class="ivu-table-wrapper" style="height: 400px;overflow-y:auto;">
                  <div class="ivu-table-header">
                    <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;" class="ivu-table table">
                      <thead>
                        <tr>
                          <th class="ivu-table-column-center border">
                            <div class="ivu-table-cell">
                              <span>评分项</span>
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
                        <tr class="ivu-table-row" v-for="(item, index) in $store.state.plusData" :key="index">
                          <td class="ivu-table-column-center border">
                            <div class="ivu-table-cell">
                              <Poptiprule :title="item.title" :select="item.select" :placement="item.placement" object="plus"></Poptiprule>
                            </div>
                          </td>
                          <td class="ivu-table-column-center border">
                            <div class="ivu-table-cell" v-if="item.select !== 'workload'">
                              <Form-item :prop="item.select" :rules="rule.score">
                                <InputNumber v-model="plusForm[item.select]"
                                :disabled="plusDisable"
                                :max="item.max" :min="item.min"></InputNumber>
                              </Form-item>
                            </div>
                            <div class="ivu-table-cell" v-else>
                              <Form-item :prop="item.select" :rules="rule.score">
                                <InputNumber v-model="plusForm[item.select]"
                                :disabled=true
                                :max="item.max" :min="item.min"></InputNumber>
                              </Form-item>
                            </div>
                          </td>
                          <td class="ivu-table-column-center">
                            <div class="ivu-table-cell">
                              <Form-item :prop="item.select" :rules="rule.explain">
                                <Input v-model="plusForm[item.select + 'Explain']" :disabled="plusDisable"></Input>
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
          <!-- 绩效扣分 -->
          <TabPane  :label="labelReduce" name="reduce">
              <Form ref="reductForm" :model="reductForm" :rules="rule">
                <div class="ivu-table-wrapper" style="height: 400px;overflow-y:auto;">
                  <div class="ivu-table-header">
                    <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;" class="ivu-table table">
                      <thead>
                        <tr>
                          <th class="ivu-table-column-center border">
                            <div class="ivu-table-cell">
                              <span>评分项</span>
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
                        <tr class="ivu-table-row" v-for="(item, index) in $store.state.reductData" :key="index">
                          <td class="ivu-table-column-center border">
                            <div class="ivu-table-cell">
                              <Poptiprule :title="item.title" :select="item.select" :placement="item.placement" object="reduce"></Poptiprule>
                            </div>
                          </td>
                          <td class="ivu-table-column-center border">
                            <div class="ivu-table-cell" v-if="item.select !== 'workload'">
                              <Form-item :prop="item.select" :rules="rule.score">
                                <InputNumber v-model="reductForm[item.select]"
                                :disabled="reductDisable"
                                :max="item.max" :min="item.min"></InputNumber>
                              </Form-item>
                            </div>
                            <div class="ivu-table-cell" v-else>
                              <Form-item :prop="item.select" :rules="rule.score">
                                <InputNumber v-model="reductForm[item.select]"
                                :disabled=true
                                :max="item.max" :min="item.min"></InputNumber>
                              </Form-item>
                            </div>
                          </td>
                          <td class="ivu-table-column-center">
                            <div class="ivu-table-cell">
                              <Form-item :prop="item.select" :rules="rule.explain">
                                <Input v-model="reductForm[item.select + 'Explain']" :disabled="reductDisable"></Input>
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


          <span slot="extra" class="fullMarks">
            <!-- <Button slot="extra" type="primary" :disabled="fullMarkDis" @click="fullMarks()">一键满分</Button> -->
            <Button slot="extra" type="primary" :disabled="exportDis" @click="save()">保存</Button>
            <Button slot="extra" type="primary" :disabled="previewDis" @click="preview">预览总分</Button>
            <Button slot="extra" type="primary" v-if="workIf" :disabled="workDisable" @click="submitwork()">提交</Button>
            <Button slot="extra" type="primary" v-if="quaIf" :disabled="quaDisable" @click="submitQualitative()">提交</Button>
            <Button slot="extra" type="primary" v-if="plusIf" :disabled="plusDisable" @click="submitPlus()">提交</Button>
            <Button slot="extra" type="primary" v-if="reductIf" :disabled="reductDisable" @click="submitReduct()">提交</Button>
          </span>
        </Tabs>
      </div>
    </div>

    <Modal v-model="totalTable" :styles="{top: '20px'}" >
      <p slot="header" style="color:#f60;text-align:center">
          <span>预览绩效考核表</span>
      </p>
      <Table :loading="totalLoad" highlight-row border :columns='preTotal' :data='totalData'  :height="400" size='small' ref='table'>
      </Table>
      <div slot="footer">
        <Button @click="totalTable=false">取消</Button>
        <Button type="primary" @click="totalTable=false">确定</Button>
      </div>
    </Modal>

  </section>
</template>
<script>
import store from '../../vuex/store'
import Poptiprule from './Poptiprule'
import { workPreview, qualitativePreview, projectId, jxWork, jxPlus, jxReduct, jxQualitative, getRate, getWorkAndQua, saveAllJobCompletion, saveAllQualitative, totalPreview } from './../../api/jxkh'
export default {
  data () {
    const validateScore = (rule, value, callback) => {
      let formName = ''
      if (rule.field in this.plusForm) {
        formName = 'plusForm'
      } else if (rule.field in this.reductForm) {
        formName = 'reductForm'
      } else if (rule.field in this.qualitativeForm) {
        formName = 'qualitativeForm'
      } else if (rule.field in this.workForm) {
        formName = 'workForm'
      } else {
        console.log('error in validate')
      }
      if (this[formName][rule.field] === 0 && this[formName][rule.field + 'Explain'] !== '') {
        callback(new Error('请填写分数'))
      } else {
        callback()
      }
    }
    const validateExplain = (rule, value, callback) => {
      let formName = ''
      if (rule.field in this.plusForm) {
        formName = 'plusForm'
      } else if (rule.field in this.reductForm) {
        formName = 'reductForm'
      } else if (rule.field in this.qualitativeForm) {
        formName = 'qualitativeForm'
      } else if (rule.field in this.workForm) {
        formName = 'workForm'
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
      workMax: [
        {select: 'stability', title: '稳定性', max: 10, min: 0},
        {select: 'normative', title: '规范性', max: 15, min: 0},
        {select: 'maintainability', title: '可维护性', max: 15, min: 0},
        {select: 'bugNumber', title: 'bug数量', max: 15, min: 0},
        {select: 'efficiency', title: '工作效率', max: 15, min: 0},
        {select: 'difficulty', title: '难度得分', max: 10, min: 0},
        {select: 'normativeB', title: '规范性', max: 5, min: 0},
        {select: 'structural', title: '结构性', max: 5, min: 0},
        {select: 'integrality', title: '完整性', max: 5, min: 0, placement: 'top-start'},
        {select: 'instructive', title: '指导性', max: 5, min: 0, placement: 'top-start'},
        {select: 'totalScore', title: '总分', max: 100, min: 0}
      ],
      quaMax: [
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
      ],
      // 预览总分
      totalLoad: true,
      totalData: [],
      preTotal: [
        {
          title: '姓名', align: 'center', key: 'realName'
        },
        {
          title: '总分', align: 'center', key: 'totalScore'
        }
      ],
      isQuaEdit: true,
      count: '',
      previewDis: false,
      testDis: false,
      quaRoleIf: sessionStorage.getItem('role'),
      totalTable: false,
      exportDis: false,
      fullMarkDis: false,
      isQuaReviewed: '',
      isWorkReviewed: '',
      totalScore: 0,
      tabValue: 'work',
      workIf: false,
      quaIf: false,
      plusIf: false,
      reductIf: false,
      // 提交加载
      workShow: false,
      quaShow: false,
      workData: [],
      qualitativeData: [],
      // 控制tab右上角完成图标显示
      labelWork: (h) => {
        return h('div', [
          h('span', '工作完成情况'),
          h('Icon', {
            props: {
              type: this.testDis === false ? this.workDisable === true ? 'checkmark-circled' : '' : ''
            }
          })
        ])
      },
      labelPlus: (h) => {
        return h('div', [
          h('span', '加分项'),
          h('Icon', {
            props: {
              type: this.testDis === false ? this.plusDisable === true && this.isPlusReviewed === '1' ? 'checkmark-circled' : '' : ''
            }
          })
        ])
      },
      labelReduce: (h) => {
        return h('div', [
          h('span', '减分项'),
          h('Icon', {
            props: {
              type: this.testDis === false ? this.reductDisable === true && this.isReductReviewed === '1' ? 'checkmark-circled' : '' : ''
            }
          })
        ])
      },
      labelQuali: (h) => {
        return h('div', [
          h('span', '定性评分'),
          h('Icon', {
            props: {
              type: this.testDis === false ? this.quaDisable === true ? 'checkmark-circled' : '' : ''
            }
          })
        ])
      },
      // 验证
      rule: {
        score: [{validator: validateScore, trigger: 'change'}],
        explain: [{validator: validateExplain, trigger: 'blur'}]
      },
      tableHeight: '400px',
      tableLoad: true,
      // 表格已评及剩余人数信息
      pName: '',
      finishRate: 0,
      // 控制输入框及提交按钮控制是否可用
      quaDisable: false,
      workDisable: false,
      plusDisable: false,
      reductDisable: false,
      queryData: [],
      selData: [],
      // 工作完成情况
      workForm: {
        /* number: 0, */
        stability: 0,
        normative: 0,
        maintainability: 0,
        bugNumber: 0,
        efficiency: 0,
        difficulty: 0,
        normativeB: 0,
        structural: 0,
        integrality: 0,
        instructive: 0,
        totalScore: 0
      },
      /* 加分表单 */
      plusForm: {
        suggest: 0,
        study: 0,
        setup: 0,
        share: 0,
        propaganda: 0,
        activity: 0,
        workload: 0,
        build: 0,
        encourage: 0,
        support: 0,
        suggestExplain: '',
        studyExplain: '',
        setupExplain: '',
        shareExplain: '',
        propagandaExplain: '',
        activityExplain: '',
        workloadExplain: '',
        buildExplain: '',
        encourageExplain: '',
        supportExplain: ''
      },
      /* 扣分表单 */
      reductForm: {
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
      // 定性评分
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
      },
      columns: [
        {
          title: '真实姓名',
          key: 'realName',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'person'
                },
                style: {
                  marginRight: '10px'
                }
              }),
              h('strong', params.row.realName)
            ])
          }
        },
        {
          title: '状态',
          key: 'status',
          align: 'center',
          render: (h, params) => {
            let color = (params.row.isPlus === '1' && params.row.isReduct === '1' && params.row.isQuali === '1') ? ((params.row.finish !== undefined) ? 'green' : 'yellow') : 'red'
            let text = (params.row.isPlus === '1' && params.row.isReduct === '1' && params.row.isQuali === '1') ? ((params.row.finish !== undefined) ? '已完成' : '已自评') : '未自评'
            return h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
          }
        }
      ]
    }
  },
  store,
  components: {
    Poptiprule
  },
  methods: {
    preview () {
      this.totalData = []
      this.save()
      this.totalTable = true
    },
    save (val) {
      this.totalLoad = true
      saveAllJobCompletion(this.workData).then(res => {
        saveAllQualitative(this.qualitativeData).then(res => {
          totalPreview({projectId: sessionStorage.getItem('projectId')}).then(res => {
            this.totalData = res.maps
            this.totalLoad = false
          })
        })
        if (val !== 'work' && val !== 'qua') {
          val === 'watch' ? this.$Message.success('已自动保存！') : this.$Message.success('保存成功!')
        }
      })
    },
    exportData () {
      this.count = 0
      if (this.workDisable !== true) {
        this.exportDis = false
        workPreview({projectId: sessionStorage.getItem('projectId')}).then(res => {
          if (res.workPreview.length !== 0) {
            this.workData = res.workPreview
            this.count ++
            /* this.$Message.success('导入成功!') */
          }
        })
      } else {
        this.exportDis = true
      }
      if (this.quaDisable !== true) {
        this.exportDis = false
        qualitativePreview({projectId: sessionStorage.getItem('projectId')}).then(res => {
          if (res.qualitativePreview.length !== 0) {
            this.qualitativeData = res.qualitativePreview
            this.count ++
            /* this.$Message.success('导入成功!') */
          }
        })
      } else {
        this.exportDis = true
      }
    },
    // 一键满分
    fullMarks () {
      if (this.tabValue === 'work') {
        for (var i in this.workMax) {
          for (var j in this.workData) {
            this.workData[j][this.workMax[i].select] = this.workMax[i].max
          }
        }
      } else {
        for (var m in this.quaMax) {
          for (var n in this.qualitativeData) {
            this.qualitativeData[n][this.quaMax[m].select] = this.quaMax[m].max
          }
        }
      }
      this.$Message.success('一键满分成功!')
    },
    afterInput (target, key, value) {
      this.$set(target, key, value)
      let totalScore = 0
      let formName = ''
      this.tabValue === 'work' ? formName = 'workForm' : formName = 'qualitativeForm'
      for (let key in this[formName]) {
        if (key === 'totalScore') continue
        totalScore += (target[key] || 0)
      }
      this.isQuaEdit = true
      this.$set(target, 'totalScore', totalScore)
    },
    submitwork () {
      this.$Modal.confirm({
        content: '是否确定提交',
        onOk: () => {
          this.save('work')
          this.workShow = true
          this.workData.forEach(item => {
            delete item.isPreviewed
            delete item.id
          })
          jxWork(this.workData).then(res => {
            setTimeout(() => {
              this.workShow = false
            }, 300)
            this.$Notice.success({
              title: '工作完成情况评分成功'
            })
            this.workDisable = true
            sessionStorage.removeItem('workData')
            if (sessionStorage.getItem('role') === 'bmfjl') {
              this.previewDis = true
            } else {
              this.workDisable === true && this.quaDisable === true ? this.previewDis = true : this.previewDis = false
            }
            this.getData()
          })
        },
        onCancel: () => {
          this.$Message.info('你选择取消')
        }
      })
    },
    submitQualitative () {
      this.$Modal.confirm({
        content: '是否确定提交',
        onOk: () => {
          this.save('qua')
          this.quaShow = true
          this.qualitativeData.forEach(item => {
            delete item.isPreviewed
            delete item.id
          })
          if (this.isQuaEdit) {
            jxQualitative(this.qualitativeData).then(res => {
              setTimeout(() => {
                this.quaShow = false
              }, 300)
              this.$Notice.success({
                title: '定性评分成功'
              })
              this.quaDisable = true
              sessionStorage.removeItem('quaData')
              this.workDisable === true && this.quaDisable === true ? this.previewDis = true : this.previewDis = false
              this.getData()
            })
          } else {
            this.quaShow = false
            this.$Message.warning('请修改默认值之后再提交')
          }
        },
        onCancel: () => {
          this.$Message.info('你选择取消')
        }
      })
    },
    submitPlus () {
      if (this.selData.length !== 0) {
        this.$refs['plusForm'].validate((valid) => {
          if (valid) {
            let para = Object.assign(this.plusForm, {userId: this.selData.id, projectId: sessionStorage.getItem('projectId')})
            jxPlus(para).then(res => {
              this.plusDisable = true
              this.getData('plus')
            })
            this.$Notice.success({
              title: '绩效加分审核成功'
            })
          } else {
            this.$Message.error('表单验证失败')
          }
        })
      } else {
        this.$Notice.error({
          title: '请选择一项进行评分'
        })
      }
    },
    submitReduct () {
      if (this.selData.length !== 0) {
        this.$refs['reductForm'].validate((valid) => {
          if (valid) {
            let para = Object.assign(this.reductForm, {userId: this.selData.id, projectId: sessionStorage.getItem('projectId')})
            jxReduct(para).then(res => {
              this.reductDisable = true
              this.getData('reduct')
            })
            this.$Notice.success({
              title: '绩效扣分审核成功'
            })
          } else {
            this.$Message.error('表单验证失败')
          }
        })
      } else {
        this.$Notice.error({
          title: '请选择一项进行评分'
        })
      }
    },
    chooseRows (currentRow) {
      console.log(currentRow)
      this.selData = currentRow
      this.resetPlus()
      this.resetReduct()
      this.isPlusReviewed = ''
      this.isReductReviewed = ''
      getRate({uid: this.selData.id}).then((res) => {
        if (res.plus && res.reduct && this.selData.isQuali === '1') {
          this.plusForm = res.plus
          this.reductForm = res.reduct
          if (res.plus.isPlusReviewed === '0') {
            this.plusDisable = false
          } else {
            this.isPlusReviewed = '1'
            this.plusDisable = true
          }
          if (res.reduct.isReductReviewed === '0') {
            this.reductDisable = false
          } else {
            this.isReductReviewed = '1'
            this.reductDisable = true
          }
        } else {
          this.plusDisable = true
          this.reductDisable = true
        }
      })
    },
    // 重置表单
    resetPlus () {
      this.$refs['plusForm'].resetFields()
      for (var i in this.plusForm) {
        this.plusForm[i] = typeof (this.plusForm[i]) === 'number' ? 0 : ''
      }
    },
    resetReduct () {
      this.$refs['reductForm'].resetFields()
      for (var i in this.reductForm) {
        this.reductForm[i] = typeof (this.reductForm[i]) === 'number' ? 0 : ''
      }
    },
    // 初始值为良
    fullMark () {
      this.quaMax.forEach(formItem => {
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
        duration: 4
      })
    },
    getData (val) {
      if (val !== undefined) {
        val === 'plus' ? this.isPlusReviewed = '1' : this.isReductReviewed = '1'
      }
      projectId({projectId: sessionStorage.getItem('projectId')}).then(res => {
        if (res.maps.length !== 0) {
          this.queryData = res.maps
          this.pName = this.queryData[0].projectName
          this.finishRate = res.count
          let ids = res.ids.map(item => item.u_id)
          this.queryData.forEach(item => {
            if (ids.indexOf(item.id) !== -1) {
              this.$set(item, 'finish', true)
            }
          })
          let isWorkReviewed = res.maps[0].isWorkReviewed
          let isQualitativeReviewed = res.maps[0].isQualitativeReviewed
          this.queryData.forEach(item => {
            if (item.isPlus !== '1' || item.isQuali !== '1' || item.isReduct !== '1') {
              this.quaDisable = this.workDisable = this.plusDisable = this.reductDisable = this.testDis = this.exportDis = this.fullMarkDis = this.previewDis = true
              this.$Modal.warning({
                title: '警告',
                content: '该项目存在项目成员尚未自评完，无法提交评分'
              })
            }
          })
          this.qualitativeData = []
          this.workData = []
          if (this.testDis !== true) {
            getWorkAndQua({projectId: sessionStorage.getItem('projectId')}).then(res => {
              console.log(res)
              if (isWorkReviewed === '0' && res.work.length === 0) {
                this.queryData.forEach(item => {
                  this.workData.push(Object.assign({}, {userId: item.id, userName: item.realName, projectId: sessionStorage.getItem('projectId')}, this.workForm))
                })
                this.workDisable = false
              } else if (isWorkReviewed === '0' && res.work.length !== 0) {
                this.exportDis = true
                this.workDisable = false
                this.workData = res.work
              } else {
                this.exportDis = false
                this.workDisable = true
                this.workData = res.work
              }
              if (sessionStorage.getItem('role') === 'bmfjl') {
                this.quaDisable = true
              } else {
                if (isQualitativeReviewed === '0' && res.qualitative.length === 0) {
                  this.queryData.forEach(item => {
                    this.qualitativeData.push(Object.assign({}, {userId: item.id, userName: item.realName, projectId: sessionStorage.getItem('projectId')}, this.qualitativeForm))
                  })
                  this.fullMark()
                  this.isQuaEdit = false
                  this.quaDisable = false
                } else if (isQualitativeReviewed === '0' && res.qualitative.length !== 0) {
                  this.quaDisable = false
                  this.qualitativeData = res.qualitative
                } else {
                  this.quaDisable = true
                  this.qualitativeData = res.qualitative
                }
              }
              this.workDisable === true ? this.exportDis = this.fullMarkDis = true : this.exportDis = this.fullMarkDis = false
              this.workDisable === true && this.quaDisable === true ? this.previewDis = true : this.previewDis = false
            })
          }
        } else {
          this.$Modal.warning({
            title: '警告',
            content: '参加评分的人数为空'
          })
        }
        this.tableLoad = false
      })
      setTimeout(() => {
        this.exportData()
      }, 500)
    }
  },
  watch: {
    'count' (val) {
      if (val === 1) {
        this.$Message.success('导入成功!')
      }
    },
    'tabValue' (val) {
      this.workIf = this.quaIf = this.plusIf = this.reductIf = this.exportDis = false
      if (val === 'work') {
        this.workIf = true
        this.save('watch')
        /* this.$Notice.warning({ title: '切换评分项，记得保存更改，以防数据丢失', duration: 2 }) */
       /*  if (sessionStorage.getItem('role') === 'bmfjl') {
          this.previewDis = true
        } else { */
        this.workDisable === true && this.quaDisable === true ? this.previewDis = true : this.previewDis = false
        /* } */
        this.queryData.forEach(item => {
          if (item.isPlus !== '1' || item.isQuali !== '1' || item.isReduct !== '1') {
            this.quaDisable = this.workDisable = this.plusDisable = this.reductDisable = this.exportDis = this.fullMarkDis = this.previewDis = true
            this.testDis = true
          } else {
            this.workDisable === true ? this.exportDis = this.fullMarkDis = this.previewDis = true : this.exportDis = this.fullMarkDis = this.previewDis = false
          }
        })
      }
      if (val === 'reduce') {
        this.reductIf = this.fullMarkDis = this.exportDis = true
        this.fullMarkDis = true
        this.queryData.forEach(item => {
          if (item.isPlus !== '1' || item.isQuali !== '1' || item.isReduct !== '1') {
            this.quaDisable = this.workDisable = this.plusDisable = this.reductDisable = true
            this.testDis = true
          }
        })
      }
      if (val === 'quali') {
        this.quaIf = true
        this.save('watch')
        /* this.$Notice.warning({ title: '切换评分项，记得保存更改，以防数据丢失', duration: 2 }) */
        this.workDisable === true && this.quaDisable === true ? this.previewDis = true : this.previewDis = false
        this.queryData.forEach(item => {
          if (item.isPlus !== '1' || item.isQuali !== '1' || item.isReduct !== '1') {
            this.quaDisable = this.workDisable = this.plusDisable = this.reductDisable = this.exportDis = this.fullMarkDis = this.previewDis = true
            this.testDis = true
          } else {
            this.quaDisable === true ? this.exportDis = this.fullMarkDis = this.previewDis = true : this.exportDis = this.fullMarkDis = this.previewDis = false
          }
        })
      }
      if (val === 'plus') {
        this.plusIf = this.fullMarkDis = this.exportDis = true
        this.queryData.forEach(item => {
          if (item.isPlus !== '1' || item.isQuali !== '1' || item.isReduct !== '1') {
            this.quaDisable = this.workDisable = this.plusDisable = this.reductDisable = true
            this.testDis = true
          }
        })
      }
    }
  },
  mounted () {
    this.workIf = true
    let clientHeight = document.documentElement.clientHeight
    this.tableHeight = clientHeight - this.$refs.table.$el.offsetTop - 195
    this.getData()
    setTimeout(() => {
      this.exportData()
    }, 500)
  }
}
</script>
<style lang="scss">
.projectUser {
  margin-left: 20px;
  .information {
    .ivu-icon {
      color: red
    }
  }
  .checkMark {
    .ivu-icon {
    color: #19BE6B
    }
  }
  font-size: 15px
}
.jxkhHead {
  tr.ivu-table-row-highlight td {
    background-color: rgba(146, 231, 77, 0.75);
  }
  tr.ivu-table-row-hover td {
    background-color: rgba(146, 231, 77, 0.75);
  }
  margin-top: -10px;
  display: flex;
  justify-content:space-around;
}
.caoz {
  .stripe{
    tr:nth-child(2n) {
      td{
        background-color: #eeeeee;
      }
    }
  }
  .fullMarks {
    margin-right: 10px
  }
  .ivu-tabs-tabpane {
    margin-top: -10px;
    overflow: hidden;
  }
  .border{
    border-right: 1px solid #e9eaec
  }
  margin-left: -40px;
  overflow-y: hidden;
  height: 100%;
  width: 75%;
  .ivu-input-number-input[disabled] {
    color: #000000;
  }
  .ivu-input[disabled] {
    color: #000000;
  }
  .ivu-table:before {
    background-color: white
  }
  .ivu-table-wrapper {
    border-bottom: 1px solid #e9eaec
  }
  .ivu-table-tbody td{
    position: relative // 解决滚动之后Poptiprule跟随滚动的问题
  }
  .ivu-table-header th{
    height: 32px
  }
  .ivu-table-row td{
    height: 40px;
  }
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
    width: 60px;
  }
  .ivu-input-wrapper{
    width: 120px;
  }
  .ivu-form-item{
    margin-bottom: 0px;
    display: inline-block;
  }
  .foot {
    text-align: center
  }
}
.tableClass {
  .ivu-table-row-highlight td {
    color: red
  }
  margin-left: -55px;
}
</style>
