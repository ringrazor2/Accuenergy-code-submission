
<script>
import { ref, onMounted } from "vue";
import L from "leaflet";
import "@geoapify/leaflet-address-search-plugin";
import "leaflet/dist/leaflet.css";

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
        maxZoom: 13,
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
            if (marker !== null) {
              map.value.removeLayer(marker);
            }
            marker = L.marker([address.lat, address.lon]).addTo(map.value);
            marker.on('click', () => {
            map.value.setView([address.lat, address.lon], 13);})
            map.value.setView([address.lat, address.lon], 13);
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

<!-- <style scoped>
  /* Custom styles for the search control */
  .leaflet-control-address-search .address-search-input {
    width: 200px;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 6px;
        font-size: 14px;
      }

      .leaflet-control-address-search .address-search-results {
        background-color: #fff;
        border: 1px solid #ccc;
        border-top: none;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        max-height: 200px;
        overflow-y: auto;
      }

      .leaflet-control-address-search .address-search-results-item {
        padding: 4px 8px;
        cursor: pointer;
      }

      .leaflet-control-address-search .address-search-results-item:hover {
        background-color: #f0f0f0;
      }
    </style> -->
