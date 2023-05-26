<script setup>
import {ref} from "vue"
import "leaflet/dist/leaflet.css";
// import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";
import { LMap, LTileLayer } from "vue3-leaflet";

</script>

<template>
    <!-- <div class = " w-2/3 h-10">
        <l-map :center="mapCenter" :zoom="zoom" style="height: 100vh">
            <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></l-tile-layer>
        </l-map>
    </div> -->
    <div style="height:600px; width:800px">
    <l-map ref="map" v-model:zoom= "zoom" :center="[47.41322, -1.219482]">
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>
    </l-map>
  </div>
</template>
