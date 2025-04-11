<script setup lang="ts">

import Schema from '@/components/Schema.vue'
</script>

<template>
  <h1 class="title">{{ $t('create-advertisement') }}</h1>
  <schema
  :new="true"
  :preview="false"
  :id="null"
  :advertisement="null"/>
</template>

<style scoped>

.title{
  text-decoration: underline;
  margin-bottom: 20px;
}

</style>
