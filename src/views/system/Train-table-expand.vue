<template>
  <div>
    <Row class="expand-row">
      <Col span="24">
      <span class="expand-key">主讲人: </span>
      <span class="expand-value">{{ speaker }}</span>
      </Col>
    </Row>
    <Row>
      <Col span="24">
      <span class="expand-key">培训人员: </span>
      <span class="expand-value">{{ listener }}</span>
      </Col>
    </Row>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        speaker: '',
        listener: ''
      }
    },
    props: {
      row: Object
    },
    watch: {
      'row.speaker': {
        handler: function (val, oldVal) {
          val.forEach(item => {
            this.speaker += (item.userName + '，')
          })
          this.speaker = this.speaker.substr(0, this.speaker.length - 1)
        },
        deep: true,
        immediate: true
      },
      'row.listener': {
        handler: function (val, oldVal) {
          val.forEach(item => {
            this.listener += (item.userName + '，')
          })
          this.listener = this.listener.substr(0, this.listener.length - 1)
        },
        deep: true,
        immediate: true
      }
    }
  }
</script>

<style scoped>
  .expand-row {
    margin-bottom: 16px;
  }
</style>