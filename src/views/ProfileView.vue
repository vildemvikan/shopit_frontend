<script setup lang="ts">

import MyAdvertisements from '@/components/profile/MyAdvertisements.vue'
import ProfileInfo from '@/components/profile/ProfileInfo.vue'
import ChangePassword from '@/components/profile/ChangePassword.vue'
import { useTokenStore } from '@/stores/tokenStore.ts'
import DeletePopUp from '@/components/Popups/DeletePopUp.vue'
import { ref } from 'vue'

const tokenStore = useTokenStore()

const displayDeletePopUp = ref<boolean>(false)

async function logout(){
  try{
    await tokenStore.logOut()
  }catch (error){
    console.error(error)
  }
}

async function deleteUser(){
  try{
    await tokenStore.logOut()
  }catch (error){
    console.error(error)
  }
}

</script>

<template>
  <DeletePopUp
    v-if="displayDeletePopUp"
    @close:delete-pop-up="displayDeletePopUp = false"
    :id="null"
    :type-delete-advertisement="false"
    :type-delete-user="true"
  />

  <div class="profile">
    <div class="button-options">
      <button class="option-button" id="delete-button" @click="displayDeletePopUp = true">
        {{$t('button-delete-user')}}</button>
      <button class="option-button" id="logout-button" @click="logout">
        {{$t('button-logout')}}</button>
    </div>
    <div class="content">
      <div id="left-side">
        <div class="component" id="profile-info">
          <ProfileInfo/>
        </div>
        <div class="component" id="change-password">
          <ChangePassword/>
        </div>

      </div>
      <div id="right-side">
        <div class="component" id="my-advertisements">
          <my-advertisements/>
        </div>

      </div>
    </div>

  </div>

</template>

<style scoped>

.profile{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  place-items: end;
  gap: 10px;
}

.button-options{
  display: flex;
  flex-direction: row;
  gap: 10px;
  height: 5%;
}

.option-button{
  height: 100%;
  width: fit-content;
  padding: 0 20px;
}

.content{
  display: flex;
  flex-direction: row;
  width: 100%;
  height: calc(95% - 10px);
  gap: 20px;
}

#left-side, #right-side{
  width: 50%;
  height: 100%;
}

#left-side{
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.component{
  box-shadow: var(--global-box-shaddow);
  border-radius: var(--global-border-radius);
  border: var(--global-border-size) solid var(--color-gray-divider);
  padding: 15px;
}

#profile-info{
  width: 100%;
  height: 60%;
  box-shadow: var(--global-box-shaddow);
  border-radius: var(--global-border-radius);
}

#change-password{
  width: 100%;
  height: 40%;
}

#my-advertisements{
  height: 100%;
  width: 100%;
}
@media (max-width: 1000px) {

  .profile{
    height: 200%;
  }

  .button-options{
    height: 2.5%;
  }

  .content{
    display: flex;
    flex-direction: column;
  }

  #left-side, #right-side{
    width: 100%;
    height: 50%;
  }
}

</style>
