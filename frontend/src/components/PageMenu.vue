<template>
  <VList
    dense
    nav
  >
    <VListItem
      v-for="(menuItem, menuItemIndex) in menuItems"
      :key="menuItem.title"
      :input-value="activeMenuItemIndex === menuItemIndex"
      color="indigo"
      @click="menuItemClickHandler(menuItem)"
    >
      <VListItemIcon>
        <VIcon>{{ menuItem.icon }}</VIcon>
      </VListItemIcon>
      <VListItemContent>
        <VListItemTitle>{{ menuItem.title }}</VListItemTitle>
      </VListItemContent>
    </VListItem>
  </VList>
</template>
<script>
import routeNames from '../routes/routeNames';

export default {
  data() {
    return {
      menuItems: [
        {
          title: 'Home Page',
          routeName: routeNames.homePage,
          icon: 'mdi-home',
        },
        {
          title: 'Clients',
          routeName: routeNames.clientsPage,
          icon: 'mdi-account-multiple',
        },
        {
          title: 'API docs',
          routeName: 'ApiDocs',
          icon: 'mdi-book',
          url: 'http://localhost/api-docs',
        },
      ],
    };
  },
  computed: {
    activeMenuItemIndex() {
      return this.menuItems.findIndex(
        (menuItem) => menuItem.routeName === this.$route.name,
      );
    },
  },
  methods: {
    menuItemClickHandler(menuItem) {
      if (Object.keys(menuItem).indexOf('url') !== -1) {
        window.open(menuItem.url, '_blank');
        return;
      }
      if (this.$route.name === menuItem.routeName) {
        return;
      }
      this.$router.push({ name: menuItem.routeName });
    },
  },
};
</script>
