<style lang="less">
    @import "../../../components/styles/home.less";
    @import "../../../components/styles/common.less";
</style>
<template>
    <div class="home-main">
        <div class="header-title-div">
            <div class="header-title" >
                {{title}} 大表读数
            </div>
        </div>
        <Row>
            <div class="tools_div">
                <Row style="padding-top: 10px;margin-left: 20px;">
                    <Col span="6">
                        楼栋：
                        <Select v-model="currentBuild" style="width:200px">
                            <Option value="0" key="0">全部</Option>
                            <Option v-for="item in builds" :value="item.id" :key="item.id">{{ item.title }}</Option>
                        </Select>
                    </Col>
                    <Col span="6">查询时间：<DatePicker :value="dateValue"
                                                   type="daterange"
                                                   format="yyyy/MM/dd"
                                                   placement="bottom-end"
                                                   split-panels
                                                   style="width: 200px"
                                                   @on-change="dateChange"/></Col>
                    <Col span="6"></Col>
                    <Col span="6">
                    <Button @click="searchClick">搜索</Button>
                    <Button @click="exportClick">导出</Button>
                    </Col>
                </Row>
            </div>
        </Row>
        <br/>
        <Row>
            <Table border stripe  :columns="tableColumns" :data="meterData" ref="table"></Table>
        </Row>
        <Row style="margin: 10px">
            <Col span="8">
            &nbsp;
            </Col>
            <Col span="16" style="text-align: right">
            <Page :total="page.total" :current="page.currentPage" show-total  :pageSize="page.pageSize"
                  @on-change="pageChange"/>
            </Col>
        </Row>
    </div>
</template>
<script>
    import inforCard from '../../../components/inforCard.vue';
    import VeRing from 'v-charts/lib/ring.common';
    import VeHistogramfrom from 'v-charts/lib/histogram.common';
    import dataIcon from "../../../components/dataIcon.vue";
    import {formatDate,initDate} from '../../../utils';
    import {getMeterData} from '../../../axios/http';
    export default {
        data(){
            return {
                self: this,
                meterData: [],
                tableColumns:[
                    {
                        title: '表号',
                        key: 'meter_addr',
                        align: 'center',
                    },
                    {
                        title: '所在位置',
                        key: 'b_name',
                        align: 'center',
                    },
                    {
                        title: '类型',
                        key: 'meter_type',
                        align: 'center',
                    },
                    {
                        title: '累积热量(MWH)',
                        key: 'cu_heat',
                        align: 'center',
                    },
                    {
                        title: '热功率(KW)',
                        key: 'heat_power',
                        align: 'center',
                    },
                    {
                        title: '瞬时流量(m³/h)',
                        key: 'flow_rate',
                        align: 'center',
                    },
                    {
                        title: '累积流量(m³)',
                        key: 'cu_flow',
                        align: 'center',
                    },
                    {
                        title: '进水温度(℃)',
                        key: 'entrance_temp',
                        align: 'center',
                    },
                    {
                        title: '回水温度(℃)',
                        key: 'exit_temp',
                        align: 'center',
                    },
                    {
                        title: '温差(℃)',
                        key: 'diff_temp',
                        align: 'center',
                    },
                    {
                        title: '累积工作时间(h)',
                        key: 'hours',
                        align: 'center',
                    },
//                    {
//                        title: '电池状态',
//                        key: 'battery_status',
//                        align: 'center',
//                    },
                    {
                        title: '采集时间',
                        key: 'meter_datatime',
                        align: 'center',
                    },

                ],
                dateValue:[],
                selectedTreeNode:{},
                page:{
                    currentPage:1,//当前页码
                    pageSize:10,//每页数据量
                    total:0,//数据总量
                },
                currentBuild:"0",
                builds:[],
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
            },
            initBuilds(){
                let data=[];
                this.selectedTreeNode.children.forEach((c)=>{data.push(c)});
                this.builds=data;
            },
            initDate(){
                var inDate=initDate();
                this.$set(this.dateValue,0,inDate[0]);
                this.$set(this.dateValue,1,inDate[1]);
            },
            initMeterData(){
//                console.log(this.currentBuild);
                getMeterData(this.selectedTreeNode.id,
                    this.currentBuild,
                    0,
                    this.dateValue[0],
                    this.dateValue[1],
                    this.page.currentPage,
                    this.page.pageSize)
                    .then((respose)=>{
                        this.page.total=respose.data.total;
                        this.meterData=respose.data.list;
                    }).catch(function (error) {
                    console.log(error);
                });
            },
            searchClick(){
                this.initMeterData();
            },
            pageChange(page){
                this.page.currentPage=page;
                this.initMeterData();
            },
            dateChange(date1,date2){
                this.$set(this.dateValue,0,date1[0]);
                this.$set(this.dateValue,1,date1[1]);
            },
            exportClick(){
                this.$refs.table.exportCsv({
                    filename: this.selectedTreeNode.name+"大表读数"
                });
            },
        },
        mounted () {
            this.init();
        },
        watch: {
            selectedTreeNode(){
                this.initBuilds();
                this.initMeterData();
            },

        },
        created(){
            this.initDate();
        }
    }
</script>
