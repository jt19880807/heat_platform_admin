<template>
    <div>
        <Row>
            <Col span="4">
                <Card>
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        项目列表
                    </p>
                    <Tree :data="treeData" @on-select-change="treeSelectChange"></Tree>
                </Card>
            </Col>
            <Col span="20">
                <Card>
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        历史数据
                    </p>
                    <Row style="margin: 10px">
                        <Col span="24" style="text-align: right">
                            <span>开始日期&nbsp;&nbsp;</span>
                           <DatePicker size="small" type="date" format="yyyy/MM/dd" @on-change="startDateChange" placeholder="Select date" :value="startDate"  style="width: 120px"></DatePicker>
                            <span>结束日期&nbsp;&nbsp;</span>
                            <DatePicker size="small" type="date" format="yyyy/MM/dd" @on-change="endDateChange" placeholder="Select date" :value="endDate" style="width: 120px"></DatePicker>
                            &nbsp;&nbsp;
                             <Button type="primary" icon="ios-search" @click="searchData">查询</Button>
                            <Button type="primary" icon="ios-download-outline" @click="exportData()" v-bind:disabled="data.length==0">导出</Button>
                        </Col>
                    </Row>
                    <Row>
                        <!--<Col span="8">-->
                        <!--&nbsp;&nbsp;-->
                        <!--</Col>-->
                        <!--<Col span="8">-->
                            <!--<Table border stripe :columns="columns" :data="data"  ></Table>-->

                        <!--</Col>-->
                        <!--<Col span="8" style="text-align: right">-->
                            <!--<Button type="primary" shape="circle" icon="minus-round" v-if="historyCount!==2" @click="minusHistory"></Button>-->
                        <!--&nbsp;&nbsp;<Button type="primary" shape="circle" icon="plus-round" v-if="historyCount!==5" @click="addHistory"></Button>-->
                        <!--</Col>-->
                        <Tabs value="name1">
                            <TabPane label="表格" icon="ios-list" name="name1">
                                <Col span="22">
                                <Table :loading="loading" border stripe :columns="columns" :data="data" size="small" ></Table>
                                </Col>
                                <Col span="2">
                                &nbsp;&nbsp;
                                <Button type="primary" shape="circle" icon="minus-round" v-if="historyCount!==2" @click="minusHistory"></Button>
                                <Button type="primary" shape="circle" icon="plus-round" v-if="historyCount!==5" @click="addHistory"></Button>
                                </Col>
                            </TabPane>
                            <TabPane label="图表" icon="stats-bars" name="name2">
                                <Row>
                                    <Col span="12">
                                        <Card >
                                            <p slot="title">
                                                <Icon type="ios-film-outline"></Icon>
                                                耗热量
                                            </p>

                                            <div id="div_hrl" style="height: 260px"></div>
                                        </Card>
                                    </Col>
                                    <Col span="12">
                                        <Card >
                                            <p slot="title">
                                                <Icon type="ios-film-outline"></Icon>
                                                耗电量
                                            </p>
                                            <div id="div_hdl" style="height: 260px"></div>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                    <Card >
                                        <p slot="title">
                                            <Icon type="ios-film-outline"></Icon>
                                            室内温度
                                        </p>

                                        <div id="div_snwd" style="height: 260px"></div>
                                    </Card>
                                    </Col>
                                    <Col span="12">
                                    <Card >
                                        <p slot="title">
                                            <Icon type="ios-film-outline"></Icon>
                                            室外温度
                                        </p>
                                        <div id="div_swwd" style="height: 260px"></div>
                                    </Card>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                    <Card >
                                        <p slot="title">
                                            <Icon type="ios-film-outline"></Icon>
                                            室内湿度
                                        </p>

                                        <div id="div_snsd" style="height: 260px"></div>
                                    </Card>
                                    </Col>

                                </Row>
                            </TabPane>
                        </Tabs>
                    </Row>
                </Card>
            </Col>
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
    require('echarts/theme/macarons');
    import {getHisttoryData,getProjectTreeNoChildren} from '../../../axios/http';
    import Cookies from 'js-cookie';
    export default {
        data () {
            return {
                treeData:[],
                tree_project_id:0,//筛选过滤的
                defaultProjectId:0,//默认加载第一个项目
                startDate:'',
                endDate:'',
                data:[],//返回的数据
                historyCount:2,
                columns: [],
                loading:true,
                xAxis:[],
            }
        },
        methods: {
            getColumns(){
                //this.columns.
                let data=[{
                        title: ' ',
                        key: 'key',
                        width:140,
                    }];
                var startYear='';
                if (this.startDate==undefined){
                    let date=new Date();
                    startYear=date.getFullYear();
                }
                else {
                    startYear=this.startDate.split('/')[0];
                }
                this.xAxis=[];
                for (var i=0;i<this.historyCount;i++){
                    data.push({
                        title:startYear-i,
                        key: 'value'+i,
                    });
                    this.xAxis.push(startYear-i);
                }
                return data;
            },
            //加载数据
            initHistorDatas(projectId){
                getHisttoryData(projectId,this.startDate,this.endDate+" 23:59:59",this.historyCount)
                    .then((response)=>{
                   this.data=response.data.result;
                   this.loading=false;
                   this.initCharts();
                }).catch(function (error) {
                    console.log(error);
                });
            },
            initProjectTree(){
                getProjectTreeNoChildren(Cookies.get("projects")).then((response)=>{
                    this.treeData=response.data.result;
                    this.tree_project_id = this.treeData[0].id;
                    this.defaultProjectId=this.treeData[0].id;
                    this.initHistorDatas(this.defaultProjectId);
                }).catch(function (error) {
                    console.log(error);
                });
            },
            initDate(){
                var date=new Date();
                this.startDate=date.getFullYear()+"/"+(date.getMonth()+1)+"/01";
                this.endDate=date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate();
            },
            treeSelectChange(option) {
                if (option.length > 0) {
                    this.tree_project_id = option[0].id;
                    this.initHistorDatas(this.tree_project_id);
                }
            },
            searchData(){
                this.changeColums();
                this.initHistorDatas(this.tree_project_id);
            },
            startDateChange(date){
              this.startDate=date;
            },
            endDateChange(date){
                this.endDate=date;
            },
            addHistory(){
                this.historyCount+=1;
                this.changeColums();
                this.initCharts();
            },
            minusHistory(){
                this.historyCount-=1;
                this.changeColums();
                this.initCharts();
            },
            changeColums(){
                this.columns=this.getColumns();
            },
            filteryAxis(index){
                var filterData=this.data[index];
                var yAxis=[];
                for (var i=0;i<this.historyCount;i++){
                    yAxis.push(filterData["value"+i]==='暂无数据'?null:filterData["value"+i]);
                }
                return yAxis;
            },
            filteryHumidity(index){
                var filterData=this.data[index];
                var yAxis=[];
                for (var i=0;i<this.historyCount;i++){
                    yAxis.push(filterData["value"+i]==='暂无数据'?null:filterData["value"+i].split('%')[0]);
                }
                console.log(yAxis);
                return yAxis;
            },
            //加载耗热量图表
            initHeatChart(){
                var option = {
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['耗热量']
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            mark : {show: true},
                            magicType : {show: true, type: ['line', 'bar']},
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            data : this.xAxis,
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'耗热量',
                            type:'line',
                            data:this.filteryAxis(0),
                            markPoint : {
                                data : [
                                    {type : 'max', name: '最大值'},
                                    {type : 'min', name: '最小值'}
                                ]
                            },
                            markLine : {
                                data : [
                                    {type : 'average', name: '平均值'}
                                ]
                            }
                        }
                    ]
                };
                let heatChart = echarts.init(document.getElementById('div_hrl'),'macarons');
                heatChart.setOption(option);
            },
            //加载耗电量图表
            initElectricityChart(){
                var option = {
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['耗电量']
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            mark : {show: true},
                            magicType : {show: true, type: ['line', 'bar']},
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            data : this.xAxis,
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'耗电量',
                            type:'line',
                            data:this.filteryAxis(1),
                            markPoint : {
                                data : [
                                    {type : 'max', name: '最大值'},
                                    {type : 'min', name: '最小值'}
                                ]
                            },
                            markLine : {
                                data : [
                                    {type : 'average', name: '平均值'}
                                ]
                            }
                        }
                    ]
                };
                let heatChart = echarts.init(document.getElementById('div_hdl'),'macarons');
                heatChart.setOption(option);
            },
            //加载室内温度图表
            initIndoorTempChart(){
                var option = {
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['室内最高温度','室内最低温度','室内平均温度']
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            mark : {show: true},
                            magicType : {show: true, type: ['line', 'bar']},
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            data : this.xAxis,
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'室内最高温度',
                            type:'line',
                            data:this.filteryAxis(3),
                            markPoint : {
                                data : [
                                    {type : 'max', name: '最大值'},
                                    {type : 'min', name: '最小值'}
                                ]
                            }
                        },
                        {
                            name:'室内最低温度',
                            type:'line',
                            data:this.filteryAxis(4),
                            markPoint : {
                                data : [
                                    {type : 'max', name: '最大值'},
                                    {type : 'min', name: '最小值'}
                                ]
                            }
                        },
                        {
                            name:'室内平均温度',
                            type:'line',
                            data:this.filteryAxis(2),
                            markPoint : {
                                data : [
                                    {type : 'max', name: '最大值'},
                                    {type : 'min', name: '最小值'}
                                ]
                            }
                        }

                    ]
                };
                let heatChart = echarts.init(document.getElementById('div_snwd'),'macarons');
                heatChart.setOption(option);
            },
            //加载室外温度图表
            initOutdoorTempChart(){
                var option = {
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['室外最高温度','室外最低温度','室外平均温度']
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            mark : {show: true},
                            magicType : {show: true, type: ['line', 'bar']},
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            data : this.xAxis,
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'室外最高温度',
                            type:'line',
                            data:this.filteryAxis(6),
                            markPoint : {
                                data : [
                                    {type : 'max', name: '最大值'},
                                    {type : 'min', name: '最小值'}
                                ]
                            }
                        },
                        {
                            name:'室外最低温度',
                            type:'line',
                            data:this.filteryAxis(7),
                            markPoint : {
                                data : [
                                    {type : 'max', name: '最大值'},
                                    {type : 'min', name: '最小值'}
                                ]
                            }
                        },
                        {
                            name:'室外平均温度',
                            type:'line',
                            data:this.filteryAxis(5),
                            markPoint : {
                                data : [
                                    {type : 'max', name: '最大值'},
                                    {type : 'min', name: '最小值'}
                                ]
                            }
                        }

                    ]
                };
                let heatChart = echarts.init(document.getElementById('div_swwd'),'macarons');
                heatChart.setOption(option);
            },
            //加载室内湿度图表
            initIndoorHumidityChart(){
                var option = {
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['室内最高湿度','室内最低湿度','室内平均湿度']
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            mark : {show: true},
                            magicType : {show: true, type: ['line', 'bar']},
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            data : this.xAxis,
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'室内最高湿度',
                            type:'line',
                            data:this.filteryHumidity(9),
                            markPoint : {
                                data : [
                                    {type : 'max', name: '最大值'},
                                    {type : 'min', name: '最小值'}
                                ]
                            }
                        },
                        {
                            name:'室内最低湿度',
                            type:'line',
                            data:this.filteryHumidity(10),
                            markPoint : {
                                data : [
                                    {type : 'max', name: '最大值'},
                                    {type : 'min', name: '最小值'}
                                ]
                            }
                        },
                        {
                            name:'室内平均湿度',
                            type:'line',
                            data:this.filteryHumidity(8),
                            markPoint : {
                                data : [
                                    {type : 'max', name: '最大值'},
                                    {type : 'min', name: '最小值'}
                                ]
                            }
                        }

                    ]
                };
                let heatChart = echarts.init(document.getElementById('div_snsd'),'macarons');
                heatChart.setOption(option);
            },
            initCharts(){
                this.initHeatChart();
                this.initElectricityChart();
                this.initIndoorTempChart();
                this.initOutdoorTempChart();
                this.initIndoorHumidityChart();
            },
            //导出数据
            exportData(){
                window.location.href="http://192.168.5.21:8082/historydata/export?projectId="+this.tree_project_id+"&startDate="+this.startDate+"&endDate="+this.endDate+" 23:59:59&count="+this.historyCount;
            }
        },
        created(){
            this.initDate();
            this.changeColums();
            this.initProjectTree();
        }

    }
</script>
