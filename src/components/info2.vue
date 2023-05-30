<script setup>
import { ref, onMounted, inject } from "vue";
import {auth, db} from "../../firebase"
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
} from "firebase/firestore";
import Head from "./Head.vue";
import "leaflet-control-geocoder";
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";

const latitude = ref("");
const longitude = ref("");
const placeName = ref("");
const userSearch10 = ref([]);
const selectedRow = ref(null)
const moreData = ref(true)
let page = ref(1);
let pageCount = ref(1);
const hasNextPage = ref(true);
const pageSize = 10;
let lastEntry = null;

const receiveData = inject("receiveData");

const locationClick = async () => {
  navigator.geolocation.getCurrentPosition(async (position) => {
    latitude.value = position.coords.latitude;
    longitude.value = position.coords.longitude;

    // Perform reverse geocoding using Google Maps Geocoding API
    const apiKey = "AIzaSyArDcrpqRH6QHCHpPefS8Q36ftHghcs9Xg";
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

const deleteSelectedPlaces = async () => {
  // get all selected data you want to delete
  const selectedDocuments = userSearch10.value.filter((data) => data.selected);

  // for each selected data delete from database and update the userSearch10 array
  for (const document of selectedDocuments) {
    try {
      const documentRef = doc(db, "testingSelect", document.id);
      await updateDoc(documentRef, { selected: true });
      await deleteDoc(documentRef);
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
    collection(db, "testingSelect"),
    orderBy("time", "asc"),
    limit(pageSize)
  );
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => doc.data());
    userSearch10.value = data;
    const lastDocument = snapshot.docs[snapshot.docs.length - 1];
    lastEntry = lastDocument ? lastDocument.data() : null;
  });
  return unsubscribe;
};

const fetchNextPage = async () => {
  // console.log(lastEntry);
  // if (pageCount.value === 2) {
  //   moreData.value = false
  //   return;
  // }
  // page.value++;
  // pageCount.value++;
  // moreData.value = true
  const q = query(
    collection(db, "testingSelect"),
    orderBy("time", "asc"),
    startAfter(lastEntry.time),
    limit(pageSize)
    );
    let data = []
    const unsubscribe = onSnapshot(q, (snapshot) => {
      data = snapshot.docs.map((doc) => doc.data());
      console.log(data);
      userSearch10.value = data;
      const lastDocument = snapshot.docs[snapshot.docs.length - 1];
     console.log(userSearch10.value.length);
      if(userSearch10.value.length !== 10){
    changePage()
       return;
      }
      lastEntry = lastDocument ? lastDocument.data() : null;
      hasNextPage.value = snapshot.docs.length === pageSize;
      // if(snapshot.docs.length < pageSize) {
        //  lastEntry
        // }
      });
   console.log(userSearch10.value.length);  
  
      return unsubscribe;
};
const changePage = () =>{
  page.value++;
  pageCount.value++;
  moreData.value = true
}
const fetchPreviousPage = async () => {
  if (lastEntry === null) {
    return;
  }
  page.value--;
  pageCount.value--;

  const q = query(
    collection(db, "testingSelect"),
    orderBy("time", "asc"),
    endBefore(lastEntry.time),
    limit(pageSize)
  );
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => doc.data());
    userSearch10.value = data;
    const lastDocument = snapshot.docs[snapshot.docs.length - 1];
    lastEntry = lastDocument ? lastDocument.data() : null;
  });

  return unsubscribe;
};

onMounted(fetchFirstPage);

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
      <div class="max-h-96 overflow-y-auto">
  <table class="bg-white w-full rounded-lg text-xs" v-if="userSearch10?.length > 0">
    <thead>
      <tr class="p-4">
        <th class="px-4">Select</th>
        <th class = "pt-2">Time searched</th>
        <th>Address</th>
      </tr>
    </thead>
    <tbody>
      <tr
              v-for="(data, index) in userSearch10"
              :key="data.id"
              :class="{ 'bg-gray-300': selectedRow === index }"
              class="hover:bg-slate-300"
            >
              <td class="my-3 pl-5"><input type="checkbox" class="cursor-pointer" v-model="data.selected" /></td>
              <td class="py-3">{{ data.time }}</td>
              <td
                class="py-3 overflow-hidden pl-6 cursor-pointer"
                @click="goToAddress(data.lat, data.lon); selectedRow = index"
              >{{ data.address }}</td>
            </tr>
    </tbody>
  </table>
  </div>
</div>
<div v-if="userSearch10?.length > 0" class = "flex items-center justify-center p-2">
  <v-pagination
  v-model="page"
  :pages="pageCount"
  :range-size="1"
  active-color="#DCEDFF"
  @update:modelValue="(value) => {
    if (value > page) {
      fetchNextPage();
    } else if (value < page) {
      fetchPreviousPage();
    }
  }"
/>
  </div>

<div class = "flex justify-between w-full text-white">
<button @click = "fetchPreviousPage" v-if="userSearch10?.length > 0" >Previous</button>
<button @click = "fetchNextPage" v-if="userSearch10?.length" :disabled="!moreData">Next</button>

</div>
    
  </div>
</template>
