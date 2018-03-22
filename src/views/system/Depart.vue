<template>
  <div>
    <!-- 搜索栏 -->
    <span>部门名称：</span>
    <Input v-model="keyWord" placeholder="请输入..." style="width: 200px"></Input>
    <Button type="primary" shape="circle" icon="ios-search" @click="getDept"></Button>

    <!-- 工具栏 -->
    <div style="margin:15px 0px">
      <Button type="primary" icon="plus-circled" @click="setCreate">录入</Button>
      <Button type="primary" icon="edit" @click="setEdit">编辑</Button>
      <Button type="primary" icon="plus-circled" @click="setAdd">添加成员</Button>
      <Button type="error" icon="trash-b" @click="remove">删除</Button>
    </div>

    <!-- 主表格 -->
    <Table :height="tableHeight" highlight-row @on-current-change="columnSelect"
    :columns="tableHeader" :data="tableData" :loading="tableLoading"></Table>

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
    <Modal v-model="dialogVisible" :title="dialogTitle" @on-cancel="cancelUpdata">
      <Form ref="form" label-position="left" :label-width="100" :rules="rule" :model="form">
        <Form-item label="部门名称" prop="name">
          <Input v-model="form.name"></Input>
        </Form-item>
        <Form-item label="部门编码" prop="code">
          <Input v-model="form.code"></Input>
        </Form-item>
        <Form-item label="描述" prop="remark">
          <Input v-model="form.remark"></Input>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="cancelUpdata">取消</Button>
        <Button type="primary" @click="update">确定</Button>
      </div>
    </Modal>

    <!-- 查看成员 -->
    <Modal v-model="showMember" :title="memberTitle">
      <Table highlight-row :columns="memberHeader" :data="memberData"></Table>
      <div slot="footer"></div>
    </Modal>

    <!-- 添加成员 -->
    <Modal v-model="addMemberVisible" :title="'添加'+addTitle+'成员'">
      <Table height="300" :columns="addHeader" :data="addData" @on-selection-change="columnChecked"></Table>
      <div slot="footer">
        <Button type="primary" @click="addMemberVisible = false">取消</Button>
        <Button type="primary" @click="addMember">确定</Button>
      </div>
    </Modal>

  </div>
</template>
<script>
  import { getDeparts, addDepart, editDepart, removeDepart, getFreeUsers, setMember } from '../../api/depart'
  export default {
    data () {
      return {
        tableData: [],
        memberData: [],
        addData: [],

        tableHeight: 300,
        tableLoading: true,
        keyWord: '', // 搜索关键字
        rowItem: undefined,
        selectUser: [],
        selectItem: undefined,

        // 录入与编辑
        dialogTitle: '',
        dialogVisible: false,

        // 查看成员
        memberTitle: '',
        showMember: false,

        // 添加成员
        addTitle: '',
        addMemberVisible: false,

        form: {
          id: undefined,
          name: '',
          remark: '',
          code: ''
        },

        pager: {
          totalRow: 0,
          pageSizeOpt: [5, 10, 20, 30, 40],
          pageSize: 10,
          pageNumber: 1
        },

        rule: {
          name: [
            { required: true, message: '请填写部门名称', trigger: 'blur' },
            { pattern: /^[\u4e00-\u9fa5]*$/, message: '部门名称只能为中文', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '请填写部门编码', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '部门名称只能为数字', trigger: 'blur' }
          ]
        },

        addHeader: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            type: 'index',
            align: 'center',
            width: 60
          },
          {
            title: '用户名', key: 'name'
          },
          {
            title: '真实姓名', key: 'realName'
          }
        ],

        memberHeader: [
          {
            type: 'index',
            align: 'center',
            width: 100
          },
          {
            title: '用户名', key: 'name'
          },
          {
            title: '真实姓名', key: 'realName'
          }
        ],

        tableHeader: [
          {
            align: 'center',
            width: 100,
            render: (h, params) => {
              return h('div', [
                h('span', {
                }, (this.pager.pageNumber - 1) * this.pager.pageSize + params.index + 1)
              ])
            }
          },
          {
            title: '部门名称', key: 'name'
          },
          {
            title: '部门编码', key: 'code'
          },
          {
            title: '描述', key: 'remark'
          },
          {
            title: '操作',
            key: 'action',
            width: 200,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary', size: 'small'
                  },
                  on: {
                    click: () => {
                      this.memberTitle = params.row.name
                      this.memberData = params.row.users
                      this.showMember = true
                    }
                  }
                }, '查看成员')
              ])
            }
          }
        ]
      }
    },

    methods: {
      handlePageNumber (pageNumber) {
        this.pager.pageNumber = pageNumber
        this.getDept()
      },
      handlePageSize (pageSize) {
        this.pager.pageSize = pageSize
        this.getDept()
      },
      columnSelect (currentRow) {
        this.rowItem = currentRow // 把当前点击行的数据对象赋给rowItem
      },
      columnChecked (selection) {
        this.selectUser = selection
      },
      cancelUpdata () {
        this.$refs['form'].resetFields()
        this.dialogVisible = false
      },
      setAdd () {
        if (this.rowItem === undefined) {
          this.$Message.error('请选择一项进行操作')
          return
        }
        let alreadyIn = this.rowItem.users
        getFreeUsers().then(data => {
          this.addData = data.attr.result
          alreadyIn.forEach((item, index) => {
            // item = Object.assign(item, {_checked: true})
            item['_checked'] = true
            this.addData.push(item)
          })
        })
        this.addTitle = this.rowItem.name
        this.addMemberVisible = true
      },
      setCreate () {
        this.dialogTitle = '部门录入'
        this.selectItem = 'create'
        this.dialogVisible = true
      },
      setEdit () {
        if (this.rowItem === undefined) {
          this.$Message.error('请选择一项进行操作')
          return
        }
        this.dialogTitle = '部门编辑'
        this.selectItem = 'edit'
        this.form = Object.assign({}, this.form, this.rowItem)
        this.dialogVisible = true
      },
      getDept () {
        this.rowItem = undefined
        if (this.keyWord !== '') { // 搜索时重置为第一页
          this.pager.pageNumber = 1
        }
        let params = {pageSize: this.pager.pageSize, pageNumber: this.pager.pageNumber, name: this.keyWord}
        getDeparts(params).then(data => {
          this.tableData = data.attr.list
          this.pager.pageNumber = data.attr.pager.pageNumber
          this.pager.pageSize = data.attr.pager.pageSize
          this.pager.totalRow = data.attr.pager.recordCount
          setTimeout(() => { this.tableLoading = false }, 150)
        })
      },
      update () {
        this.dialogVisible = true
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.selectItem === 'create') {
              addDepart(this.form).then(data => {
                this.getDept()
                this.$Message.success(data.msg)
                this.dialogVisible = false
                this.$refs['form'].resetFields()
              })
            } else if (this.selectItem === 'edit') {
              editDepart(this.form).then(data => {
                this.getDept()
                this.$Message.success(data.msg)
                this.dialogVisible = false
                this.rowItem = undefined
                this.$refs['form'].resetFields()
              })
            } else {
              console.log('updata error in this.selectItem')
            }
          } else {
            this.$Message.error('表单验证失败!')
          }
        })
      },
      remove () {
        if (this.rowItem === undefined) {
          this.$Message.error('请选择一项进行操作')
          return
        }
        if (this.tableData.length === 1 && this.pager.pageNumber !== 1) {
          this.pager.pageNumber-- // 当在最后一页删除最后一条数据 并且 该页不是第一页时, 自动跳转到前一页
        }
        removeDepart(this.rowItem.id).then(data => {
          this.$Message.success(data.msg)
          this.getDept()
        })
      },
      addMember () {
        let userIds = []
        this.selectUser.forEach((item, index) => {
          userIds.push(item.id)
        })
        let params = {id: this.rowItem.id, userIds: userIds}
        setMember(params).then(data => {
          this.$Message.success(data.msg)
          this.getDept()
        })
        this.addMemberVisible = false
      }
    },

    mounted () {
      let clientHeight = document.documentElement.clientHeight
      this.tableHeight = clientHeight - (50 + 25 + 30) - (32 + 67.5 + 52.5 + 20)
      this.getDept()
    }
  }
</script>
