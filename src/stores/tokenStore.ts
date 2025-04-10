import {defineStore} from 'pinia'
import { getToken, logout, refreshToken, registerUser } from '../../utils/Authentication.ts'
import router from '@/router'


export const useTokenStore = defineStore('tokenStore', {
  state: () => ({
    jwtToken: null as string|null,
    refreshToken: null as string|null,
    accessTokenExpiresAt: 0 as number,
    tokenTimer: null as ReturnType<typeof setTimeout> | null,
    email: null as string | null,
  }),

  persist: {
    storage: sessionStorage
  },

  actions: {

    async login(email: string, password: string) {
      try{
        const response: { token:string} = await getToken(email, password);
        this.jwtToken = response.token
        this.email = email;
        this.accessTokenExpiresAt = Date.now() + 30 * 60 * 1000 // 30 minutes
        this.startRefreshTimer()

        console.log("Expiration:" + this.accessTokenExpiresAt)
        await router.push('/')
      } catch (error: any) {
        console.log(error)
        throw { message: error.message, status: error.status };

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
        this.jwtToken = response.data.token;
        this.email = email;
        this.accessTokenExpiresAt = Date.now() + 30 * 60 * 1000
        console.log(response.data.token);
      } catch (error: any) {
        if (error) {
          throw { message: error.message, status: error.status };
        } else {
          throw new Error('Registration failed');
        }
      }
    },

    async logOut(){
      try {
        if(!this.jwtToken) return
        const response = await logout(this.jwtToken)
        if(response == 200){
          await this.emptyTokenStore()
          await router.push('/')
        }
      } catch (error){
        console.error('Could not logout / delete refresh token from cookie')
      }
    },

    async refreshAccessToken() {
      console.log('refreshing token')
      try {
        const response = await refreshToken()
        this.jwtToken = response.token
        this.accessTokenExpiresAt = Date.now() + 30 * 60 * 1000
        this.startRefreshTimer()
      } catch (error) {
        await this.emptyTokenStore()
        throw error
        //throw new Error('Failed to refresh access token')
      }
    },

    startRefreshTimer() {
      if (this.tokenTimer) clearTimeout(this.tokenTimer)

      const remainingTime = this.accessTokenExpiresAt - Date.now();
      console.log('Remaining time:' + (remainingTime / (1000 * 60)))

      const refreshMargin = 10 * 60 * 1000; // 5 minutes
      const refreshDelay = Math.max(remainingTime - refreshMargin, 0);

      this.tokenTimer = setTimeout(async () => {
        if (this.isAccessTokenExpired() || (this.accessTokenExpiresAt - Date.now()) < refreshMargin) {
          await this.refreshAccessToken()
        }
      }, refreshDelay)
    },

    async emptyTokenStore() {
      this.jwtToken = null;
      this.email = null;
      await router.push('/');
    },

    isAccessTokenExpired(): boolean {
      console.log(Date.now())
      console.log(this.accessTokenExpiresAt)
      return Date.now() > this.accessTokenExpiresAt;
    },

    async initializeTimer() {
      if (this.jwtToken && this.accessTokenExpiresAt) {
        if (!this.isAccessTokenExpired()) {
          this.startRefreshTimer();
        } else {
          await this.refreshAccessToken()
        }
      }
    }

  },

  getters: {
    isAuthenticated: (state) => {
      return !!state.jwtToken && Date.now() < state.accessTokenExpiresAt;
    },
    getToken: (state) => state.jwtToken,
    getEmail: (state) => state.email,
  }
})
