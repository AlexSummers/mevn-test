<template>
  <VList
    dense
    nav
  >
    <VListItemGroup
      v-model="activeMenuItemIndex"
      mandatory
      color="indigo"
    >
      <VListItem
        v-for="(menuItem, menuItemIndex) in menuItems"
        :key="menuItem.title"
        :name="menuItem.routeName"
        link
        @click="menuItemClickHandler(menuItem, menuItemIndex)"
      >
        <VListItemIcon>
          <VIcon>{{ menuItem.icon }}</VIcon>
        </VListItemIcon>
        <VListItemContent>
          <VListItemTitle>{{ menuItem.title }}</VListItemTitle>
        </VListItemContent>
      </VListItem>
    </VListItemGroup>
  </VList>
</template>
<script>
import routeNames from '../routes/routeNames';

export default {
  data() {
    return {
      activeMenuItemIndex: 0,
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
      ],
    };
  },
  created() {
    this.setActiveMenuItemIndex();
  },
  methods: {
    setActiveMenuItemIndex() {
      const activeMenuItemIndex = this.menuItems.findIndex(
        (menuItem) => menuItem.routeName === this.$route.name,
      );
      if (activeMenuItemIndex !== -1) {
        this.activeMenuItemIndex = activeMenuItemIndex;
      }
    },
    menuItemClickHandler(menuItem, menuItemIndex) {
      if (this.$route.name === menuItem.routeName) {
        return;
      }
      this.activeMenuItemIndex = menuItemIndex;
      this.$router.push({ name: menuItem.routeName });
    },
  },
};
</script>
