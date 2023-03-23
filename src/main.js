import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/all.css';



import axios from 'axios'
/* axios.defaults.withCredentials = true; //跨域携带cookie */
axios.defaults.baseURL = '/api'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';



Vue.prototype.$axios = axios
var token = sessionStorage.getItem("token");

if (!token) {
  token = localStorage.getItem("token");
}



axios.interceptors.request.use(

  config => {

    config.headers.Authorization = token;



    return config;
  },
  err => {
    return Promise.reject(err);
  });

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response.status === 401) {
      //输出授权失败错误信息
    } else {
      //输出其他错误信息
    }
    return Promise.reject(error);
  }
);




Vue.use(ElementUI);


Vue.config.productionTip = false



//配置token获取函数，全局使用
Vue.mixin({
  methods: {
    getAuthHeader() {
      return {


        Authorization: token,

      }
    }
  }
})


new Vue({

  router,
  store,
  render: h => h(App)
}).$mount('#app')
