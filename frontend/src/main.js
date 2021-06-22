import Vue from 'vue';
import axios from 'axios';
import VueRouter from 'vue-router';
import vuetify from './plugins/vuetify';
import App from './App.vue';
import routes from './routes/routes';

const http = axios.create({
  baseURL: process.env.BACKEND_URL ? process.env.BACKEND_URL : 'http://localhost/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

Vue.prototype.$http = http;
Vue.use(VueRouter);
Vue.config.productionTip = false;

const router = new VueRouter({
  mode: 'history',
  routes,
});

new Vue({
  vuetify,
  router,
  render: (h) => h(App),
}).$mount('#app');
