<style lang="less">
    @import "home.less";
    @import "../../styles/common.less";
</style>
<template>
    <div class="home-main">
        <Row style="margin: 10px">
            <Col span="6">
            <Select v-model="filter_project_id" filterable @on-change="projectChange" style="width:200px">
                <Option v-for="item in projectList" :value="item.id" :key="item.name">{{ item.name }}</Option>
            </Select>
            </Col>
            <Col span="18" >
                <Card >
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        最新数据
                    </p>
                    <Row :gutter="16">
                        <Col span="4">
                        <div style="height: 140px;box-shadow:0 0 1px #000 inset;">
                            <div style="height: 80px;background: green;text-align: center;line-height:80px;">
                                <span style="font-size: 18pt;color: white;">{{accountHeat}}MJ</span>
                            </div>
                            <div style="height: 60px;text-align: center;line-height:60px;">
                                <p style="font-size: 14pt;color: green;">累计热量</p>
                            </div>
                        </div>
                        </Col>
                        <Col span="4">
                        <div style="height: 140px;box-shadow:0 0 1px #000 inset;">
                            <div style="height: 80px;background: green;text-align: center;line-height:80px;">
                                <span style="font-size: 18pt;color: white;">{{accountElectricity}}kwh</span>
                            </div>
                            <div style="height: 60px;text-align: center;line-height:60px;">
                                <p style="font-size: 14pt;color: green;">累计电量</p>
                            </div>
                        </div>
                        </Col>
                        <Col span="4">
                        <div style="height: 140px;box-shadow:0 0 1px #000 inset;">
                            <div style="height: 80px;background: green;text-align: center;line-height:80px;">
                                <span style="font-size: 18pt;color: white;">{{outdoor_temp}}℃</span>
                            </div>
                            <div style="height: 60px;text-align: center;line-height:60px;">
                                <p style="font-size: 14pt;color: green;">室外温度</p>
                            </div>
                        </div>
                        </Col>
                        <Col span="4">
                        <div style="height: 140px;box-shadow:0 0 1px #000 inset;">
                            <div style="height: 80px;background: green;text-align: center;line-height:80px;">
                                <span style="font-size: 18pt;color: white;">{{averageTemp}}℃</span>
                            </div>
                            <div style="height: 60px;text-align: center;line-height:60px;">
                                <p style="font-size: 14pt;color: green;">室内平均温度</p>
                            </div>
                        </div>
                        </Col>
                        <Col span="4">
                        <div style="height: 140px;box-shadow:0 0 1px #000 inset;">
                            <div style="height: 80px;background: green;text-align: center;line-height:80px;">
                                <span style="font-size: 18pt;color: white;">{{maxTemp}}℃</span>
                            </div>
                            <div style="height: 60px;text-align: center;line-height:60px;">
                                <p style="font-size: 14pt;color: green;">室内最高温度</p>
                            </div>
                        </div>
                        </Col>
                        <Col span="4">
                        <div style="height: 140px;box-shadow:0 0 1px #000 inset;">
                            <div style="height: 80px;background: green;text-align: center;line-height:80px;">
                                <span style="font-size: 18pt;color: white;">{{minTemp}}℃</span>
                            </div>
                            <div style="height: 60px;text-align: center;line-height:60px;">
                                <p style="font-size: 14pt;color: green;">室内最低温度</p>
                            </div>
                        </div>
                        </Col>
                    </Row>

                </Card>
            </Col>
        </Row>
        <Row>
            <Card >
                <p slot="title">
                    <Icon type="ios-film-outline"></Icon>
                    近一个月日耗热量
                </p>

            <div id="heatChart" style="height: 240px"></div>
            </Card>
        </Row>
        <Row>
            <Card >
                <p slot="title">
                    <Icon type="ios-film-outline"></Icon>
                    近一个月日耗电量
                </p>
            <div id="electricityChart" style="height: 240px"></div>
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
    import {getProjectsList,getLastMonthPowerConsumptions,getLastMonthHeatConsumptions} from '../../axios/http';
    import Cookies from 'js-cookie';
    export default {
        data () {
            return {
                projectList:[],//项目列表
                filter_project_id:0,//筛选过滤的
                outdoor_temp:0,
                maxTemp:0,
                minTemp:0,
                averageTemp:0,
                accountHeat:0,
                accountElectricity:0,
                startDate:'',
                endDate:''
            }
        },
        methods: {
            //加载项目数据
            initProject(){
                getProjectsList(Cookies.get('projects')).then((response)=>{
                    this.filter_project_id = response.data.result[0].id;
                    this.projectList=response.data.result;
                    this.initHeatChart();
                    this.initElectricityChart();
                }).catch(function (error) {
                    console.log(error);
                });
            },
            initDate(){
                var date=new Date();
                this.startDate=date.getFullYear()+"/"+(date.getMonth())+"/"+date.getDate();
                this.endDate=date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate();
            },
            initHeatChart(){
                getLastMonthHeatConsumptions(this.filter_project_id,this.startDate,this.endDate).then((response)=>{
                    var option = {
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:['日耗热量']
                        },
                        toolbox: {
                            show : true,
                            feature : {
                                magicType : {show: true, type: ['line', 'bar']},
                            }
                        },
                        calculable : true,
                        xAxis : [
                            {
                                type : 'category',
                                data : response.data.result[0].text,
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value'
                            }
                        ],
                        series : [
                            {
                                name:'日耗热量',
                                type:'bar',
                                data:response.data.result[0].value,


                            }
                        ]
                    };
                    let heatChart = echarts.init(document.getElementById('heatChart'));
                    heatChart.setOption(option);
                }).catch(function (error) {
                    console.log(error);
                });
            },
            initElectricityChart(){
                getLastMonthPowerConsumptions(this.filter_project_id,this.startDate,this.endDate).then((response)=>{
                    var option = {
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:['日耗电量']
                        },
                        toolbox: {
                            show : true,
                            feature : {
                                magicType : {show: true, type: ['line', 'bar']},
                            }
                        },
                        calculable : true,
                        xAxis : [
                            {
                                type : 'category',
                                data : response.data.result[0].text,
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value'
                            }
                        ],
                        series : [
                            {
                                name:'日耗电量',
                                type:'bar',
                                data:response.data.result[0].value,
                                itemStyle: {
                                    normal: {
                                        color: function(params) {
                                            // build a color map as your need.
                                            var colorList = [
                                                '#26C0C0'
                                            ];
                                            return colorList[params.dataIndex]
                                        }
                                    }
                                },
                            }
                        ]
                    };
                    let electricity = echarts.init(document.getElementById('electricityChart'));
                    electricity.setOption(option);
                }).catch(function (error) {
                    console.log(error);
                });
            },
            projectChange(Option){//项目下拉框发生改变时
                this.filter_project_id = Option;

            }
        },
        created(){
            //this.projecIds=Cookies.get("projects");
            this.initDate();
            this.initProject();

        }

    }
</script>
