<script setup>
import { ref, onMounted, onUnmounted, inject, watch } from "vue";
import { db } from "../../firebase";
import L from "leaflet";
import "@geoapify/leaflet-address-search-plugin";
import "leaflet/dist/leaflet.css";
import {doc, collection, setDoc, onSnapshot} from "firebase/firestore";

    const map = ref(null);
    let marker = null;

  const props = defineProps({
    location: {
      type: Object,
      default: null,
    },})

    const loc = ref(props.location)
    


    onMounted(initializeMap);
   
    function initializeMap() {
      // Create a map instance
      map.value = L.map("map").setView([0, 0], 13);      
      
      watch(() => props.location, (val) => {
      loc.value = val;
      map.value.setView([loc?.value?.lat, loc?.value?.lon], 13);
    })
     
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
      //     if (marker !== null) {
      //       map.value.removeLayer(marker);
      //     }
      //     marker = L.marker([latitude, longitude]).addTo(map.value);

      //     marker.on('click', () => {
      //    map.value.setView([latitude, longitude], 13);
      // });
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );

      const collectionRef = collection(db, "testingSelect")
     
  const searchedAddress = async (address) => {
  try {

    // Create a new document with a custom ID and save the address data
    await setDoc(doc(collectionRef, address.place_id), {
      id: address.place_id,
      address: address.formatted,
      selected: false,
      lat: address.lat,
      lon: address.lon,
      time: new Date().toLocaleString(),
    });

    // marker = L.marker([address.lat, address.lon]).addTo(map.value);
    //         marker.on('click', () => {
    //         map.value.setView([address.lat, address.lon], 13)
    //       })
            map.value.setView([address.lat, address.lon], 13);

  } catch (error) {
    console.error("Error saving address data:", error);
  }
};

      const searchControl = L.control.addressSearch(
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
            searchedAddress(address)

          //   marker = L.marker([address.lat, address.lon]).addTo(map.value);
          //   marker.on('click', () => {
          //   map.value.setView([address.lat, address.lon], 13)
          // })
          //   map.value.setView([address.lat, address.lon], 13);

          },
        }
      );


      // keep track of markers to associated with address
      const markers = {}
   
//       const searchControl = L.control.addressSearch(
//   // process.env.VUE_APP_GEOAPIFY_API_KEY,
//   "47777fe9156749ca89df5e1b9ef27751",
//   {
//     position: "topright",
//     placeholder: "Enter address here",
//     resultCallback: async (address) => {
//       console.log(address);
//       if (!address) {
//         return;
//       }
      
//       searchedAddress(address)
//       const documentRef = doc(collectionRef, address.place_id);
//       const documentSnapshot = await getDoc(documentRef);

//       if (documentSnapshot.exists()) {
//         // Address exists in the Firestore database
//         if (markers[address.place_id]) {
//           // Remove the previous marker if it exists
//           map.value.removeLayer(markers[address.place_id]);
//         }
//         markers[address.place_id] = L.marker([address.lat, address.lon]).addTo(map.value);
//         markers[address.place_id].on("click", () => {
//           map.value.setView([address.lat, address.lon], 13);
//         });
//         map.value.setView([address.lat, address.lon], 13);
//       } else {
//         // Address does not exist in the Firestore database
//         if (markers[address.place_id]) {
//           // Remove the marker associated with the deleted document
//           map.value.removeLayer(markers[address.place_id]);
//           delete markers[address.place_id];
//         }
//         console.log("Address does not exist in the database.");
//       }
//     },
//   }
// );

  searchControl.addTo(map.value);

  const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
    // check for changes to the database and update marker accordingly
    
  snapshot.docChanges().forEach((change) => {
    const docData = change.doc.data();
    const { lat, lon } = docData;

    // use metadata about change to add or remove marker
    if (change.type === "added" || change.type === "modified") {
      // Create or update the marker
      if (markers[change.doc.id]) {
        // Remove the previous marker if it exists
        map.value.removeLayer(markers[change.doc.id]);
      }
      // save the marker to the markers object
      markers[change.doc.id] = L.marker([lat, lon]).addTo(map.value);
      
      markers[change.doc.id].on("click", () => {
        map.value.setView([lat, lon], 13);
      });
    } else if (change.type === "removed") {
      // Remove the marker associated with the deleted document
      if (markers[change.doc.id]) {
        map.value.removeLayer(markers[change.doc.id]);
        delete markers[change.doc.id];
      }
    }
  })});

      // Update marker position on map zoom
      map.value.on("zoomend", () => {
        if (marker !== null) {
          const { lat, lng } = marker.getLatLng();
          marker.setLatLng([lat, lng]).update();
        }
      });
    }
</script>

<template>
  <div id="map" class="w-[65%] h-screen"></div>
</template>

