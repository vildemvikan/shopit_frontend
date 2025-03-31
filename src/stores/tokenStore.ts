import {defineStore} from 'pinia'
import { getJwtToken, registerUser } from '../../utils/Authentication.ts'
import router from '@/router'

export const useTokenStore = defineStore('tokenStore', {
  state: () => ({
    jwtToken: '',
    email: null as string | null,
  }),

  persist: {
    storage: sessionStorage
  },

  actions: {
    async login(email: string, password: string) {
        const response = await getJwtToken(email, password);
        const token = response.data.token;
        this.jwtToken = token;
        this.email = email;
        // Redirect or show success
        await router.push('/')
},
    async registerAndSaveToken(
      firstName: string,
      lastName: string,
      email: string,
      password: string
    ) {
      try {
        const response = await registerUser(firstName, lastName, email, password);
        this.jwtToken = response.data.token;
        console.log(response.data.token);
      } catch (error: any) {
        if (error.response?.status === 409) {
          throw new Error('Email already in use');
        } else {
          throw new Error('Registration failed');
        }
      }
    },

    emptyTokenStore() {
      this.jwtToken = '';
      this.email = null;
      router.push('/');
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.jwtToken,
    getToken: (state) => state.jwtToken,
  }
})
