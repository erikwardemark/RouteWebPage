<template>
    <p>{{ maps }}</p>
</template>

<script>
export default {
    name: 'Map',
    computed: {
        maps() {
            return this.$route.params.maps;
        },
        polyline() {
            return this.$route.params.polyline;
        }
    },
}
</script>