<script setup lang="ts">

import MyAdvertisements from '@/components/profile/MyAdvertisements.vue'
import ProfileInfo from '@/components/profile/ProfileInfo.vue'
import ChangePassword from '@/components/profile/ChangePassword.vue'
</script>

<template>
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

</template>

<style scoped>

.content{
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
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
  .content{
    display: flex;
    flex-direction: column;
  }

  #left-side, #right-side{
    width: 100%;
  }
}

</style>
