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
                        温度
                    </p>
                    <Row style="margin: 10px">
                        <Col span="8">
                            <Select v-model="filter_meter_error" filterable @on-change="meterErrorChange" style="width:80px">
                                <Option :value="0" >全部</Option>
                                <Option :value="1" >正常</Option>
                                <Option :value="2" >异常</Option>
                            </Select>
                        </Col>
                        <Col span="16" style="text-align: right">
                            <span>开始日期&nbsp;&nbsp;</span>
                           <DatePicker size="small" type="date" format="yyyy/MM/dd" @on-change="startDateChange" placeholder="Select date" :value="startDate"  style="width: 120px"></DatePicker>
                            <span>结束日期&nbsp;&nbsp;</span>
                            <DatePicker size="small" type="date" format="yyyy/MM/dd" @on-change="endDateChange" placeholder="Select date" :value="endDate" style="width: 120px"></DatePicker>
                            <Button type="primary" icon="ios-search" @click="searchData">查询</Button>
                            <Button type="primary" icon="ios-download-outline" @click="exportData()" v-bind:disabled="data.length==0">导出</Button>
                        </Col>
                    </Row>
                    <Row><Table size="small" border stripe ref="selection" :columns="columns" :data="data" ></Table></Row>
                    <Row style="margin: 10px">
                        <Col span="24" style="text-align: right">
                            <Page :current="currentPage" v-bind:total="total" show-total v-bind:pageSize="pageSize" @on-change="pageChange"></Page>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
    import {getAverageTemps,getProjectTreeNoChildren} from '../../../axios/http';
    import Cookies from 'js-cookie';
    export default {
        data () {
            return {
                columns: [
                    {
                        title: '项目',
                        key: 'number',
                        render: (h, params) => {
                            return h('div', [
                                h('strong', params.row.project.name)
                            ]);
                        }
                    },{
                        title: '读数日期',
                        key: 'date'
                    },
                    {
                        title: '室内平均温度',
                        key: 'indoor_averagetemp',
                        render: (h, params) => {
                            const row = params.row;
                            const color = parseInt(row.indoor_averagetemp) <16? 'red' : 'black';
                            const text = row.indoor_averagetemp ;
                            console.log(text);
                            return h('Tooltip', {
                                props: {
                                    trigger: 'hover',
                                    placement: 'left-start',
                                    transfer:true
                                }
                            }, [
                                h('div', {
                                    style: {
                                        color: color,
                                    }
                                }, text),
                                h('div', {
                                    slot: 'content'
                                }, [
                                    h('div', '室内平均温度不得低于16℃')
                                ])
                            ]);
                        }


                    },
                    {
                        title: '室外平均温度',
                        key: 'outdoor_averagetemp',

                    },
                    {
                        title: '室内最高温度',
                        key: 'indoor_maxtemp',
                        render: (h, params) => {
                            const row = params.row;
                            const color = parseInt(row.indoor_maxtemp) >24? 'red' : 'black';
                            const text = row.indoor_maxtemp ;
                            return h('Tooltip', {
                                props: {
                                    trigger: 'hover',
                                    placement: 'left-start',
                                    transfer:true
                                }
                            }, [
                                h('div', {
                                    style: {
                                        color: color,
                                    }
                                }, text),
                                h('div', {
                                    slot: 'content'
                                }, [
                                    h('div', '室外最高温度不得高于24℃')
                                ])
                            ]);
                        }
                    },
                    {
                        title: '室内最低温度',
                        key: 'indoor_mintemp',
                        render: (h, params) => {
                            const row = params.row;
                            const color = parseInt(row.indoor_mintemp) <18? 'red' : 'black';
                            const text = row.indoor_mintemp ;
                            return h('Tooltip', {
                                props: {
                                    trigger: 'hover',
                                    placement: 'left-start',
                                    transfer:true
                                }
                            }, [
                                h('div', {
                                    style: {
                                        color: color,
                                    }
                                }, text),
                                h('div', {
                                    slot: 'content'
                                }, [
                                    h('div', '室内最低温度不得低于18℃')
                                ])
                            ]);
                        }
                    },
                    {
                        title: '室内平均湿度',
                        key: 'indoor_averagehumidity'
                    }
                ],
                data: [],
                treeData:[],
                currentPage:1,//当前页码
                pageSize:20,//每页数据量
                total:0,//数据总量
                tree_project_id:0,//筛选过滤的
                defaultProjectId:0,//默认加载第一个项目
                startDate:'',
                endDate:'',
                filter_meter_error:0,
            }
        },
        methods: {
            //加载数据
            initAverageTemps(projectId,num){
                getAverageTemps(projectId,this.filter_meter_error,this.startDate,this.endDate+" 23:59:59",num,this.pageSize)
                    .then((response)=>{
                    this.total=response.data.total;
                    this.data=response.data.list;
                }).catch(function (error) {
                    console.log(error);
                });
            },
            initProjectTree(){
                getProjectTreeNoChildren(Cookies.get("projects")).then((response)=>{
                    this.total=response.data.total;
                    this.treeData=response.data.result;
                    this.defaultProjectId=this.treeData[0].id;
                    this.tree_project_id = this.treeData[0].id;
                    this.initAverageTemps(this.defaultProjectId,1);
                }).catch(function (error) {
                    console.log(error);
                });
            },
            initDate(){
                var date=new Date();
                this.startDate=date.getFullYear()+"/"+(date.getMonth()+1)+"/01";
                this.endDate=date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate();
            },
            pageChange(page){
                this.currentPage=page;
                this.initAverageTemps(this.tree_project_id);
            },
            treeSelectChange(option) {
                if (option.length > 0) {
                    this.tree_project_id = option[0].id;
                    this.initAverageTemps(this.tree_project_id);
                }
            },
            searchData(){
                this.currentPage=1;
                this.initAverageTemps(this.tree_project_id,1);
            },
            startDateChange(date){
              this.startDate=date;
            },
            endDateChange(date){
                this.endDate=date;
            },
            //导出数据
            exportData(){
                window.location.href="http://192.168.5.21:8082/averageTemps/export?projectId="+this.tree_project_id+"&errorCode="+this.filter_meter_error+"&startDate="+this.startDate+"&endDate="+this.endDate+" 23:59:59";
            },
            meterErrorChange(option){
                this.currentPage=1;
                this.filter_meter_error=option;
                this.initAverageTemps(this.tree_project_id, 1);
            },
        },
        created(){
            this.initDate();
            this.initProjectTree();
        }

    }
</script>
