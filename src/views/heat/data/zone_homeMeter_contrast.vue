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
                    </Col>
                </Row>
            </div>
        </Row>
        <br/>
        <Row>
            <Card>
                <ve-histogramfrom :data="contrastHeat" :settings="chartSettings"></ve-histogramfrom>
            </Card>

        </Row>
    </div>
</template>
<script>
    import inforCard from '../../../components/inforCard.vue';
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
                contrastHeat:{
                    columns: ['buildName', 'currentHeat', 'lastHeat', 'beforeHeat'],
                    rows: [
                    ]
                },
                chartSettings:{
                    labelMap: {
                        'currentHeat': '',
                        'lastHeat': '',
                        'beforeHeat':'',
                    }
                },
                startDate:'',
                endDate:'',

            }
        },
        components: {
            VeHistogramfrom,
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
                // initLabelMap
                this.initLabelMap();
                getZoneContrast(this.builds,
                    this.selectedTreeNode.type,
                    this.selectedTreeNode.name,
                    this.startDate,
                    this.endDate)
                    .then((respose)=>{
                    this.contrastHeat.rows=respose.data.result;
                }).catch((error)=>{

                    })
            },
            initLabelMap(){
                var session=parseInt(this.currentHeatSession);
                this.chartSettings.labelMap.currentHeat=session+"";
                this.chartSettings.labelMap.lastHeat=session-1+"";
                this.chartSettings.labelMap.beforeHeat=session-2+"";
                this.startDate=session+"/11/01";
                this.endDate=session+1+"/10/31";
            },
            searchClick(){
                this.initContrastHeat();
            },
            dateChange(date){
            },
        },
        mounted () {
            this.initContrastHeat();

        },
        watch: {
            selectedTreeNode(){
                //this.initAlermData(this.tabValue);
            },

        },
        created(){
            this.init();
        }
    }
</script>
