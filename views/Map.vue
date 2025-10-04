<template>
  <div id=container class = "container2-1">
    <div id="title" class="title">
      <h1>{{ routeData.name }}</h1>
    </div>

    <div id="info" class="info">
      <h1>Route Information</h1>
      <div v-for ="(value, key) in routeData">
        <p>{{ key.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase()) }}: {{ value }}</p>
      </div>
    </div>

    <div id="map" class="map">
      <GoogleMap
        api-key="AIzaSyCQmfChcySlixqBada07625MgJevZLlrg0"
        style="width: 100%; height: 400px"
        :center="center"
        :zoom="14"
      >
        <Polyline
          ref="polylineref"
          :options="pathOptions"
          @dragend="onPolylineEdited"
          @dblclick="handlePolylineDblClick"
        />
      </GoogleMap>
    </div>
     <div id="buttons" class="buttons">
      <button @click="EditPath">Edit Path</button>
      <button @click="SavePath">Save Path</button>
      <button @click="ExportPath">Export as GPX</button>
    </div>

    <div class="footer">
      <p>By Erik Wårdemark</p>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { GoogleMap, Polyline } from 'vue3-google-map'
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router'
import { useNotification } from "@kyvg/vue3-notification";

const polylineref = ref(null)
const updatedPath = ref([])
const center = ref({})
const pathOptions = ref({
    path: [],
    editable: false,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2,})

const router = useRoute()
const { notify }  = useNotification()
const baseUrl = 'http://192.168.1.87:5000/api/path/'
const pathId = ref(router.params.id)
const routeData = ref({})

async function fetchData() {
  const url = baseUrl + pathId.value 
  const data = await axios.get(url)
  routeData.value = {
    name: data.data.name,
    distance: data.data.distance + 'm',
    elevation: data.data.total_elevation_gain + 'm',
    type: data.data.type,
    creation_date: data.data.creation_date,
    updated: data.data.updated

  };
  console.log(routeData.value)
}

async function fetchMap() {
  const url = baseUrl + pathId.value + '/map'
  const mapData = await axios.get(url)
  pathOptions.value.path = mapData.data.coordinates;
  center.value = mapData.data.center;    
  updatedPath.value = mapData.data.coordinates;   
}

function EditPath() {
  const editable = !pathOptions.value.editable;
  pathOptions.value = {
    ...pathOptions.value,
    editable: editable
    }
}

async function SavePath() {
  pathOptions.value = {
    ...pathOptions.value,
    path: getNewPath().getArray(),
    editable: false
    }
    const response = await axios.put( 
      baseUrl + pathId.value+ '/map', 
      {
      path: pathOptions.value.path,
      center: center.value
      }
    );
    if (response.status != 200) {
      console.error('Error saving path:', response);
    }
    fetchData()
}

async function ExportPath() {
  try {
    const result = await axios.post(baseUrl + pathId.value + '/export')
    if (result.status === 200) {
      notify({
        title: "Success",
        text: "File exported successfully",
        type: "success",
        duration: 5000,
        speed: 1000,
        position: "top right"
      });
    } 
  } catch (error) {
    console.error('Error exporting file:', error);
    const message = error.response?.data?.message || 'Error exporting file';
    notify({
      title: "Error",
      text: message,
      type: "error",
      duration: 5000,
      speed: 1000,
      position: "top right"
    });
  }
}

const handlePolylineDblClick = (event) => {
  const gpsIndex = event.vertex;

  // Access the underlying MVCArray of the path
    const newPath = getNewPath();
    // Get the path as an array of LatLng objects
    const pathArray = newPath.getArray();

  if (gpsIndex !== null && gpsIndex !== undefined) {
    // Remove the vertex at the specified index
    newPath.removeAt(gpsIndex);
    // Reflect changes in updatedPath
    updatedPath.value = pathArray.map(latLng => ({
      lat: latLng.lat(),
      lng: latLng.lng()
    }));
  }
}

function onPolylineEdited() {
  if (polylineref.value) {
    // Access the underlying MVCArray of the path
    const newPath = getNewPath();
    
    // Get the path as an array of LatLng objects
    const pathArray = newPath.getArray();
    
    updatedPath.value = pathArray.map(latLng => ({
      lat: latLng.lat(),
      lng: latLng.lng()
    }));
    console.log('Polyline path updated:', updatedPath.value);
  }
};

function getNewPath() {
  // This assumes the Polyline instance has a getPath() method
  return polylineref.value.polyline.getPath()
}

onMounted(() => {
  fetchData()
  fetchMap()
})

</script>

<style scoped>
.info {
    background-color: var(--primary-green);
    font-size: 1em;
    grid-row: 2 / span 2;
    grid-column: 1;
    height: 100%;
    color: var(--text-white);
}
.info h1 {
    text-align: center;
    margin-bottom: 5px;
    border-bottom: 2px solid var(--accent-light-grey);
}
.info p {
    text-align: left;
    padding-left: 5px;
}

.map {
    grid-column: 2;
    grid-row: 2;
    background-color: lightgrey;
}

.buttons {
    background-color: var(--primary-green);
    color: white;
    text-align: center;
    font-size: 1em;
    grid-row: 3;
    grid-column: 2;
}

</style>
