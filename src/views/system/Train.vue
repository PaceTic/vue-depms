<template>
  <div class="trainCls">
    <!-- 搜索栏 -->
    <div style="margin-bottom:15px">
      <span>培训名称：</span>
      <Input v-model="keyWord" placeholder="请输入..." style="width: 200px"></Input>
      <Button type="primary" shape="circle" icon="ios-search" @click="getTrain"></Button>
    </div>

    <!-- 工具栏 -->
    <div style="margin-bottom:15px" v-if="role === 'admin'">
      <Button type="primary" icon="plus-circled" @click="setCreate">新增</Button>
      <Button type="primary" icon="edit" @click="setEdit">编辑</Button>
      <Button type="error" icon="trash-b" @click="remove">删除</Button>
    </div>

    <!-- 主表格 -->
    <Table :columns="columns" :data="tableData" :height="tableHeight"
    highlight-row @on-current-change="columnSelect" :loading="tableLoading"></Table>

    <!-- 分页 -->
    <div style="padding: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="pager.totalRow" :current="pager.pageNumber" 
        :page-size="pager.pageSize" 
        :page-size-opts="pager.pageSizeOpt" placement='top'
        @on-change="handlePageNumber" @on-page-size-change="handlePageSize"
        show-sizer show-elevator show-total></Page>
      </div>
    </div>

    <!-- 录入及编辑 -->
    <Modal :styles="{top: '20px'}" v-model="dialogVisible" :title="dialogTitle" width="500" 
    @on-cancel="clearData" scrollable>
      <Form ref="form" label-position="left" :label-width="100" :model="form">
        <Form-item label="培训日期">
          <DatePicker v-model="datePicker.date" type="date" @on-change="dateChange"
          placeholder="请选择日期" style="width: 200px"></DatePicker>
        </Form-item>
        <Form-item label="培训名称" prop="name">
          <Input v-model="form.name"></Input>
        </Form-item>
        <Form-item label="时长" prop="time">
          <InputNumber :min="1" v-model="form.time" style="width: 50px"></InputNumber>
          <span> 小时</span>
        </Form-item>
        <Form-item label="讲师">
          <Input v-model="speaker" readonly style="width: 200px"></Input>
          <Button type="primary" icon="plus-circled" @click="setTransfer('speaker')">选择讲师</Button>
        </Form-item>
        <Form-item label="培训人员">
          <Input v-model="listener" readonly type="textarea" style="width: 200px"></Input>
          <Button type="primary" icon="plus-circled" @click="setTransfer('listener')">选择培训人员</Button>
        </Form-item>
        <Form-item label="培训人数" prop="trainNum">
          <Input v-model="form.trainNum" disabled style="width: 50px"></Input>
          <span> 人</span>
        </Form-item>
        <Form-item label="证书" prop="certificate">
          <Input v-model="form.certificate"></Input>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="clearData">取消</Button>
        <Button type="primary" @click="submit">确定</Button>
      </div>
    </Modal>

    <!-- 穿梭框选择 -->
    <Modal v-model="transferVisible" :title="transferModalTitle" 
      :mask-closable="false" :closable="false">
      <Transfer
        ref="transfer"
        :data="transferData"
        :target-keys="targetKeys"
        :titles="transferTitle"
        :list-style="{ width: '200px', height: '350px'}"
        :selectedKeys="['']"
        filterable
        @on-change="transferChange">
      </Transfer>
      <div slot="footer">
        <Button type="primary" @click="transferVisible = false">取消</Button>
        <Button type="primary" @click="handleTransfer">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getUsers, addTrain, editTrain, getData, removeTrain } from '../../api/train'
import expandRow from './Train-table-expand.vue'
export default {
  components: {
    expandRow
  },
  data () {
    return {
      role: sessionStorage.getItem('role'),
      keyWord: '',
      rowItem: undefined,
      selectBtn: '',
      selectTransfer: '',
      dialogTitle: '',
      dialogVisible: false,
      transferModalTitle: '',
      transferTitle: [],
      transferVisible: false,

      transferData: [],
      targetKeys: [],

      tableData: [],
      tableHeight: 0,
      tableLoading: true,

      speaker: '',
      listener: '',
      form: {
        date: '',
        name: '',
        time: 0,
        trainNum: 0,
        certificate: '',
        speaker: [],
        listener: []
      },

      pager: {
        totalRow: 0,
        pageSizeOpt: [10, 20, 30, 40],
        pageSize: 10,
        pageNumber: 1
      },

      columns: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row
              }
            })
          }
        },
        { title: '培训日期', key: 'date', sortable: true },
        { title: '培训名称', key: 'name' },
        { title: '时长(小时)', key: 'time', sortable: true },
        { title: '培训人数', key: 'trainNum', sortable: true },
        { title: '证书', key: 'certificate' }
      ]
    }
  },

  methods: {
    handlePageNumber (pageNumber) {
      this.pager.pageNumber = pageNumber
      this.getTrain()
    },
    handlePageSize (pageSize) {
      this.pager.pageSize = pageSize
      this.getTrain()
    },
    transferChange (newTargetKeys) {
      this.targetKeys = newTargetKeys
    },
    dateChange (date) {
      this.form.date = date
    },
    columnSelect (currentRow) {
      this.rowItem = currentRow
    },
    clearData () {
      this.$refs['form'].resetFields()
      this.form.date = ''
      this.form.speaker = []
      this.form.listener = []
      this.dialogVisible = false
    },
    handleTransfer () {
      // 使targetKeys中的值和this.form同步
      if (this.selectTransfer === 'speaker') {
        this.form.speaker = []
      } else {
        this.form.listener = []
      }
      this.targetKeys.forEach(key => {
        for (let i = 0; i < this.transferData.length; i++) {
          if (key === this.transferData[i].key) {
            if (this.selectTransfer === 'speaker') {
              this.form.speaker.push({
                account: this.transferData[i].account,
                userName: this.transferData[i].key
              })
            } else if (this.selectTransfer === 'listener') {
              this.form.listener.push({
                account: this.transferData[i].account,
                userName: this.transferData[i].key
              })
            }
            break
          }
        }
      })
      this.transferVisible = false
    },
    setTransfer (select) {
      // 调用组件方法重置搜索框
      this.$refs['transfer'].$refs['left'].handleQueryClear()
      this.$refs['transfer'].$refs['right'].handleQueryClear()
      // 调用组件方法重置勾选
      this.$refs['transfer'].splitSelectedKey()
      // 使form和Transfer targetKeys关联
      this.targetKeys = []
      if (select === 'speaker') {
        this.transferModalTitle = '选择讲师'
        this.transferTitle = ['待选人员', '讲师']
        this.selectTransfer = 'speaker'
        this.form.speaker.forEach(item => {
          this.targetKeys.push(item.userName)
        })
      } else if (select === 'listener') {
        this.transferModalTitle = '选择培训人员'
        this.transferTitle = ['待选人员', '培训人员']
        this.selectTransfer = 'listener'
        this.form.listener.forEach(item => {
          this.targetKeys.push(item.userName)
        })
      } else {
        console.log('error in setTransfer')
      }
      this.transferVisible = true
    },
    setCreate () {
      this.selectBtn = 'create'
      this.dialogTitle = '录入'
      this.dialogVisible = true
      this.targetKeys = []
    },
    setEdit () {
      if (this.rowItem === undefined) {
        this.$Message.error('请选择一项进行操作')
        return
      }
      this.dialogTitle = '编辑'
      this.selectBtn = 'edit'
      this.form = Object.assign({}, this.rowItem)
      this.dialogVisible = true
    },
    submit () {
      this.dialogVisible = false
      if (this.selectBtn === 'create') {
        addTrain(this.form).then(data => {
          this.getTrain()
          this.$Message.success(data.msg)
          this.dialogVisible = false
          this.clearData()
        })
      } else if (this.selectBtn === 'edit') {
        editTrain(this.form).then(data => {
          this.getTrain()
          this.$Message.success(data.msg)
          this.dialogVisible = false
          this.selectBtn = undefined
          this.clearData()
        })
      } else {
        console.log('updata error in this.selectItem')
      }
    },
    remove () {
      if (this.rowItem === undefined) {
        this.$Message.error('请选择一项进行操作')
        return
      }
      if (this.tableData.length === 1 && this.pager.pageNumber !== 1) {
        this.pager.pageNumber-- // 当在最后一页删除最后一条数据 并且 该页不是第一页时, 自动跳转到前一页
      }
      removeTrain(this.rowItem.id).then(data => {
        this.$Message.success(data.msg)
        this.getTrain()
      })
    },
    getTrain () {
      this.rowItem = undefined
      if (this.keyWord !== '') { // 搜索时重置为第一页
        this.pager.pageNumber = 1
      }
      let params = {pageSize: this.pager.pageSize, pageNumber: this.pager.pageNumber, name: this.keyWord}
      getData(params).then(data => {
        this.tableData = data.attr.list
        this.pager.pageNumber = data.attr.pager.pageNumber
        this.pager.pageSize = data.attr.pager.pageSize
        this.pager.totalRow = data.attr.pager.recordCount
        setTimeout(() => { this.tableLoading = false }, 150)
      })
    }
  },

  computed: {
    datePicker () {
      return {date: this.form.date}
      // 写成对象，规避警告
    }
  },

  watch: {
    // 使form和input输入框(v-model this.speaker)关联
    'form.speaker': {
      handler: function (val, oldVal) {
        this.speaker = ''
        this.form.speaker.forEach(item => {
          this.speaker += (item.userName + '，')
        })
        this.speaker = this.speaker.substr(0, this.speaker.length - 1)
      },
      deep: true,
      immediate: true
    },
    'form.listener': {
      handler: function (val, oldVal) {
        this.listener = ''
        this.form.listener.forEach(item => {
          this.listener += (item.userName + '，')
        })
        this.listener = this.listener.substr(0, this.listener.length - 1)
        this.form.trainNum = this.form.listener.length
      },
      deep: true,
      immediate: true
    }
  },

  mounted () {
    this.getTrain()
    getUsers().then(data => {
      data.attr.result.forEach(item => {
        this.transferData.push({key: item.realName, account: item.name})
      })
    })
    if (this.role === 'admin') {
      this.tableHeight = document.documentElement.clientHeight - 105 - 160
    } else {
      this.tableHeight = document.documentElement.clientHeight - 105 - 110
    }
    // let t = document.getElementsByClassName('ivu-modal-body')
    // console.log(t)
    // t[1].style.height = '300px'
    // t[1].style.overflowY = 'scroll'
  }
}
</script>
<style lang="scss">
.trainCls{
  tr.ivu-table-row-highlight td {
    background-color: rgba(146, 231, 77, 0.75);
  }
  tr.ivu-table-row-hover td {
    background-color: rgba(146, 231, 77, 0.75);
  }
}
</style>