<template>
  <section>
    <div class="queryClass">
      <label>项目名称:</label>
      <AutoComplete v-model="filter.name" :data="nameData" :filter-method="filterMethod" clearable placeholder="请输入..." style="width:150px"></AutoComplete>
      <label>项目编号:</label>
      <Input v-model="filter.code" placeholder="请输入..." style="width: 150px"></Input>
      <label>开始结束日期:</label>
      <DatePicker @on-change="data"	format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="选择开始结束时间" style="width: 200px"></DatePicker>
      <Button type="primary" @click="getData" shape="circle" icon="ios-search">搜索</Button>
    </div>
    <span>
      <Button type="primary" v-if="role === 'bmjl'" @click="$router.push('/jxkhUser')">部门经理定性评分入口</Button>
      <Button type="primary" v-if="role === 'bmfjl'" @click="$router.push('/jxkhUser')">部门副经理定性评分入口</Button>
    </span>
    <span v-if="adminDis">
      <Button type="primary" @click="add" icon="android-add">新增</Button>
      <Button type="primary" @click="edit" icon="edit" :disabled="handleDisable">编辑</Button>
      <Button type="error" @click="remove" icon="trash-b" :disabled="handleDisable">删除</Button>
      <Button type="primary" @click="projectPerson" icon="person-stalker" :disabled="handleDisable">项目人员</Button>
      <!-- <Button type="primary" @click="parentMethod" icon="android-add">删除2 -->
      <!-- <ProjectPerson ref="ref"></ProjectPerson> -->
    </span>
    <div class="proTable">
      <Table highlight-row border :loading="tableLoad" @on-current-change="chooseRows" :height="tableHeight"  :columns='project' :data='tableData' size='small' ref='table'>
      </Table>
    </div>
    <div style="margin-top: 10px">
      <div>
        <Page style="float: right" placement='top' show-total show-sizer show-elevator @on-page-size-change="pageSizeChange" :page-size-opts="[10, 20, 40, 50]" :page-size="pager.pageSize" :total="pager.total" :current="pager.pageNumber" @on-change="changePage"></Page>
      </div>
    </div>
    <!-- 项目人员信息 -->
    <div class="foot">
    <Modal title="项目人员信息" v-model="personModal" :styles="{top: '20px'}" :closable="false" :mask-closable="false">
      <!-- <ProjectPerson @chooseUser="getUsers" @totalData="totaluser" ref="ref"></ProjectPerson> -->
      <Transfer
        ref="transfer"
        :selectedKeys="['']"
        :data='mockData'
        :target-keys='targetkey'
        :render-format="render"
        filterable
        :titles="['待选人员', '项目人员']"
        :not-found-text = "'此项目暂时无人'"
        :list-style="{ width: '200px', height: '350px'}"
        @on-change='handleChange'>
      </Transfer>
      <div slot="footer">
        <Button type="primary" @click="personModal = false">取消</Button>
        <Button type="primary" @click="submitUser()">确定</Button>
      </div>
    </Modal>
    </div>
    <!-- 项目管理信息弹框 -->
    <div style="height:100px">
    <Modal v-model="projectModal" title="项目管理信息" :closable="false">
      <Form ref="formItem" :model="formItem" :rules="ruleValidate" label-position="left" :label-width="130">
        <Form-item label="项目名称" prop="name">
          <Input v-model="formItem.name" style="width: 187px" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="项目编号" prop="code">
          <Input style="width: 187px" v-model="formItem.code" placeholder="请输入编号"></Input>
        </Form-item>
        <Form-item label="项目描述" prop="remark">
          <Input style="width: 187px" v-model="formItem.remark" placeholder="请描述一下项目"></Input>
        </Form-item>
        <Form-item label="预计开始/结束时间" prop="valueDate">
          <DatePicker placement="top" v-model="valueDate"	format="yyyy-MM-dd" type="daterange"  placeholder="选择开始结束时间" style="width: 187px"></DatePicker>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button @click="submitCancel('formItem')">取消</Button>
        <Button type="primary" @click="submit('formItem')">确定</Button>
      </div>
    </Modal>
    </div>
  </section>
</template>
<script>
import moment from 'moment'
import { removeProject, addProject, editProject, getProjectList, userProject, queryProjectUser, unemployed } from './../../api/project'
export default {
  data () {
    return {
      role: 0,
      projectUser: [],
      mockData: [],
      unChoose: [],
      targetkey: [],
      target: [],
      // 搜索
      filter: {
        name: '',
        code: ''
      },
      tableHeight: '400px',
      managerName: '',
      nameData: [],
      beginEnd: [],
      projectId: '',
      // 权限控制
      adminDis: true,
      choose: '',
      handleDisable: true,
      tableLoad: '',
      pager: {
        total: 0,
        pageNumber: 1,
        pageSize: 10
      },
      projectModal: false,
      personModal: false,
      formItem: {
        name: '',
        code: '',
        remark: '',
        beginTime: '',
        endTime: ''
      },
      valueDate: [],
      ruleValidate: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      project: [
        {
          title: '序号',
          width: 70,
          align: 'center',
          render: (h, params) => {
            return h(
              'span',
              {},
              (this.pager.pageNumber - 1) * this.pager.pageSize + params.index + 1
            )
          }
        },
        {
          title: '项目名称', key: 'name', align: 'center'
        },
        {
          title: '项目编号', key: 'code', align: 'center'
        },
        {
          title: '预计开始时间', align: 'center', key: 'beginTime'
        },
        {
          title: '预计结束时间', align: 'center', key: 'endTime'
        },
        {
          title: '项目描述', align: 'center', key: 'remark'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            if (sessionStorage.getItem('checkVersion') !== '0') {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    disabled: false
                  },
                  style: {
                    textAlign: 'center'
                  },
                  on: {
                    click: () => {
                      this.jxkh(params.row.id, params.row.name)
                    }
                  }
                }, '绩效考核')
              ])
            } else {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    disabled: true
                  },
                  style: {
                    textAlign: 'center'
                  },
                  on: {
                    click: () => {
                      this.jxkh(params.row.id, params.row.name)
                    }
                  }
                }, '绩效考核')
              ])
            }
          }
        }
      ],
      tableData: [],
      users: [],
      selData: []
    }
  },
  methods: {
    render (item) {
      return item.role === 'xmjl' ? item.label + '(项目经理)' : item.label
    },
    handleChange (newTargetKeys, direction, moveKeys) {
      this.targetkey = newTargetKeys
    },
    data (val) {
      this.beginEnd = val
    },
    filterMethod (value, option) {
      if (value !== '') {
        return option.indexOf(value) !== -1
      } else {
        return
      }
    },
    jxkh (pid, pname) {
      sessionStorage.setItem('projectId', pid)
      sessionStorage.setItem('projectName', pname)
      if (this.role === 'xmjl' || this.role === 'bmfjl') {
        this.$router.push('/jxkh')
      } else {
        this.$router.push('/jxkhUser')
      }
    },
    submitUser () {
      this.ids = []
      console.log(this.targetkey)
      this.unChoose.forEach(item => {
        if (this.targetkey.indexOf(item.realName) !== -1) {
          this.ids.push(item.id)
        }
      })
      let para = {
        userIds: this.ids,
        id: this.selData.id
      }
      userProject(para).then((res) => {
        this.$Notice.success({
          title: '设置项目人员成功'
        })
      })
      this.personModal = false
      this.getData()
    },
    projectPerson () {
      this.unChoose = []
      this.personModal = true
      // 清空勾选、左搜索、右搜索
      this.$refs['transfer'].splitSelectedKey()
      this.$refs['transfer'].$refs['left'].handleQueryClear()
      this.$refs['transfer'].$refs['right'].handleQueryClear()
      this.targetkey = []
      this.projectId = this.selData.id
      queryProjectUser({projectId: this.projectId}).then(res => {
        this.projectUser = res.list
        this.projectUser.forEach(item => {
          if (item.roleName === 'xmjl') {
            this.projectUser.unshift(item)
          }
        })
        this.projectUser = new Set(this.projectUser)
        unemployed().then(res2 => {
          this.mockData = []
          this.unChoose = res2.maps
          this.projectUser.forEach(item => {
            this.unChoose.push(item)
          })
          this.unChoose.forEach(item => {
            this.mockData.push({
              role: item.roleName,
              key: item.realName,
              label: item.realName
            })
          })
        })
        this.projectUser.forEach(item => {
          this.targetkey.push(item.realName)
        })
        // console.log(this.targetkey)
      })
    },
    chooseRows (currentRow) {
      this.selData = currentRow
      if (!this.selData.id) {
        this.handleDisable = true
      } else {
        this.handleDisable = false
        sessionStorage.setItem('pid', this.projectId)
        this.managerName = this.selData.managerName
      }
    },
    changePage (val) {
      this.pager.pageNumber = val
      this.getData()
    },
    pageSizeChange (val) {
      this.pager.pageSize = val
      this.getData()
    },
    remove () {
      this.$Modal.confirm({
        title: '删除确定',
        content: '你确定删除这个项目吗？',
        onOk: () => {
          if (this.tableData.length === 1 && this.pager.pageNumber !== 1) {
            this.pager.pageNumber-- // 当在最后一页删除最后一条数据 并且 该页不是第一页时, 自动跳转到前一页
          }
          removeProject(this.selData.id).then((res) => {
            if (res.ok) {
              this.$Notice.success({
                title: res.msg
              })
              this.getData()
            } else {
              this.$Notice.error({
                title: res.msg
              })
            }
          })
        },
        onCancel: () => {
          this.$Message.info('你取消了删除')
        }
      })
    },
    add () {
      this.valueDate = []
      this.projectModal = true
    },
    edit () {
      this.valueDate = []
      this.choose = 'edit'
      this.formItem = Object.assign({}, this.formItem, this.selData)
      this.valueDate[0] = this.formItem.beginTime
      this.valueDate[1] = this.formItem.endTime
      this.projectModal = true
    },
    submit () {
      this.$refs['formItem'].validate((valid) => {
        if (valid) {
          if (this.choose === 'edit') {
            this.formItem.beginTime = moment(this.valueDate[0]).format('YYYY-MM-DD')
            this.formItem.endTime = moment(this.valueDate[1]).format('YYYY-MM-DD')
            editProject(this.formItem).then((res) => {
              if (res.ok) {
                this.$Notice.success({
                  title: res.msg
                })
                this.getData()
              } else {
                this.$Notice.error({
                  title: res.msg
                })
              }
              this.projectModal = false
              this.$refs['formItem'].resetFields()
            })
          } else {
            if (this.valueDate[0] !== undefined) {
              this.formItem.beginTime = moment(this.valueDate[0]).format('YYYY-MM-DD')
              this.formItem.endTime = moment(this.valueDate[1]).format('YYYY-MM-DD')
            } else {
              this.formItem.beginTime = this.formItem.endTime = ''
            }

            addProject(this.formItem).then((res) => {
              if (res.ok) {
                this.$Notice.success({
                  title: res.msg
                })
                this.getData()
              } else {
                this.$Notice.error({
                  title: res.msg
                })
              }
              this.projectModal = false
              this.$refs['formItem'].resetFields()
            })
          }
        } else {
          this.$Message.error('表单验证失败!')
        }
      })
    },
    submitCancel () {
      this.$refs['formItem'].resetFields()
      this.projectModal = false
    },
    getData () {
      this.handleDisable = true
      if (this.beginEnd[0] === undefined || this.beginEnd[1] === undefined) {
        this.beginEnd[0] = ''
        this.beginEnd[1] = ''
      }
      if (this.filter.name !== '' && this.filter.code !== '' && this.beginEnd[0] !== '' && this.beginEnd[1] !== '') {
        this.pager.pageNumber = 1
      }
      let para = {
        beginDate: this.beginEnd[0],
        endDate: this.beginEnd[1],
        name: this.filter.name,
        code: this.filter.code,
        pageSize: this.pager.pageSize,
        pageNumber: this.pager.pageNumber
      }
      getProjectList(para).then(res => {
        if (res.ok) {
          console.log(res)
          this.pager.total = res.attr.pager.recordCount
          this.pager.pageNumber = res.attr.pager.pageNumber
          this.pager.pageSize = res.attr.pager.pageSize
          this.tableData = res.attr.list
          this.nameData = this.tableData.map(item => item.name)
          setTimeout(() => {
            this.tableLoad = false
          }, 50)
        } else {
          this.$Notice.error({
            titleL: res.msg
          })
        }
      })
    }
  },
  watch: {
    'filter.name' (val) {
      val === '' ? this.getData() : val
    }
  },
  mounted () {
    /* let y = document.getElementsByClassName('ivu-modal-body')
    y[0].style.height = '800px'
    console.log(y) */
    let clientHeight = document.documentElement.clientHeight
    this.tableHeight = clientHeight - this.$refs.table.$el.offsetTop - 80
    this.getData()
    this.role = sessionStorage.getItem('role')
    if (sessionStorage.getItem('isadmin')) {
      this.adminDis = true
    } else {
      this.adminDis = false
    }
  }
}
</script>
<style lang="scss">
.proTable {
  margin-top:10px;
  tr.ivu-table-row-highlight td {
    background-color: rgba(146, 231, 77, 0.75);
  }
  tr.ivu-table-row-hover td {
    background-color: rgba(146, 231, 77, 0.75);
  }
}
.ivu-btn-ghost {
  background-color: #00ffcc !important
}
.queryClass {
  text-align: left;
  margin-bottom: 10px
}
</style>
