export const routes = [
  {
    path: '/',
    redirect: '/admin',
  },
  {
    path: '/admin',
    component: () => import('@/pages/Admin/Index.vue'),
  },
]
