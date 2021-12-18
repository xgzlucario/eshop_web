<template>
  <el-container>

    <el-header>
      <tab-bar />
    </el-header>

    <el-main style="background-color: rgba(245,245,245)">
      <div style="width: 70%; margin-left: 15%">
        <cateList />
        <br>
        <book-list />
      </div>
    </el-main>
  </el-container>
</template>

<script>
import tabBar from "../common/tabBar";
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
  border-radius: 10px;
  height: 350px;
  object-fit: cover;
}
</style>

