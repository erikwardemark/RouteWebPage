<template>
    <p> ID: {{ pathId }}</p> <br>
    <p> Center: {{ center }}</p> <br>
    <!-- <p> Coordinates: {{ routeOptions.path }}</p>  -->

    <button @click="EditPath">Edit Path</button>
    <button @click="SavePath">Save Path</button>

    <GoogleMap
            api-key="AIzaSyCQmfChcySlixqBada07625MgJevZLlrg0"
            style="width: 100%; height: 500px"
            :center="center"
            :zoom="14"
        >
            <Polyline 
            :options="pathOptions"
            @update:path="SavePath"
            />
        </GoogleMap> 
    
</template>

<script setup>
import axios from 'axios';
import { GoogleMap, Polyline } from 'vue3-google-map'
import { ref } from 'vue';
import { useRoute } from 'vue-router'

const center = ref({})
const pathOptions = ref({
    path: [],
    editable: false,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2,})

const router = useRoute()
const pathId = ref(router.params.id)

async function decodePolyLine() {
            const url = `http://192.168.1.87:5000/api/route/${pathId.value}/map`//`http://192.168.1.143:5000/api/route/${this.routeid}/map`;
            const mapData = await axios.get(url)
            pathOptions.value.path = mapData.data.coordinates;
            center.value = mapData.data.center;       
}

function EditPath() {
  pathOptions.value = {
    ...pathOptions.value,
    editable: true
    }
}

function SavePath(newPath) {
  pathOptions.value = {
    ...pathOptions.value,
    path: newPath,
    editable: false
    }
}

decodePolyLine()
</script>
