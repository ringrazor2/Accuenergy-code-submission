<template>
    <div id="map" class="w-full h-[700px]"></div>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import L from "leaflet";
  import "@geoapify/leaflet-address-search-plugin";
  import "leaflet/dist/leaflet.css";
  import "leaflet-control-geocoder/dist/Control.Geocoder.css";
  import "leaflet-control-geocoder/dist/Control.Geocoder.js";
  
  export default {
    name: "MapView",
    setup() {
      // const searchQuery = ref("");
      // const map = ref(null);
      // const markerLayer = ref(null);
  
      onMounted(initializeMap);
  
      function initializeMap() {
        // Create a map instance
        map.value = L.map("map").setView([0, 0], 13);
  
        // Add the Google Maps style tile layer
        L.tileLayer("https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
          maxZoom: 18,
        }).addTo(map.value);
  
        // Get the user's current location
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
  
            // Set the map view to the user's location
            map.value.setView([latitude, longitude], 13);
  
            // Add a marker at the user's location
            L.marker([latitude, longitude]).addTo(map.value);
          },
          (error) => {
            console.error("Error getting current location:", error);
          }
        );
      }
  
      // function searchLocation() {
      //   // Remove previous markers
      //   if (markerLayer.value) {
      //     map.value.removeLayer(markerLayer.value);
      //   }
  
      //   // Geocode the search query
      //   L.Control.Geocoder.nominatim().geocode(searchQuery.value, (results) => {
      //     if (results.length > 0) {
      //       // Create a marker layer group to store all markers
      //       markerLayer.value = L.layerGroup();
  
      //       results.forEach((result) => {
      //         const { lat, lon } = result.center;
  
      //         // Create a marker at each searched location
      //         const marker = L.marker([lat, lon]).addTo(markerLayer.value);
      //         marker.bindPopup(result.display_name);
  
      //         // Add the marker to the marker layer group
      //         markerLayer.value.addLayer(marker);
      //       });
  
      //       // Add the marker layer group to the map
      //       markerLayer.value.addTo(map.value);
  
      //       // Fit the map bounds to the markers
      //       map.value.fitBounds(markerLayer.value.getBounds());
      //     }
      //   });
      // }
  
      // return {
      //   searchQuery,
      //   map,
      //   markerLayer,
      //   initializeMap,
      //   // searchLocation,
      // };
    },
  };
  </script>
  