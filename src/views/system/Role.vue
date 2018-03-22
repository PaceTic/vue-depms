<template>
  <div class="roleCls">
    <!-- 搜索栏 -->
    <span>角色名称：</span>
    <Input v-model="keyWord" placeholder="请输入..." style="width: 200px"></Input>
    <Button type="primary" shape="circle" icon="ios-search" @click="getRoles"></Button>

    <!-- 工具栏 -->
    <div style="margin:15px 0px">
      <Button type="primary" icon="plus-circled" @click="setCreate">新增</Button>
      <Button type="primary" icon="edit" @click="setEdit">编辑</Button>
      <Button type="error" icon="trash-b" @click="remove">删除</Button>
    </div>

    <!-- 主表格 -->
    <Table :height="tableHeight" highlight-row @on-current-change="columnSelect"
    :columns="tableHeader" :data="tableData" :loading="tableLoading"></Table>

    <!-- 分页 -->
    <div style="padding: 10px;">
      <div style="float: right; overflow: hidden">
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
        <Form-item label="角色名称" prop="name">
          <Input v-model="form.name"></Input>
        </Form-item>
        <Form-item label="描述" prop="description">
          <Input v-model="form.description"></Input>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="cancelUpdata">取消</Button>
        <Button type="primary" :loading="dialogLoading" @click="update">确定</Button>
      </div>
    </Modal>

    <!-- 权限设置 -->
    <div class="overay" v-show="open" @click="drawerClose"></div>
    <div class="popUp" v-show="open" :class="{'drawerOpen':drawerOpen}">
      <div class="title"><span>权限设置</span></div>
      <Tree style="margin-left: 45px" :data="permitData" show-checkbox 
      @on-check-change="treeCheck" @on-select-change="treeNode" ref="tree"></Tree>
      <div class="button">
        <Button type="primary" @click="submitPermit">确定</Button>
        <Button type="primary" @click="drawerClose" style="float: right">取消</Button>
      </div>
    </div>

  </div>
</template>
<script>
  import { getRoleList, getMenuList, getPermission, removeRole, submitMenu, editRole, addRole } from '../../api/role'
  export default {
    data () {
      return {
        tableData: [],
        permitData: [],

        form: {
          id: undefined,
          name: '',
          description: ''
        },

        rule: {
          name: [
            { required: true, message: '请填写角色名称', trigger: 'blur' },
            { pattern: /^[a-zA-Z]*$/, message: '角色名称只能为字母', trigger: 'blur' }
          ]
        },

        searchItem: '', // 选择的搜索项
        keyWord: '', // 搜索关键字

        rowItem: undefined, // 当前选中行的数据对象
        selectItem: undefined, // 判断点击了录入还是编辑

        dialogTitle: '',
        dialogVisible: false,
        dialogLoading: false,

        pager: {
          totalRow: 0,
          pageSizeOpt: [5, 10, 20, 30, 40],
          pageSize: 10,
          pageNumber: 1
        },

        open: false,
        drawerOpen: false,

        tableHeight: 300,
        tableLoading: true,

        tableHeader: [
          {
            // type: 'index',
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
            title: '角色名称', key: 'name'
          },
          {
            title: '描述', key: 'description'
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
                    click: (event) => {
                      event.stopPropagation()
                      this.currentRow = params.row
                      this.setTreeCheck(params.row.id)
                    }
                  }
                }, '权限设置')
              ])
            }
          }
        ]
      }
    },

    methods: {
      drawerClose () {
        this.drawerOpen = false
        setTimeout(() => {
          this.open = false
        }, 100)
      },
      submitPermit () {
        let permission = []
        this.$refs['tree'].getCheckedNodes().forEach(item => {
          if ('id' in item) {
            permission.push(item.id)
          }
        })
        let params = {roleId: this.currentRow.id, permissions: permission}
        submitMenu(params).then(data => {
          this.$Notice.success({title: data.msg})
        })
        this.drawerClose()
      },
      clearTreeCheck () {
        // 清空所有已勾选节点
        // 需把根节点和子节点全设为false 才能生效
        this.permitData.forEach(root => {
          if (root.children !== undefined) {
            root.children.forEach(child => {
              child.checked = false
            })
            root.checked = false
          }
        })
      },
      setTreeCheck (roleId) {
        /*
          BUG 当从 "多个子节点勾选" 跳转到 "无任何子节点勾选时"
          根节点为半选状态(出错 本应是无勾选状态)
        */
        this.clearTreeCheck()
        getPermission({roleId: roleId}).then(data => {
          console.log(data)
          let list = data.menu
          if (list === null) {
            this.clearTreeCheck()
          } else {
            this.permitData.forEach(root => {
              if (root.children !== undefined) {
                root.children.forEach(child => {
                  if (list.indexOf(child.path) !== -1) {
                    child.checked = true
                  }
                })
              }
            })
          }
          this.open = true
          setTimeout(() => {
            this.drawerOpen = true
          }, 50)
        })
      },
      treeNode (node) {
        /*
          想实现点击node同时选中checkbox
          点击node节点时selected会改变为当前状态的非
          所以每次改变checked属性都要点击2次
          但是修改selected属性会导致整体联动失效
          具体表现为第二次点击node时 父节点的选中状态和子节点失去同步
        */
      },
      treeCheck (checked) {
        console.log(checked)
      },
      handlePageNumber (pageNumber) {
        this.pager.pageNumber = pageNumber
        this.getRoles()
      },
      handlePageSize (pageSize) {
        this.pager.pageSize = pageSize
        this.getRoles()
      },
      columnSelect (currentRow) {
        this.rowItem = currentRow // 把当前点击行的数据对象赋给rowItem
      },
      setCreate () {
        this.dialogTitle = '角色录入'
        this.selectItem = 'create'
        this.dialogVisible = true
      },
      setEdit () {
        if (this.rowItem === undefined) {
          this.$Message.error('请选择一项进行操作')
          return
        }
        this.dialogTitle = '角色编辑'
        this.selectItem = 'edit'
        // this.form = JSON.parse(JSON.stringify(this.rowItem))

        // this.form = this.rowItem
        // this.rowItem = {}
        this.form = Object.assign({}, this.form, this.rowItem)
        this.dialogVisible = true
      },
      cancelUpdata () {
        this.$refs['form'].resetFields()
        this.dialogVisible = false
      },
      update () {
        this.dialogLoading = true
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.selectItem === 'create') {
              addRole(this.form).then(data => {
                this.$Message.success(data.msg)
                this.getRoles()
                this.$refs['form'].resetFields()
                this.dialogLoading = false
                this.dialogVisible = false
              })
            } else if (this.selectItem === 'edit') {
              editRole(this.form).then(data => {
                this.$Message.success(data.msg)
                this.getRoles()
                this.$refs['form'].resetFields()
                this.dialogLoading = false
                this.dialogVisible = false
                this.rowItem = undefined
              })
            } else {
              console.log('updata error in this.selectItem')
            }
          } else {
            this.dialogLoading = false
            this.$Message.error('表单验证失败!')
          }
        })
      },
      getRoles () {
        this.rowItem = undefined
        if (this.keyWord !== '') { // 搜索时重置为第一页
          this.pager.pageNumber = 1
        }
        let params = {pageSize: this.pager.pageSize, pageNumber: this.pager.pageNumber, name: this.keyWord}
        getRoleList(params).then(data => {
          this.tableData = data.attr.list
          this.pager.pageNumber = data.attr.pager.pageNumber
          this.pager.pageSize = data.attr.pager.pageSize
          this.pager.totalRow = data.attr.pager.recordCount
          setTimeout(() => { this.tableLoading = false }, 150)
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
        removeRole(this.rowItem.id).then(data => {
          this.$Message.success(data.msg)
          this.getRoles()
        })
      },
      initPermitData () {
        /*
          初始化树节点

          BUG 同时设置所有根节点checked为true，子节点没有设置，
          第一次点击子节点checkbox根节点没有出现半选状态而是空选，并且伴随一次抖动，之后恢复正常
          实际测试 父节点的checked不由子节点控制  iview version 2.1.0
          更新到iview 2.6.0后有所好转
        */

        getMenuList().then(data => {
          let menu = data.menu // 获取菜单列表
          this.permitData = []
          let routes = this.$router.options.routes
          routes.forEach((item, index) => {
            if (item.leaf && !item.hidden) {
              this.permitData.push({
                expand: true,
                checked: true,
                disabled: true,
                title: item.children ? item.children[0].name : item.name
              })
            } else if (!item.leaf && !item.hidden) {
              let child = []
              for (let i in item.children) {
                let id = ''
                // 下面这个for循环寻找对应菜单id和英文名
                for (let j in menu) {
                  if (item.children[i].name === menu[j].description) {
                    id = menu[j].id
                    break
                  }
                }
                // 把id和英文名与对应菜单进行绑定
                child.push({
                  title: item.children[i].name,
                  checked: false,
                  id: id,
                  path: item.children[i].path
                })
              }
              this.permitData.push({
                expand: true,
                checked: false,
                title: item.name,
                children: child
              })
            }
          })
        })
      }
    },

    created () {
      this.initPermitData()
    },

    mounted () {
      let clientHeight = document.documentElement.clientHeight
      this.tableHeight = clientHeight - (50 + 25 + 30) - (32 + 67.5 + 52.5 + 20)
      this.getRoles()
    }
  }
</script>
<style lang="scss">
.roleCls{
  tr.ivu-table-row-highlight td {
    background-color: rgba(146, 231, 77, 0.75);
  }
  tr.ivu-table-row-hover td {
    background-color: rgba(146, 231, 77, 0.75);
  }
  .overay {
    background: #000;
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    z-index: 20;
    opacity: 0.6;
  }
  .drawerOpen {
    transform: translate3d(-100%, 0, 0);
  }
  .popUp {
    overflow: hidden;
    transition: all .65s cubic-bezier(.23,1,.32,1);
    position: fixed;
    z-index: 21 !important; 
    background-color: White; 
    width: 256px; 
    left: auto; 
    top: 0; 
    right: -256px;
    bottom: 0;
    font-size: 20px;
    .title {
      display: flex;
      box-shadow: 0 1px 6px rgba(0,0,0,.117647), 
                  0 1px 4px rgba(0,0,0,.117647);
      align-items:center;
      height: 50px;
      padding: 0 10px;
      width: 100%;
      font-size: 18px;
      line-height: 50px;
    }
    .button{
      width: 55%;
      margin: auto
    }
    .ivu-tree ul li {
      font-size: 16px;
    }
    .ivu-tree-children {
      // margin-left: 10px
    }
    .ivu-checkbox-wrapper {
      // margin-left: 5px
    }
  }
}
</style>
