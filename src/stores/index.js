import { ref, watch } from 'vue'
import { defineStore, } from 'pinia'
function initState() {
  return {
    isCollapse: false,
    tags: [
      {
        path: "/home",
        name: 'home',
        label: '首页',
        icon: 'home'

      }
    ],
    currentMenu: null,
    menuList:[],
    token:'',
    routerList:[],
  }
}

export const useAllDataStore = defineStore('allData', () => {
  // ref类似于state属性
  // computed类似于getters属性
  // function actions
  const state = ref(initState())
  // watch监听state,让数据持久化
  watch(state,(newObj)=>{
    if(!newObj.token) return
    localStorage.setItem('store',JSON.stringify(newObj));

  },
  {deep: true})
  function selectMenu(val) {
    if (val.name === 'home') { 
      state.value.currentMenu = null;
    } else {
      state.value.currentMenu = val;
      let index = state.value.tags.findIndex(item => item.name === val.name)
      index === -1 ? state.value.tags.push(val) : '';
    }
  }
  function updateTags(tag){
    let index = state.value.tags.findIndex(item=>item.name === tag.name)
    state.value.tags.splice(index,1);
  }
  function updateMenuList(val){
    state.value.menuList = val;

  }
  // 实现动态路由
  function addMenu(router,type){
    if(type === 'refresh'){
      if(JSON.parse(localStorage.getItem('store'))){
        state.value = JSON.parse(localStorage.getItem('store'))
        // 
        state.value.routerList = [];
      }else{
        return;
      }
    }
    const menu = state.value.menuList;
    // vite支持使用特殊的import.meta.glob函数，从文件系统导入多个模块 
    // 函数会被转义为
    // const modules = {
    //  './dir.***.js': () = > import('./dir.***.js')
    // }
    const module = import.meta.glob('../views/**/*.vue')
    const routeArr = []
    menu.forEach(item=>{
      if(item.children){
        item.children.forEach(val=>{
          let url = `../views/${val.url}.vue`
          val.component = module[url];
          routeArr.push(...item.children);
        })
      }else{
        let url = `../views/${item.url}.vue`
        item.component = module[url];
        routeArr.push(item);
      }
    })
    state.value.routerList =[];
    console.log(router.getRoutes())
    // 解决了登录admin之后,登录用户账号也可以访问mall的bug
    let routers = router.getRoutes()
    routers.forEach(item=>{
      if(item.name === 'main' || item.name === 'login' || item.name === '404'){
        return
      }else {
        router.removeRoute(item.name);
      }
    })
    routeArr.forEach(item =>{
      state.value.routerList.push(router.addRoute("main",item))
    })
  }
  function clean(){
    state.value.routerList.forEach(item=>{
      console.log(item);
      if(item) item();
    });
    state.value = initState();
    // 删除本地缓存
    localStorage.removeItem('store')
  }
  return {
    state,
    selectMenu,
    updateTags,
    updateMenuList,
    addMenu,
    clean,
  };
})
