<template>
    <div style="margin:-16px">
      <Table highlight-row border @on-select="chooseRows" @on-select-cancel="chooseRows" height="350" :columns='project' :data='tableData' size='small' ref='table'>
      </Table>
    </div>
</template>
<script>
import { getUserProject } from './../../api/project'
export default {
  data () {
    return {
      project: [
        {
          type: 'selection',
          width: 60
        },
        {
          'title': '序号',
          'width': 70,
          align: 'center',
          render: (h, params) => {
            return h(
              'span',
              {},
             params.index + 1
            )
          }
        },
        {
          title: '用户名',
          key: 'name',
          align: 'center',
          width: 150
        },
        {
          title: '创建时间',
          align: 'center',
          key: 'createTime'
        },
        {
          title: '更新时间',
          align: 'center',
          key: 'updateTime'
        },
        {
          title: '用户昵称',
          key: 'nickName',
          align: 'center',
          width: 100
        }
      ],
      tableData: [],
      selData: []
    }
  },
  methods: {
    chooseRows (selection) {
      this.selData = selection
      this.$emit('chooseUser', this.selData)
    },
    getData () {
      getUserProject().then(res => {
        if (res.ok) {
          this.tableData = res.attr.list
        }
      })
    }
  },
  mounted () {
    this.getData()
  }/* ,
  created () {
    this.totalData()
  } */
}
</script>
<style>
</style>
