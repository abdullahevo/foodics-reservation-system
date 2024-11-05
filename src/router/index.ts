import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import BranchList from '@/components/BranchList.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'BranchList',
    component: BranchList
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
