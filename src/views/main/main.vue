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
                <!--<div class="header-middle-con">-->
                <!--<div class="main-breadcrumb">-->
                <!--<breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>-->
                <!--</div>-->
                <!--</div>-->
                <div class="header-avator-con">
                    <div class="main-header">
                        <div class="user-dropdown-menu-con">
                            <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                                <Dropdown trigger="click" @on-click="handleClickUserDropdown">
                                    <a href="javascript:void(0)">
                                        <span class="main-user-name">{{ userName }}</span>
                                        <Icon type="arrow-down-b"></Icon>
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
            <!--<div class="tags-con">-->
            <!--<tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>-->
            <!--</div>-->
        </div>
        <div class="sidebar-con" :style="{width: $store.state.hideSidePage?'0px':'200px', overflow: $store.state.hideSidePage ? 'hidden' : 'visible'}">
            <transition name="tran_project" mode="out-in">

                <div v-if="!hideMenuText" class="sidebar-con-menu" key="tran_menu">
                    <Button style="margin-left:200px;margin-top: 20px;" ghost type="primary" size="small" @click="toggleClick">
                        项<br>目<br>列<br>表<br>
                    </Button>
                    <div style="width: 100%;height: 100%;margin-top: -100px;">
                        <sidebar-menu  :menuList="menuList" :iconSize="14"></sidebar-menu>
                    </div>
                </div>
                <div v-else class="sidebar-con-project" key="tran_object">
                    <Button style="margin-left:200px;margin-top: 20px;" ghost type="primary" size="small" @click="toggleClick">
                        菜<br>单<br>列<br>表<br>
                    </Button>
                    <div style="width: 100%;height: 100%;margin-top: -100px;">
                        <Input icon="ios-search-strong" style="margin: 20px;width: 170px;" placeholder="请输入关键词" />
                        <Tree :data="projectData"  style="font-size: 39px;margin-left: 20px;text-color:green;" @on-select-change="projectChange"/>
                    </div>
                </div>
            </transition>
            <!--<div class="navicon-con" v-if="!hideMenuText">-->
                <!--<Button :style="{'margin-left': $store.state.hideSidePage?'0px':'200px'}" ghost type="primary" size="small" @click="toggleClick">-->
                    <!--菜<br>单<br>列<br>表<br>-->
                <!--</Button>-->

            <!--</div>-->
        </div>

        <div class="single-page-con" :style="{paddingLeft: $store.state.hideSidePage?'0px':'210px'}">
            <div class="header-middle-con" style="z-index: 100;">
                <div class="main-breadcrumb" >
                    <Row >
                        <Col span="12">
                            <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
                        </Col>
                        <Col span="12" style="text-align: right">
                        <!--<div style="float: right;width: 300px;">-->
                        <Input v-model="searchData" icon="ios-search-strong" style="width: 300px;" placeholder="请输入关键字..."
                               @on-change="searchChange" @on-blur	="filterData=[]"/>

                        <!--</div>-->
                        </Col>
                    </Row>
                </div>
            </div>
            <div v-show="filterData.length>0" class="search_div">
                <ul class="list-group">
                    <li class="list-group-item" v-for="item in filterData">
                        {{ item.title }}
                    </li>
                </ul>
            </div>
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
            tagsPageOpened
        },
        data(){
            return{
                hideMenuText: true,
                userName: '',
                showFullScreenBtn: window.navigator.userAgent.indexOf('MSIE') < 0,
                isFullScreen: false,
                messageCount: 10,
                lockScreenSize: 0,
                projectData: [
                    {
                        title: '明光热源厂',
                        expand: true,
                        type:1,
                        children: [
                            {
                                title: '明光换热站',
                                expand: true,
                                type:2,
                                children: [
                                    {
                                        title: '明光小区',
                                        type:3,
                                        children: [
                                            {
                                                title: '1号楼',
                                                type:4,
                                            },
                                            {
                                                title: '2号楼',
                                                type:4,
                                            },
                                            {
                                                title: '3号楼',
                                                type:4,
                                            },
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        title: '万达热源厂',
                        expand: true,
                        type:1,
                        children: [
                            {
                                title: '万达换热站',
                                type:2,
                                expand: true,
                                children: [
                                    {
                                        title: '万达小区',
                                        type:3,
                                        children: [
                                            {
                                                title: '1号楼',
                                                type:4,
                                            },
                                            {
                                                title: '2号楼',
                                                type:4,
                                            },
                                            {
                                                title: '3号楼',
                                                type:4,
                                            },
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ],
                searchData:'',
                filterData:[
//                    {name:'明光换热站',type:'换热站'},
//                    {name:'明光小区',type:'小区'},
//                    {name:'万达换热站',type:'换热站'},
//                    {name:'万达小区',type:'小区'},
                ],
            }
        },
        computed:{
            menuList () {
                return this.$store.state.menuList;
            },
            menuIconColor () {
                return this.$store.state.menuTheme === 'dark' ? 'white' : '#495060';
            },
            currentPath () {
                //console.log(JSON.stringify(this.$store.state.currentPath));
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
                this.$store.commit('setCurrentPageName', this.$route.name);
                let pathArr = util.setCurrentPath(this, this.$route.name);
                if (pathArr.length >= 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.userName = Cookies.get('username');
                let messageCount = 3;
                //this.messageCount = messageCount.toString();
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
                //console.log(this.$router);
                if (option[0].type!==1){
                    switch (option[0].type){
                        case 2:
                            this.$router.push({
                                name: 'exchange_index'
                            });
                            break;
                        case 3:
                            this.$router.push({
                                name: 'zone_index'
                            });
                            break;
                        case 4:
                            this.$router.push({
                                name: 'building_index'
                            });
                            break;
                    }
                }
            },
            searchChange(){
                console.log(this.searchData);
                var keyWord=this.searchData;
                var filter=[];
                //this.filterData.removeAll();
                this.projectData.map(function (project) {
                    if (project.title.includes(keyWord)){
                        filter.push(project);
                    }
                });
                console.log(filter);
                this.filterData=filter;
            }
        },
        watch: {
            '$route' (to) {
                this.$store.commit('setCurrentPageName', to.name);
                if (to.name!=='home_index'){
                    this.$store.commit('toggleSidsPage', false);
                }else {
                    this.$store.commit('toggleSidsPage', true);
                }
                if (to.name==='zone_index'){
                    this.$store.commit('setMenuList',5);
                }
                if (to.name==='building_index'){
                    this.$store.commit('setMenuList',6);
                }
            },
            lang () {
                util.setCurrentPath(this, this.$route.name);  // 在切换语言时用于刷新面包屑
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
