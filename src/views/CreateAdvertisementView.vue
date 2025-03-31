<script setup lang="ts">

import Schema from '@/components/Schema.vue'
</script>

<template>
  <h2>{{ $t('create-advertisement') }}</h2>
  <schema
  :new="true"
  :preview="false"
  :id="null"
  :advertisement="null"/>
</template>

<style scoped>

</style>
