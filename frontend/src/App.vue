<template>
  <VApp id="inspire">
    <VNavigationDrawer
      app
      permanent
      :expand-on-hover="drawer"
    >
      <PageMenu />
    </VNavigationDrawer>
    <VAppBar app>
      <VAppBarNavIcon @click="toggleDrawer" />
      <VToolbarTitle>{{ title }}</VToolbarTitle>
    </VAppBar>
    <VMain>
      <RouterView />
    </VMain>
  </VApp>
</template>
<script>
import PageMenu from './components/PageMenu.vue';

export default {
  components: {
    PageMenu,
  },
  data() {
    return {
      title: 'Application',
      drawer: false,
    };
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
  },
};
</script>
