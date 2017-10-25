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
        {path:'home',title:'首页',name:'home_index',component:resolve=>{require(['../views/home/home.vue'], resolve); } },
        { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: resolve => { require(['../views/home/home.vue'], resolve); } },
        { path: 'message', title: '消息中心', name: 'message_index', component: resolve => { require(['../views/home/home.vue'], resolve); } }
    ]
};
const appRouter = [
    // {
    //     path: '/home',
    //     redirect: '/access/index',
    //     icon: 'key',
    //     name: 'access',
    //     title: '权限管理',
    //     component: Main,
    //     children: [
    //         { path: 'index', title: '权限管理', name: 'access_index', component: resolve => { require(['../views/home/home.vue'], resolve); } }
    //     ]
    // },
    // {
    //     path: '/access-test',
    //     icon: 'lock-combination',
    //     title: '权限测试页',
    //     name: 'accesstest',
    //     access: 0,
    //     component: Main,
    //     children: [
    //         { path: 'index', title: '权限测试页', name: 'accesstest_index' }
    //     ]
    // },,
    {
        path: '/sysmanage',
        icon: 'social-buffer',
        name: 'sysmanage',
        title: '系统管理',
        component: Main,
        children: [
            {
                path: 'user',
                icon: 'compose',
                name: 'user',
                title: '用户管理',
                component: resolve => { require(['../views/sys/user.vue'], resolve); }
            },
            {
                path: 'role',
                icon: 'pound',
                name: 'role',
                title: '角色管理',
                component: resolve => { require(['../views/sys/role.vue'], resolve); }
            },
            {
                path: 'permission',
                icon: 'arrow-move',
                name: 'permission',
                title: '权限管理',
                component: resolve => { require(['../views/sys/permission.vue'], resolve); }
            }
        ]
    },
    // {
    //     path: '/component',
    //     icon: 'social-buffer',
    //     name: 'component',
    //     title: '组件',
    //     component: Main,
    //     children: [
    //         {
    //             path: 'text-editer',
    //             icon: 'compose',
    //             name: 'text-editer',
    //             title: '富文本编辑器',
    //             component: resolve => { require(['../views/sys/user.vue'], resolve); }
    //         },
    //         {
    //             path: 'md-editor',
    //             icon: 'pound',
    //             name: 'md-editor',
    //             title: 'Markdown编辑器',
    //             component: resolve => { require(['../views/home/home.vue'], resolve); }
    //         },
    //         {
    //             path: 'draggable-list',
    //             icon: 'arrow-move',
    //             name: 'draggable-list',
    //             title: '可拖拽列表',
    //             component: resolve => { require(['../views/home/home.vue'], resolve); }
    //         },
    //         {
    //             path: 'file-upload',
    //             icon: 'android-upload',
    //             name: 'file-upload',
    //             title: '文件上传',
    //             component: resolve => { require(['../views/home/home.vue'], resolve); }
    //         },
    //         {
    //             path: 'count-to',
    //             icon: 'arrow-graph-up-right',
    //             name: 'count-to',
    //             title: '数字渐变',
    //             component: resolve => { require(['../views/home/home.vue'], resolve); }
    //         }
    //     ]
    // },
    // {
    //     path: '/form',
    //     icon: 'android-checkbox',
    //     name: 'form',
    //     title: '表单编辑',
    //     component: Main,
    //     children: [
    //         { path: 'artical-publish', title: '文章发布', name: 'articalpublish', icon: 'compose', component: resolve => { require(['../views/home/home.vue'], resolve); } },
    //         { path: 'workflow', title: '工作流', name: 'workflow', icon: 'arrow-swap', component: resolve => { require(['../views/home/home.vue'], resolve); } }
    //
    //     ]
    // },
    // {
    //     path: '/tables',
    //     icon: 'ios-grid-view',
    //     name: 'tables',
    //     title: '表格',
    //     component: Main,
    //     children: [
    //         { path: 'dragableTable', title: '可拖拽排序', name: 'dragableTable', icon: 'arrow-move', component: resolve => { require(['../views/home/home.vue'], resolve); } },
    //         { path: 'editableTable', title: '可编辑表格', name: 'editableTable', icon: 'edit', component: resolve => { require(['../views/home/home.vue'], resolve); } },
    //         { path: 'exportableTable', title: '表格导出数据', name: 'exportableTable', icon: 'code-download', component: resolve => { require(['../views/home/home.vue'], resolve); } },
    //         { path: 'table2image', title: '表格转图片', name: 'table2image', icon: 'images', component: resolve => { require(['../views/home/home.vue'], resolve); } }
    //     ]
    // },
    // {
    //     path: '/error-page',
    //     icon: 'android-sad',
    //     title: '错误页面',
    //     name: 'errorpage',
    //     component: Main,
    //     children: [
    //         { path: 'index', title: '错误页面', name: 'errorpage_index', component: resolve => { require(['../views/home/home.vue'], resolve); } }
    //     ]
    // }
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

export {router,otherRouter,appRouter};
// export default router;
