<style lang="less">
    @import "main.less";
</style>
<template>
    <div id="main" class="main" :class="{'main-hide-text': hideMenuText}">
        <div class="sidebar-menu-con" :style="{width: hideMenuText?'60px':'200px', overflow: hideMenuText ? 'visible' : 'auto', background:'#495060'}">
         <!--background: $store.state.menuTheme === 'dark'?'#495060':'white'}">-->
            <div class="logo-con">
                <img v-show="!hideMenuText"  src="../../images/logo.png">
                <img v-show="hideMenuText" src="../../images/logo-min.png">
            </div>
            <sidebar-menu v-if="!hideMenuText" :menuList="menuList" :iconSize="14"></sidebar-menu>
            <sidebar-menu-shrink :icon-color="menuIconColor" v-else :menuList="menuList"></sidebar-menu-shrink>
        </div>
        <div  class="main-header-con" :style="{paddingLeft: hideMenuText?'60px':'200px'}">
            <div class="main-header">
                <div class="navicon-con">
                    <Button :style="{transform: 'rotateZ(' + (this.hideMenuText ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
                        <Icon type="navicon" size="32"></Icon>
                    </Button>
                </div>
                <div class="header-middle-con">
                    <div class="main-breadcrumb">
                        <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
                    </div>
                </div>
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
                                        <DropdownItem name="ownSpace">个人中心</DropdownItem>
                                        <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                                <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" style="background: #619fe7;margin-left: 10px;"></Avatar>
                            </Row>
                        </div>
                        <div class="message-con">
                            <Tooltip :content="messageCount > 0 ? '有' + messageCount + '条未读消息' : '无未读消息'" placement="bottom">
                                <Badge :count="messageCount" dot>
                                    <Icon type="ios-bell" :size="22"></Icon>
                                </Badge>
                            </Tooltip>
                        </div>
                        <div class="lock-screen-btn-con">
                            <Tooltip content="锁屏" placement="bottom">
                                <Icon type="locked" :size="20"></Icon>
                            </Tooltip>
                        </div>
                        <div v-if="showFullScreenBtn" class="full-screen-btn-con">
                            <Tooltip :content="isFullScreen ? '退出全屏' : '全屏'" placement="bottom">
                                <Icon :type="isFullScreen ? 'arrow-shrink' : 'arrow-expand'" :size="23"></Icon>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tags-con">
                <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
            </div>
        </div>

        <div  class="single-page-con" :style="{paddingLeft: hideMenuText?'60px':'200px'}">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
    import sidebarMenu from "../../components/sidebarMenu.vue";
    import sidebarMenuShrink from "../../components/sidebarMenuShrink.vue";
    import breadcrumbNav from "../../components/breadcrumbNav.vue";
    import tagsPageOpened from "../../components/tagsPageOpened.vue";
    import util from '../../libs/util.js';
    export default {
        components:{
            sidebarMenu,
            sidebarMenuShrink,
            breadcrumbNav,
            tagsPageOpened
        },
        data(){
            return{
                hideMenuText: false,
                userName: 'Admin',
                showFullScreenBtn: window.navigator.userAgent.indexOf('MSIE') < 0,
                isFullScreen: false,
                messageCount: 10,
                lockScreenSize: 0
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
                //this.userName = Cookies.get('user');
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

                }
            },
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
