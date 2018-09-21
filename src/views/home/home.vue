<style lang="less">
    @import "home.less";
    @import "../../styles/common.less";
</style>
<template>
    <div class="home-main">
        <Row style="margin: 10px">
            <Col >
                <Card >
                <p slot="title">
                    <Icon type="ios-film-outline"></Icon>
                    基础信息
                </p>
                <Row :gutter="16">
                    <Col span="4">
                    <div class="title_div">
                        <div class="title_top">
                            <span class="title_top_span">{{baseInfo.source_plant_count}}</span>
                        </div>
                        <div class="title_bottom">
                            <p class="title_bottom_p">热源厂</p>
                        </div>
                    </div>
                    </Col>
                    <Col span="4">
                    <div class="title_div">
                        <div class="title_top">
                            <span class="title_top_span">{{baseInfo.exchange_station_count}}</span>
                        </div>
                        <div class="title_bottom">
                            <p class="title_bottom_p">换热站</p>
                        </div>
                    </div>
                    </Col>
                    <Col span="4">
                    <div class="title_div">
                        <div class="title_top">
                            <span class="title_top_span">{{baseInfo.zone_count}}</span>
                        </div>
                        <div class="title_bottom">
                            <p class="title_bottom_p">小区</p>
                        </div>
                    </div>
                    </Col>
                    <Col span="4">
                    <div class="title_div">
                        <div class="title_top">
                            <span class="title_top_span">{{baseInfo.build_count}}</span>
                        </div>
                        <div class="title_bottom">
                            <p class="title_bottom_p">楼栋</p>
                        </div>
                    </div>
                    </Col>
                    <Col span="4">
                    <div class="title_div">
                        <div class="title_top">
                            <span class="title_top_span">{{baseInfo.totalArea}}㎡</span>
                        </div>
                        <div class="title_bottom">
                            <p class="title_bottom_p">总面积</p>
                        </div>
                    </div>
                    </Col>
                    <Col span="4">
                    <div class="title_div">
                        <div class="title_top">
                            <span class="title_top_span">{{baseInfo.heatArea}}㎡</span>
                        </div>
                        <div class="title_bottom">
                            <p class="title_bottom_p">供热面积</p>
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
                    项目地图
                </p>
                <div id="objectMap" style="height: 540px;background: #efefef"></div>
            </Card>
        </Row>

    </div>
</template>
<script>
    import VeMap from 'v-charts/lib/map.common';
    // 引入基本模板
    let echarts = require('echarts/lib/echarts');
    // 引入柱状图组件
    require('echarts/map/js/china');
    import {getProjectMapData,getProjectTree,getProjectBaseInfo} from '../../axios/http';
    // 引入提示框和title组件;
//    require('echarts/lib/component/tooltip');
//    require('echarts/lib/component/title');
//    require('echarts/lib/component/toolbox');
    export default {
        data () {
            return {
                baseInfo:{
                    source_plant_count:0,
                    exchange_station_count:0,
                    zone_count:0,
                    build_count:0,
                    totalArea:0,
                    heatArea:0,
                },
                objectData: {
                    columns: ['位置', '税收', '人口', '面积'],
                    rows: [
                        { '位置': '吉林', '税收': 123, '人口': 123, '面积': 92134 },
                        { '位置': '北京', '税收': 1223, '人口': 2123, '面积': 29234 },
                        { '位置': '上海', '税收': 2123, '人口': 1243, '面积': 94234 },
                        { '位置': '浙江', '税收': 4123, '人口': 5123, '面积': 29234 }
                    ]
                },
                builds:sessionStorage.getItem("builds"),


            }
        },
        components: {
          VeMap,
        },
        methods: {
            initLoginInfo(){
                this.loginInfo='欢迎你，'+this.rolename+""+this.username+" ! ";
                this.loginInfo+=this.lastLoginTime==''?'':"上次登录时间 "+this.lastLoginTime.split('.')[0]+" ";
                this.loginInfo+=this.lastLoginCity==''?'':"上次登录地点 "+this.lastLoginCity;
            },
            initObjectMap(){
                getProjectMapData(this.builds).then((response)=>{
//                    this.total=response.data.total;
//                    this.data=response.data.list;
                    var name_title = "项目分布图";
                    var subname = '气泡是对应的参与人数\n\n需要修改的自行数据库对接实时读取数据';
                    var nameColor = " rgb(55, 75, 113)";
                    var name_fontFamily = '宋体';
                    var name_fontSize = 35;
                    var mapName = 'china';
                    var data = [];
                    var geoCoordMap = {};
                    var provinces={};
                    var toolTipData = response.data.toolTipData;

                    let myChart = echarts.init(document.getElementById('objectMap'));
                    /*获取地图数据*/
                    myChart.showLoading();
                    var mapFeatures = echarts.getMap(mapName).geoJson.features;
                    myChart.hideLoading();
                    mapFeatures.forEach(function(v) {
                        // 地区名称
                        var name = v.properties.name;
                        // 地区经纬度
                        geoCoordMap[name] = v.properties.cp;
                        data.push({
                            name: name,
                            value: Math.round(Math.random() * 100 + 10)
                        });
//                        if (name=='北京') {
//                            toolTipData.push({
//                                name: name,
//                                value: [
//                                    {
//                                        name: "热源厂",
//                                        value: Math.round(Math.random() * 100 + 10)
//                                    },
//                                    {
//                                        name: "换热站",
//                                        value: Math.round(Math.random() * 100 + 10)
//                                    },
//                                    {
//                                        name: "小区",
//                                        value: Math.round(Math.random() * 100 + 10)
//                                    },
//                                    {
//                                        name: "楼栋",
//                                        value: Math.round(Math.random() * 100 + 10)
//                                    }
//                                ]
//                            })
//                        }
                    });
                    response.data.data.forEach((item,index)=>{
                        provinces[item.name]=item.value;
                       // console.log(provinces);
                    });
                   // console.log(provinces);
                    var max = 480,
                        min = 9; // todo
                    var maxSize4Pin = 50,
                        minSize4Pin = 20;

                    var convertData = function(data) {
                        var res = [];
                        for (var i = 0; i < data.length; i++) {
                            var geoCoord = geoCoordMap[data[i].name];
                            if (geoCoord) {
                                res.push({
                                    name: data[i].name,
                                    value: geoCoord.concat(data[i].value),
                                });
                            }
                        }
                        return res;
                    };
                    var convertLabelData = function(data) {
                        var res = [];

                        for (var i = 0; i < data.length; i++) {
                            var province=provinces[data[i].name];
                            if (province){
                                var geoCoord = geoCoordMap[data[i].name];
                                if (geoCoord) {
                                    res.push({
                                        name: data[i].name,
                                        value: geoCoord.concat(province),
                                    });
                                }
                            }
//                            if (data[i].name == '北京') {
//                                var geoCoord = geoCoordMap[data[i].name];
//                                if (geoCoord) {
//                                    res.push({
//                                        name: data[i].name,
//                                        value: geoCoord.concat(data[i].value),
//                                    });
//                                }
//                            }
                        }
                        return res;
                    };
                    var option = {
                        title: {
                            text: name_title,
                            subtext: '',
                            x: 'center',
                            textStyle: {
                                color: nameColor,
                                fontFamily: name_fontFamily,
                                fontSize: name_fontSize
                            }
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: function(params) {
                                //if (typeof(params.value)[2] == "undefined") {
                                    var toolTiphtml = '';
                                    for (var i = 0; i < toolTipData.length; i++) {
                                        if (params.name == toolTipData[i].name) {
                                            toolTiphtml += toolTipData[i].name + ':<br>';
                                            for (var j = 0; j < toolTipData[i].value.length; j++) {
                                                toolTiphtml += toolTipData[i].value[j].name + ':' + toolTipData[i].value[j].value + "<br>"
                                            }
                                        }
                                    }
                                    return toolTiphtml;
//                                } else {
//                                    var toolTiphtml = ''
//                                    for (var i = 0; i < toolTipData.length; i++) {
//                                        if (params.name == toolTipData[i].name) {
//                                            toolTiphtml += toolTipData[i].name + ':<br>'
//                                            for (var j = 0; j < toolTipData[i].value.length; j++) {
//                                                toolTiphtml += toolTipData[i].value[j].name + ':' + toolTipData[i].value[j].value + "<br>"
//                                            }
//                                        }
//                                    }
//                                    return toolTiphtml;
//                                }
                            }
                        },
                        legend: {
                            orient: 'vertical',
                            y: 'bottom',
                            x: 'right',
                            data: ['credit_pm2.5'],
                            textStyle: {
                                color: '#fff'
                            }
                        },
                        visualMap: {
                            show: true,
                            min: 0,
                            max: 500,
                            left: 'left',
                            top: 'bottom',
                            text: ['高', '低'], // 文本，默认为数值文本
                            calculable: true,
                            seriesIndex: [1],
                            inRange: {
                                // color: ['#3B5077', '#031525'] // 蓝黑
                                // color: ['#ffc0cb', '#800080'] // 红紫
                                // color: ['#3C3B3F', '#605C3C'] // 黑绿
                                //  color: ['#0f0c29', '#302b63', '#24243e'] // 黑紫黑
                                // color: ['#23074d', '#cc5333'] // 紫红
                                //   color: ['#00467F', '#A5CC82'] // 蓝绿
                                // color: ['#1488CC', '#2B32B2'] // 浅蓝
                                color: ['#00467F', '#A5CC82', '#ffc0cb'] // 蓝绿红
                                // color: ['#00467F', '#A5CC82'] // 蓝绿
                                // color: ['#00467F', '#A5CC82'] // 蓝绿
                                // color: ['#00467F', '#A5CC82'] // 蓝绿

                            }
                        },
                        /*工具按钮组*/
                        toolbox: {
                            show: true,
                            orient: 'vertical',
                            left: 'right',
                            top: 'center',
                            feature: {
                                dataView: {
                                    readOnly: false
                                },
                                restore: {},
                                saveAsImage: {}
                            }
                        },
                        geo: {
                            show: true,
                            map: mapName,
                            label: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: false,
                                }
                            },
                            roam: true,
                            itemStyle: {
                                normal: {
                                    areaColor: '#031525',
                                    borderColor: '#097bba',
                                },
                                emphasis: {
                                    areaColor: '#2B91B7',
                                }
                            }
                        },
                        series: [
                            {
                                name: '散点',
                                type: 'scatter',
                                coordinateSystem: 'geo',
                                data: convertData(data),
                                symbolSize: function(val) {
                                    return val[2] / 10;
                                },
                                label: {
                                    normal: {
                                        formatter: '{b}',
                                        position: 'right',
                                        show: true
                                    },
                                    emphasis: {
                                        show: true
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: '#05C3F9'
                                    }
                                }
                            },
                            {
                                type: 'map',
                                map: mapName,
                                geoIndex: 0,
                                aspectScale: 0.75, //长宽比
                                showLegendSymbol: false, // 存在legend时显示
                                label: {
                                    normal: {
                                        show: true
                                    },
                                    emphasis: {
                                        show: false,
                                        textStyle: {
                                            color: '#fff'
                                        }
                                    }
                                },
                                roam: true,
                                itemStyle: {
                                    normal: {
                                        areaColor: '#031525',
                                        borderColor: '#3B5077',
                                    },
                                    emphasis: {
                                        areaColor: '#2B91B7'
                                    }
                                },
                                animation: false,
                                data: data
                            },
                            {
                                name: '点',
                                type: 'scatter',
                                coordinateSystem: 'geo',
                                symbol: 'pin', //气泡
                                symbolSize: function(val) {
                                    var a = (maxSize4Pin - minSize4Pin) / (max - min);
                                    var b = minSize4Pin - a * min;
                                    b = maxSize4Pin - a * max;
                                    return a * val[2] + b;
                                },
                                label: {
                                    normal: {
                                        show: true,
                                        formatter: function(params) {
                                            return params.data.value[2]
                                        },
                                        textStyle: {
                                            color: '#fff',
                                            fontSize: 9,
                                        }
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: '#F62157', //标志颜色
                                    }
                                },
                                zlevel: 6,
                                data: convertLabelData(data),
                            },
//                        {
//                            name: 'Top 5',
//                            type: 'effectScatter',
//                            coordinateSystem: 'geo',
//                            data: convertData(data.sort(function(a, b) {
//                                return b.value - a.value;
//                            }).slice(0, 5)),
//                            symbolSize: function(val) {
//                                return val[2] / 10;
//                            },
//                            showEffectOn: 'render',
//                            rippleEffect: {
//                                brushType: 'stroke'
//                            },
//                            hoverAnimation: true,
//                            label: {
//                                normal: {
//                                    formatter: '{b}',
//                                    position: 'right',
//                                    show: true
//                                }
//                            },
//                            itemStyle: {
//                                normal: {
//                                    color: '#05C3F9',
//                                    shadowBlur: 10,
//                                    shadowColor: '#05C3F9'
//                                }
//                            },
//                            zlevel: 1
//                        },
                        ]
                    };
                    myChart.setOption(option);
                    myChart.on('click', (params)=>{
                       // console.log(params);
                        if (provinces[params.data.name]) {
                            getProjectTree(this.builds).then((response)=>{
                                sessionStorage.setItem("projectTreeData",JSON.stringify(response.data.result));
                                this.$store.commit('setProjectTreeData', response.data.result);
                            });
                            this.$router.push({
                                name: 'exchange_index'
                            });
                        }
                    });
                }).catch(function (error) {
                    console.log(error);
                });

            },
            initProjectBaseInfo(){
                getProjectBaseInfo(this.builds).then((response)=>{
                    this.baseInfo.source_plant_count=response.data.result.source_plant_count;
                    this.baseInfo.exchange_station_count=response.data.result.exchange_station_count;
                    this.baseInfo.zone_count=response.data.result.zone_count;
                    this.baseInfo.build_count=response.data.result.build_count;
                    this.baseInfo.totalArea=response.data.result.totalArea;
                    this.baseInfo.heatArea=response.data.result.heatArea;

                }).catch(function (error) {
                    console.log(error);
                });
            },
        },
        created(){
//            this.initObjectMap();
            //this.initChart();
            this.initProjectBaseInfo();
        },
        mounted() {
            this.initObjectMap();
        },
    }
</script>
