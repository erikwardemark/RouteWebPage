<template>
    <div id="settings" class="allSettings">
        <h1>Settings</h1>
        <p>Here you can adjust your application settings.</p>

        <div id ="settings-list">
            <SettingItemText v-for ="setting in settings" 
                :key ="setting"
                :title="setting.title"
                :description="setting.description"
                :currentSetting= "setting.currentSetting">
            </SettingItemText>
        </div>
        <button @click="Save()">Save</button>
        <button @click="$router.back()">Cancel</button>
    </div>
</template>

<script setup>
import SettingItemText from '../components/SettingItemText.vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import axios from 'axios';

const router = useRouter();
const backendUrl = '192.168.1.87:5000'
const settings = ref([]);

async function Save(){
    const response = await axios.post('http://' + backendUrl + '/api/settings', settings.value);
    if (response.status === 200) {
        console.log('Settings saved successfully');
    } else {
        console.error('Error saving settings:', response.statusText);
    }
}

async function fetchSettings(){
    try {
        const response = await axios.get ('http://' + backendUrl + '/api/settings');
        settings.value = response.data;
        console.log('Fetched settings:', settings.value);
    } catch (error) {
        console.error('Error fetching settings:', error);
    }
}


fetchSettings();

</script>

<style scoped>
.allSettings {
    padding: 20px;
    background-color: var(--primary-green);
    color: var(--text-white);
}
.allSettings input {
    padding: 5px;
    margin-right: 5px;
    border-radius: 2px;
    border: none;
    width: 60%;
} 
.allSettings input:focus {
    outline: var(--primary-orange) 2px solid;
    box-shadow: 0 0 10px var(--primary-orange);
}

</style>
