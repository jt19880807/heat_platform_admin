import Vue from 'vue'
import Main from '../views/main/main.vue'
import VueRouter from 'vue-router'
import Cookies from 'js-cookie'
import store from '../main.js'

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
        { path:'home',title:'首页',name:'home_index',component:resolve=>{require(['../views/home/home.vue'], resolve); } },
        { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: resolve => { require(['../views/home/home.vue'], resolve); } },
        { path: 'message', title: '消息中心', name: 'message_index', component: resolve => { require(['../views/home/home.vue'], resolve); } }
    ]
};
const appRouter = [
    {
        path: '/projectmanage',
        icon: 'social-buffer',
        name: 'project',
        title: '项目管理',
        component: Main,
        children: [
            {
                path: 'project',
                icon: 'compose',
                name: 'baseinfo',
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
        name: 'device',
        title: '设备管理',
        component: Main,
        children: [
            {
                path: 'collector',
                icon: 'compose',
                name: 'collector',
                title: '采集器',
                component: resolve => { require(['../views/kqn/equipment/collector.vue'], resolve); }
            },
            {
                path: 'ammeter',
                icon: 'pound',
                name: 'ammeter',
                title: '电表',
                component: resolve => { require(['../views/kqn/equipment/amMeter.vue'], resolve); }
            },
            {
                path: 'buildingmeter',
                icon: 'pound',
                name: 'buildingmeter',
                title: '热量表',
                component: resolve => { require(['../views/kqn/equipment/buildingMeter.vue'], resolve); }
            },
            {
                path: 'tempmeter',
                icon: 'ios-home',
                name: 'tempmeter',
                title: '测温设备',
                component: resolve => { require(['../views/kqn/equipment/tempMeter.vue'], resolve); }
            }
        ]
    },
    {
        path: '/dataquery',
        icon: 'social-buffer',
        name: 'dataquery',
        title: '数据查询',
        component: Main,
        children: [
            {
                path: 'heatreading',
                icon: 'compose',
                name: 'heatreading',
                title: '热量',
                component: resolve => { require(['../views/kqn/readings/heat.vue'], resolve); }
            },
            {
                path: 'electricity',
                icon: 'pound',
                name: 'electricity',
                title: '电量',
                component: resolve => { require(['../views/kqn/readings/electricity.vue'], resolve); }
            },
            {
                path: 'tempreading',
                icon: 'pound',
                name: 'tempreading',
                title: '温度',
                component: resolve => { require(['../views/kqn/readings/temp.vue'], resolve); }
            }
        ]
    },
    {
        path: '/datanalysis',
        icon: 'social-buffer',
        name: 'datanalysis',
        title: '数据分析',
        component: Main,
        children: [
            {
                path: 'energy',
                icon: 'pound',
                name: 'energy',
                title: '能耗分析',
                component: resolve => { require(['../views/kqn/analysis/energy.vue'], resolve); }
            },
            {
                path: 'historydata',
                icon: 'pound',
                name: 'historydata',
                title: '历史数据',
                component: resolve => { require(['../views/kqn/analysis/historydata.vue'], resolve); }
            },
            {
                path: 'energyreport',
                icon: 'pound',
                name: 'energyreport',
                title: '能耗报告',
                component: resolve => { require(['../views/kqn/analysis/energyreport.vue'], resolve); }
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
const userRouter=[
    {
        path: '/userInfo',
        icon: 'compose',
        name: 'userInfo',
        title: '基础信息',
        component: Main,
        children:[
            { path:'index',title:'基础信息',name:'userInfo',component:resolve=>{require(['../views/heat/user/test.vue'], resolve); } },
        ]
    },
    {
        path: '/userModel',
        icon: 'pound',
        name: 'userModel',
        title: '用户模型',
        component: Main,
        children:[
            { path:'index',title:'用户模型',name:'userModel',component:resolve=>{require(['../views/heat/user/test.vue'], resolve); } },
        ]
    },
    {
        path: '/userPermission',
        icon: 'ios-home',
        name: 'userPermission',
        title: '用户权限',
        component: Main,
        children:[
            { path:'index',title:'用户权限',name:'userPermission',component:resolve=>{require(['../views/heat/user/test.vue'], resolve); } },
        ]
    },
];
const settingRouter=[
    {
        path: '/manager',
        icon: 'compose',
        name: 'manager',
        title: '管理员管理',
        component: Main,
        children:[
            { path:'index',title:'管理员管理',name:'manager',component:resolve=>{require(['../views/heat/user/test.vue'], resolve); } },
        ]
    },
    {
        path: '/role',
        icon: 'pound',
        name: 'role',
        title: '角色管理',
        component: Main,
        children:[
            { path:'index',title:'角色管理',name:'role',component:resolve=>{require(['../views/heat/user/test.vue'], resolve); } },
        ]
    },
];
const viewRouter=[
    {
        path: '/heat_exchange_station',
        icon: 'compose',
        name: 'heat_exchange_station',
        title: '换热站',
        component: Main,
        children:[
            { path:'index',title:'管理员管理',name:'exchange_index',component:resolve=>{require(['../views/heat/object/heat_exchange_station.vue'], resolve); } },
        ]
    },
    {
        path: '/zone',
        icon: 'pound',
        name: 'role',
        title: '小区',
        component: Main,
        children:[
            { path:'index',title:'小区',name:'zone_index',component:resolve=>{require(['../views/heat/object/zone.vue'], resolve); } },
        ]
    },
    {
        path: '/building',
        icon: 'pound',
        name: 'role',
        title: '楼栋',
        component: Main,
        children:[
            { path:'index',title:'楼栋',name:'building_index',component:resolve=>{require(['../views/heat/object/building.vue'], resolve); } },
        ]
    },
];
const zoneRouter = [
    {
        path: '/nodaData',
        icon: 'social-buffer',
        name: 'zone_homeMeter',
        title: '户表数据',
        component: Main,
        children: [
            {
                path: 'zone_homeMeter_lastData',
                icon: 'compose',
                name: 'zone_homeMeter_lastData',
                title: '实时数据',
                component: resolve => { require(['../views/heat/data/lastData.vue'], resolve); }
            },
            {
                path: 'zone_homeMeter_histtoryData',
                icon: 'pound',
                name: 'zone_homeMeter_histtoryData',
                title: '历史数据',
                component: resolve => { require(['../views/heat/data/historyData.vue'], resolve); }
            },
            {
                path: 'zone_homeMeter_useData',
                icon: 'ios-home',
                name: 'zone_homeMeter_useData',
                title: '用量数据',
                component: resolve => { require(['../views/heat/data/zone_useheat.vue'], resolve); }
            },
            {
                path: 'zone_homeMeter_contrast',
                icon: 'ios-home',
                name: 'zone_homeMeter_contrast',
                title: '对比分析',
                component: resolve => { require(['../views/heat/data/zone_homeMeter_contrast.vue'], resolve); }
            },

        ]
    },
    {
        path: '/meterData',
        icon: 'social-buffer',
        name: 'zone_buildMeter',
        title: '大表数据',
        component: Main,
        children: [
            {
                path: 'zone_buildMeter_data',
                icon: 'compose',
                name: 'zone_buildMeter_data',
                title: '读数',
                component: resolve => { require(['../views/heat/data/zone_meterData.vue'], resolve); }
            },
            {
                path: 'zone_buildMeter_eca',
                icon: 'pound',
                name: 'zone_buildMeter_eca',
                title: '能耗分析',
                component: resolve => { require(['../views/heat/data/zone_buildMeter_eca.vue'], resolve); }
            }
        ]
    },
    {
        path: '/bill',
        icon: 'social-buffer',
        name: 'zone_bill',
        title: '账单数据',
        component: Main,
        children: [
            {
                path: 'zone_bill_settlement',
                icon: 'compose',
                name: 'zone_bill_settlement',
                title: '季末结算',
                component: resolve => { require(['../views/kqn/readings/heat.vue'], resolve); }
            },
            {
                path: 'zone_bill_stationReport',
                icon: 'pound',
                name: 'zone_bill_stationReport',
                title: '台账报表',
                component: resolve => { require(['../views/kqn/readings/electricity.vue'], resolve); }
            },

        ]
    },
];
const buildRouter = [
    {
        path: '/nodaData',
        icon: 'social-buffer',
        name: 'build_homeMeter',
        title: '户表数据',
        component: Main,
        children: [
            {
                path: 'build_homeMeter_lastData',
                icon: 'compose',
                name: 'build_homeMeter_lastData',
                title: '实时数据',
                component: resolve => { require(['../views/heat/data/lastData.vue'], resolve); }
            },
            {
                path: 'build_homeMeter_historyData',
                icon: 'pound',
                name: 'build_homeMeter_historyData',
                title: '历史数据',
                component: resolve => { require(['../views/heat/data/historyData.vue'], resolve); }
            },
            {
                path: 'build_homeMeter_useData',
                icon: 'ios-home',
                name: 'build_homeMeter_useData',
                title: '用量数据',
                component: resolve => { require(['../views/heat/data/build_useheat.vue'], resolve); }
            },
            {
                path: 'build_homeMeter_contrast',
                icon: 'ios-home',
                name: 'build_homeMeter_contrast',
                title: '对比分析',
                component: resolve => { require(['../views/heat/data/build_homeMeter_contrast.vue'], resolve); }
            },

        ]
    },
    {
        path: '/dataquery',
        icon: 'social-buffer',
        name: 'build_bill',
        title: '账单数据',
        component: Main,
        children: [
            {
                path: 'heatreading',
                icon: 'compose',
                name: 'build_bill_settlement',
                title: '季末结算',
                component: resolve => { require(['../views/kqn/readings/heat.vue'], resolve); }
            },
            {
                path: 'electricity',
                icon: 'pound',
                name: 'build_bill_stationReport',
                title: '台账报表',
                component: resolve => { require(['../views/kqn/readings/electricity.vue'], resolve); }
            },

        ]
    },
];
const routers = [
    loginRouter,
    otherRouter,
    ...userRouter,
    ...settingRouter,
    ...viewRouter,
    ...zoneRouter,
    ...buildRouter,
    ...appRouter,
];
const router=new VueRouter({
    mode: 'history',
    routes:routers
});

router.beforeEach((to,from,next)=>{
    if (to.name!=='home_index'){
        localStorage.setItem("hideSidePage",false);
        store.commit('toggleSidsPage', false);
    }else {
        localStorage.setItem("hideSidePage",true);
        store.commit('toggleSidsPage', true);
    }
    if (!Cookies.get('username')&&to.name!=='login'){
        next({
            path: '/login'
        });
    }
    next();

});

export {router,otherRouter,userRouter,settingRouter,viewRouter,zoneRouter,buildRouter,appRouter};
// export default router;
