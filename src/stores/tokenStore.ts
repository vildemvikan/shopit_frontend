import {defineStore} from 'pinia'
import { getTokens, refreshToken, registerUser } from '../../utils/Authentication.ts'
import router from '@/router'

export const useTokenStore = defineStore('tokenStore', {
  state: () => ({
    jwtToken: '',
    refreshToken: '',
    email: null as string | null,
    accessTokenExpiresAt:0,
    tokenTimer: null as ReturnType<typeof setTimeout> | null
  }),

  persist: {
    storage: sessionStorage
  },

  actions: {
    async login(email: string, password: string) {
      try{
        const response = await getTokens(email, password);
        this.jwtToken = response.data.accessToken
        this.refreshToken = response.data.refreshToken
        this.email = email;
        this.accessTokenExpiresAt = Date.now() + 30 * 60 * 1000 // 30 minutes
        await router.push('/')
      } catch (error: any) {
        throw new Error('Error logging in')
      }
},
    async registerAndSaveToken(
      firstName: string,
      lastName: string,
      email: string,
      password: string
    ) {
      try {
        const response = await registerUser(firstName, lastName, email, password);
        this.jwtToken = response.data.accessToken;
        this.refreshToken = response.data.refreshToken;
        this.accessTokenExpiresAt = Date.now() + 30 * 60 * 1000

        console.log(response.data.token);
      } catch (error: any) {
        if (error.response?.status === 409) {
          throw new Error('Email already in use');
        } else {
          throw new Error('Registration failed');
        }
      }
    },
    async refreshAccessToken() {
      try {
        const response = await refreshToken(this.refreshToken)
        this.jwtToken = response.data.accessToken
        this.accessTokenExpiresAt = Date.now() + 30 * 60 * 1000
        this.startRefreshTimer()
      } catch (error) {
        this.emptyTokenStore()
        throw new Error('Failed to refresh access token')
      }
    },
    startRefreshTimer() {
      if (this.tokenTimer) clearTimeout(this.tokenTimer)

      const refreshDelay = 25 * 60 * 1000 // 25 minutes
      this.tokenTimer = setTimeout(async () => {
        if (this.isAccessTokenExpired()) {
          await this.refreshAccessToken()
        }
      }, refreshDelay)
    },

    async reHydrate() {
      if (!this.jwtToken || !this.refreshToken) {
        return;
      }

      if (this.isAccessTokenExpired()) {
        await this.refreshAccessToken()
      } else {
        this.startRefreshTimer()
      }
    },

    emptyTokenStore() {
      this.jwtToken = '';
      this.email = null;
      this.refreshToken=''
      router.push('/');
    },

    isAccessTokenExpired(): boolean {
      return Date.now() > this.accessTokenExpiresAt;
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.jwtToken,
    getToken: (state) => state.jwtToken,
  }
})
