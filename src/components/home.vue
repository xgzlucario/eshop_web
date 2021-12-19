<template>
  <el-container>

    <el-header>
      <tab-bar />
    </el-header>

    <el-main style="background-color: rgba(245,245,245)">
      <div style="width: 70%; margin-left: 15%">
        <el-row>
          <div class="seckill-text">
            <span class="seckill-title">这里是电子书商城！</span>
          </div>
        </el-row>

        <el-divider/>

        <cateList />

        <el-divider/>

        <book-list />
      </div>
    </el-main>
  </el-container>
</template>

<script>
import tabBar from "./tabBar";
import cateList from "./cateList";
import bookList from "./bookList";
export default {
  components: {
    tabBar, bookList, cateList
  }
};
</script>

<style>
.carousel-img {
  width: 100%;
  height: 350px;
  object-fit: cover;
}
</style>

