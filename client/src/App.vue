<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>

export default {
    name: "app",
    data() {
        return {};
    },
    computed: {},
    components: {
    }
};
</script>


<style lang="less">
html,
body,
#app {
    padding: 0;
    margin: 0;
    height: 100%;
    width: 100%;
}
</style>
