<template>
  <section class="rules">
    <span class="tool">
        <span>规则生效时间：</span>
        <Select :value="timeVersion" style="width:150px" @on-change="versionChange">
          <Option v-for="item in this.dates" :value="item.beginDate" :key="item.beginDate">{{ item.beginDate }}</Option>
        </Select>
    </span>
    <div class="title">绩效考核评分维护</div>
    <div>
      <Button type="primary" @click="show('add')" icon="android-add">新增规则</Button>
    </div>
     <Modal v-model="ruleModal" title="评分规则信息" :closable="false" width="900px">
      <Form ref="formItem" :model="formItem" label-position="left" :label-width="160">
        <div class="xmjl">
          <div class="label">
            项目经理得分=
          </div>
          <div>
            <Form-item label="项目组成员平均分数*" prop="xmcy">
              <InputNumber :step="0.1" :min="0" v-model="formItem.xmjlRate"></InputNumber>
            </Form-item>
          </div>
          <div>
            <Form-item label="+部门副经理定性评价分数*" prop="bmfjl">
              <InputNumber :step="0.1" :min="0" v-model="formItem.bmfjlQuaRate"></InputNumber>
            </Form-item>
          </div>
          <div>
            <Form-item label="+部门经理定性评价分数*" prop="bmjl">
              <InputNumber :step="0.1" :min="0" v-model="formItem.bmjlQuaRate"></InputNumber>
            </Form-item>
          </div>
        </div>
        <div class="bmfjl">
          <div class="label">
            部门副经理得分=
          </div>
          <div>
            <Form-item label="项目经理得分*" prop="xmjl">
              <InputNumber :step="0.1" :min="0" v-model="formItem.bmfjlRate"></InputNumber>
            </Form-item>
          </div>
        </div>
      </Form>
      <div slot="footer">
        <Button @click="submitCancel()">取消</Button>
        <Button type="primary" @click="submit()">确定</Button>
      </div>
    </Modal>
    <Table highlight-row border :height="tableHeight"  :columns='ruleHead' :data='tableData' size='small' ref='table'>
    </Table>
  </section>
</template>
<script>
import API from './../../api/rules'
export default {
  data () {
    return {
      // 搜索
      dates: [],
      beginDate: '',
      xmjlRate: 0,
      bmfjlQuaRate: 0,
      bmjlQuaRate: 0,
      bmfjlRate: 0,
      timeVersion: '',
      // 表格
      tableHeight: '400px',
      ruleHead: [
        {
          title: '适用用户类型', key: 'person', align: 'center'
        },
        {
          title: '项目组成员平均分数*', key: 'xmjlRate', align: 'center'
        },
        {
          title: '+部门副经理定性评价分数* ', key: 'bmfjlQuaRate', align: 'center', width: '200px'
        },
        {
          title: '+部门经理定性评价分数*', align: 'center', key: 'bmjlQuaRate'
        },
        {
          title: '+项目经理得分*', align: 'center', key: 'bmfjlRate'
        },
        {
          title: '是否生效',
          align: 'center',
          key: 'isActive',
          render: (h, params) => {
            return h('div', [
              h('span', params.row.isActive === '1' ? '生效' : '失效')
            ])
          }
        }
      ],
      ppp: [],
      tableData: [],
      // 表单
      ruleModal: false,
      formItem: {
        xmjlRate: 0,
        bmfjlQuaRate: 0,
        bmjlQuaRate: 0,
        bmfjlRate: 0
      }
    }
  },
  methods: {
    versionChange (val) {
      this.beginDate = val
      this.getData()
    },
    show (val) {
      this.ruleModal = true
      document.getElementsByClassName('ivu-input-number')[0].style.marginLeft = '-40px'
      document.getElementsByClassName('ivu-input-number')[1].style.marginLeft = '-15px'
      document.getElementsByClassName('ivu-input-number')[2].style.marginLeft = '-18px'
      document.getElementsByClassName('ivu-input-number')[3].style.marginLeft = '-80px'
    },
    submit () {
      API.add(this.formItem).then(res => {
        if (res.ok === true) {
          this.$Notice.success({
            title: res.msg
          })
          this.getData()
        }
      })
      this.submitCancel()
    },
    submitCancel () {
      this.formItem = {
        xmjlRate: 0,
        bmfjlQuaRate: 0,
        bmjlQuaRate: 0,
        bmfjlRate: 0
      }
      this.$refs['formItem'].resetFields()
      this.ruleModal = false
    },
    getData () {
      API.getAlldate().then(res => {
        this.dates = res.attr.maps
        this.timeVersion = this.dates[0].beginDate
      })
      API.getDate({beginDate: this.beginDate}).then(res => {
        this.ppp = [{person: '项目经理得分='}, {person: '部门副经理得分='}]
        this.ppp.forEach(item => {
          item = Object.assign(item, res.attr.list[0])
          if (item.person === '项目经理得分=') {
            this.$set(item, 'cellClassName', {
              xmjlRate: 'demo-table-info-cell-age',
              bmjlQuaRate: 'demo-table-info-cell-age',
              bmfjlQuaRate: 'demo-table-info-cell-age',
              bmfjlRate: 'demo-table-info-cell-address'
            })
          } else {
            this.$set(item, 'cellClassName', {
              xmjlRate: 'demo-table-info-cell-address',
              bmjlQuaRate: 'demo-table-info-cell-address',
              bmfjlQuaRate: 'demo-table-info-cell-address',
              bmfjlRate: 'demo-table-info-cell-age'
            })
          }
        })
        this.tableData = this.ppp
      })
    }
  },
  watch: {
  },
  mounted () {
    this.getData()
  }
}
</script>
<style lang="scss">
.rules {
  .ivu-table .demo-table-info-cell-age {
    background-color: #ff6600;
    color: #fff;
  }
  .ivu-table .demo-table-info-cell-address {
    background-color: white;
    color: white;
  }
  .tool {
    float: right
  }
  .title {
    display: flex;
    justify-content: center;
    font-size: 20px;
  }
}
.label {
  position: relative;
  top: 7px
}
.xmjl {
    display: flex;
    justify-content:left;
  }
  .bmfjl {
    display: flex;
    justify-content:left;
  }
</style>
