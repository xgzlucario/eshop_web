<template>
  <!--菜单-->
  <el-menu :default-active="active" mode="horizontal">
    <el-menu-item style="margin-left: 15%" index="1" @click="toHome">
      主页
    </el-menu-item>

    <el-menu-item v-show="!isLogin" style="float: right; margin-right: 15%" index="2" @click="showLogin=true">
      你还未登录，<n-button quaternary text type="info">去登录</n-button>
    </el-menu-item>

    <el-menu-item v-show="isLogin" style="float: right; margin-right: 15%" index="3" @click="this.$router.push({path:'/user'})">
      我的信息
    </el-menu-item>
  </el-menu>

  <!--登录框-->
  <el-dialog v-model="showLogin" title="请登录" width="30%">
    <login/>
  </el-dialog>
</template>

<script>
import login from "../user/Login";
export default {
  components: {
    login
  },
  data() {
    return {
      activeIndex: '1',
      showLogin: false,
    };
  },
  computed: {
    isLogin() {
      return this.$store.state.uid !== null
    },
    active() {
      if (this.$route.path === '/home') return 1
      else if (this.$route.path === '/user') return 3
      return ''
    }
  },
  methods: {
    toHome() {
      this.$router.push({path:'/home'})
    }
  },
}
</script>
