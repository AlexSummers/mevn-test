import HomePage from '../components/pages/HomePage.vue';
import IndexClients from '../components/pages/clients/IndexClients.vue';
import routeNames from './routeNames';

export default [
  {
    name: routeNames.homePage,
    path: '/',
    component: HomePage,
  },
  {
    name: routeNames.clientsPage,
    path: '/clients',
    component: IndexClients,
  },
];
