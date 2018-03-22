<template>
<section class="home">
  <div class="headFont">
    <span>兆翔科技绩效考核系统</span>
  </div>
  <div class="tool">
    <div>
      <router-link to="/perform">
        <Icon class="icon-bg" type="ios-timer"></Icon><br>
        <span class="text-class">工时统计</span>
      </router-link>
    </div>
    <div v-if="role !== 'bmjl' && role !== 'bmfjl'">
      <router-link to="/projects">
        <Icon class="icon-bg" type="briefcase"></Icon><br>
        <span class="text-class">项目管理</span>
      </router-link>
    </div>
    <div>
      <router-link to="/table">
        <Icon class="icon-bg" type="document-text"></Icon><br>
        <span class="text-class">总分查询</span>
      </router-link>
    </div>
    <div>
      <router-link to="/train">
        <Icon class="icon-bg" type="ios-book"></Icon><br>
        <span class="text-class">培训管理</span>
      </router-link>
    </div>
    <div>
      <router-link to="/total">
        <Icon class="icon-bg" type="flag"></Icon><br>
        <span class="text-class">考核汇总</span>
      </router-link>
    </div>
  </div>
</section>
</template>
<script>
export default {
  data () {
    return {
      role: sessionStorage.getItem('role')
    }
  },
  methods: {
  },
  mounted () {
  }
}
</script>
<style lang="scss">
.home {
  width: 100%;
  height: 100%;
  .tool {
    height: 80%;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  .set {
    margin-top: 90px;
    display: flex;
    justify-content: space-around;
  }
  .tool i{
    text-align: center;
    width: 87.5px;
  }
  .icon-bg:hover {
    color: red;
    cursor: pointer;
  }
  .ivu-icon {
    font-size: 100px;
  }
  .headFont{
  color: #495060;
  letter-spacing: 0;
  // text-shadow: 0px 1px 0px #999, 0px 2px 0px #888, 0px 3px 0px #777, 0px 4px 0px #666, 0px 5px 0px #555, 0px 6px 0px #444, 0px 7px 0px #333, 0px 8px 7px #001135;
  font-size: 40px;
  font-family: '楷体';
  position:relative;
  text-align: center;
  }
}
.text-class {
  color: #2D8CF0;
  font-size: 20px;
  font-family: '楷体';
  margin-left: 5px;
}
.ivu-icon-stats-bars:before {
  font-size: 15px !important;
}
</style>
