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
        </div>
        <div style="background: green" class="main-header-con" :style="{paddingLeft: hideMenuText?'60px':'200px'}">

        </div>

        <div style="background: red" class="single-page-con" :style="{paddingLeft: hideMenuText?'60px':'200px'}">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
    import sidebarMenu from "../../components/sidebarMenu.vue"
    export default {
        components:{
            sidebarMenu,

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
        },
        created(){
            // 权限菜单过滤相关
            this.$store.commit('updateMenulist');
        },
    }
</script>
