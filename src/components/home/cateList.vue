<template>
  <el-row>
    <el-col :span="10">
      <div class="seckill-text">
        <span class="seckill-title">书籍分类</span>
        &ensp;
        <span class="seckill-remarks">你想要的都在这里~</span>
      <div>

      <span v-for="(i, index) in cate" :key="i.value">
        <n-button text @click="cateID=i.value; cateName=i.label">{{ i.label }}</n-button>&ensp;/&ensp;
        <div v-if="(index%3===0) && index > 0" style="height: 16px"/>
    </span>
        </div>
      </div>
    </el-col>

    <el-col :span="14">
      <n-carousel autoplay show-arrow style="border-radius: 10px">
        <img class="carousel-img"
             src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg"/>
        <img class="carousel-img"
             src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg"/>
        <img class="carousel-img"
             src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg"/>
        <img class="carousel-img"
             src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg"/>
      </n-carousel>
    </el-col>
  </el-row>

  <br>
  <br>
  <el-row>
    <div class="seckill-text">
      <span class="seckill-title">{{ cateName }} 分类排行</span>
      &ensp;
      <span class="seckill-remarks">分类的热门书籍~</span>
    </div>
  </el-row>

  <el-row>
    <el-col v-for="(i, index) in rank.slice(0, 8)" :key="i.name" :span="5" :offset="index%4===0 ? 0 : 1">
      <div style="padding: 3%">
        <div style="font-weight: 500; font-size: 16px">
          <n-button quaternary text type="info"
            @click="this.$router.push({path: '/items/' + i.ID})">
            {{ i.Name.length > 30 ? i.Name.slice(0,20) + '...' : i.Name }}</n-button>
        </div>
        <div style="color: gray; font-size: 14px">{{ i.Author }}</div>
        <div>购买: {{ i.PayNumber }}</div>
        <n-rate readonly :default-value="i.Star / 2" />
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      cate: [],
      rank: [],
      cateID: '',
      cateName: '',
    }
  },
  mounted() {
    this.getCategory()
    this.getRankBooks()
  },
  watch: {
    cateID() {
      this.getRankBooks()
    }
  },
  methods: {
    getCategory() {
      this.$store.state.axios({
        url: '/go/categories/',
        method: 'get'
      }).then(r => {
        // 分类集合
        let cateSet = {}
        r.data.data.forEach(i => {
          cateSet[i.name] = i.id
        })

        for (let k in cateSet)
          this.cate.push({label: k, value: cateSet[k]})
      })
    },
    getRankBooks() {
      this.$store.state.axios({
        url: '/go/book/',
        method: 'get',
        params: {
          category: this.cateID,
          hot: 1,
          page: 1
        },
      }).then(r => {
        this.rank = r.data.data
      })
    },
    // 更新数据
    saveData(data) {
      this.data = []
      data.forEach(i => {
        this.data.push({
          id: i.ID, bookName: i.Name, author: i.Author, cate: i.Category, sell: i.PayNumber, star: i.Star,
        })
      })
    }
  }
}
</script>