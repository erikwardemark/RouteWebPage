<template>
    <div id="app" class="container">
        <header>
            <h1>Running routes</h1>
        </header>
        
        <main>
            <section class="routes-section">
                <h2>List of router</h2>
                <div id="routes" class="routes-container">
                    <ExpandableItem v-for = "route in routes" :key = "route.id">
                        <template #header>
                            <strong>{{ route.id }}</strong>
                        </template>
                        <div>
                            <p>{{ route.distance }}</p>
                            <p>{{ route.startPoint }}</p>
                            <p>{{ route.startPoint }}</p>

                        </div>
                        <button class="map-button" @click="viewMap(route)">View Map</button>
                    </ExpandableItem>
                </div>
            </section>
        </main>
    </div>
</template>

<script>
import axios from 'axios';
import ExpandableItem from '../components/ExpandableItem.vue';
export default {
    name: 'Start',
    data() {
        return {
            routes: [],
            loading: false,
            error: null,
            backendUrl: 'http://192.168.1.143:5000/api/routes' 
        };
    },
methods : {
        async fetchRoutes() {
            this.loading = true;
            this.error = null;
            this.routes = [];
            try {
                const response = await axios.get(this.backendUrl);
                this.routes = response.data;
            } catch (err) {
                this.error = err.message || 'Error fetching routes';
                console.error('Error fetching routes:', err);
            } finally {
                this.loading = false;
            }
        },

        viewMap(route) {
            this.$router.push({ 
                name: 'Map', 
                params: { 
                    mapid: route.map.id,
                    id: route.id
                } 
            });
        }
    },
mounted() {
    this.fetchRoutes();
},
components: { ExpandableItem },

}
</script>

<style scoped>
.routes-container {
    max-height: 400px;
    overflow-y: auto;
    margin-top: 20px;
    padding: 10px;
    text-align: left;

    ul li {
        padding: 5px;
        border: 1px solid #000000;
        background-color: aquamarine;
        border-radius: 5px;
        margin-bottom: 5px;
    }
}
.map-button {
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin-top: 10px;
    cursor: pointer;
    float: right;
}
</style>