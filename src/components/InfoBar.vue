<script setup>
import { ref, onMounted, inject } from "vue";
import {db} from "../../firebase"
import {
  doc,
  onSnapshot,
  collection,
  query,
  startAfter,
  endBefore,
  limit,
  orderBy,
  deleteDoc,
  updateDoc,
  limitToLast,
} from "firebase/firestore";
import Head from "./Head.vue";
import "leaflet-control-geocoder";

const latitude = ref("");
const longitude = ref("");
const placeName = ref("");
const userSearch10 = ref([]);
const previousEntryNext = ref(null)
const previousEntryPrev = ref(null)
const selectedRow = ref(null)
const page = ref(1);
const pageCount = ref(1);
const pageSize = 10;
let maxPageCount = 0
let allDocuments = []

const receiveData = inject("receiveData");

const locationClick = async () => {
  navigator.geolocation.getCurrentPosition(async (position) => {
    latitude.value = position.coords.latitude;
    longitude.value = position.coords.longitude;

    // Perform reverse geocoding using Google Maps Geocoding API
    
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    // const apiKey = "AIzaSyArDcrpqRH6QHCHpPefS8Q36ftHghcs9Xg";
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude.value},${longitude.value}&key=${apiKey}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.results.length > 0) {
        const location = data.results[0].formatted_address;
        placeName.value = location;
      } else {
        placeName.value = "No results found";
      }
    } catch (error) {
      console.error("Error:", error);
      placeName.value = "Error getting location";
    }
  });
};
const toggleSelected = async (data) => {
  try {
    const documentRef = doc(db, "search", data.id);
    await updateDoc(documentRef, { selected: !data.selected });
  } catch (error) {
    console.error(`Error toggling selection for document ${data.id}:`, error);
  }
};
const deleteSelectedPlaces = async () => {
  // get all selected data you want to delete
  const selectedDocuments = allDocuments.filter((data) => data.selected);

  // for each selected data delete from database and update the userSearch10 array
  for (const document of selectedDocuments) {
    try {
      const documentRef = doc(db, "search", document.id);
      await deleteDoc(documentRef);
      // location.reload();
    } catch (error) {
      console.error(`Error deleting document ${document.id}:`, error);
    }
  }
};

const goToAddress = (lat, lon) => {
  receiveData(lat, lon);
};

// Query data for pagination
const fetchFirstPage = async () => {
  const q = query(
    collection(db, "search"),
    orderBy("time", "asc"),
    limit(pageSize)
  );

  // get real time data from database
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => doc.data());
    
    //save batches of 10 data to state
    userSearch10.value = data;
    
    // store all data in an array 
    allDocuments.push(...data);

    // get first and last document from the batch
    const lastDocument = snapshot.docs[snapshot.docs.length - 1];
    const firstDocument = snapshot.docs[0];

    previousEntryNext.value = lastDocument ? lastDocument.data() : null;
    previousEntryPrev.value = firstDocument ? firstDocument.data() : null;
    
    
  });
  // return if we don't need real time data anymore
  return unsubscribe;
};


const fetchNextPage = async () => {
  if (previousEntryNext.value === null) {
    return;
  }
  
  const q = query(
    collection(db, "search"),
    orderBy("time", "asc"),
    startAfter(previousEntryNext.value.time),
    limit(pageSize)
  );
    
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => doc.data());
    const lastDocument = snapshot.docs[snapshot.docs.length - 1];
    const firstDocument = snapshot.docs[0];
    
    allDocuments.push(...data);
    const uniqueDoc = [...new Set(allDocuments)];
   
    // get max page count for conditional 
    maxPageCount = Math.ceil(uniqueDoc.length / pageSize);
    if (pageCount.value >= maxPageCount) {
      return;
    }
    
    userSearch10.value = data;
    previousEntryNext.value = lastDocument ? lastDocument.data() : null;

    previousEntryPrev.value = firstDocument ? firstDocument.data() : null;
    
    
    page.value++;
    pageCount.value++;
    
  });

  return unsubscribe;
};

const fetchPreviousPage = async () => {
  if (previousEntryPrev.value === null) {
    return;
  }
  if (pageCount.value <= 1) {
    return;
  }
  page.value--;
  pageCount.value--;

  const q = query(
    collection(db, "search"),
    orderBy("time", "asc"),
    endBefore(previousEntryPrev.value.time),
    limitToLast(pageSize)
  );
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => doc.data());
    userSearch10.value = data;
    
    const lastDocument = snapshot.docs[snapshot.docs.length - 1];
    const firstDocument = snapshot.docs[0];
    
    previousEntryNext.value = lastDocument ? lastDocument.data() : null;

    previousEntryPrev.value = firstDocument ? firstDocument.data() : null;
    
  });

  return unsubscribe;
};


onMounted(fetchFirstPage);

</script>

<template>
  <div class="flex flex-col bg-dark h-screen w-[35%] px-5 items-center">
    <Head />
    <button class="btn" @click="locationClick">
      <p class="text-2xl">Your Location</p>
    </button>
    <div>
      <p class="text-white pt-8 text-center text-xl" v-if="placeName">
        You are here: {{ placeName }} [lat: {{ latitude.toFixed(2) }}, lng: {{ longitude.toFixed(2) }}]
      </p>
    </div>
    <div class="flex flex-col mt-10">
      <h2 class="text-primary text-4xl capitalize text-center pb-4">History</h2>
      <button class="bg-red-600 hover:bg-red-700 text-white w-1/4 rounded-md items-end mb-0.5 text-xl" v-if="userSearch10?.length > 0" @click="deleteSelectedPlaces">
        Delete
      </button>
      <div class="max-h-[700px] overflow-y-auto">
        <table class="bg-white w-full rounded-lg text-lg" v-if="userSearch10?.length > 0">
          <thead>
            <tr class="p-4 pt-4">
              <th class="px-4 pt-4">Select</th>
              <th class="pt-4">Time searched</th>
              <th class="pt-4">Address</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(data, index) in userSearch10" :key="data.id" :class="{ 'bg-gray-300': selectedRow === index }" class="hover:bg-slate-300">
              <td class="my-3">
                <input type="checkbox" class="cursor-pointer h-4" :checked="data.selected" @change="toggleSelected(data)" />
              </td>
              <td class="py-3">{{ data.time }}</td>
              <td class="py-3 overflow-hidden pl-6 cursor-pointer" @click="goToAddress(data.lat, data.lon); selectedRow = index">{{ data.address }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="userSearch10?.length > 0" class="flex items-center justify-center p-2"></div>
    <div v-if="userSearch10?.length > 0" class="flex items-center justify-center p-2"></div>
    <div class="flex justify-between w-full text-white">
      <button class="text-2xl" @click="fetchPreviousPage" v-if="userSearch10?.length > 0">Previous</button>
      <button class="text-2xl" @click="fetchNextPage" v-if="userSearch10?.length">Next</button>
    </div>
  </div>
</template>



