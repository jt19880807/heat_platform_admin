<style lang="less">
    @import "../../../components/styles/home.less";
    @import "../../../components/styles/common.less";
</style>
<template>
    <div class="home-main">
        <div class="header-title-div">
            <div class="header-title" >
                {{title}}
            </div>
        </div>
        <Row>
            <Col span="12">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="android-checkbox-outline"></Icon>
                        基础信息
                    </p>
                    <Row>
                            <Col span="8">
                            <infor-card
                                id-name="user_total_count"
                                :end-val="count.totalUser"
                                iconType="ios-people"
                                color="#149F1F"
                                intro-text="总户数" unit="户" style="margin-right:20px;"/>
                            </Col>
                            <Col span="8">
                            <infor-card
                                id-name="user_gn_count"
                                :end-val="count.heatUser"
                                iconType="person-stalker"
                                color="#149F1F"
                                intro-text="供暖户数" unit="户" style="margin-right:20px;"/>
                            </Col>
                            <Col span="8">
                            <!--<ve-ring :data="userPieData" :colors="this.userPieColors" :settings="chartSettings"></ve-ring>-->
                            <infor-card
                                id-name="user_bl"
                                :end-val="count.heatUser/count.totalUser*100"
                                iconType="person-stalker"
                                color="#149F1F"
                                intro-text="所占比例" unit="%" style="margin-right:20px;"/>
                            </Col>
                        </Row>
                    <br/>
                    <Row>
                            <Col span="8">
                            <infor-card
                                id-name="user_total_area"
                                :end-val="count.totalArea"
                                iconType="map"
                                color="#ffd572"
                                intro-text="总面积" unit="㎡" style="margin-right:20px;"/>
                            </Col>
                            <Col span="8">
                            <infor-card
                                id-name="user_gn_area"
                                :end-val="count.heatArea"
                                iconType="android-map"
                                color="#ffd572"
                                intro-text="供热面积" unit="㎡" style="margin-right:20px;"/>
                            </Col>
                            <Col span="8">
                            <!--<ve-ring :data="areaPieData" :colors="this.areaPieColors"></ve-ring>-->
                            <infor-card
                                id-name="area_bl"
                                :end-val="count.heatArea/count.totalArea*100"
                                iconType="android-map"
                                color="#ffd572"
                                intro-text="所占比例" unit="%" style="margin-right:20px;"/>
                            </Col>
                        </Row>
                </Card>
            </Col>

            <Col span="12">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="android-checkbox-outline"></Icon>
                        进水温度分析
                    </p>
                    <Row :gutter="16">
                        <Col span="6" class="temp_text_info">
                            <p class="temp_text_info_p" style="color: #ff9100">40℃以下:{{entrance_temp_analyse.low_40}} 户</p>
                        </Col>
                        <Col span="6" class="temp_text_info">
                            <p class="temp_text_info_p" style="color: #d26500">40~50℃:{{entrance_temp_analyse.low_50}} 户</p>
                        </Col>
                        <Col span="6" class="temp_text_info">
                            <p class="temp_text_info_p" style="color: #cb4f6a">50~60℃:{{entrance_temp_analyse.low_60}} 户</p>
                        </Col>
                        <Col span="6" class="temp_text_info">
                            <p class="temp_text_info_p" style="color: #aa0000">60℃以上:{{entrance_temp_analyse.up_60}} 户</p>
                        </Col>
                    </Row>
                    <Row>
                        <div id="temp_bar" style="height: 240px"></div>
                        <!--<ve-histogramfrom :data="areaHeatBarData" height="200px"  :colors="colors"></ve-histogramfrom>-->
                    </Row>
                </Card>
            </Col>
        </Row>
        <Row>
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="android-checkbox-outline"></Icon>
                    报警信息
                </p>
                <Row>
                    <Col span="3">
                    <data-icon
                        :val="alermData.rows[0].room_count"
                        :alermType="alermData.rows[0].id"
                        iconType="alert-circled"
                        intro-text="通讯故障" />
                    </Col>
                    <Col span="3">
                    <data-icon
                        :val="alermData.rows[1].room_count"
                        :alermType="alermData.rows[1].id"
                        iconType="alert-circled"
                        intro-text="多天通讯故障" />
                    </Col>
                    <Col span="3">
                    <data-icon
                        :val="alermData.rows[2].room_count"
                        :alermType="alermData.rows[2].id"
                        iconType="alert-circled"
                        intro-text="电池欠压" />
                    </Col>
                    <Col span="3">
                    <data-icon
                        :val="alermData.rows[3].room_count"
                        :alermType="alermData.rows[3].id"
                        iconType="alert-circled"
                        intro-text="流量过小" />
                    </Col>
                    <Col span="3">
                    <data-icon
                        :val="alermData.rows[4].room_count"
                        :alermType="alermData.rows[4].id"
                        iconType="alert-circled"
                        intro-text="供回水接反" />
                    </Col>
                    <Col span="3">
                    <data-icon
                        :val="alermData.rows[5].room_count"
                        :alermType="alermData.rows[5].id"
                        iconType="alert-circled"
                        intro-text="流量超限" />
                    </Col>
                    <Col span="3">
                    <data-icon
                        :val="alermData.rows[6].room_count"
                        :alermType="alermData.rows[6].id"
                        iconType="alert-circled"
                        intro-text="进水温度低" />
                    </Col>
                    <Col span="3">
                    <data-icon
                        :val="alermData.rows[7].room_count"
                        :alermType="alermData.rows[7].id"
                        iconType="alert-circled"
                        intro-text="进水温度高" />
                    </Col>
                </Row>
                <Row>
                    <Col span="3">
                    <data-icon
                        :val="alermData.rows[8].room_count"
                        :alermType="alermData.rows[8].id"
                        iconType="alert-circled"
                        intro-text="出水温度低" />
                    </Col>
                    <Col span="3">
                    <data-icon
                        :val="alermData.rows[9].room_count"
                        :alermType="alermData.rows[9].id"
                        iconType="alert-circled"
                        intro-text="供暖日用量为零" />
                    </Col>
                    <Col span="3">
                    <data-icon
                        :val="alermData.rows[10].room_count"
                        :alermType="alermData.rows[10].id"
                        iconType="alert-circled"
                        intro-text="未供暖用量非零" />
                    </Col>
                    <Col span="3">
                    <data-icon
                        :val="alermData.rows[11].room_count"
                        :alermType="alermData.rows[11].id"
                        iconType="alert-circled"
                        intro-text="温差过大" />
                    </Col>
                    <Col span="3">
                    <data-icon
                        :val="alermData.rows[12].room_count"
                        :alermType="alermData.rows[12].id"
                        iconType="alert-circled"
                        intro-text="典型测温故障" />
                    </Col>
                    <Col span="3">
                    <data-icon
                        :val="alermData.rows[13].room_count"
                        :alermType="alermData.rows[13].id"
                        iconType="alert-circled"
                        intro-text="瞬时流量为零" />
                    </Col>
                </Row>
                <Row>
                    <ve-histogramfrom :data="alermData" :settings="chartSettings"></ve-histogramfrom>
                </Row>
            </Card>
        </Row>
    </div>
</template>
<script>
    // 引入基本模板
    let echarts = require('echarts/lib/echarts');
    // 引入柱状图组件
    require('echarts/lib/chart/bar');
    require('echarts/lib/chart/line');
    // 引入提示框和title组件;
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/title');
    require('echarts/lib/component/toolbox');
    require('echarts/lib/component/legend');
    import inforCard from '../../../components/inforCard.vue';
    import VeRing from 'v-charts/lib/ring.common';
    import VeHistogramfrom from 'v-charts/lib/histogram.common';
    import dataIcon from "../../../components/dataIcon.vue";
    import {getHouseholdsAndArea,entrance_temp_analyse,getNodeAlermCount} from '../../../axios/http';
    export default {
        data(){
            return {
                count: {
                    totalUser: 0,
                    heatUser: 0,
                    totalArea: 0,
                    heatArea: 0,
                    error0:0,
                    error1:0,
                },
                userPieData: {
                    columns: ['title', 'vlue'],
                    rows: [
                        { 'title': '未供热户数', 'vlue': 2},
                        { 'title': '供热户数', 'vlue': 48 },
                    ]
                },
                areaPieData: {
                    columns: ['title', 'vlue'],
                    rows: [
                        { 'title': '未供热面积', 'vlue': 3},
                        { 'title': '供热面积', 'vlue': 12000 },
                    ]
                },
                alermData:{
                    columns: ['name', 'room_count'],
                    rows: [
                        { 'title': '通讯故障', 'room_count': 0},
                        { 'title': '多天通讯故障', 'room_count': 0 },
                        { 'title': '电池欠压', 'room_count': 0 },
                        { 'title': '流量过小', 'room_count': 0 },
                        { 'title': '供回水接反', 'room_count': 0 },
                        { 'title': '流量超限', 'room_count': 0 },
                        { 'title': '进水温度低', 'room_count': 0 },
                        { 'title': '进水温度高', 'room_count': 0 },
                        { 'title': '出水温度低', 'room_count': 0 },
                        { 'title': '供暖日用量为零', 'room_count': 0 },
                        { 'title': '未供暖用量非零', 'room_count': 0 },
                        { 'title': '温差过大', 'room_count': 0 },
                        { 'title': '典型测温故障', 'room_count': 0 },
                        { 'title': '瞬时流量为零', 'room_count': 0 },
                    ]
                },
                chartSettings:{
                    labelMap: {
                        'room_count': '户数',
                    }
                },
                areaHeatBarData:{
                    columns: ['title', '户数'],
                    rows: [
                        { 'title': '40℃以下', '户数': 20},
                        { 'title': '40~50℃', '户数': 35 },
                        { 'title': '50~60℃', '户数': 24 },
                        { 'title': '60℃以上', '户数': 18 }
                    ]
                },
                selectedTreeNode:{},
                builds:sessionStorage.getItem("builds"),
                option : {
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['户数']
                    },
                    calculable : true,
                    xAxis : [
                        {
                            show:false,
                            type : 'category',
                            data : ['40℃以下','40~50℃','50~60℃','60℃以上'],
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            show:false,
                        }
                    ],
                    series : [
                        {
                            name:'户数',
                            type:'bar',
                            itemStyle: {
                                normal: {
                                    color: function(params) {
                                        let colorList = [
                                            '#ff9100','#d26500','#cb4f6a','#aa0000'
                                        ];
                                        return colorList[params.dataIndex]
                                    },
                                    label: {
                                        show: true,
                                        position: 'top',
                                        formatter: '{b}\n{c}'
                                    }
                                }
                            },
                            data:[0,0,0,0],
                        }
                    ]
                },
                heatChart:{},
                entrance_temp_analyse:{
                    low_40:0,
                    low_50:0,
                    low_60:0,
                    up_60:0,
                },
            }
        },
        components: {
            inforCard,
            VeRing,
            dataIcon,
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
                this.heatChart = echarts.init(document.getElementById('temp_bar'));
                this.heatChart.setOption(this.option);
            },
            initHeatChart(){
                entrance_temp_analyse(this.builds,this.selectedTreeNode.type,this.selectedTreeNode.name)
                    .then((respose)=>{
                        if (respose.data.status===0) {
                            this.entrance_temp_analyse.low_40=respose.data.result.low_40;
                            this.entrance_temp_analyse.low_50=respose.data.result.low_50;
                            this.entrance_temp_analyse.low_60=respose.data.result.low_60;
                            this.entrance_temp_analyse.up_60=respose.data.result.up_60;

                            this.$set(this.option.series[0].data,0,respose.data.result.low_40);
                            this.$set(this.option.series[0].data,1,respose.data.result.low_50);
                            this.$set(this.option.series[0].data,2,respose.data.result.low_60);
                            this.$set(this.option.series[0].data,3,respose.data.result.up_60);
                            this.heatChart.setOption(this.option);
                        }
                    }).catch(function (error) {
                    console.log(error);
                });

            },
            initHouseholdsAndArea(){
//                this.count.totalUser=9;
                getHouseholdsAndArea(this.builds,this.selectedTreeNode.type,this.selectedTreeNode.name)
                    .then((respose)=>{
                        this.count=respose.data.result;
                    }).catch(function (error) {
                    console.log(error);
                });
            },
            initNodeAlerm(){
                getNodeAlermCount(this.builds,this.selectedTreeNode.type,this.selectedTreeNode.name)
                    .then((respose)=>{
                        this.alermData.rows=respose.data.result;
                    }).catch(function (error) {
                    console.log(error);
                });
            },
        },
        mounted(){
            this.init();
            this.initHeatChart();
            this.initNodeAlerm();
        },
        watch: {
            selectedTreeNode(){
                this.initHouseholdsAndArea();
                this.initHeatChart();
                this.initNodeAlerm();
            },

        },
        created(){

        }
    }
</script>
