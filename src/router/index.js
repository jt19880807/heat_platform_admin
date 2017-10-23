import Vue from 'vue'
import Main from '../views/main/main.vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter);

const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录'
  },
  component: resolve => { require(['../views/login/login.vue'], resolve); }
};
const otherRouter={
    path:'/',
    name:'otherRouter',
    redirect: '/home',
    component: Main,
    children:[
        {path:'home',title:'首页',name:'home_index',component:resolve=>{require(['../views/home/home.vue'], resolve); } }
    ]
};

export const routers = [
    loginRouter,
    otherRouter,
];
const router=new VueRouter({
    mode: 'history',
    routes:routers
});

export default router;
// export const routers = [
//   loginRouter,
// ];
