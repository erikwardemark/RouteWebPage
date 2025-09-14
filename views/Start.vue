<template>
    <div id="app" class="container">
        <header>
            <h1>Running routes</h1>
        </header>
        
        <main>
            <section class = "import-section">
                <h2>Import new route</h2>
                <input v-model="fileImport" placeholder="File path" />
                <button @click="uploadFile">Import</button>
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
                        <button class="map-button" @click="viewMap(path)">View Map</button>
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

function viewMap(path) {
    router.push({ 
        name: 'Map', 
        params: { 
            id: path.id
        } 
    });
}
async function uploadFile(){
    const filePath = fileImport.value
    if (!filePath) return
    console.log(filePath)

    const formData = new FormData()
    formData.append("file", filePath)   // key MUST match Flask’s request.files["file"]

    await axios.post("http://" + backendUrl + "/api/upload", 
        {
            path: filePath
        }
    )
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