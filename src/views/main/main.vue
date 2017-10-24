<style lang="less">
    @import "main.less";
</style>
<template>
    <div id="main" class="main" :class="{'main-hide-text': hideMenuText}">
        <div class="sidebar-menu-con" :style="{width: hideMenuText?'60px':'200px', overflow: hideMenuText ? 'visible' : 'auto', background:'#495060'}">
         <!--background: $store.state.menuTheme === 'dark'?'#495060':'white'}">-->
            <div class="logo-con">
                <img v-show="!hideMenuText"  src="../../images/logo.jpg">
                <img v-show="hideMenuText" src="../../images/logo-min.jpg">
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
            </div>
        </div>

        <div style="background: red" class="single-page-con" :style="{paddingLeft: hideMenuText?'60px':'200px'}">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
    import sidebarMenu from "../../components/sidebarMenu.vue"
    import sidebarMenuShrink from "../../components/sidebarMenuShrink.vue"
    export default {
        components:{
            sidebarMenu,
            sidebarMenuShrink
        },
        data(){
            return{
                hideMenuText: false,
            }
        },
        computed:{
            menuList () {
                return this.$store.state.menuList;
            },
            menuIconColor () {
                return this.$store.state.menuTheme === 'dark' ? 'white' : '#495060';
            },
        },
        methods:{
            toggleClick () {
                this.hideMenuText = !this.hideMenuText;
            },
        },
        created(){
            // 权限菜单过滤相关
            this.$store.commit('updateMenulist');
        },
    }
</script>
