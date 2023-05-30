<script setup>

import {provide, ref} from "vue";
import InfoBar from "../components/InfoBar.vue"
import Map from "../components/Map.vue"

let location = ref(null);

const receiveData = (lat, lon) => {
   location.value = {lat, lon}
}

provide("receiveData", receiveData);

</script>

<template >
  <router-view/>
  <div class = "min-h-screen w-full flex">
    <InfoBar/>
    <Map :location = "location"/>
</div>
  
</template>