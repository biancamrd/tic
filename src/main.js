import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import { Vue3Mq } from 'vue3-mq';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Configurare Vuetify
const vuetify = createVuetify({
  components,
  directives,
});

// Configurare Vue3Mq
const mqConfig = {
  breakpoints: {
    mobile: 450,
    tablet: 900,
    laptop: 1250,
    desktop: Infinity,
  },
  defaultBreakpoint: 'desktop' // breakpoint implicit
};

// Creează aplicația Vue folosind store-ul, router-ul și Vuetify
const app = createApp(App);

app.use(store);
app.use(vuetify);
app.use(Vue3Mq, mqConfig);
app.mount('#app');
