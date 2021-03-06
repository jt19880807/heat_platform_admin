import Vue from 'vue';
import App from './App.vue';
import iview from 'iview';
import 'iview/dist/styles/iview.css';
import {router,otherRouter,userRouter,settingRouter,viewRouter,zoneRouter,buildRouter,appRouter} from './router';
import Vuex from "vuex";
import Util from './libs/util';
import Cookies from 'js-cookie'
Vue.config.productionTip = false;
Vue.use(iview);
Vue.use(Vuex);
const store=new Vuex.Store({
    state:{
        userInfo:{
            name:Cookies.get('name')||'',
            token:Cookies.get('token')||''
        },
        // routers:[
        //     otherRouter,
        //     ...userRouter,
        //     ...settingRouter,
        //     viewRouter,
        //     zoneRouter,
        //     buildRouter
        // ],
        menuList: [],
        tagsList: [...otherRouter.children],
        pageOpenedList: [],
        currentPageName: '',
        hideSidePage:localStorage.getItem("hideSidePage")?JSON.parse(localStorage.getItem("hideSidePage")): true,
        hideProjectMenu:localStorage.getItem("hideProjectMenu")?JSON.parse(localStorage.getItem("hideProjectMenu")): true,
        currentPath: [
            {
                title: '首页',
                path: '',
                name: 'home_index'
            }
        ],  // 面包屑数组
        openedSubmenuArr: [],  // 要展开的菜单数组
        menuTheme: 'light', // 主题
        theme: '',
        projectData:sessionStorage.getItem("projectTreeData")?JSON.parse(sessionStorage.getItem("projectTreeData")): [],
        selectedTreeNode:sessionStorage.getItem("selectedTreeNode")?JSON.parse(sessionStorage.getItem("selectedTreeNode")): [],
        alermType:0,
    },
    mutations:{
        setTagsList (state, list) {
            state.tagsList.push(...list);
        },
        increateTag (state, tagObj) {
            state.pageOpenedList.splice(1, 0, tagObj);
        },
        removeTag (state, name) {
            state.pageOpenedList.map((item, index) => {
                if (item.name === name) {
                    state.pageOpenedList.splice(index, 1);
                }
            });
        },
        moveToSecond (state, index) {
            let openedPage = state.pageOpenedList[index];
            state.pageOpenedList.splice(index, 1);
            state.pageOpenedList.splice(1, 0, openedPage);
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        setOpenedList (state) {
            state.pageOpenedList = localStorage.pageOpenedList ? JSON.parse(localStorage.pageOpenedList) : [otherRouter.children[0]];
            //state.pageOpenedList = [otherRouter.children[0]];
        },
        setCurrentPath (state, pathArr) {
            state.currentPath = pathArr;
        },
        setCurrentPageName (state, name) {
            state.currentPageName = name;
        },
        addOpenSubmenu (state, name) {
            let hasThisName = false;
            let isEmpty = false;
            if (name.length === 0) {
                isEmpty = true;
            }
            if (state.openedSubmenuArr.indexOf(name) > -1) {
                hasThisName = true;
            }
            if (!hasThisName && !isEmpty) {
                state.openedSubmenuArr.push(name);
            }
        },
        clearOpenedSubmenu (state) {
            state.openedSubmenuArr.length = 0;
        },
        changeMenuTheme (state, theme) {
            state.menuTheme = theme;
        },
        changeMainTheme (state, mainTheme) {
            state.theme = mainTheme;
        },
        lock (state) {
            Cookies.set('locking', '1');
        },
        unlock (state) {
            Cookies.set('locking', '0');
        },
        setMenuList (state, active) {
            if (active===3){
                state.menuList = userRouter;
            }
            if (active===4){
                state.menuList = settingRouter;
            }
            if (active===5){
                state.menuList = zoneRouter;
            }
            if (active===6){
                state.menuList = buildRouter;
            }
        },
        updateMenulist (state) {
            let accessCode =1;// parseInt(Cookies.get('access'));
            let rights=sessionStorage.getItem("rights");
            let menus=sessionStorage.getItem("menus");
            let buttons=sessionStorage.getItem("buttons");
            let menuList = [];
            appRouter.forEach((item, index) => {
                if (rights != null) {
                    if (rights !== "*") {
                        var roleMenus = menus.split(",");
                        if (Util.oneOf(item.name, roleMenus)) {
                            if (item.children.length <= 1) {
                                menuList.push(item);
                            } else {
                                let i = menuList.push(item);
                                let childrenArr = [];
                                childrenArr = item.children.filter(child => {
                                    if (Util.oneOf(child.name, roleMenus)) {
                                        return child;
                                    }
                                });
                                menuList[i - 1].children = childrenArr;
                            }
                        }
                    }
                    else {
                        if (item.children.length <= 1) {
                            menuList.push(item);
                        } else {
                            let i = menuList.push(item);
                            let childrenArr = [];
                            menuList[i - 1].children = item.children;
                        }
                    }
                }
                else {
                }
            });
            state.menuList = menuList;
        },
        toggleSidsPage (state,value) {
            state.hideSidePage = localStorage.getItem("hideSidePage")?JSON.parse(localStorage.getItem("hideSidePage")): true;
        },
        toggleHideProjectMenu (state,value) {
            state.hideProjectMenu = localStorage.getItem("hideProjectMenu")?JSON.parse(localStorage.getItem("hideProjectMenu")): true;
        },
        setProjectTreeData(state,data){
            state.projectData=data;
        },
        setSelectedTreeNode(state,data){
            state.selectedTreeNode=data;
            //console.log(state.selectedTreeNode);
        },
        setAlermType(state,data){
            state.alermType=data;
        }
    }
});

//权限指令
Vue.directive('has', {
    bind: function(el, binding) {
        let rights=sessionStorage.getItem("rights");
        let buttons=sessionStorage.getItem("buttons");
        if (rights !== "*") {
            var roleButtons = buttons.split(",");
            if (!Util.oneOf(binding.value, roleButtons)) {
                el.parentNode.removeChild(el);
            }
        }
    }
});
export default store;
new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    mounted () {
        this.currentPageName = this.$route.name;
    },
    created () {
        let rights=sessionStorage.getItem("rights");
        let tagsList = [];
        appRouter.map((item) => {
            if (item.children.length <= 1) {
                tagsList.push(item.children[0]);
            } else {
                tagsList.push(...item.children);
            }
        });
        this.$store.commit('setTagsList', tagsList);
    }
});

