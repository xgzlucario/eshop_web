<template>
  <tabBar/>

  <div style="padding: 4%">
    <el-row>
      <!--图片+详情+评论区-->
      <el-col :span="14" :offset="3">
        <el-row>
          <!--书本图片-->
          <el-col :span="10">
            <img :src="bookPic(123)" style="width: 250px; height: 300px">
          </el-col>

          <!--书本详情-->
          <el-col :span="12">
            <div style="font-weight: 500; font-size: 26px">{{ info.name }}</div>
            <div style="color: gray; margin-top: 1%; line-height: 30px">
              作者：{{ info.Author }}<br>
              分类：{{ info.Category }}<br>
              已售：{{ info.PayNumber }}本<br>
            </div>

            <!--评分-->
            <el-rate style="margin-top: 1%" v-model="getStar" disabled show-score text-color="#ff9900"/>

            <div style="color: gray; margin-top: 2%">
              售价：<span style="font-size: 22px; color: #ea0505">￥{{ Number(info.Price).toFixed(2) }}</span>
            </div>

            <!--操作按钮-->
            <el-row style="margin-top: 5%">
              <el-col :span="6" v-if="!have">
                <el-button type="primary" @click="addTrolley" v-if="!inCart">加入购物车</el-button>
                <el-button type="danger" plain @click="removeTrolley" v-else>移出购物车</el-button>
              </el-col>
              <el-col :span="6">
                <el-button type="warning" @click="buy" v-if="!have">购买</el-button>
                <el-button type="success" @click="read" v-else>已有书本，开始阅读</el-button>
              </el-col>
              <el-col :span="6">
                <el-button type="danger" @click="removeBook" v-show="isAdmin">删除</el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

        <el-divider style="margin-top: 10%"/>

        <!--评论区-->
        <el-row>
          <div class="seckill-text">
          <span class="seckill-title">
            <i class="el-icon-document"/> 评论区
          </span>
          </div>
        </el-row>

        <!--评论区-->
        <el-card style="margin-top: 3%" shadow="never" v-for="(comment,index) in comments" :key="comment">
          <el-row>
            <el-col :span="4">
              <span>{{ comment.UserID }}</span>
            </el-col>
            <el-col :span="8">
              <el-rate
                  v-model="comment.Star"
                  disabled
                  show-score
                  text-color="#ff9900">
              </el-rate>
            </el-col>
          </el-row>
          <span>{{ comment.Content }}</span>
          <el-button type="danger" plain @click="deleteComments(index)" v-if="isAdmin || isMine(comment.UserID)">
            删除该评论
          </el-button>
        </el-card>

        <el-divider v-if="have" style="margin-top: 5%"/>

        <!--评论输入框-->
        <div v-if="have" style="margin-top: 3%">
          <div class="seckill-text">
          <span class="seckill-title">
            <i class="el-icon-chat-line-round"/> 我要发言
          </span>
            &ensp;
            <span class="seckill-remarks"> 请友好发言哦~</span>
          </div>
        </div>

        <div v-if="have" style="margin-top: 1%">
          <el-input
              size="large"
              type="textarea"
              placeholder="请输入内容"
              v-model="textarea"
              maxlength="100"
              show-word-limit
              id="comment"/>

          <el-rate v-model="value_choose" style="margin-top: 1%"/>

          <el-button style="margin-top: 1%" type="primary" round @click="submit">提交</el-button>
        </div>
      </el-col>

      <!--排行榜-->
      <el-col :span="7">
        &emsp;<span style="font-size: 16px">同分类排行</span>
        <el-row>
          <el-col v-for="(i, index) in Rankings" :key="i.name" :span="10" :offset="1">
            <div style="padding: 3%">
              <div style="font-weight: 500; font-size: 16px">
                <n-button text type="info"
                          @click="this.$router.push({path: '/items/' + i.ID})">
                  <span style="font-size: 15px">{{ i.Name.length > 16 ? i.Name.slice(0, 16) + '..' : i.Name }}</span>
                </n-button>
              </div>
              <div style="color: gray; font-size: 14px">{{ i.Author }}</div>
              <img :src="bookPic(index)" style="width: 100px; height: 100px">
              <div style="font-size: 14px; line-height: 24px">售出: {{ i.PayNumber }}</div>
              <n-rate size="small" readonly :default-value="i.Star / 2"/>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <div style="width: 76%; margin-left: 12%; margin-top: 5%" v-if="showText">
      <el-row>
        <div class="seckill-text">
          <span class="seckill-title">
            <i class="el-icon-document"/> 书本内容
          </span>
        </div>
      </el-row>

      {{ bookContent }}
    </div>
  </div>
  <div style="height: 150px"/>
</template>

<script>
import tabBar from "./tabBar";
import {ref} from 'vue'
import {ElMessage} from 'element-plus';
import {chooseRandomPic} from "./func";

export default {
  components: {
    tabBar
  },
  setup() {
    // 从url截取id
    let items = window.location.href.split('/')
    let id = items.slice(-1)
    id = Number(id[0])
    return {
      id,
      text: ref(''),
      textarea: ref('')
    }
  },
  computed: {
    getStar() {
      return this.info.Star / 2
    },
    isAdmin() {
      return this.$store.state.uid === 1
    },
  },
  data() {
    return {
      info: {},
      comments: [],
      Rankings: {},
      bookContent: '',
      value_choose: null,
      inCart: false,
      have: false,
      showText: false
    }
  },
  mounted() {
    this.getInfo()
    this.getComments()
    this.getRanking()
    this.getHave()
    this.getInCart()
  },
  methods: {
    bookPic(i) {
      return chooseRandomPic(i)
    },
    isMine(id) {
      return this.$store.state.uid === id
    },
    getInfo() {
      this.$axios({
        url: '/go/book/' + this.id,
        method: 'get',
      }).then(r => {
        this.info = r.data
      })
    },
    getComments() {
      this.$axios({
        url: '/go/comments/',
        method: 'get',
        params: {book: this.id},
      }).then(r => {
        this.comments = r.data
      })
    },
    getRanking() {
      this.$axios({
        url: '/go/book/',
        method: 'get',
        params: {
          category: this.info.cateID,
          hot: 1
        },
      }).then(r => {
        if (r.data.length > 8) this.Rankings = r.data.slice(0,8)
        else this.Rankings = r.data
      })
    },
    getHave() {
      this.$axios({
        url: '/go/purchased/' + this.id,
        method: 'get',
      }).then(() => {
        this.have = true
      })
    },
    getInCart() {
      this.$axios({
        url: '/go/carts/',
        method: 'get',
      }).then(r => {
        r.data.forEach(i => {
          if (i.id === this.id) {
            this.inCart = true
          }
        })
      })
    },
    removeBook() {
      this.$confirm('此操作将永久删除该书本, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios({
          url: '/go/book/' + this.id,
          method: 'delete',
        }).then(() => {
          ElMessage.success({
            message: '恭喜你，已经成功删除!',
            type: 'success'
          })
        })
      })
    },
    addTrolley() {
      this.$axios({
        url: '/go/carts/',
        method: 'post',
        data: {
          BookID: this.id
        },
      }).then(() => {
        ElMessage.success({
          message: '恭喜你，已经成功添加到购物车!',
          type: 'success'
        })
        this.inCart = true
      }).catch(() => {
        this.$alert('你还没有登录！', '提示', {
          confirmButtonText: '确定',
          center: false
        })
      })
    },
    removeTrolley() {
      this.$axios({
        url: '/go/carts/' + this.id,
        method: 'delete',
      }).then(() => {
        ElMessage.success({
          message: '恭喜你，已经成功从购物车删除!',
          type: 'success'
        })
        this.inCart = false
      }).catch(() => {
        this.$alert('你还没有登录！', '提示', {
          confirmButtonText: '确定',
          center: false
        })
      })
    },
    deleteComments(index) {
      this.$confirm('是否删除该条评论?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios({
          url: '/go/comments/' + this.comments[index].ID,
          method: 'delete',
        }).then(() => {
          ElMessage.success({
            message: '评论已删除!',
            type: 'success'
          })
          this.getComments()
        })
      })
    },
    buy() {
      this.$axios({
        url: '/go/purchased/' + this.id,
        method: 'post',
      }).then(() => {
        ElMessage.success({
          message: '恭喜你，已经成功购买!',
          type: 'success'
        })
        this.have = true
      }).catch(() => {
        this.$alert('你还没有登录！', '提示', {
          confirmButtonText: '确定',
          center: false
        })
      })
    },
    read() {
      this.$axios({
        url: '/go/purchased/' + this.id,
        method: 'get',
      }).then(r => {
        this.bookContent = r.data.content
        this.showText = !this.showText
      })
    },
    submit() {
      let isCommented = false
      this.comments.forEach(i => {
        if (this.isMine(i.UserID)) isCommented = true
      })
      if (isCommented) {
        this.$alert('你已经评论过了,请勿重复评论', '提示', {
          confirmButtonText: '确定',
          center: false
        })
        return
      }
      if (document.getElementById("comment").value === ""
          || this.value_choose == null) {
        this.$alert('内容和评分不能为空', '提示', {
          confirmButtonText: '确定',
          center: false
        })
        return;
      }
      this.$axios({
        url: '/go/comments/',
        method: 'post',
        data: {
          BookID: this.id,
          Star: this.value_choose,
          Content: document.getElementById("comment").value
        },
      }).then(() => {
        ElMessage.success({
          message: '恭喜你，评论成功!',
          type: 'success'
        })
        this.getComments()
        document.getElementById("comment").value = ""
        this.value_choose = null
      })
    }
  }
}
</script>
