<template>
  <div class="total">
    <span class="tool">
      <DatePicker :value="year" type="year" placeholder="请选择年份" @on-change="handleYearChange"
      style="width: 120px; margin-right: 10px;" :clearable="false"></DatePicker>
      <Button type="primary" icon="ios-download" @click="exportData">导出</Button>
    </span>
    <div class="title">研发中心月度考核汇总</div>
    <!-- 主表格 -->
    <Table :height="tableHeight" :data="tableData" border 
    :columns="tableHeader" :loading="tableLoading" stripe></Table>
  </div>
</template>
<script>
  import axios from 'axios'
  export default {
    data () {
      return {
        year: new Date().getFullYear().toString(),
        tableHeight: 100,
        tableData: [],
        tableLoading: false,
        tableHeader: [
          {
            type: 'index',
            align: 'center',
            width: 60
          },
          { title: '姓名', key: 'userName', width: 100 },
          { title: '1月', key: 'one' },
          { title: '2月', key: 'two' },
          { title: '3月', key: 'three' },
          { title: '4月', key: 'four' },
          { title: '5月', key: 'five' },
          { title: '6月', key: 'six' },
          { title: '7月', key: 'seven' },
          { title: '8月', key: 'eight' },
          { title: '9月', key: 'nine' },
          { title: '10月', key: 'ten' },
          { title: '11月', key: 'eleven' },
          { title: '12月', key: 'twelve' },
          { title: '平均分', key: 'avg', width: 80, sortable: true }
        ]
      }
    },
    methods: {
      handleYearChange (val) {
        this.year = val
        this.getData()
      },
      exportData () {
        location.href = 'api/staff/export/yearscore?' + 'year=' + this.year
      },
      getData () {
        this.tableLoading = true
        axios.get('api/manager/yearCount', {params: {year: this.year}}).then(res => {
          this.tableData = res.data.yearCount
          this.tableLoading = false
        })
      }
    },
    mounted () {
      this.getData()
      this.tableHeight = document.documentElement.clientHeight - 105 - 80
    }
  }
</script>
<style lang="scss">
.total{
  tr.ivu-table-row-hover td {
    background-color: rgba(146, 231, 77, 0.75) !important;
  }
  .tool{
    input{
      text-align: center;
    }
    float: right
  }
  .title{
    display: flex;
    justify-content: center;
    font-size: 20px;
    padding-left: 170px;
    padding-bottom: 10px;
  }
}
</style>
