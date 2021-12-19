import { createRouter, createWebHashHistory } from 'vue-router'
import home from "../components/home";
import Mine from "../components/Mine";
import Items from "../components/Items";

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    component: home
  },
  {
    path: '/user',
    component: Mine
  },
  {
    path: '/items/:id',
    component: Items
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
