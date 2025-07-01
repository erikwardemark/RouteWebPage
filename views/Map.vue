<template>
    <p> ID: {{ routeid }}</p> <br>
    <p> Center: {{ center }}</p> <br>
    <!-- <p> Coordinates: {{ coordinates }}</p>  -->

    <button @click="EditRoute">Edit route</button>
    <button @click="SaveRoute">Save Route</button>

    <GoogleMap
            api-key="AIzaSyCQmfChcySlixqBada07625MgJevZLlrg0"
            style="width: 100%; height: 500px"
            :center="center"
            :zoom="14"
        >
            <Polyline :options="routeCoord" /> <!--check polyline decoding-->
        </GoogleMap>   
    
</template>

<script>
import axios from 'axios';
import { GoogleMap, Polyline } from 'vue3-google-map'

export default {
    name: 'Map',
    data() {
        return {
            coordinates: [],
            center: {},
            editable: false,
        }
        },
    components: {
        GoogleMap,
        Polyline
    },
    computed: {
        mapid() {
            return this.$route.params.maps;
        },
        routeid() {
            return this.$route.params.id;
        },
        routeCoord() {
            return {
                path: this.coordinates,
                editable: this.editable,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2,
            }
        }
    },
    methods: {
        async decodePolyLine() {
            const url = `http://192.168.1.143:5000/api/route/${this.routeid}/map`;
            const mapData = await axios.get(url)
            this.coordinates = mapData.data.coordinates;
            this.center = mapData.data.center;
        },
        EditRoute() {
            this.editable = !this.editable;
        },
        SaveRoute(){
            //TODO: save route
        }
    },
    mounted() {
        this.decodePolyLine();
    }
}
</script>