import Vue from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import './plugins/element.js';
import './assets/css/global.css';
import './assets/fonts/iconfont.css';
import Table from 'vue-table-with-tree-grid'

Vue.config.productionTip = false;

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
// 设置axios拦截器，为请求头添加token字段
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config;
})
Vue.prototype.$http = axios;
Vue.component('tree-table', Table)

// 定义一个全局过滤器，用来处理日期格式
Vue.filter('dateFormat', function (val) {
    const date = new Date(val)
    const y = date.getFullYear()
    const m = (date.getMonth() + 1 + '').padStart(2, '')
    const d = (date.getDate() + '').padStart(2, '')
    const hh = (date.getHours() + '').padStart(2, '')
    const mm = (date.getMinutes() + '').padStart(2, '')
    const ss = (date.getSeconds() + '').padStart(2, '')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
    router,
    'render': h => h(App)
}).$mount('#app');
