<template>
  <router-view />
</template>

<script>
export default {
  // 加载缓存数据
  mounted() {
    // 是否登录
    let uid = localStorage.getItem('uid')
    if (uid) {
      this.$store.state.uid = uid
    }

    let token = localStorage.getItem('token')
    if (token) {
      this.$store.state.is_login = true
      this.$axios.defaults.headers['Authorization'] = 'Bearer ' + token
    }
  }
}
</script>
