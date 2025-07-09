<template>
    <p> ID: {{ routeid }}</p> <br>
    <p> Center: {{ center }}</p> <br>
    <!-- <p> Coordinates: {{ routeOptions.path }}</p>  -->

    <button @click="EditRoute">Edit route</button>
    <button @click="SaveRoute">Save Route</button>

    <GoogleMap
            api-key="AIzaSyCQmfChcySlixqBada07625MgJevZLlrg0"
            style="width: 100%; height: 500px"
            :center="center"
            :zoom="14"
        >
            <Polyline 
            :options="routeOptions"
            @update:path="SaveRoute"
            />
        </GoogleMap> 
    
</template>

<script setup>
import axios from 'axios';
import { GoogleMap, Polyline } from 'vue3-google-map'
import { ref } from 'vue';
import { useRoute } from 'vue-router'

const coordinates = ref([])
const center = ref({})
const editable = ref(false)
const routeOptions = ref({
    path: [],
    editable: false,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2,})

const route = useRoute()
const routeid = ref(route.params.id)
const mapid =  ref(route.params.maps)

async function decodePolyLine() {
            const url = `http://192.168.1.87:5000/api/route/${routeid.value}/map`//`http://192.168.1.143:5000/api/route/${this.routeid}/map`;
            const mapData = await axios.get(url)
            routeOptions.value.path = mapData.data.coordinates;
            center.value = mapData.data.center;       
}

function EditRoute() {
  routeOptions.value = {
    ...routeOptions.value,
    editable: true
    }
}

function SaveRoute(newPath) {
  routeOptions.value = {
    ...routeOptions.value,
    path: newPath,
    editable: false
    }
}

decodePolyLine()
</script>
