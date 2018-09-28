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
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="android-checkbox-outline"></Icon>
                    基础信息
                </p>
                <Row>
                    <Col span="12">
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
                    </Col>
                    <Col span="12">
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
                    </Col>
                </Row>
            </Card>
        </Row>
        <Row>
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="android-checkbox-outline"></Icon>
                    用热信息
                </p>
                <div  slot="extra">
                    <DatePicker :value="dateValue"
                                type="daterange"
                                format="yyyy/MM/dd"
                                placement="bottom-end"
                                split-panels
                                placeholder="Select date" style="width: 200px"
                     @on-change="dateChange"/>
                </div>
                <Row >
                    <Col span="12">
                        <Table :columns="areaHeatColumn" :data="areaHeatData"></Table>
                    </Col>
                    <Col span="12">
                        <ve-histogramfrom :data="areaHeatBarData" height="260px" ></ve-histogramfrom>
                    </Col>
                </Row>
            </Card>
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
    import inforCard from '../../../components/inforCard.vue';
    import VeLine from 'v-charts/lib/line.common';
    import VeHistogramfrom from 'v-charts/lib/histogram.common';
    import dataIcon from "../../../components/dataIcon.vue";
    import {getHouseholdsAndArea,getAreaHeat,getNodeAlermCount} from '../../../axios/http';
    import {formatDate,initDate} from '../../../utils';
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
                areaHeatColumn:[
                    {
                        title: '',
                        key: 'name'
                    },
                    {
                        title: '小区整体',
                        key: 'all'
                    },
                    {
                        title: '小区边侧',
                        key: 'side'
                    },
                    {
                        title: '小区顶层',
                        key: 'top'
                    },
                    {
                        title: '图表',
                        key: 'chart',
                        render: (h, params) => {
                            if (params.index!==3) {
                                return h('div', [
                                    h('Icon', {
                                        props: {
                                            type: 'stats-bars',
                                            size: 30,
                                            color: '#607D8B'
                                        },
                                        style: {
                                        },
                                        on: {
                                            click: () => {
                                                this.showAreaHeatingBar(params.index)
                                            }
                                        }
                                    })
                                ]);
                            }
                        }
                    }

                ],
                areaHeatData:[
//                    {
//                        name: '用热量',
//                        all: 7056,
//                        side: 1056,
//                        top: 2056,
//
//                    },
//                    {
//                        name: '供热面积',
//                        all: 801,
//                        side: 101,
//                        top: 201,
//                    },
//                    {
//                        name: '平均单耗',
//                        all: 9.6,
//                        side: 10.4,
//                        top: 10.6,
//                    },
//                    {
//                        name: '与整体单耗关系',
//                        all: '',
//                        side: '108%',
//                        top: '110%',
//                    }
                ],
                areaHeatBarData:{},
                areaHeatBarData0:{
                    columns: ['title', '用热量'],
                    rows: [
                        { 'title': '总体', '用热量': 0},
                        { 'title': '边侧', '用热量': 0 },
                        { 'title': '顶部', '用热量': 0 }
                    ]
                },
                areaHeatBarData1:{
                    columns: ['title', '供热面积'],
                    rows: [
                        { 'title': '总体', '供热面积': 0},
                        { 'title': '边侧', '供热面积': 0 },
                        { 'title': '顶部', '供热面积': 0 }
                    ]
                },
                areaHeatBarData2:{
                    columns: ['title', '平均单耗'],
                    rows: [
                        { 'title': '总体', '平均单耗': 0},
                        { 'title': '边侧', '平均单耗': 0 },
                        { 'title': '顶部', '平均单耗': 0 }
                    ]
                },
                selectedTreeNode:{},
                builds:sessionStorage.getItem("builds"),
                dateValue:[],
                chartSettings:{
                   // showLine: ['room_count'],
                    labelMap: {
                         'room_count': '户数',
                    }
                },
            }
        },
        components: {
            inforCard,
            //VeRing,
            dataIcon,
            VeHistogramfrom,
        },
        computed:{
            title () {
                this.selectedTreeNode=this.$store.state.selectedTreeNode[0];
                return this.selectedTreeNode.title;
            },
        },
        methods:{
            //展示区域用热汇总图表
            showAreaHeatingBar(index){
                //console.log(index);
                if (index==0){
                    this.areaHeatBarData0.rows[0].用热量=this.areaHeatData[0].all;
                    this.areaHeatBarData0.rows[1].用热量=this.areaHeatData[0].side;
                    this.areaHeatBarData0.rows[2].用热量=this.areaHeatData[0].top;

                    this.areaHeatBarData=this.areaHeatBarData0;
                }
                if (index==1){
                    this.areaHeatBarData1.rows[0].供热面积=this.areaHeatData[1].all;
                    this.areaHeatBarData1.rows[1].供热面积=this.areaHeatData[1].side;
                    this.areaHeatBarData1.rows[2].供热面积=this.areaHeatData[1].top;
                    this.areaHeatBarData=this.areaHeatBarData1;
                }
                if (index==2){
                    this.areaHeatBarData2.rows[0].平均单耗=this.areaHeatData[2].all;
                    this.areaHeatBarData2.rows[1].平均单耗=this.areaHeatData[2].side;
                    this.areaHeatBarData2.rows[2].平均单耗=this.areaHeatData[2].top;
                    this.areaHeatBarData=this.areaHeatBarData2;
                }
            },
            initHouseholdsAndArea(){
                getHouseholdsAndArea(this.builds,this.selectedTreeNode.type,this.selectedTreeNode.title)
                    .then((respose)=>{
                    this.count=respose.data.result;
                }).catch(function (error) {
                    console.log(error);
                });
            },
            initDate(){
                var inDate=initDate();
                this.$set(this.dateValue,0,inDate[0]);
                this.$set(this.dateValue,1,inDate[1]);
            },
            initNodeAlerm(){
                getNodeAlermCount(this.builds,this.selectedTreeNode.type,this.selectedTreeNode.title)
                    .then((respose)=>{
                        this.alermData.rows=respose.data.result;
                    }).catch(function (error) {
                    console.log(error);
                });
            },
            dateChange(date1,date2){
                this.$set(this.dateValue,0,date1[0]);
                this.$set(this.dateValue,1,date1[1]);
            },
            initAreaHeat(){
                getAreaHeat(this.builds,this.selectedTreeNode.type,this.selectedTreeNode.title,this.dateValue[0],this.dateValue[1])
                    .then((respose)=>{
                        this.areaHeatData=respose.data.result;
                        this.areaHeatBarData2.rows[0].平均单耗=this.areaHeatData[2].all;
                        this.areaHeatBarData2.rows[1].平均单耗=this.areaHeatData[2].side;
                        this.areaHeatBarData2.rows[2].平均单耗=this.areaHeatData[2].top;
                        this.areaHeatBarData=this.areaHeatBarData2;
                }).catch(function (error) {
                    console.log(error);
                });
            }
        },
        watch: {
            selectedTreeNode(){
                this.initDate();
                this.initHouseholdsAndArea();
                this.initNodeAlerm();
            },
            dateValue(newVal,oldVal){
                this.initAreaHeat();
            }
        },
        created(){
            this.areaHeatBarData=this.areaHeatBarData2;
            this.initDate();
        },
        mounted () {
           this.initHouseholdsAndArea();
           this.initNodeAlerm();
        },
    }
</script>
