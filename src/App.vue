<script setup>
import {provide, ref} from "vue";
import InfoBar from "./components/InfoBar.vue"
import Map from "./components/Map.vue"

// passing prop to Map component
let location = ref(null);

const receiveData = (lat, lon) => {
   location.value = {lat, lon}
}

provide("receiveData", receiveData);

</script>

<template >
  <div class = "min-h-screen w-full flex">
    <InfoBar/>
    <Map :location = "location"/>
</div>
  
</template>

