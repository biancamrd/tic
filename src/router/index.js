import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';

// Importăm toate componentele pe care le vom utiliza ca pagini
import UserLogin from './components/UserLogin.vue';
import UserRegister from './components/UserRegister.vue';
import AuthorsList from './components/AuthorsList.vue';
import BookDetails from './components/BookDetails.vue';
import BooksTable from './components/BooksTable.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: '/login' }, // Redirecționăm către login ca default
  { path: '/login', component: UserLogin },
  { path: '/register', component: UserRegister },
  { path: '/authors', component: AuthorsList },
  { path: '/book/:id', component: BookDetails, props: true },
  { path: '/books', component: BooksTable },
  // Alte rute pot fi adăugate aici în funcție de nevoile aplicației tale
];

const router = new VueRouter({
  routes,
  mode: 'history', // Optional: utilizează istoricul browserului fără hash (#) în URL
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
