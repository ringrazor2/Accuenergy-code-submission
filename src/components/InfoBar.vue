<script setup>
import {ref, onMounted} from "vue"
// import {UserAuth} from "../Auth.js"
import {auth, db} from "../../firebase";
import {doc, onSnapshot, updateDoc, collection, query, startAfter, limit, getDocs, orderBy} from "firebase/firestore";
import Head from "./Head.vue"
import "leaflet-control-geocoder";

const latitude = ref("")
const longitude = ref("")
const placeName = ref("");
const userSearch10 = ref([]);
const pageSize = 10
let lastEntry = null

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

// onMounted(async()=> {
//   const path = doc(db, "users", "searches") 
//   onSnapshot(path, (doc) => {
//     console.log("Current data: ", doc.data());
//   });
// })


// const deleteSelectedPlaces = async () => {
//   await updateDoc(path, {
//     search: userSearch.value.filter((place) => !place.selected),
//   });
// };

// const goToAddress = (map, address) =>{
//   map.value.setView([address.lat, address.lon], 13);
// }


const path = doc(db, "users", "searches") 
  onSnapshot(path, (doc) => {
    userSearch10.value = doc.data().search;
    console.log(userSearch10.value);
  });

// const fetchFirstPage = async () => {
//   const q = query(collection(db, "users"), orderBy("createdAt"), limit(pageSize));
//   console.log(q);
//     const snapshot = await getDocs(q);
//     const data = snapshot.docs.map((doc) => doc.data());
//     console.log(data);
//     userSearch10.value = data
//     console.log(userSearch10);
//     lastEntry = snapshot.docs[snapshot.docs.length - 1];
//     console.log(lastEntry);

//   onSnapshot(q, (doc) => {
//     userSearch10.value = doc.data().search;
//     console.log(userSearch10.value);
//   });
  
// };

// const fetchNextPage = async () => {
//   const q = query(collection(db, "users"), orderBy("createdAt"), startAfter(lastEntry), limit(pageSize));
//   const snapshot = await getDocs(q);
//   const data = snapshot.docs.map((doc) => doc.data().search);
//   userSearch10.value = data;
//   lastEntry = snapshot.docs[snapshot.docs.length - 1];
// };

// const fetchPreviousPage = async () => {
//   const q = query(collection(db, "users"), orderBy("createdAt"), endBefore(lastEntry), limitToLast(pageSize));
//   const snapshot = await getDocs(q);
//   const data = snapshot.docs.map((doc) => doc.data().search);
//   userSearch10.value = data.reverse();
//   lastEntry = snapshot.docs[0];
// };


// onMounted(fetchFirstPage);
</script>

<template>
  <div class="flex flex-col bg-dark h-screen w-[35%] px-5 items-center">
    <Head />
    <button class="btn" @click="locationClick">
      Your Location
    </button>
    <div>
      <p class="text-white pt-5 text-center" v-if="placeName">
        You are here: {{ placeName }} [lat: {{ latitude.toFixed(2) }}, lng: {{ longitude.toFixed(2) }}]
      </p>
    </div>
    <div class="flex flex-col mt-6">
      <h2 class="text-primary text-3xl capitalize text-center pb-4">History</h2>
      <button class="bg-red-600 hover:bg-red-700 text-white w-1/4 rounded-md items-end mb-0.5" v-if="userSearch10?.length > 0" @click="deleteSelectedPlaces">
        Delete
      </button>
      <table class="bg-white w-full rounded-lg text-xs" v-if="userSearch10?.length > 0">
        <thead>
          <tr class="p-4">
            <th class="pr-4">Select</th>
            <th>Time searched</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          <tr class="mt-4" v-for="(data, index) in userSearch10" :key="userSearch10.id">
            <td><input type="checkbox" class="cursor-pointer" v-model="selectedPlaces" :value="place" /></td>
            <td>{{ data.time }}</td>
            <td class="overflow-hidden pl-6 cursor-pointer" @click="goToAddress(address)">{{ data.address }}</td>
          </tr>
        </tbody>
      </table>
    </div>
<div class = "flex justify-between w-full text-white">
<button @click = "fetchPreviousPage" v-if="userSearch10?.length > 0" >Previous</button>
<button @click = "fetchNextPage" v-if="userSearch10?.length > 0">Next</button>
</div>
    <div>
      <h2 class="text-sky-400 cursor-pointer hover:underline">Log in to view history</h2>
    </div>
  </div>
</template>
