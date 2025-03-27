<script setup lang="ts">

import { useRouter } from 'vue-router'
import {ref} from 'vue'

const options = [
  { icon: 'notifications.svg', label: 'notifications', path: 'notifications'},
  { icon: 'create.svg', label: 'create-advertisement', path: 'create-advertisement'},
  { icon: 'messages.svg', label: 'messages', path: 'messages'},
  { icon: 'bookmark.svg', label: 'bookmarks', path: 'bookmarks' },
  { icon: 'profile.svg', label: 'profile' , path: 'profile'},
]

const router = useRouter()

const currentRoute = router.currentRoute

const status = ref(false)

function navigateTo(path: string) {
  if (path) router.push(path)
  status.value = false
}

function toggleMenu() {
  status.value = !status.value
  console.log(status.value)
}

const iconPath = (icon: string) => new URL(`../assets/icons/${icon}`, import.meta.url).href

</script>

<template>
  <nav class="navbar">
    <button class="logo" @click="navigateTo('/')">
      <H1>ShopIT</H1>
    </button>

    <button class="option" id="menu" @click="toggleMenu" alt="burger-menu">
      <img class="icon" id="burger-icon" :src="status ? iconPath('exit.svg') : iconPath('burger.svg')" alt="Menu">
    </button>

    <div class="options" :class="{'open':status}">
      <button
        v-for="option in options"
        :key="option.label"
        class="option"
        id="button-option"
        type="button"
        @click="navigateTo(option.path)">
        <img class="icon" id="option-icon" :src="iconPath(option.icon)" :alt="$t(option.label)">
        <span class="option-text"
              :class="{active: currentRoute.name == option.path}">
          {{ $t(option.label) }}
        </span>
      </button>
    </div>
  </nav>


</template>

<style scoped>

.navbar{
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  box-shadow: var(--global-box-shaddow);
  place-content: space-between;
  place-items: center;

  padding-left: 2.5%;
  padding-right: 2.5%;
}

.logo{
  height: 100%;
  place-content: center;
  cursor: pointer;

  background-color: transparent;
  border: none;
}

.logo:hover{
  transform: scale(1.05);
}

.options{
  height: 60%;
  display: flex;
  flex-direction: row;
}

.option{
  display: flex;
  flex-direction: row;
  height: 100%;
  margin: 5px;
  place-items: center;
  cursor: pointer;

  background-color: transparent;
  border: none;
}

.option:hover{
  transform: scale(1.05);
}

.option-text.active{
  border-bottom: 2px solid orange;
}

.icon{
  height: 100%;
}

#menu{
  display: none;
}

@media (max-width: 900px) {
  /* Show hamburger on mobile */
  #menu {
    display: block;
    z-index: 2;
  }

  #burger-icon{
    height: 60%;
  }

  /* Hide options by default on mobile */
  .options {
    display: none; /* Hidden unless toggled open */
  }

  /* When the menu is open, display the options */
  .options.open {
    display: flex;
    flex-direction: column;
    position: absolute;
    place-content: center;
    background-color: white;


    top: 0;
    right: 0;
    left: 0;
    height: 92.5%;
    width: 100%;

    z-index: 1;
  }

  #button-option {
    justify-content: center;
    height: 7.5%;
    padding: 10px;
    margin: 0;
  }

  #option-icon{
    display: none;
  }
}
</style>

