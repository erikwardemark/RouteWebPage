<template>
    <div id =container class = "container2-1">
        <div id="title" class="title">
            <h1>Running Routes</h1>
        </div>
        <div id="routelist" class="routelist">
            <h1>List of paths</h1>
            <p>Number of paths ({{ runPaths.length }})</p>
            <div id="routes" class="routes-container">
                <ExpandableItem v-for = "path in runPaths" :key = "path.id">
                    <template #header>
                        <strong>{{ path.name }}</strong>
                    </template>
                    <div>
                        <p>{{ path.name }}</p>
                        <p>{{ path.distance }}</p>
                        <p>{{ path.startPoint }}</p>

                    </div>
                    <button class="map-button" @click="viewMap(path.id)">View Map</button>
                </ExpandableItem>
            </div>
        </div>
        <div id="abouT" class="about">
            <h1>About</h1>
            <p>This is a web application for viewing and managing running routes. You can view existing routes, import new ones, and see them displayed on a map.</p>
            <p>To get started, select a route from the list to view its details and map.</p>
            <p>You can also import new routes using the import section below.</p>
        </div>
         <div class = "import-section">
                <h1>Import new route</h1>
                <input v-model="fileImport" placeholder="File path" />
                <button @click="importFile">Import</button>
        </div>
        <div class="footer">
            <p>By Erik Wårdemark</p>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import ExpandableItem from '../components/ExpandableItem.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { notify } from '@kyvg/vue3-notification';

const router = useRouter();
const runPaths = ref([]);
const loading = ref(false);
const error = ref(null);
const fileImport = ref(null);
const backendUrl = '192.168.1.87:5000' //http://192.168.1.143:5000/api/routes

async function fetchRoutes() {
    try {
        const response = await axios.get('http://' + backendUrl + '/api/routes');
        runPaths.value = response.data;
        console.log('Fetched routes:', runPaths.value);
    } catch (err) {
        error.value = err.message || 'Error fetching routes';
        //console.error('Error fetching routes:', err);
    } finally {
        loading.value = false;
    }
}

function viewMap(pathId) {
    console.log("Viewing map for path ID:", pathId);
    router.push({ 
        name: 'Map', 
        params: { 
            id: pathId
        } 
    });
}

async function importFile(){
    const filePath = fileImport.value
    if (!filePath) return

    const formData = new FormData()
    formData.append("file", filePath)   // key MUST match Flask’s request.files["file"]

    try {
        const response = await axios.post("http://" + backendUrl + "/api/upload", 
            {
                path: filePath
            }
        )
        if (response.status === 200) {
            notify({
                title: 'Success',
                text: 'File imported successfully!',
                type: 'success',
                duration: 5000,
                speed: 1000,
                position: "top right"
            
            });
            viewMap(response.data.newId)

        }
    } catch (err) {
        notify({
                title: 'Error',
                text: 'File could not be imported!',
                type: 'error',
                duration: 5000,
                speed: 1000,
                position: "top right"
            
            });
        console.error('Error importing file:', err);
    }
}

fetchRoutes();

</script>

<style scoped>
.routelist {
    overflow-y: auto;
    background-color: var(--primary-color);
    color: white;
    grid-column: 1;
    grid-row: 2 / span 2;
    scrollbar-color: #888 #d4d4d4; /* thumb and track color */
    scrollbar-width: thin; /* "auto" or "thin" */
}

.routes-container {	
    text-align: left;
    color: black;

    ul li {
        padding: 5px;
        border-radius: 5px;
        margin-bottom: 5px;
    }
}

.import-section {
    background-color: var(--primary-color);
    color: white;
    text-transform: uppercase;
    text-align: center;
    font-size: 1em;
    grid-row: 3;
    grid-column: 2;
}
.about {
    background-color: #2E7D32;
    color: white;
    text-align: left;
    padding-left: 10px;
    font-size: 0.75em;
    grid-row: 2;
    grid-column: 2;
}

</style>