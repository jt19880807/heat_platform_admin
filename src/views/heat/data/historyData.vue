<style lang="less">
    @import "../../../components/styles/home.less";
    @import "../../../components/styles/common.less";
</style>
<template>
    <div class="home-main">
        <div class="header-title-div">
            <div class="header-title" >
                {{title}} 历史数据
            </div>
        </div>
        <Row>
            <div class="tools_div">
                <Row style="padding-top: 10px;margin-left: 20px;">
                    <Col span="6">
                    查询时间：<DatePicker :value="dateValue"
                                     type="daterange"
                                     format="yyyy/MM/dd"
                                     placement="bottom-end"
                                     split-panels
                                     style="width: 200px"
                                     @on-change="dateChange"/>
                    </Col>
                    <Col span="6"></Col>
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
            <Table border stripe  :columns="tableColumns" :data="historyData" ref="table"></Table>
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
    import {getHistoryNodeData} from '../../../axios/http';
    export default {
        data(){
            return {
                self: this,
                historyData: [],
                tableColumns: [],
                tableColumnsChecked: [ 'charge_mode', 'heat_met_addr', 'cu_heat', 'heat_power', 'cu_flow', 'instant_flowrate', 'entrance_temp', 'exit_temp', 'diff_temp', 'battery_status','add_time'],
                dateValue:[],
                selectedTreeNode:{},
                builds:'',
                page:{
                    currentPage:1,//当前页码
                    pageSize:10,//每页数据量
                    total:0,//数据总量
                },
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
            getTableColumns () {
                const tableColumnList = {
                    b_name:{
                        title: '楼号',
                        key: 'b_name'
                    },
                    user_code:{
                        title: '房间',
                        key: 'user_code'
                    },
                    host_name:{
                        title: '户主',
                        key: 'host_name'
                    },
                    location:{
                        title: '房间位置',
                        key: 'location',
                    },
                    area:{
                        title: '供热面积',
                        key: 'area'
                    },
                    charge_mode:{
                        title: '计量方式',
                        key: 'charge_mode'
                    },
                    heat_met_addr:{
                        title: '表号',
                        key: 'heat_met_addr'
                    },
                    cu_heat:{
                        title: '累积热量',
                        key: 'cu_heat'
                    },
                    heat_power:{
                        title: '热功率',
                        key: 'heat_power'
                    },
                    cu_flow:{
                        title: '累积流量',
                        key: 'cu_flow'
                    },
                    instant_flowrate:{
                        title: '瞬时流量',
                        key: 'instant_flowrate'
                    },
                    entrance_temp:{
                        title: '供水温度',
                        key: 'entrance_temp'
                    },
                    exit_temp:{
                        title: '回水温度',
                        key: 'exit_temp'
                    },
                    diff_temp:{
                        title: '温差',
                        key: 'diff_temp'
                    },
                    battery_status: {
                        title: '电压状态',
                        key: 'battery_status'
                    },
                    add_time:{
                        title: '抄表时间',
                        key: 'add_time'
                    }
                };
                let data = [];
                if (this.selectedTreeNode.type==="3"){
                    data.push(tableColumnList.b_name);
                }
                data.push(tableColumnList.user_code,tableColumnList.host_name,tableColumnList.location,tableColumnList.area);
                this.tableColumnsChecked.forEach(col => data.push(tableColumnList[col]));
                return data;
            },
            changeTableColumns () {
                this.tableColumns = this.getTableColumns();
            },
            toggleFav (index) {
                this.tableData2[index].fav = this.tableData2[index].fav === 0 ? 1 : 0;
            },
            initDate(){
                var inDate=initDate();
                this.$set(this.dateValue,0,inDate[0]);
                this.$set(this.dateValue,1,inDate[1]);
            },
            initHistoryData(){
                getHistoryNodeData(this.builds,
                    this.selectedTreeNode.type,
                    this.selectedTreeNode.name,
                    this.dateValue[0],
                    this.dateValue[1],
                    this.page.currentPage,
                    this.page.pageSize)
                    .then((respose)=>{
                        this.page.total=respose.data.total;
                        this.historyData=respose.data.list;
                        //console.log(this.page.total);
                    }).catch(function (error) {
                    console.log(error);
                });
            },
            searchClick(){
                this.initHistoryData();
            },
            pageChange(page){
                this.page.currentPage=page;
                this.initHistoryData();
            },
            dateChange(date1,date2){
                this.$set(this.dateValue,0,date1[0]);
                this.$set(this.dateValue,1,date1[1]);
            },
            exportClick(){
                this.$refs.table.exportCsv({
                    filename: this.selectedTreeNode.name+"历史数据"
                });
            },
        },
        mounted () {
            this.init();
            this.changeTableColumns();
        },
        watch: {
            selectedTreeNode(){
                this.initHistoryData();
            },

        },
        created(){
            this.initDate();
        }
    }
</script>
