<style lang="less">
    @import "../../../components/styles/home.less";
    @import "../../../components/styles/common.less";
</style>
<template>
    <div class="home-main">
        <div class="header-title-div">
            <div class="header-title" >
                {{title}}历史数据对比
            </div>
        </div>
        <Row>
            <div class="tools_div">
                <Row style="padding-top: 10px;margin-left: 20px;">
                    <Col span="6">
                    供暖季：
                    <Select v-model="currentHeatSession" style="width:200px">
                        <Option v-for="item in heatSessions" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    </Col>
                    <Col span="6"></Col>
                    <Col span="6"></Col>
                    <Col span="6">
                    <Button @click="searchClick">搜索</Button>
                    <Button>导出</Button>
                    </Col>
                </Row>
            </div>
        </Row>
        <br/>
        <Row>
            <Card>

            </Card>

        </Row>
    </div>
</template>
<script>
    import inforCard from '../../../components/inforCard.vue';
    import VeRing from 'v-charts/lib/ring.common';
    import VeHistogramfrom from 'v-charts/lib/histogram.common';
    import dataIcon from "../../../components/dataIcon.vue";
    import {getZoneContrast} from '../../../axios/http';
    import {initHeatSession} from '../../../utils';
    export default {
        data(){
            return {
                self: this,
                lastNodeData: [],
                tableColumns: [],
                selectedTreeNode:{},
                builds:'',
                currentHeatSession:'',//当前供暖季
                heatSessions:[],
            }
        },
        computed:{
            title () {
                this.selectedTreeNode=this.$store.state.selectedTreeNode[0];
                return this.selectedTreeNode.name;
            },
        },
        methods:{
            init(){
                this.builds=sessionStorage.getItem("builds");
                this.heatSessions=initHeatSession();
                this.currentHeatSession=this.heatSessions[0].value;
            },
            initContrastHeat(){

            },
            searchClick(){
//                this.initLastNodeData();
            },

            searchClick(){

            },
            dateChange(date){
            },
        },
        mounted () {
//            this.initUseHeat(this.tabValue);

        },
        watch: {
            selectedTreeNode(){
                //this.initUseHeat(this.tabValue);
            },

        },
        created(){
            this.init();
        }
    }
</script>
