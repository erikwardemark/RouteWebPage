<template>
    <div id="app" class="container">
        <header>
            <h1>Running routes</h1>
        </header>
        
        <main>
            <section class = "import-section">
                <h2>Import new route</h2>
                <input v-model="fileImport" placeholder="File path" />
                <button @click="importFile">Import</button>
            </section>

            <section class="routes-section">
                <h2>List of paths</h2>
                <div id="routes" class="routes-container">
                    <ExpandableItem v-for = "path in runPaths" :key = "path.id">
                        <template #header>
                            <strong>{{ path.id }}</strong>
                        </template>
                        <div>
                            <p>{{ path.distance }}</p>
                            <p>{{ path.startPoint }}</p>
                            <p>{{ path.startPoint }}</p>

                        </div>
                        <button class="map-button" @click="viewMap(path.id)">View Map</button>
                    </ExpandableItem>
                </div>
            </section>
        </main>
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
    } catch (err) {
        error.value = err.message || 'Error fetching routes';
        console.error('Error fetching routes:', err);
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
.routes-container {
    height: 100vh;	
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