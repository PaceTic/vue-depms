<template>
  <section>
    <Table :loading="totalLoad" highlight-row border :columns='total' :data='totalData'  :height="400" size='small' ref='table'>
    </Table>
  </section>
</template>
<script>
import { totalPreview } from './../../api/jxkh'
export default {
  props: {
    workData: {
      type: Array
    },
    quaData: {
      type: Array
    }
  },
  data () {
    return {
      totalLoad: true,
      totalData: [],
      total: [
        {
          title: '姓名', align: 'center', key: 'realName'
        },
        {
          title: '总分', align: 'center', key: 'totalScore'
        }
      ]
    }
  },
  methods: {
    getData () {
      totalPreview({projectId: sessionStorage.getItem('projectId')}).then(res => {
        this.totalData = res.maps
        this.totalLoad = false
      })
    }
  },
  mounted () {
    this.getData()
  },
  watch: {
    'workData' (val) {
      this.getData()
      console.log('wprk')
    },
    'quaData' (val) {
      this.getData()
      console.log('qua')
    }
  }
}
</script>
<style lang="scss">
tr.ivu-table-row-highlight td {
  background-color: rgba(146, 231, 77, 0.75);
}
tr.ivu-table-row-hover td {
  background-color: rgba(146, 231, 77, 0.75);
}
</style>

