<template>
  <section>
    <div style="margin-bottom:20px">
      <span style="text-align:left">
        <Button type="primary" @click="add" icon="android-add">新增</Button>
        <Button type="primary" @click="edit" icon="edit" :disabled="handleDisable">修改密码</Button>
        <Button type="primary" @click="editMsg" icon="edit" :disabled="handleDisable">修改信息</Button>
        <Button type="primary" @click="remove" icon="trash-b" :disabled="handleDisable">删除</Button>
        <Button type="error" @click="lock" icon="locked" :disabled="lockDisable">锁定</Button>
        <Button type="success" @click="activate" icon="unlocked" :disabled="unlockDisable">激活</Button>
        <Button type="success" @click="roleHandle" icon="settings" :disabled="handleDisable">角色</Button>
        <Button type="success" @click="upData" icon="refresh" :disabled="upDataDisable">更新</Button>
      </span>
      <span style="margin-left:80px">
        <label>用户名/真实姓名:</label>
        <AutoComplete v-model="filter.name" clearable :data="searchData" @on-search="filterMethod" @keyup.13.native="getData" placeholder="请输入..." style="width:150px"></AutoComplete>
        <Button type="primary" @click="getData" shape="circle" icon="ios-search">搜索</Button>
      </span>
    </div>
    <div class="userTable">
      <Table highlight-row border @on-current-change="danxuan" @on-select="chooseRows" @on-select-cancel="chooseRows" :columns='columns' :height="tableHeight" :loading="tableLoad" :data='tableData' size='small' ref='table'>
      </Table>
    </div>
    <div style="margin-top:10px">
      <Page style="float: right" placement='top' show-total show-sizer show-elevator @on-page-size-change="pageSizeChange" :page-size-opts="[10, 15, 20, 50]" :page-size="pager.pageSize" :total="pager.total" :current="pager.pageNumber" @on-change="changePage"></Page>
    </div>
    <Modal :styles="{top: '20px'}" v-model="userModal" title="用户管理信息" :closable="false" width="950px">
      <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="80">
        <div class="class1">
          <div class="class2">
            <Form-item label="用户名" prop="name">
              <Input :disabled="isUpdate" v-model="formItem.name" style="width: 187px" placeholder="请输入"></Input>
            </Form-item>
            <Form-item label="真实姓名" prop="realName">
              <Input :disabled="isUpdate" v-model="formItem.realName" style="width: 187px" placeholder="请输入"></Input>
            </Form-item>
            <Form-item label="禅道账号" prop="account">
              <Input style="width: 187px"  v-model="formItem.account" placeholder="请输入禅道账号"></Input>
            </Form-item>
            <div v-if="pwdHidden">
            <Form-item label="密码" prop="password">
              <Input type="password" style="width: 187px" v-model="formItem.password" placeholder="请输入密码"></Input>
            </Form-item>
            <Form-item label="确定密码" prop="confirmPwd">
              <Input style="width: 187px" type="password" v-model="formItem.confirmPwd" placeholder="请输入密码"></Input>
            </Form-item>
            </div>
            <div v-if="!isUpdate">
              <Form-item label="锁定" prop="locked">
                <Radio-group style="width: 187px" v-model="formItem.locked" placeholder="请选择锁定状态">
                  <Radio label="1">是</Radio>
                  <Radio label="0">否</Radio>
                </Radio-group>
              </Form-item>
              <Form-item label="角色" prop="role">
                <RadioGroup v-model="formItem.role">
                  <table>
                    <tr v-for="items in Math.ceil(roleLength / 4)" :key="items">
                      <td v-for="(item, index) in roleList" v-if ="index < 4 * items && index >= 4 * (items - 1)" :key="index">
                        <Radio :label="item.roleId" :key="index">{{item.roleName}}
                        </Radio>
                      </td>
                    </tr>
                  </table>
                </RadioGroup>
              </Form-item>
            </div>
          </div>
          <div class="class3">
            <Form-item label="手机号码" prop="phone">
              <Input style="width: 187px"  v-model="formItem.phone" placeholder="请输入手机号码"></Input>
            </Form-item>
            <Form-item label="办公电话" prop="officePhone">
              <Input style="width: 187px" v-model="formItem.officePhone" placeholder="请输入办公电话"></Input>
            </Form-item>
            <Form-item label="邮箱" prop="email">
              <AutoComplete v-model="formItem.email" @on-search="emailSearch" placeholder="请输入邮箱" style="width:187">
                <Option v-for="item in emailData" :value="item" :key="item">{{ item }}</Option>
              </AutoComplete>
              <!-- <Input style="width: 187px"  v-model="formItem.email" placeholder="请输入邮箱"></Input> -->
            </Form-item>
            <Form-item label="入职时间" prop="joinDate">
              <DatePicker style="width: 187px" placement="top" format="yyyy-MM-dd" v-model="joinDate" type="date" placeholder="请输入入职时间"></DatePicker >
            </Form-item>
            <Form-item label="出生日期" prop="birth">
              <DatePicker style="width: 187px" placement="top" format="yyyy-MM-dd" v-model="birth" type="date" placeholder="请输入出生日期"></DatePicker >
            </Form-item>
            <Form-item label="性别" prop="sex">
              <Radio-group style="width: 187px" v-model="formItem.sex">
                <Radio label="男"><Icon type="man"></Icon>男</Radio>
                <Radio label="女"><Icon type="woman"></Icon>女</Radio>
              </Radio-group>
            </Form-item>
            <Form-item label="工作状态" prop="status">
              <Radio-group style="width: 187px" v-model="formItem.status">
                <Radio label="0">在职</Radio>
                <Radio label="1">离职</Radio>
              </Radio-group>
            </Form-item>
          </div>
          <div class="class4">
            <Form-item label="上网账号" prop="netAccount">
              <Input style="width: 187px"  v-model="formItem.netAccount" placeholder="请输入上网账号"></Input>
            </Form-item>
            <Form-item label="IP地址" prop="ipAddress">
              <Input style="width: 187px"  v-model="formItem.ipAddress" placeholder="请输入IP地址"></Input>
            </Form-item>
            <Form-item label="svn账号" prop="svnAccount">
              <Input style="width: 187px"  v-model="formItem.svnAccount" placeholder="请输入svn账号"></Input>
            </Form-item>
            <Form-item label="OA账号" prop="oaAccount">
              <Input style="width: 187px"  v-model="formItem.oaAccount" placeholder="请输入OA账号"></Input>
            </Form-item>
            <Form-item label="QQ号" prop="qq">
              <Input style="width: 187px"  v-model="formItem.qq" placeholder="请输入QQ号"></Input>
            </Form-item>
            <Form-item label="微信号" prop="wx">
              <Input style="width: 187px"  v-model="formItem.wx" placeholder="请输入微信号"></Input>
            </Form-item>
            <Form-item label="其他IM账号" prop="im">
              <Input style="width: 187px"  v-model="formItem.im" placeholder="请输入其他IM账号"></Input>
            </Form-item>
          </div>
        </div>
      </Form>
      <div slot="footer">
        <Button @click="submitCancel('formItem')">取消</Button>
        <Button type="primary" @click="submit('formItem')">确定</Button>
      </div>
    </Modal>
    </div>
    <!-- 修改密码 -->
    <Modal v-model="pwdModal" title="密码更改">
      <Form ref="pwdItem" :model="pwdItem" :rules="ruleValidate" :label-width="80">
        <Form-item label="用户名" prop="name">
          <Input :disabled="isUpdate" v-model="pwdItem.name" style="width: 187px" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="真实姓名" prop="realName">
          <Input :disabled="isUpdate" v-model="pwdItem.realName" style="width: 187px" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="密码" prop="passwords">
          <Input type="password" style="width: 187px" v-model="pwdItem.passwords" placeholder="请输入密码"></Input>
        </Form-item>
        <Form-item label="确定密码" prop="confirmPwds">
          <Input style="width: 187px" type="password" v-model="pwdItem.confirmPwds" placeholder="请输入密码"></Input>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button @click="submitCancel('pwdItem')">取消</Button>
        <Button type="primary" @click="pwdSubmit('pwdItem')">确定</Button>
      </div>
    </Modal>
    <!-- 角色更改 -->
    <Modal v-model="roleModal" title="角色更改" width="400px">
      <RadioGroup v-model="roles">
        <table>
          <tr v-for="items in Math.ceil(roleLength / 4)" :key="items">
            <td v-for="(item, index) in roleList" v-if ="index < 4 * items && index >= 4 * (items - 1)" :key="index">
              <Radio :label="item.roleId" :key="index">{{item.roleName}}
              </Radio>
            </td>
          </tr>
        </table>
      </RadioGroup>
      <div slot="footer">
        <Button @click="submitCancel('formItem')">取消</Button>
        <Button type="primary" @click="roleSubmit()">确定</Button>
      </div>
    </Modal>
  </section>
</template>
<script>
import moment from 'moment'
import { getUserList, getAllUser, addUser, removeUser, editUser, lockUser, unLockUser, updataRole, editMsgSubmit, getNewData } from './../../api/user'
import { getRoleList } from './../../api/role'
import expandRow from './user-expand.vue'
export default {
  data () {
    const validateNewPwd = (rule, value, callback) => {
      let formName = ''
      let confirm = ''
      if (rule.field in this.formItem) {
        formName = 'formItem'
      } else if (rule.field in this.pwdItem) {
        formName = 'pwdItem'
      }
      if ('confirmPwd' in this[formName]) {
        confirm = 'confirmPwd'
      } else {
        confirm = 'confirmPwds'
      }
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this[formName][rule.field] !== '') {
          // 对第二个密码框单独验证
          this.$refs[formName].validateField(confirm)
        }
        callback()
      }
    }
    const validateSurePwd = (rule, value, callback) => {
      let formName = ''
      let pwd = ''
      if (rule.field in this.formItem) {
        formName = 'formItem'
      } else if (rule.field in this.pwdItem) {
        formName = 'pwdItem'
      }
      if ('confirmPwd' in this[formName]) {
        pwd = 'password'
      } else {
        pwd = 'passwords'
      }
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this[formName][pwd]) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      upDataDisable: false,
      tableLoad: true,
      searchData: [],
      emailData: [],
      allData: [],
      pwdHidden: true,
      // 权限控制
      roleList: [],
      roleModal: false,
      roles: '',
      upRole: [],
      roleLength: '',

      adminDis: true,
      tableHeight: '400px',
      filter: {
        name: ''
      },
      handleDisable: true,
      lockDisable: true,
      unlockDisable: true,
      isUpdate: false,
      pager: {
        total: 0,
        pageNumber: 1,
        pageSize: 10
      },
      userModal: false,
      birth: '',
      joinDate: '',
      pwdModal: false,
      pwdItem: {
        id: '',
        name: '',
        realName: '',
        passwords: '',
        confirmPwds: ''
      },
      formItem: {
        name: '',
        realName: '',
        password: '',
        confirmPwd: '',
        locked: '',
        phone: '',
        officePhone: '',
        email: '',
        birth: '',
        sex: '',
        joinDate: '',
        status: '',
        netAccount: '',
        ipAddress: '',
        svnAccount: '',
        account: '',
        oaAccount: '',
        qq: '',
        wx: '',
        im: '',
        role: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        locked: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        password: [
          { required: true, validator: validateNewPwd, trigger: 'blur' }
        ],
        confirmPwd: [
          { required: true, validator: validateSurePwd, trigger: 'blur' }
        ],
        passwords: [
          { required: true, validator: validateNewPwd, trigger: 'blur' }
        ],
        confirmPwds: [
          { required: true, validator: validateSurePwd, trigger: 'blur' }
        ],
        phone: [
          { pattern: /^1[3|4|5|7|8][0-9]\d{4,8}$/, message: '请输入正确手机号码格式' }
        ]

      },
      columns: [
        {
          type: 'selection', width: 60
        },
        {
          type: 'expand',
          width: 35,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row
              }
            })
          }
        },
        {
          title: '序号',
          width: 70,
          align: 'center',
          render: (h, params) => {
            return h('span', {},
              (this.pager.pageNumber - 1) * this.pager.pageSize + params.index + 1
            )
          }
        },
        {
          title: '用户名', align: 'center', key: 'name'
        },
        {
          title: '真实姓名', align: 'center', key: 'realName'
        },
        {
          title: '创建时间', align: 'center', key: 'createTime'
        },
        {
          title: '更新时间', align: 'center', key: 'updateTime'
        },
        {
          title: '是否锁定', align: 'center', key: 'locked', width: 100
        }
      ],
      tableData: [],
      selData: [],
      danData: {}
    }
  },
  components: {
    expandRow
  },
  methods: {
    upData () {
      getNewData().then(res => {
        this.getData('更新成功')
        this.$Notice.success({
          title: '数据更新成功!'
        })
      })
    },
    emailSearch (value) {
      this.emailData = []
      this.emailData = !value || value.indexOf('@') >= 0 ? [] : [
        value + '@qq.com', value + '@sina.com', value + '@163.com', value + '@126.com'
      ]
    },
    filterMethod () {
      this.searchData = []
      for (var i in this.allData) {
        if (this.allData[i].name.toUpperCase().indexOf(this.filter.name.toUpperCase()) !== -1 || this.allData[i].realName.indexOf(this.filter.name) !== -1) {
          this.searchData.push(this.allData[i].realName)
        }
      }
      this.searchData = this.filter.name === '' ? [] : this.searchData
    },
    // 单选触发打钩
    danxuan (currentRow) {
      this.danData = currentRow
      this.tableData.forEach(item => {
        if (this.danData.id.indexOf(item.id) !== -1) {
          this.$set(item, '_checked', true)
          this.handleDisable = this.lockDisable = this.unlockDisable = false
          this.selData[0] = this.danData
          this.role = this.selData[0].roles[0].id
        } else {
          this.$set(item, '_checked', false)
        }
      })
    },
    // 权限控制
    roleHandle () {
      this.roles = this.selData[0].roles[0].id
      this.roleModal = true
    },
    lock () {
      let selIds = this.selData.map(item => item.id)
      this.$Modal.confirm({
        title: '锁定确定',
        content: '你确定锁定这些用户吗？',
        onOk: () => {
          lockUser({ ids: selIds.join(',') }).then(res => {
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
          }).catch(() => {
            this.$Notice.error({
              title: '锁定失败！'
            })
          })
        },
        onCancel: () => {
          this.$Message.info('你取消了锁定')
        }
      })
    },
    activate () {
      this.unlockDisable = false
      let selIds = this.selData.map(item => item.id)
      this.$Modal.confirm({
        title: '激活确定',
        content: '你确定激活这些用户吗？',
        onOk: () => {
          unLockUser({ ids: selIds.join(',') }).then(res => {
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
          }).catch(() => {
            this.$Notice.error({
              title: '激活失败！'
            })
          })
        },
        onCancel: () => {
          this.$Message.info('你取消了激活')
        }
      })
    },
    /* 选中和取消用同一个函数名 */
    chooseRows (selection) {
      this.selData = selection
      if (this.selData.length === 0) {
        this.handleDisable = this.lockDisable = this.unlockDisable = true
      } else if (this.selData.length === 1) {
        this.handleDisable = this.lockDisable = this.unlockDisable = false
      } else {
        this.handleDisable = true
        this.lockDisable = this.unlockDisable = false
        let selLock = this.selData.map(item => item.locked)
        for (var j in selLock) {
          if (selLock[j] === true) {
            this.lockDisable = true
            this.unlockDisable = false
          } else {
            this.lockDisable = this.unlockDisable = false
          }
        }
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
        content: '你确定删除这个用户吗？',
        onOk: () => {
          if (this.tableData.length === 1 && this.pager.pageNumber !== 1) {
            this.pager.pageNumber-- // 当在最后一页删除最后一条数据 并且 该页不是第一页时, 自动跳转到前一页
          }
          removeUser(this.selData[0].id).then((res) => {
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
          }).catch(() => {
            this.$Notice.error({
              title: '删除失败!'
            })
          })
        },
        onCancel: () => {
          this.$Message.info('你取消了删除')
        }
      })
    },
    add () {
      this.pwdHidden = this.userModal = true
      this.$refs['formItem'].resetFields()
      this.birth = this.joinDate = ''
      this.isUpdate = false
    },
    edit () {
      this.isUpdate = this.pwdModal = true
      this.pwdItem.id = this.selData[0].id
      this.pwdItem.name = this.selData[0].name
      this.pwdItem.realName = this.selData[0].realName
    },
    editMsg () {
      this.$refs['formItem'].resetFields()
      this.formItem = Object.assign({}, this.formItem, this.selData[0])
      this.birth = this.formItem.birth
      this.joinDate = this.formItem.joinDate
      this.userModal = this.isUpdate = true
      this.pwdHidden = false
    },
    roleSubmit () {
      this.upRole.push(this.roles)
      let para = {
        userId: this.selData[0].id,
        ids: this.upRole
      }
      updataRole(para).then(res => {
        this.$Notice.success({
          title: '角色更新成功!'
        })
        this.roleModal = false
        this.getData()
      })
    },
    pwdSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let para = {
            id: this.pwdItem.id,
            password: this.pwdItem.passwords
          }
          editUser(para).then((res) => {
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
            this.pwdModal = false
            this.$refs[name].resetFields()
          }).catch(() => {
            this.$Notice.error({
              title: '密码修改失败'
            })
            this.$refs[name].resetFields()
          })
        } else {
          this.$Message.error('表单验证失败!')
        }
      })
    },
    submit (name) {
      this.upRole = []
      this.$refs[name].validate((valid) => {
        if (valid) {
          console.log(this.formItem)
          this.roleList.forEach(item => {
            if (this.formItem.role[0].indexOf(item.roleName) !== -1) {
              this.$set(this.formItem, 'roleId', item.roleId)
            }
          })
          if (this.pwdHidden === false) {
            this.formItem.birth = moment(this.birth).format('YYYY-MM-DD')
            this.formItem.joinDate = moment(this.joinDate).format('YYYY-MM-DD')
            this.formItem.birth = this.formItem.birth === 'Invalid date' ? '' : this.formItem.birth
            this.formItem.joinDate = this.formItem.joinDate === 'Invalid date' ? '' : this.formItem.joinDate
            delete this.formItem.password
            delete this.formItem.locked
            let para = Object.assign(this.formItem, {userId: this.formItem.id})
            editMsgSubmit(para).then(res => {
              this.$Notice.success({
                title: '用户信息更改成功'
              })
              this.getData()
              this.userModal = false
              this.$refs[name].resetFields()
            })
          } else {
            this.formItem.birth = moment(this.birth).format('YYYY-MM-DD')
            this.formItem.joinDate = moment(this.joinDate).format('YYYY-MM-DD')
            this.formItem.birth = this.formItem.birth === 'Invalid date' ? '' : this.formItem.birth
            this.formItem.joinDate = this.formItem.joinDate === 'Invalid date' ? '' : this.formItem.joinDate
            this.upRole.push(this.formItem.role)
            let para = Object.assign(this.formItem, {ids: this.upRole}) // 有问题
            addUser(para).then((res) => {
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
              this.userModal = false
              this.$refs[name].resetFields()
            }).catch(() => {
              this.$Notice.error({
                title: '新增失败'
              })
              this.$refs[name].resetFields()
            })
          }
        } else {
          this.$Message.error('表单验证失败!')
        }
      })
    },
    submitCancel (name) {
      this.$refs[name].resetFields()
      this.userModal = this.roleModal = this.pwdModal = false
    },
    getData (val) {
      this.roleList = []
      this.selData = []
      this.upRole = []
      getAllUser().then(res => {
        this.allData = res.list
      })
      getRoleList().then(res => {
        res.attr.list.forEach(item => {
          this.roleList.push({
            roleName: item.description,
            roleId: item.id
          })
        })
        this.roleLength = this.roleList.length
      })
      this.handleDisable = this.lockDisable = this.unlockDisable = true
      if (val === '更新成功' || this.filter.name !== '') {
        this.pager.pageNumber = 1
      }
      let para = {
        realName: this.filter.name,
        pageSize: this.pager.pageSize,
        pageNumber: this.pager.pageNumber
      }
      getUserList(para).then(res => {
        if (res.ok) {
          this.pager.total = res.attr.pager.recordCount
          this.pager.pageNumber = res.attr.pager.pageNumber
          this.pager.pageSize = res.attr.pager.pageSize
          this.tableData = res.attr.list
          this.tableData.forEach(item => {
            item.locked = item.locked === '0' ? '否' : '是'
          })
          setTimeout(() => {
            this.tableLoad = false
          }, 50)
        } else {
          this.$Notice.error({
            title: res.msg
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
    let clientHeight = document.documentElement.clientHeight
    this.tableHeight = clientHeight - this.$refs.table.$el.offsetTop - 160
    this.getData()
    /* let y = document.getElementsByClassName('ivu-modal')
    y[0].style.marginTop = '-80px' */
  }
}
</script>
<style lang="scss">
.userTable {
  tr.ivu-table-row-highlight td {
    background-color: rgba(146, 231, 77, 0.75);
  }
  tr.ivu-table-row-hover td {
    background-color: rgba(146, 231, 77, 0.75);
  }
}
.class1 {
  display: flex;
  justify-content:space-around;
}
</style>
