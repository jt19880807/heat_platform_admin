<style lang="less">
    @import "main.less";
</style>
<template>
    <div id="main" class="main" :class="{'main-hide-text': hideMenuText}">
        <div class="main-header-con" >
            <div class="main-header">
                <div class="logo-con">
                    <img src="../../images/logo-min.png">
                </div>
                <div class="header-text">热量表数据平台</div>
                <div class="layout-nav">
                    <Menu mode="horizontal" theme="dark" active-name="1" @on-select="mainMenuChanged">
                        <MenuItem name="1">
                            数据管理
                        </MenuItem>
                        <MenuItem name="2">
                            基础配置
                        </MenuItem>
                        <MenuItem name="3">
                            用户管理
                        </MenuItem>
                        <MenuItem name="4">
                            系统管理
                        </MenuItem>
                    </Menu>
                </div>
                <div class="header-avator-con">
                    <div class="main-header">
                        <div style="width: 300px;float:left">
                            <Input v-model="searchData" icon="ios-search-strong"
                                   style="width: 300px;margin-top:5%;" placeholder="请输入关键字"
                                   @on-change="searchChange" @on-blur	="filterData=[]"/>
                        </div>

                        <div class="user-dropdown-menu-con">
                            <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                                <Dropdown trigger="click" @on-click="handleClickUserDropdown">
                                    <a href="javascript:void(0)">
                                        <span class="main-user-name">{{ userName }}</span>
                                        <Icon type="arrow-down-b" style="color: #fff"></Icon>
                                    </a>
                                    <DropdownMenu slot="list">
                                        <!--<DropdownItem name="ownSpace">个人中心</DropdownItem>-->
                                        <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                                <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" style="background: #619fe7;margin-left: 10px;"></Avatar>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="sidebar-con" :style="{width: hideSidePage?'0px':'200px', overflow: hideSidePage ? 'hidden' : 'visible'}">
            <transition name="tran_project" mode="out-in">

                <div v-if="!hideMenuText" class="sidebar-con-menu" key="tran_menu">
                    <Button v-if="!$store.state.hideProjectMenu" style="margin-left:200px;margin-top: 20px;" ghost type="primary" size="small" @click="toggleClick">
                        项<br>目<br>列<br>表<br>
                    </Button>
                    <div style="width: 100%;height: 100%;margin-top: -100px;">
                        <sidebar-menu  :menuList="menuList" :iconSize="14"></sidebar-menu>
                    </div>
                </div>

                <div v-else class="sidebar-con-project" key="tran_object">
                    <Button v-if="!$store.state.hideProjectMenu"
                            style="margin-left:200px;margin-top: 20px;"
                            ghost
                            type="primary"
                            size="small"
                            @click="toggleClick">
                        菜<br>单<br>列<br>表<br>
                    </Button>
                    <div :style="{marginTop: !$store.state.hideProjectMenu?'-100px':'0px'}">
                        <Input icon="ios-search-strong" style="margin: 20px;width: 170px;" placeholder="请输入关键词" />
                        <Tree ref="tree" :data="projectTree"  style="font-size: 39px;margin-left: 20px;" @on-select-change="projectChange"/>
                    </div>
                </div>
            </transition>
        </div>

        <div class="single-page-con" :style="{paddingLeft: $store.state.hideSidePage?'0px':'210px'}">
            <!--<div class="header-middle-con" style="z-index: 100;">-->
                <!--<div class="main-breadcrumb" >-->
                    <!--<Row >-->
                        <!--<Col span="12">-->
                        <!--&nbsp;-->
                            <!--&lt;!&ndash;<breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>&ndash;&gt;-->
                        <!--</Col>-->
                        <!--<Col span="12" style="text-align: right">-->
                        <!--&lt;!&ndash;<div style="float: right;width: 300px;">&ndash;&gt;-->
                        <!--<Input v-model="searchData" icon="ios-search-strong" style="width: 300px;" placeholder="请输入关键字..."-->
                               <!--@on-change="searchChange" @on-blur	="filterData=[]"/>-->

                        <!--&lt;!&ndash;</div>&ndash;&gt;-->
                        <!--</Col>-->
                    <!--</Row>-->
                <!--</div>-->
            <!--</div>-->
            <!--<div v-show="filterData.length>0" class="search_div">-->
                <!--<ul class="list-group">-->
                    <!--<li class="list-group-item" v-for="item in filterData">-->
                        <!--{{ item.title }}-->
                    <!--</li>-->
                <!--</ul>-->
            <!--</div>-->
            <!--<div //style="minHeight: 280px;background:#fff;width:100%;z-index: 100;">-->
            <div>
                <router-view></router-view>
            </div>

        </div>
    </div>
</template>
<script>
    import sidebarMenu from "../../components/sidebarMenu.vue";
    import sidebarMenuShrink from "../../components/sidebarMenuShrink.vue";
    import breadcrumbNav from "../../components/breadcrumbNav.vue";
    import tagsPageOpened from "../../components/tagsPageOpened.vue";
    import util from '../../libs/util.js';
    import Cookies from 'js-cookie';
    export default {
        components:{
            sidebarMenu,
            sidebarMenuShrink,
            breadcrumbNav,
            tagsPageOpened,
        },
        data(){
            return{
                hideMenuText: true,
                userName: '',
                showFullScreenBtn: window.navigator.userAgent.indexOf('MSIE') < 0,
                isFullScreen: false,
                messageCount: 10,
                lockScreenSize: 0,
                searchData:'',
                filterData:[
//                    {name:'明光换热站',type:'换热站'},
//                    {name:'明光小区',type:'小区'},
//                    {name:'万达换热站',type:'换热站'},
//                    {name:'万达小区',type:'小区'},
                ],
                selectedNode:[],
                projectTreeData:[],
            }
        },
        computed:{
            menuList () {
                return this.$store.state.menuList;
            },
            hideSidePage(){
                return this.$store.state.hideSidePage;
            },
            projectTree(){
                this.projectTreeData=this.$store.state.projectData;
                return this.projectTreeData;
            },
            menuIconColor () {
                return this.$store.state.menuTheme === 'dark' ? 'white' : '#495060';
            },
            currentPath () {
                return this.$store.state.currentPath;  // 当前面包屑数组
            },
            pageTagsList () {
                return this.$store.state.pageOpenedList;  // 打开的页面的页面对象
            },
            avatorPath () {
                return "https://i.loli.net/2017/08/21/599a521472424.jpg";
            }
        },
        methods:{
            init () {
//                this.$store.commit('setCurrentPageName', this.$route.name);
//                let pathArr = util.setCurrentPath(this, this.$route.name);
//                if (pathArr.length >= 2) {
//                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
//                }
                this.userName = Cookies.get('username');
//                let messageCount = 3;
            },
            toggleClick () {
                this.hideMenuText = !this.hideMenuText;
            },
            handleClickUserDropdown (name) {
                if (name === 'ownSpace') {
                    util.openPage(this, 'ownspace_index', '个人中心');
                } else if (name === 'loginout') {
                    // 退出登录
                    Cookies.remove('username');
                    Cookies.remove('projects');
                    Cookies.remove('buildings');
                    Cookies.remove('userid');
                    this.$store.commit('clearOpenedSubmenu');
                    this.$router.push({
                        name: 'login'
                    });
                }
            },
            checkTag (name) {
                let openpageHasTag = this.pageTagsList.some(item => {
                    if (item.name === name) {
                        return true;
                    }
                });
                if (!openpageHasTag) {  //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
                    util.openNewPage(this, name, this.$route.params || {}, this.$route.query || {});
                }
            },
            mainMenuChanged(active){
                switch (active){
                    case '1':
                        this.hideMenuText = true;
                        this.$router.push({
                            name: 'otherRouter'
                        });
                        break;
                    case '2':
                        this.hideMenuText = true;
                        this.$router.push({
                            name: 'project'
                        });
                        break;
                    case '3':
                        this.$store.commit('setMenuList',active);
                        this.hideMenuText=false;
                        this.$router.push({
                            name: 'userInfo'
                        });
                        break;
                    case '4':
                        this.$store.commit('setMenuList',active);
                        this.hideMenuText=false;
                        this.$router.push({
                            name: 'manager'
                        });
                        break;
                }
            },
            projectChange(option){
                if (option.length > 0) {
                    //console.log(option);
                    if (option[0].type !== "0" && option[0].type !== "1") {
                        sessionStorage.setItem("projectTreeData", JSON.stringify(this.projectTreeData));
                        this.$store.commit('setProjectTreeData', this.projectTreeData);
                        this.selectedNode = this.$refs.tree.getSelectedNodes();
                        sessionStorage.setItem("selectedTreeNode", JSON.stringify(this.$refs.tree.getSelectedNodes()));
                        this.$store.commit('setSelectedTreeNode', this.$refs.tree.getSelectedNodes());
                        if (option[0].type!=='2'){
                            localStorage.setItem("hideProjectMenu",false);
                            this.$store.commit('toggleHideProjectMenu', false);
                        }
                        else {
                            localStorage.setItem("hideProjectMenu",true);
                            this.$store.commit('toggleHideProjectMenu', true);
                        }
                        switch (option[0].type) {
                            case "2":
                                this.$router.push({
                                    name: 'exchange_index'
                                });
                                break;
                            case "3":
                                this.$router.push({
                                    name: 'zone_index'
                                });
                                break;
                            case "4":
                                this.$router.push({
                                    name: 'building_index'
                                });
                                break;
                        }
                    }
                    else {
                        localStorage.setItem("hideProjectMenu",true);
                        this.$store.commit('toggleHideProjectMenu', true);
                    }
                }
                else {
                    this.selectedNode[0].selected=true;
                }
            },
            searchChange(){
                var keyWord=this.searchData;
                var filter=[];
                //this.filterData.removeAll();
                this.projectData.map(function (project) {
                    if (project.title.includes(keyWord)){
                        filter.push(project);
                    }
                });
                this.filterData=filter;
            }
        },
        watch: {
            '$route' (to) {
                this.$store.commit('setCurrentPageName', to.name);
                if (to.name==='zone_index'){
                    this.$store.commit('setMenuList',5);
                }
                if (to.name==='building_index'){
                    this.$store.commit('setMenuList',6);
                }
            },
            projectTreeData:function (newVue, oldVue) {
                if (newVue.length>0) {
                    if (!sessionStorage.getItem("selectedTreeNode")) {
                        sessionStorage.setItem("selectedTreeNode", JSON.stringify(newVue[0].children[0].children));
                        this.$store.commit('setSelectedTreeNode', newVue[0].children[0].children);
                    }
                }
            }
        },
        mounted () {
            this.init();
        },
        created(){
            // 权限菜单过滤相关
            this.$store.commit('updateMenulist');
            // 显示打开的页面的列表
            this.$store.commit('setOpenedList');
        },
    }
</script>
