<script setup>
import {provide, ref} from "vue";
import InfoBar from "./components/InfoBar.vue"
import Map from "./components/Map.vue"

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
<!-- <script setup>
import {provide, ref, onMounted} from "vue";
import {getAuth, onAuthStateChanged, signOut, handleSignOut} from "firebase/auth";
import InfoBar from "./components/InfoBar.vue"
import Map from "./components/Map.vue"


let isLoggedIn = ref(false);

let auth;
onMounted(() => {
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
  isLoggedIn.value = true
  } else {
  isLoggedIn.value = false
  }
});
})

</script>

<template >
  <router-view/>  
</template> -->

