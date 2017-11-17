import Vue from 'vue'
import Main from '../views/main/main.vue'
import VueRouter from 'vue-router'
import Cookies from 'js-cookie'
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
        {path:'home',title:'首页',name:'home_index',component:resolve=>{require(['../views/home/home.vue'], resolve); } },
        { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: resolve => { require(['../views/home/home.vue'], resolve); } },
        { path: 'message', title: '消息中心', name: 'message_index', component: resolve => { require(['../views/home/home.vue'], resolve); } }
    ]
};
const appRouter = [
    {
        path: '/projectmanage',
        icon: 'social-buffer',
        name: 'projectmanage',
        title: '项目管理',
        component: Main,
        children: [
            {
                path: 'project',
                icon: 'compose',
                name: 'project',
                title: '基础信息',
                component: resolve => { require(['../views/kqn/project.vue'], resolve); }
            },
            {
                path: 'area',
                icon: 'pound',
                name: 'area',
                title: '小区管理',
                component: resolve => { require(['../views/kqn/area.vue'], resolve); }
            },
            {
                path: 'building',
                icon: 'ios-home',
                name: 'building',
                title: '楼栋管理',
                component: resolve => { require(['../views/kqn/building.vue'], resolve); }
            },

        ]
    },
    {
        path: '/devicemanage',
        icon: 'social-buffer',
        name: 'devicemanage',
        title: '设备管理',
        component: Main,
        children: [
            {
                path: 'collector',
                icon: 'compose',
                name: 'collector',
                title: '采集器',
                component: resolve => { require(['../views/kqn/project.vue'], resolve); }
            },
            {
                path: 'buildingmeter',
                icon: 'pound',
                name: 'buildingmeter',
                title: '热量表',
                component: resolve => { require(['../views/kqn/area.vue'], resolve); }
            },
            {
                path: 'tempmeter',
                icon: 'ios-home',
                name: 'tempmeter',
                title: '测温设备',
                component: resolve => { require(['../views/kqn/building.vue'], resolve); }
            }
        ]
    },
    {
        path: '/sysmanage',
        icon: 'monitor',
        name: 'sysmanage',
        title: '系统管理',
        component: Main,
        children: [
            {
                path: 'user',
                icon: 'ios-people',
                name: 'user',
                title: '用户管理',
                component: resolve => { require(['../views/sys/user.vue'], resolve); }
            },
            {
                path: 'role',
                icon: 'flame',
                name: 'role',
                title: '角色管理',
                component: resolve => { require(['../views/sys/role.vue'], resolve); }
            },
            {
                path: 'permission',
                icon: 'soup-can',
                name: 'permission',
                title: '权限管理',
                component: resolve => { require(['../views/sys/permission.vue'], resolve); }
            }
        ]
    },



];

const routers = [
    loginRouter,
    otherRouter,
    ...appRouter,
];
const router=new VueRouter({
    mode: 'history',
    routes:routers
});

router.beforeEach((to,from,next)=>{
    if (!Cookies.get('username')&&to.name!=='login'){
        next({
            path: '/login'
        });
    }
    // if (from.name==null){
    //     next({
    //         path: '/login'
    //     });
    // }
    // else {
    //     next();
    // }
    next();
});

export {router,otherRouter,appRouter};
// export default router;
