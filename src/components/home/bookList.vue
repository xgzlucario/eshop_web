<template>
  <div class="seckill-text">
    <span class="seckill-title">书籍榜单</span>&ensp;
    <span class="seckill-remarks">包含本站所有书籍~</span>
  </div>

  <n-data-table
      remote
      :columns="columns"
      :data="data"
      @update:sorter="sorterChange"
      @update:filters="filtersChange"
  />

  <n-pagination
      @update-page="pageChange"
      style="float: right; margin-top: 5px"
      v-model:page="page"
      :page-count="counts / 10"
  />
</template>

<script>
import { h } from 'vue'
import { NButton } from 'naive-ui'

export default {
  data() {
    return {
      columns: [
        {
          title: '书本名称',
          key: 'bookName',
          render: (row) => {
            return h(
                NButton,
                {
                  quaternary: true,
                  text: true,
                  type: 'info',
                  onClick: () => {
                    this.$router.push({path: '/items/' + row.id})
                  }
                },
                {
                  default: () => row.bookName,
                })
          }
        },
        {title: '作者', key: 'author'},
        {
          title: '分类',
          key: 'cate',
          filterOptions: [],
          filter () {
            return true
          },
          render (row) {
            return row.cate === 'uncategorized' ? '--' : row.cate
          }
        },
        {
          title: '评分', key: 'star', sorter: 'default',
          render: (row) => {
            return row.star / 2
          }
        },
        {title: '已售', key: 'sell'},
      ],
      counts: 0,
      page: 0,
      hot: 1,
      data: [],
      cateID: '',
    }
  },
  mounted() {
    this.getCategory()
    this.getBooks()
  },
  methods: {
    filtersChange(i) {
      this.cateID = i.cate[0]
      this.getBooks()
    },
    sorterChange(i) {
      if (i.order === 'ascend') this.hot = -1
      else if (i.order === 'descend') this.hot = 1
      else this.hot = ''
      this.getBooks()
    },
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
          this.columns[2].filterOptions.push({label: k, value: cateSet[k]})
      })
    },
    getBooks(page) {
      this.$store.state.axios({
        url: '/go/book/',
        method: 'get',
        params: {
          category: this.cateID,
          hot: this.hot,
          page: page ? page : 1
        },
      }).then(r => {
        this.counts = r.data['all books count']
        this.saveData(r.data.data)
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
    },
    pageChange(i) {
      this.getBooks(i)
    }
  }
}
</script>

<style>
.seckill-text {
  width: 300px;
  height: 100%;
  float: left;
}
.seckill-text .seckill-title {
  font-size: 22px;
  line-height: 50px;
  color: #000;
}
.seckill-text .seckill-remarks {
  margin-left: 5px;
  font-size: 10px;
  color: #000;
}
</style>