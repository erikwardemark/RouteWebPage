
<template>
  <div id="map" class="map">
    <GoogleMap
      api-key="AIzaSyCQmfChcySlixqBada07625MgJevZLlrg0"
      style="width: 100%; height: 500px"
      :center="center"
      :zoom="14"
    >
      <Polyline
        ref="polylineref"
        :options="pathOptions"
        @dblclick="onPolylineDblClick"
      />
    </GoogleMap>
  </div>
</template>


<script setup>
import { GoogleMap, Polyline } from 'vue3-google-map'
import { ref } from 'vue'

const props = defineProps({
  center: {
    type: Object,
    required: true
  },
  pathOptions: {
    type: Object,
    required: true
  }
})

const polylineref = ref(null)

function getNewPath() {
  return polylineref.value?.polyline?.getPath()
}

function onPolylineDblClick(event) {
  const gpsIndex = event.vertex
  const newPath = getNewPath()
  if (gpsIndex !== null && gpsIndex !== undefined) {
    newPath.removeAt(gpsIndex)
  }
}

defineExpose({ polylineref, getNewPath })


</script>

