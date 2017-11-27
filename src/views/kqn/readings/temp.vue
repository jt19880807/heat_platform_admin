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
                        <Col span="24" style="text-align: right">
                            <span>开始日期&nbsp;&nbsp;</span>
                           <DatePicker size="small" type="date" format="yyyy/MM/dd" @on-change="startDateChange" placeholder="Select date" :value="startDate"  style="width: 120px"></DatePicker>
                            <span>结束日期&nbsp;&nbsp;</span>
                            <DatePicker size="small" type="date" format="yyyy/MM/dd" @on-change="endDateChange" placeholder="Select date" :value="endDate" style="width: 120px"></DatePicker>
                            &nbsp;&nbsp;
                             <Button type="primary" icon="ios-search" @click="searchData">查询</Button>
                        </Col>
                    </Row>
                    <Row><Table border stripe ref="selection" :columns="columns" :data="data" ></Table></Row>
                    <Row style="margin: 10px">
                        <Col span="24" style="text-align: right">
                            <Page v-bind:total="total" show-total v-bind:pageSize="pageSize" @on-change="pageChange"></Page>
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
                                h('strong', params.row.project.Name)
                            ]);
                        }
                    },{
                        title: '读数日期',
                        key: 'date'
                    },
                    {
                        title: '室内平均温度',
                        key: 'indoor_averagetemp'
                    },
                    {
                        title: '室外平均温度',
                        key: 'outdoor_averagetemp'
                    },
                    {
                        title: '室内最高温度',
                        key: 'indoor_maxtemp'
                    },
                    {
                        title: '室内最低温度',
                        key: 'indoor_mintemp'
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

            }
        },
        methods: {
            //加载数据
            initAverageTemps(projectId){
                getAverageTemps(projectId,this.startDate,this.endDate+" 23:59:59",this.currentPage,this.pageSize)
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
                    this.initAverageTemps(this.defaultProjectId);
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
                this.initAverageTemps(this.tree_project_id);
            },
            startDateChange(date){
              this.startDate=date;
            },
            endDateChange(date){
                this.endDate=date;
            },
        },
        created(){
            this.initDate();
            this.initProjectTree();
        }

    }
</script>
