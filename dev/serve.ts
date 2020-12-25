import Vue, { VNode } from 'vue';
import ServeApp from './ServeApp.vue';

Vue.config.productionTip = false;

new Vue({
  render: (h): VNode => h(ServeApp),
}).$mount('#app');
