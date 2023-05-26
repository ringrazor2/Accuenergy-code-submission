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


<!-- 
<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style> -->
