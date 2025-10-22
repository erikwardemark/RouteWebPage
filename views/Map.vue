<template>
  <div id=container class = "container2-1">
    <div id="title" class="title">
      <h1>{{ routeData.name }}</h1>
    </div>

    <div id="info" class="info">
      <h1>Route Information</h1>
      <p> ID: {{ pathId }}</p> <br>
      <p> Name: {{ routeData.name }}</p> <br>
      <p> Distance: {{ routeData.distance }}</p> <br>
      <p> Elevation: {{ routeData.elevation }}</p> <br>
      <p> Center: {{ center }}</p> <br>
    </div>

    <div id="map" class="map">
      <GoogleMap
        v-if ="apiKey"
        :api-key="apiKey"
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
import { onMounted, ref, computed } from 'vue';
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
const settings = ref([]);

const apiKey = computed(() => {
  // adjust id or property name if needed
  const key =  settings.value.find(s => s.id === '1')?.currentSetting || ''
  console.log('API Key:', key);
  return key;
});

async function fetchData() {
  const url = baseUrl + pathId.value 
  const data = await axios.get(url)
  routeData.value = {
    name: data.data.name,
    distance: data.data.distance,
    elevation: data.data.total_elevation_gain,
    type: data.data.type,
    creation_date: data.data.creation_date
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
    await axios.put( 
      baseUrl + pathId.value+ '/map', 
      {
      path: pathOptions.value.path,
      center: center.value
      }
    );
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

async function fetchSettings(){
    try {
        const response = await axios.get ('http://192.168.1.87:5000/api/settings');
        settings.value = response.data;
        console.log('Fetched settings:', settings.value);
    } catch (error) {
        console.error('Error fetching settings:', error);
    }
}

onMounted(() => {
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
