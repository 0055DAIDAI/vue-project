import { createApp } from 'vue'
import '@/assets/less/index.less'
import App from './App.vue'
import ElementPlus from 'element-plus'
import router from '@/router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import {createPinia} from 'pinia'
import '@/api/mock.js' // 引入mock数据
import api from '@/api/api.js' // 引入api
import {useAllDataStore} from '@/stores'

const pinia = createPinia()
const app = createApp(App)
// app.use(ElementPlus)
app.use(pinia)
// store实在pinia之后才有的
const store = useAllDataStore()
store.addMenu(router,"refresh")

function isRoute(to){
  return router.getRoutes().filter(item=>item.path === to.path).length > 0
}
router.beforeEach((to,from)=>{
   if(to.path !== '/login' && !store.state.token){
    return {name: "login"}
   }
   if(!isRoute(to)){
    return {name: "404"}
   }
})

app.config.globalProperties.$api = api // 将api挂载到全局属性上



app.use(ElementPlus)
app.use(router).mount('#app')
for (const [key,component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
 