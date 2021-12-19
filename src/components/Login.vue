<template>
  <el-tabs>
    <!--登录框验证-->
    <el-tab-pane label="登录">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"/>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass"/>
        </el-form-item>
        <el-button style="margin-left: 45%" type="primary" @click="submitForm('ruleForm')">登录</el-button>
      </el-form>
    </el-tab-pane>

    <!--注册表单验证-->
    <el-tab-pane label="注册">
      <el-form :model="ruleForm2" status-icon :rules="rules" ref="ruleForm2" label-width="80px">
        <el-form-item label="用户名" prop="username2">
          <el-input v-model="ruleForm2.username2"/>
        </el-form-item>
        <el-form-item label="密码" prop="pass2">
          <el-input type="password" v-model="ruleForm2.pass2"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass2">
          <el-input type="password" v-model="ruleForm2.checkPass2"/>
        </el-form-item>
        <el-form-item label="昵称" prop="name2">
          <el-input v-model="ruleForm2.name2"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email2">
          <el-input v-model="ruleForm2.email2"/>
        </el-form-item>
        <el-button style="margin-left: 45%" type="primary" @click="submitForm2('ruleForm2')">注册</el-button>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  data() {
    let username = (rule, value, callback) => {
      if (value === '') callback(new Error('请输入用户名'))
      else callback()
    }
    let password = (rule, value, callback) => {
      if (value === '') callback(new Error('请输入密码'))
      else callback()
    };
    let password2 = (rule, value, callback) => {
      if (value === '')
        callback(new Error('请输入密码'))
      else {
        if (this.ruleForm2.checkPass2 !== '') {
          this.$refs.ruleForm2.validateField('checkPass2')
        }
        callback()
      }
    }
    let checkPassword2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm2.pass2) {
        callback(new Error('两次输入密码不一致！'))
      } else {
        callback()
      }
    };
    let name2 = (rule, value, callback) => {
      if (value === '') callback(new Error('昵称不能为空'))
      else callback()
    }
    let email2 = (rule, value, callback) => {
      let isMatch = this.checkEmail(value)
      if (value === '') {
        callback(new Error('请输入邮箱！'))
      } else if (!isMatch) {
        callback(new Error('邮箱格式不正确！'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        username: '',
        pass: '',
      },
      ruleForm2: {
        username2: '',
        pass2: '',
        checkPass2: '',
        name2: '',
        email2: ''
      },
      rules: {
        username: [
          {validator: username, trigger: 'blur'}
        ],
        pass: [
          {validator: password, trigger: 'blur'}
        ],
        username2: [
          {validator: username, trigger: 'blur'}
        ],
        pass2: [
          {validator: password2, trigger: 'blur'}
        ],
        checkPass2: [
          {validator: checkPassword2, trigger: 'blur'}
        ],
        name2: [
          {validator: name2, trigger: 'blur'}
        ],
        email2: [
          {validator: email2, trigger: 'blur'}
        ],
      },
    }
  },
  methods: {
    // 登录
    submitForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.$axios({
            url: '/go/auth/',
            method: 'post',
            data: {
              Username: this.ruleForm.username,
              Password: this.ruleForm.pass,
            }
          }).then(res => {
            this.$store.state.pass = this.ruleForm.pass
            // 设置缓存
            localStorage.setItem('uid', res['userID'])
            localStorage.setItem('token', res.token)
            localStorage.setItem('pass', this.ruleForm.pass)

            this.$store.state.uid = res['userID']
            this.$axios.defaults.headers['Authorization'] = 'Bearer ' + res.token

            this.$alert('登录成功！', '提示', {
              type: 'success',
              confirmButtonText: '确定',
            })
            window.location.reload()
          }).catch(() => {
            this.$alert('用户名或密码错误！', '提示', {
              type: 'error',
              confirmButtonText: '确定',
            })
          })
        }
      })
    },
    //注册
    submitForm2() {
      this.$refs['ruleForm2'].validate((valid) => {
        if (valid) {
          this.$axios({
            url: '/go/newAuth',
            method: 'post',
            data: {
              Username: this.ruleForm2.username2,
              Password: this.ruleForm2.pass2,
              Name: this.ruleForm2.name2,
              Email: this.ruleForm2.email2
            }
          }).then(() => {
            // 填充信息
            this.ruleForm.username = this.ruleForm2.username2
            this.ruleForm.pass = this.ruleForm2.pass2
            this.$alert('注册成功！', '提示', {
              type: 'success',
              confirmButtonText: '确定',
            })
          }).catch(() => {
            this.$alert('用户名或邮箱已存在！', '提示', {
              type: 'error',
              confirmButtonText: '确定',
            })
          })
        } else {
          return false
        }
      })
    },
    checkEmail(value) {
      let myReg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/
      return myReg.test(value)
    },
  }
}
</script>
