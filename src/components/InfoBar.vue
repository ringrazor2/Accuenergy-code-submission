<script setup>
import {ref} from "vue"
import Head from "./Head.vue"
import "leaflet-control-geocoder";

const latitude = ref("")
const longitude = ref("")
const placeName = ref("");

const locationClick = async () => {
  navigator.geolocation.getCurrentPosition(async (position) => {
    latitude.value = position.coords.latitude
    longitude.value = position.coords.longitude

    // Perform reverse geocoding using Google Maps Geocoding API
    const apiKey = 'AIzaSyAbUtCR_UR3G0pTWvjz2b-ZxNjEi3jQ2qk'; 
    // const apiKey = process.env.VUE_APP_GOOGLE_MAPS_API_KEY; 
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude.value},${longitude.value}&key=${apiKey}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.results.length > 0) {
        const location = data.results[0].formatted_address;
        placeName.value = location;
      } else {
        placeName.value = 'No results found';
      }
    } catch (error) {
      console.error('Error:', error);
      placeName.value = 'Error getting location';
    }
  });
};



</script>

<template>
     <div class = " flex flex-col bg-dark h-screen w-[35%] px-5 items-center">
      <Head/>
      <button class = "btn" @click = "locationClick">
        Your Location
      </button>
      <div>
        <p class = "text-white pt-5 text-center" v-if="latitude && longitude" >You are here: {{placeName }} [lat: {{ latitude.toFixed(2)}}, lng: {{ longitude.toFixed(2) }}]</p>
      </div>
      <div class = "flex flex-col mt-6">
        <h2 class = "text-primary text-3xl capitalize text-center pb-4">History</h2>
        <button class = "bg-red-600 hover:bg-red-700  text-white w-1/4 rounded-md items-end mb-0.5" @click="deleteSelectedPlaces">Delete</button>
        <table class = "bg-white w-full rounded-lg text-xs">
        <thead>
        <tr class = "p-4">
          <th class= "pr-4">Select</th>
          <th>Time searched</th>
          <th>Address</th>

        </tr>
      </thead>
      <tbody>
        <!-- <tr v-for="(place, index) in places" :key="index"> -->
        <tr>
          <td><input type="checkbox" class = "cursor-pointer" v-model="selectedPlaces" :value="place" /></td>
          <!-- <td>{{ place.address }}</td> -->
          <td>2023-05-26</td>
          <td class = "overflow-hidden pl-6">CF Toronto Eaton Centre, 220 Yonge Street, Toronto, ON M5B 2H1, Canada</td>
        </tr>
      </tbody>
    </table>
      </div>
 
      <div>
        <h2 class = "text-sky-400 cursor-pointer hover:underline">Log in to view history</h2>
      </div>
    </div>
</template>