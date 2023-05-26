<script setup>
import Head from './components/Head.vue'
import InfoBar from "./components/InfoBar.vue"
import Map from "./components/Map.vue"
</script>

<template >
  <div class = "min-h-screen">
  <Head/>
  <main class = "w-full h-max flex">
    <InfoBar/>
    <Map/>
  </main>
</div>
  
</template>

