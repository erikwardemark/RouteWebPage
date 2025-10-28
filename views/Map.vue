<template>
  <div id=container class="container2-1">
    <div id="title" class="title">
      <h1>{{ routeData.name }}</h1>
    </div>

    <div id="info" class="info">
      <h1>Route Information</h1>
      <div v-for="(value, key) in routeData">
        <p>{{key.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}}: {{ value }}</p>
      </div>
    </div>

    <MapItem 
      :center="center" 
      :pathOptions="pathOptions" 
      ref="mapItemRef"
    />

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
import axios from 'axios'
import { onBeforeMount, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useNotification } from "@kyvg/vue3-notification"
import MapItem from '../components/MapItem.vue'

const mapItemRef = ref(null)
const center = ref({})
const pathOptions = ref({
  path: [],
  editable: false,
  geodesic: true,
  strokeColor: '#FF0000',
  strokeOpacity: 1.0,
  strokeWeight: 2,
})

const router = useRoute()
const { notify } = useNotification()
const baseUrl = 'http://192.168.1.87:5000/api/path/'
const pathId = ref(router.params.id)
const routeData = ref({})

const settings = ref([]);

const apiKey = computed(() => {
  // adjust id or property name if needed
  const key =  settings.value.find(s => s.key === 'ApiKeyMap')?.currentSetting || ''
  return key;
});

const savedPath = []


async function fetchData() {
  const url = baseUrl + pathId.value
  const data = await axios.get(url)
  routeData.value = {
    name: data.data.name,
    distance: data.data.distance / 1000 + ' km',
    elevation: data.data.total_elevation_gain + ' m',
    type: data.data.type,
    creation_date: data.data.creation_date,
    updated: data.data.updated,
  }
  console.log(routeData.value)
}

async function fetchMap() {
  const url = baseUrl + pathId.value + '/map'
  const mapData = await axios.get(url)
  pathOptions.value.path = mapData.data.coordinates
  center.value = mapData.data.center
  savedPath.splice(0, savedPath.length, ...mapData.data.coordinates)
}

function EditPath() {
  const editable = !pathOptions.value.editable
  pathOptions.value = {
    ...pathOptions.value,
    editable: editable,
  }
}

async function SavePath() {
  try {
    const newPath = mapItemRef.value?.getNewPath?.()
    pathOptions.value = {
      ...pathOptions.value,
      path: newPath ? newPath.getArray() : pathOptions.value.path,
      editable: false,
    }
    await axios.put(
      baseUrl + pathId.value + '/map',
      {
        path: pathOptions.value.path,
        center: center.value,
      }
    )
    savedPath.splice(0, savedPath.length, ...mapData.data.coordinates)
    notify({
      title: "Success",
      text: "Path saved successfully",
      type: "success",
      duration: 3000,
      speed: 1000,
      position: "top right",
    })
  } catch (error) {
    pathOptions.value = {
      ...pathOptions.value,
      path: savedPath,
      editable: false,
    }
    console.error('Error saving path:', error)
    notify({
      title: "Error",
      text: "Error saving path: " + (error.response?.data?.error || ''),
      type: "error",
      duration: 5000,
      speed: 1000,
      position: "top right",
    })
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
        position: "top right",
      })
    }
  } catch (error) {
    console.error('Error exporting file:', error)
    const message = error.response?.data?.message || 'Error exporting file'
    notify({
      title: "Error",
      text: message,
      type: "error",
      duration: 5000,
      speed: 1000,
      position: "top right",
    })
  }
}

async function testApiKey() {
  try {
    const response = await axios.get(baseUrl + 'apikey')
    if (!response.data.valid) {
      throw new Error(response.data.error)
    }
  } catch (error) {
    console.warn('API Key test failed:', error)
    notify({
      title: "Api Key Error",
      text: "Api key invalid, might be problems saving the route." + error || '',
      type: "warn",
      duration: 10000,
      speed: 1000,
      position: "top right",
    })
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

async function fetchSettings(){
    try {
        const response = await axios.get ('http://192.168.1.87:5000/api/settings');
        settings.value = response.data;
        console.log('Fetched settings:', settings.value);
    } catch (error) {
        console.error('Error fetching settings:', error);
    }
}

onBeforeMount(() => {
  testApiKey()
  fetchData()
  fetchMap()
  fetchSettings()
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
