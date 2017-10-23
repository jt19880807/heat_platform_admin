import Vue from 'vue'
import App from './App.vue'
import iview from 'iview';
import 'iview/dist/styles/iview.css';
import router from './router'

Vue.config.productionTip = false;
Vue.use(iview);

new Vue({
  el: '#app',
  router: router,
  template: '<App/>',
  components: { App }
});
