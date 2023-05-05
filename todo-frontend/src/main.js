// Import Vue and VueRouter libraries
import Vue from 'vue';
import VueRouter from 'vue-router';

// Import the main App component
import App from './App.vue';

// Import the TodoList component
import TodoList from './components/TodoList.vue';

// Use VueRouter
Vue.use(VueRouter);

// Define the routes
const routes = [
  {
    path: '/',
    component: TodoList,
  },
];

// Create the router instance
const router = new VueRouter({
  routes,
});

// Create the Vue instance and mount it to the DOM
new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
