<script>
import { ref, onMounted } from "vue";
import { db } from "../../firebase";
import L from "leaflet";
import "@geoapify/leaflet-address-search-plugin";
import "leaflet/dist/leaflet.css";
import {arrayUnion, doc, updateDoc} from "firebase/firestore";


export default {
  name: "MapView",
  setup() {
    const map = ref(null);
    let marker = null;

    onMounted(initializeMap);

    function initializeMap() {
      // Create a map instance
      map.value = L.map("map").setView([0, 0], 13);

      // Add the Google Maps style tile layer
      L.tileLayer("https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
        maxZoom: 15,
      }).addTo(map.value);

      // Get the user's current location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Set the map view to the user's location
          map.value.setView([latitude, longitude], 13);

          // Add a marker at the user's location
          if (marker !== null) {
            map.value.removeLayer(marker);
          }
          marker = L.marker([latitude, longitude]).addTo(map.value);

          marker.on('click', () => {
         map.value.setView([latitude, longitude], 13);
      });
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );

      const path = doc(db, "users", "searches") 
      const searchedAddress = async(address) => {
        await updateDoc(path, {
          search: arrayUnion({
            id: address.place_id,
            address: address.formatted,
            lat: address.lat,
            lon: address.lon,
            time: new Date().toLocaleString()
          }),
 
        })
      }
      const searchControl = L.control.addressSearch(
        // process.env.VUE_APP_GEOAPIFY_API_KEY,
        "47777fe9156749ca89df5e1b9ef27751",
        {
          position: "topright",
          placeholder: "Enter address here",
          resultCallback: (address) => {
           console.log(address);
            if (!address) {
              return;
            }
            // if (marker !== null) {
            //   map.value.removeLayer(marker);
            // }
            marker = L.marker([address.lat, address.lon]).addTo(map.value);
            marker.on('click', () => {
            map.value.setView([address.lat, address.lon], 13)})
            map.value.setView([address.lat, address.lon], 13);

             searchedAddress(address)
          },
        }
      );

      searchControl.addTo(map.value);

      // Update marker position on map zoom
      map.value.on("zoomend", () => {
        if (marker !== null) {
          const { lat, lng } = marker.getLatLng();
          marker.setLatLng([lat, lng]).update();
        }
      });
    }

    return {
      map,
    };
  },
};
</script>

<template>
  <div id="map" class="w-[65%] h-screen"></div>
</template>

