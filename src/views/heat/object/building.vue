<style lang="less">
    @import "../../../components/styles/home.less";
    @import "../../../components/styles/common.less";
</style>
<template>
    <div class="home-main">
        <div class="header-title-div">
            <div class="header-title" >
                明光1号楼
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
                            :end-val="count.heatingUser"
                            iconType="person-stalker"
                            color="#149F1F"
                            intro-text="供暖户数" unit="户" style="margin-right:20px;"/>
                        </Col>
                        <Col span="8">
                        <!--<ve-ring :data="userPieData" :colors="this.userPieColors" :settings="chartSettings"></ve-ring>-->
                        <infor-card
                            id-name="user_bl"
                            :end-val="count.heatingUser/count.totalUser*100"
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
                            :end-val="count.heatingArea"
                            iconType="android-map"
                            color="#ffd572"
                            intro-text="供热面积" unit="㎡" style="margin-right:20px;"/>
                        </Col>
                        <Col span="8">
                        <!--<ve-ring :data="areaPieData" :colors="this.areaPieColors"></ve-ring>-->
                        <infor-card
                            id-name="area_bl"
                            :end-val="count.heatingArea/count.totalArea*100"
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
                        :val="count.error1"
                        iconType="alert-circled"
                        intro-text="通讯故障" />
                    </Col>
                    <Col span="3">
                    <data-icon
                        :val="count.error1"
                        iconType="alert-circled"
                        intro-text="多天通讯故障" />
                    </Col>
                    <Col span="3">
                    <data-icon
                        :val="count.error0"
                        iconType="alert-circled"
                        intro-text="电池欠压" />
                    </Col>
                    <Col span="3">
                    <data-icon
                        :val="count.error0"
                        iconType="alert-circled"
                        intro-text="流量过小" />
                    </Col>
                    <Col span="3">
                    <data-icon
                        :val="count.error0"
                        iconType="alert-circled"
                        intro-text="供回水接反" />
                    </Col>
                    <Col span="3">
                    <data-icon
                        :val="count.error0"
                        iconType="alert-circled"
                        intro-text="流量超限" />
                    </Col>
                    <Col span="3">
                    <data-icon
                        :val="count.error0"
                        iconType="alert-circled"
                        intro-text="进水温度低" />
                    </Col>
                    <Col span="3">
                    <data-icon
                        :val="count.error0"
                        iconType="alert-circled"
                        intro-text="进水温度高" />
                    </Col>
                </Row>
                <Row>
                    <Col span="3">
                    <data-icon
                        :val="count.error1"
                        iconType="alert-circled"
                        intro-text="出水温度低" />
                    </Col>
                    <Col span="3">
                    <data-icon
                        :val="count.error0"
                        iconType="alert-circled"
                        intro-text="供暖日用量为零" />
                    </Col>
                    <Col span="3">
                    <data-icon
                        :val="count.error0"
                        iconType="alert-circled"
                        intro-text="未供暖用量非零" />
                    </Col>
                    <Col span="3">
                    <data-icon
                        :val="count.error0"
                        iconType="alert-circled"
                        intro-text="温差过大" />
                    </Col>
                    <Col span="3">
                    <data-icon
                        :val="count.error0"
                        iconType="alert-circled"
                        intro-text="典型测温故障" />
                    </Col>
                    <Col span="3">
                    <data-icon
                        :val="count.error0"
                        iconType="alert-circled"
                        intro-text="瞬时流量为零" />
                    </Col>
                </Row>
                <Row>
                    <ve-histogramfrom :data="alertData"></ve-histogramfrom>
                </Row>
            </Card>
        </Row>
    </div>
</template>
<script>
    import inforCard from '../../../components/inforCard.vue';
    import VeRing from 'v-charts/lib/ring.common';
    import VeHistogramfrom from 'v-charts/lib/histogram.common';
    import dataIcon from "../../../components/dataIcon.vue";
    export default {
        data(){
            this.userPieColors = ['#F0797A','#149F1F'];
            this.areaPieColors = ['#EA82FF','#FF6C2E'];
            this.chartSettings = {
                height:'220px;'
            };
            return {
                //userPieColors:['#2d8cf0','#149F1F'],
                count: {
                    totalUser: 500,
                    heatingUser: 480,
                    totalArea: 1280,
                    heatingArea: 1200,
                    error0:0,
                    error1:10,
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
                alertData:{
                    columns: ['title', '户数'],
                    rows: [
                        { 'title': '通讯故障', '户数': 10},
                        { 'title': '多天通讯故障', '户数': 10 },
                        { 'title': '电池欠压', '户数': 0 },
                        { 'title': '流量过小', '户数': 0 },
                        { 'title': '供回水接反', '户数': 0 },
                        { 'title': '流量超限', '户数': 0 },
                        { 'title': '进水温度低', '户数': 0 },
                        { 'title': '进水温度高', '户数': 0 },
                        { 'title': '出水温度低', '户数': 10 },
                        { 'title': '供暖日用量为零', '户数': 0 },
                        { 'title': '未供暖用量非零', '户数': 0 },
                        { 'title': '温差过大', '户数': 0 },
                        { 'title': '典型测温故障', '户数': 0 },
                        { 'title': '瞬时流量为零', '户数': 0 },
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
                                            // marginRight: '5px'
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
                    {
                        name: '用热量',
                        all: 7056,
                        side: 1056,
                        top: 2056,

                    },
                    {
                        name: '供热面积',
                        all: 801,
                        side: 101,
                        top: 201,
                    },
                    {
                        name: '平均单耗',
                        all: 9.6,
                        side: 10.4,
                        top: 10.6,
                    },
                    {
                        name: '与整体单耗关系',
                        all: '',
                        side: '108%',
                        top: '110%',
                    }
                ],
                areaHeatBarData:{},
                areaHeatBarData0:{
                    columns: ['title', '用热量'],
                    rows: [
                        { 'title': '总体', '用热量': 7056},
                        { 'title': '边侧', '用热量': 1056 },
                        { 'title': '顶部', '用热量': 2056 }
                    ]
                },
                areaHeatBarData1:{
                    columns: ['title', '供热面积'],
                    rows: [
                        { 'title': '总体', '供热面积': 801},
                        { 'title': '边侧', '供热面积': 102 },
                        { 'title': '顶部', '供热面积': 201 }
                    ]
                },
                areaHeatBarData2:{
                    columns: ['title', '平均单耗'],
                    rows: [
                        { 'title': '总体', '平均单耗': 9.6},
                        { 'title': '边侧', '平均单耗': 10.4 },
                        { 'title': '顶部', '平均单耗': 10.6 }
                    ]
                }
            }
        },
        components: {
            inforCard,
            VeRing,
            dataIcon,
            VeHistogramfrom,
        },
        methods:{
            //展示区域用热汇总图表
            showAreaHeatingBar(index){
                //console.log(index);
                if (index==0){
                    this.areaHeatBarData=this.areaHeatBarData0;
                }
                if (index==1){
                    this.areaHeatBarData=this.areaHeatBarData1;
                }
                if (index==2){
                    this.areaHeatBarData=this.areaHeatBarData2;
                }
            },
        },
        created(){
            this.areaHeatBarData=this.areaHeatBarData2;
        }
    }
</script>
