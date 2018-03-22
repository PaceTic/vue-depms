<template>
    <div>
        <Row class="expand-row">
          <Col span="5">
              <span class="expand-key">手机号码: </span>
              <span class="expand-value">{{ row.phone }}</span>
          </Col>
          <Col span="5">
              <span class="expand-key">办公电话: </span>
              <span class="expand-value">{{ row.officePhone }}</span>
          </Col>
          <Col span="5">
              <span class="expand-key">邮箱: </span>
              <span class="expand-value">{{ row.email }}</span>
          </Col>
          <Col span="5">
              <span class="expand-key">IP地址: </span>
              <span class="expand-value">{{ row.ipAddress }}</span>
          </Col>
          <Col span="5">
              <span class="expand-key">性别: </span>
              <span class="expand-value">{{ row.sex }}</span>
          </Col>
          <Col span="5">
              <span class="expand-key">工作状态: </span>
              <span class="expand-value">{{row.status !== '0' ? '离职' : '在职' }}</span>
          </Col>
          <Col span="5">
              <span class="expand-key">出生日期: </span>
              <span class="expand-value">{{ row.birth }}</span>
          </Col>
        </Row>
        <Row>
          <Col span="5">
              <span class="expand-key">上网账号: </span>
              <span class="expand-value">{{ row.netAccount }}</span>
          </Col>
          <Col span="5">
              <span class="expand-key">svn账号: </span>
              <span class="expand-value">{{ row.svnAccount }}</span>
          </Col>
          <Col span="5">
              <span class="expand-key">禅道账号: </span>
              <span class="expand-value">{{ row.account }}</span>
          </Col>
          <Col span="5">
              <span class="expand-key">OA账号: </span>
              <span class="expand-value">{{ row.oaAccount }}</span>
          </Col>
          <Col span="5">
              <span class="expand-key">QQ号: </span>
              <span class="expand-value">{{ row.qq }}</span>
          </Col>
          <Col span="5">
              <span class="expand-key">微信号: </span>
              <span class="expand-value">{{ row.wx }}</span>
          </Col>
          <Col span="5">
              <span class="expand-key">其他IM账号: </span>
              <span class="expand-value">{{ row.im }}</span>
          </Col>
          <Col span="5">
              <span class="expand-key">入职时间: </span>
              <span class="expand-value">{{ row.joinDate }}</span>
          </Col>
        </Row>
    </div>
</template>
<script>
export default {
  props: {
    row: Object
  }
}
</script>
<style scoped>
.expand-row {
  margin-bottom: 16px;
}
</style>
