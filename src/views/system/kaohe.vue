<template>
  <div class="kaohe">
      <Row type="flex" justify="center">
        <Col span="6" >
          <Card style="width:190px">
            <p slot="title">
              <Checkbox :value="selected[0].check" :indeterminate="selected[0].indeterminate" @on-change="Change(assessment.data, assessment.selected, selected[0])">
              </Checkbox><Icon type="person-stalker" size="20"></Icon>
              <span class="headTitle" @click="click('assessment')"> 需要考核的人</span> 
            </p>
            <div style="height:225px; overflow: auto;">
              <CheckboxGroup v-model="assessment.selected" @on-change="projectChange(assessment.data, assessment.selected, selected[0])">
                <div class="checkbox" v-for="item in assessment.data" :key="item.id">
                  <Checkbox :label="JSON.stringify(item)">
                    <span class="content">{{ item.realName }}</span>
                  </Checkbox>
                </div>
              </CheckboxGroup>
            </div>
          </Card>
        </Col>
        <Col span="6">
          <Card style="width:360px">
            <p slot="title">
              <Icon type="person-stalker" size="20"></Icon>
              <span class="headTitle" @click="selectClear">&thinsp; 选中的考核人员</span> 
            </p>
            <div style="height:225px; overflow:auto;">
              <p v-if="assessment.selected.length"><Tag checkable color="green">需要考核的人</Tag></p>
              <div style="display: inline-block;width: 90px;margin: 0 5px;" v-for="(item, index) in assessment.selected" :key="item" @click="handleClose(assessment.selected, index, selected[0])"><Tag type="dot"  color="green" >{{JSON.parse(item).realName}}</Tag></div>
              <div v-for="items in project" :key="items.data.id" v-if="items.selected.length"><p><Tag checkable color="blue">{{items.data.name}}</Tag></p>
                <div style="display: inline-block;" v-for="(item, index) in items.selected" :key="item.id" @click="handleClose(items.selected, index, selected[index + 1])">
                  <Tag type="dot"  color="blue">{{JSON.parse(item).realName}}</Tag>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span="6" offset="5">
          <Card style="width:230px">
            <p slot="title">
              <Icon type="ios-flame" size="20"></Icon>
              <span class="headTitle">&thinsp; 项目</span> 
            </p>
            <div style="min-height: 225px;">
              <Menu :open-names="openValue" accordion width="200px" ref="menu">
                <Submenu :name="items.data.id" v-for="(items, index) in project" :key="items.data.id">
                  <template slot="title">
                    <div style="width:150px;display: inline-block;">
                      <Checkbox :value="selected[index + 1].check" :indeterminate="selected[index + 1].indeterminate" @on-change="Change(project[index].data.users, project[index].selected, selected[index + 1])">
                        <span>&thinsp; </span>
                      </Checkbox>
                      <Icon type="ios-folder-outline" size="15"></Icon>
                        <span @click="click(index)" >{{items.data.name}}</span>
                    </div> 
                  </template>
                  <MenuGroup :title="manager[index].realName">
                    <div style="max-height:110px;overflow:auto;">
                      <CheckboxGroup v-model="items.selected" @on-change="projectChange(project[index].data.users, project[index].selected, selected[index + 1])">
                        <MenuItem :name="JSON.stringify(item)" v-for="item in items.data.users" :key="item.id">
                          <Checkbox :label="JSON.stringify(item)">
                            <span class="content">{{ item.realName }}</span>
                          </Checkbox>
                        </MenuItem>
                      </CheckboxGroup>
                    </div>
                  </MenuGroup>
                </Submenu>
              </Menu>
            </div>
          </Card>
        </Col>
      </Row>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data () {
    return {
      project: [
        // {data: {id: 111, name: '货运项目', users: []}, selected: []},
        // {data: {id: 222, name: '送货项目', users: []}, selected: []}
      ],
      openValue: [1],
      selected: [
        {check: false, indeterminate: false},
        {check: false, indeterminate: false},
        {check: false, indeterminate: false},
        {check: false, indeterminate: false},
        {check: false, indeterminate: false},
        {check: false, indeterminate: false}
      ],
      select: '',
      manager: []
    }
  },
  methods: {
    bClick () {
      if (this.select !== 'assessment') {
        for (var i in this.assessment.selected) {
          if (JSON.stringify(this.project[this.select].data.users).indexOf(JSON.parse(this.assessment.selected[i]).realName) === -1 && JSON.parse(this.assessment.selected[i]).realName !== this.manager[this.select].realName) {
            this.project[this.select].data.users.push(JSON.parse(this.assessment.selected[i]))
          }
        }
        for (var x in this.project) {
          for (var y in this.project[x].selected) {
            if (JSON.stringify(this.project[this.select].data.users).indexOf(JSON.parse(this.project[x].selected[y]).realName) === -1 && JSON.parse(this.project[x].selected[y]).realName !== this.manager[this.select].realName) {
              this.project[this.select].data.users.push(JSON.parse(this.project[x].selected[y]))
            }
          }
        }
      }
      for (var c in this.project) {
        for (var e in this.project[c].selected) {
          for (var f in this.project[c].data.users) {
            if (this.project[c].data.users[f].realName === JSON.parse(this.project[c].selected[e]).realName) {
              this.project[c].data.users.splice(f, 1)
            }
          }
        }
      }
      this.selectClear()
      this.$emit('childToParent', this.project, this.manager)
    },
    Change (array, array2, select) {
      if (select.indeterminate) {
        select.check = true
      } else {
        select.check = !select.check
      }
      select.indeterminate = false
      if (select.check) {
        array2.splice(0, array.length)
        for (var i in array) {
          array2.push(JSON.stringify(array[i]))
        }
      } else {
        array2.splice(0, array.length)
      }
    },
    projectChange (array, array2, select) {
      if (array.length === array2.length) {
        select.check = true
        select.indeterminate = false
      } else if (array2.length > 0) {
        select.check = false
        select.indeterminate = true
      } else {
        select.check = false
        select.indeterminate = false
      }
    },
    selectClear () {
      this.selected = [{check: false, indeterminate: false}, {check: false, indeterminate: false}, {check: false, indeterminate: false}, {check: false, indeterminate: false}, {check: false, indeterminate: false}, {check: false, indeterminate: false}]
      this.assessment.selected = []
      for (var i in this.project) {
        this.project[i].selected = []
      }
    },
    click (val) {
      console.log(val)
      this.select = val
      this.bClick()
      if (val !== 'assessment') {
        this.openValue = [this.project[val].data.id]
      }
      this.$nextTick(function () {
        this.$refs.menu.updateOpened()
      })
    },
    handleClose (array, index, select) {
      array.splice(index, 1)
      if (array.length === 0) {
        select.check = false
        select.indeterminate = false
      }
    }
  },
  created () {
    // for (var i in this.project) {
    //   this.project[i].selected = []
    // }
    // console.log(this.project)
    var that = this
    axios({
      url: '/api/project/queryall',
      method: 'get'
    }).then((res) => {
      console.log(res)
      that.project = res.data.attr.result
      for (var i in that.project) {
        that.manager.push(that.project[i].data.users[0])
        that.project[i].data.users.splice(0, 1)
      }
      console.log(that.manager)
    })
  },
  props: ['assessment']
}
</script>

<style>
.headTitle{
  font-size: 15px;
  cursor: pointer;
}
.kaohe .ivu-card-head{
  padding: 10px 16px;
}
.kaohe .ivu-card-body{
  padding: 10px 16px;
}
.kaohe .ivu-checkbox-input {
  pointer-events: none;
}
.kaohe .ivu-tag-dot {
  width: 90px;
  text-align: center;
}
.kaohe .ivu-menu-submenu-title {
  padding: 5px 12px;
}
.kaohe .ivu-menu-vertical .ivu-menu-item-group-title{
  height: 24px;
  line-height: 24px;
}
.kaohe .ivu-menu-vertical.ivu-menu-light:after{
  display: none;
}
.kaohe .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu){
  border: 0;
}
.kaohe .ivu-menu-item{
  padding: 2px 24px;
}
.kaohe p{
  height: auto;
  display: flex;
  justify-content: center;
}
.checkbox{
  margin: 0 5px 0 10px;
  padding-left: 10px;
}
.checkbox:hover{
  background-color: #e9eaec;
}
.content{
    padding: 7px 0 7px 15px;
    width: 80px;
    font-size: 15px;
    display: inline-block;
}
.kaohe select{
      display: block;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-left: 8px;
    padding-right: 24px;
}
</style>
//  缺陷：当menu用@on-select函数结合CheckBox，点击CheckBox的span会执行两次@on-select函数
