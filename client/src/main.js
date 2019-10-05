import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from '../config/axios'
// element ui库
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// bootstrap
// import 'bootstrap'
// import 'bootstrap/dist/css/bootstrap.min.css'

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.use(ElementUI)


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
