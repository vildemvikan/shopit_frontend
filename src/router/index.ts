import { createRouter, createWebHistory } from 'vue-router'
import ProfileView from '@/views/ProfileView.vue'
import MessagesView from '@/views/MessagesView.vue'
import NotificationsView from '@/views/NotificationsView.vue'
import BookmarksView from '@/views/BookmarksView.vue'
import CreateAdvertisementView from '@/views/CreateAdvertisementView.vue'
import FrontView from '@/views/FrontView.vue'
import AuthenticationView from '@/views/AuthenticationView.vue'
import { useAdvertisementStore } from '@/stores/advertisementStore.ts'
import EditAdvertisement from '@/views/EditAdvertisement.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'front-page',
      component: MessagesView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/messages',
      name: 'messages',
      component: MessagesView
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: NotificationsView
    },
    {
      path: '/bookmarks',
      name: 'bookmarks',
      component: BookmarksView
    },
    {
      path: '/create-advertisement',
      name: 'create-advertisement',
      component: CreateAdvertisementView
    },
    {
      path:'/edit-advertisement/:id',
      name:'edit-advertisement',
      component: EditAdvertisement,
      props: true
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthenticationView
    }
  ],
})

router.beforeEach((to, from, next) => {
  if (from.name === 'create-advertisement' && to.name !== 'create-advertisement') {
    const advertisementStore = useAdvertisementStore()
    advertisementStore.$reset()
  }
  next()
})

export default router
