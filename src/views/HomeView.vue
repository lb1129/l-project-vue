<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloTsx />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src
import HelloTsx from '@/components/HelloTsx'

export default Vue.extend({
  name: 'HomeView',
  components: {
    HelloWorld,
    HelloTsx
  }
});
</script>
