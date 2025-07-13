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
            ref="polylineref"
            :options="pathOptions"
            @dragend="onPolylineEdited"
            @insert_at="onPolylineEdited"
            @remove_at="onPolylineEdited"
            @set_at="onPolylineEdited"
            />
        </GoogleMap> 
    <p>new path: {{ updatedPath }}</p>
    
</template>

<script setup>
import axios from 'axios';
import { GoogleMap, Polyline } from 'vue3-google-map'
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router'

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
const pathId = ref(router.params.id)

async function decodePolyLine() {
            const url = `http://192.168.1.87:5000/api/path/${pathId.value}/map`//`http://192.168.1.143:5000/api/route/${this.routeid}/map`;
            const mapData = await axios.get(url)
            pathOptions.value.path = mapData.data.coordinates;
            center.value = mapData.data.center;    
            updatedPath.value = mapData.data.coordinates;   
}

function EditPath() {
  pathOptions.value = {
    ...pathOptions.value,
    editable: true
    }
}

async function SavePath() {
  pathOptions.value = {
    ...pathOptions.value,
    path: getNewPath().getArray(),
    editable: false
    }
    await axios.put(`http://192.168.1.87:5000/api/path/${pathId.value}/map`, 
    {
      path: pathOptions.value.path,
      center: center.value
    }
);


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
  decodePolyLine()
})

</script>
