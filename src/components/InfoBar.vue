<script setup>
import {ref} from "vue"

const latitude = ref("")
const longitude = ref("")

const locationClick = () => {
  navigator.geolocation.getCurrentPosition((position) => {
    latitude.value = position.coords.latitude
    longitude.value = position.coords.longitude
  })
}
</script>

<template>
     <div class = " flex flex-col bg-dark h-[700px] w-1/3 p-5 pt-7 items-center">
      <button class = "btn" @click = "locationClick">
        Your Location
      </button>
      <div>
        <p class = "text-white pt-5" v-if="latitude && longitude">You are here: [lat: {{ latitude }}, lng: {{ longitude }}]</p>
      </div>
 
    </div>
</template>