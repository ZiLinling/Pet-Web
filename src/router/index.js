import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [{
      path: 'index',
      name: '主页',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/manage',
    component: Layout,
    redirect: '/manage/user',
    name: 'Manage',
    meta: { title: '管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/manage/user'),
        meta: { title: '用户管理', icon: 'table' }
      },
      {
        path: 'store',
        name: 'Store',
        component: () => import('@/views/manage/store'),
        meta: { title: '商店管理', icon: 'tree', noShowItem: true },
      },
      {
        path: 'order',
        name: 'Order',
        component: () => import('@/views/manage/order'),
        meta: { title: '订单管理', icon: 'tree' },
      },
      {
        path: '/orderItem',
        name: 'orderItem',
        hidden: true,
        component: () => import('@/views/manage/orderItem'),
        meta: { title: '订单详情', icon: 'table' }
      },
      {
        path: 'breed',
        name: 'Breed',
        component: () => import('@/views/manage/breed'),
        meta: { title: '品种管理', icon: 'tree' }
      },
      {
        path: '/pet',
        name: 'Pet',
        hidden: true,
        component: () => import('@/views/manage/pet'),
        meta: { title: '宠物管理', icon: 'table' }
      },
      {
        path: '/goods',
        name: 'Goods',
        hidden: true,
        component: () => import('@/views/manage/goods'),
        meta: { title: '周边管理', icon: 'table' }
      },
      
    ]
  },
  {
    path: '/data',
    component: Layout,
    redirect: '/data/store',
    name: 'Store',
    meta: { title: '数据', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'store',
        name: 'store',
        component: () => import('@/views/data/store'),
        meta: { title: '商店数据', icon: 'table' }
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/data/user'),
        meta: { title: '用户数据', icon: 'table' }
      },
    ]
  },
  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
