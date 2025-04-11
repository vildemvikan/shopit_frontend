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
import AdvertisementView from '@/views/AdvertisementView.vue'
import LoginForm from '@/components/Authentication/LoginForm.vue'
import SignUpForm from '@/components/Authentication/SignUpForm.vue'
import ForgotPasswordForm from '@/components/Authentication/ForgotPasswordForm.vue'
import ResetPasswordForm from '@/components/Authentication/ResetPasswordForm.vue'
import SearchView from '@/views/SearchView.vue'
import { useTokenStore } from '@/stores/tokenStore.ts'

const restrictedRoutes = [
  'profile',
  'notifications',
  'messages',
  'bookmarks',
  'edit-advertisement',
  'create-advertisement'
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      name: 'front-page',
      component: FrontView
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView,
      props: route => ({
        search: route.query.search || null,
        category: route.query.category || null,
        subCategory: route.query.subCategory || null,
        conditions: route.query.conditions || null,
        counties: route.query.counties || null,
        maxPrice: route.query.maxPrice || null,
        minPrice: route.query.minPrice || null,
        publishedToday: route.query.publishedToday || null,
        type: route.query.type || null,
        sortBy: route.query.sortBy || null,
        displayType: route.query.displayType || null
      })
    },
    {
      path: '/messages',
      name: 'messages',
      component: MessagesView,
      props: route => ({
        itemId: route.query.itemId || null,
        recipientId: route.query.recipientId ||null
      })
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
      component: AuthenticationView,
      children: [
        { path: '', redirect: '/auth/login',  name:'Redirect' },
        { path: 'login', component: LoginForm,  name: 'Login', },
        { path: 'signup', component: SignUpForm, name: 'Signup' },
        { path: 'forgot-password', component: ForgotPasswordForm, name: 'ForgotPassword' },
        { path: 'reset-password', component: ResetPasswordForm, name: 'ResetPassword' },
      ]
    },
    {
      path: '/advertisement/:id',
      name:'advertisement',
      component: AdvertisementView,
      props: true
    }
  ],
})

router.beforeEach((to, from, next) => {
  if (restrictedRoutes.includes(to.name as string)) {
    const tokenStore = useTokenStore();
    if (!tokenStore.isAuthenticated) {
      return next({ path: '/auth/login' });
    }
  }
  if (from.name === 'create-advertisement' && to.name !== 'create-advertisement') {
    const advertisementStore = useAdvertisementStore();
    advertisementStore.$reset();
  }
  next();
});


export default router
