<style lang="less">
    @import "../../../components/styles/home.less";
    @import "../../../components/styles/common.less";
</style>
<template>
    <div class="home-main">
        <div class="header-title-div">
            <div class="header-title" >
                {{title}}用热数据
            </div>
        </div>
        <Row>
            <div class="tools_div">
                <Row style="padding-top: 10px;margin-left: 20px;">
                    <Col span="6">
                    日期：<DatePicker v-if="tabValue==='name1'"  :value="dayValue"
                            type="date"
                            format="yyyy/MM/dd"
                            placement="bottom-end"
                            style="width: 200px"
                            @on-change="dateChange"/>

                            <DatePicker v-if="tabValue==='name2'" :value="monthValue"
                                        type="month"
                                        format="yyyy/MM"
                                        placement="bottom-end"
                                        style="width: 200px"
                                        @on-change="dateChange"/>
                    </Col>
                    <Col span="6"></Col>
                    <Col span="6"></Col>
                    <Col span="6">
                        <Button @click="searchClick">搜索</Button>
                        <Button>导出</Button>
                    </Col>
                </Row>
            </div>
        </Row>
        <br/>
        <Row>
            <Card>
                <Tabs :value="tabValue" @on-click="tabClick">
                    <TabPane label="日用量" name="name1">
                        <Table border stripe  :columns="tableColumn" :data="dayHeat" ></Table>
                    </TabPane>
                    <TabPane label="月用量" name="name2">
                        <Table border stripe  :columns="tableColumn" :data="monthHeat" ></Table>
                    </TabPane>
                </Tabs>
            </Card>

        </Row>
    </div>
</template>
<script>
    import inforCard from '../../../components/inforCard.vue';
    import VeRing from 'v-charts/lib/ring.common';
    import VeHistogramfrom from 'v-charts/lib/histogram.common';
    import dataIcon from "../../../components/dataIcon.vue";
    import {getZoneDayHeat,getZoneMonthHeat} from '../../../axios/http';
    import {formatDate,initDate} from '../../../utils';
    export default {
        data(){
            return {
                self: this,
                lastNodeData: [],
                tableColumns: [],
                selectedTreeNode:{},
                builds:'',
                dayValue:'',
                monthValue:'',
                tableColumn:[
                    {
                        title: '楼号',
                        key: 'buildName'
                    },
                    {
                        title: '面积',
                        key: 'area'
                    },
                    {
                        title: '日累计热量',
                        key: 'useHeat'
                    },
                    {
                        title: '平均能耗',
                        key: 'avgHeat'
                    },
                    {
                        title: '累计流量',
                        key: 'useFlow'
                    },
                ],
                dayHeat:[],
                monthHeat:[],
                tabValue:'name1',
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
                var date=new Date();
                this.dayValue=formatDate(date,"yyyy/MM/dd");
                this.monthValue=formatDate(date,"yyyy/MM");
            },
            changeTableColumns () {
                this.tableColumns = this.getTableColumns();
            },
            toggleFav (index) {
                this.tableData2[index].fav = this.tableData2[index].fav === 0 ? 1 : 0;
            },
            initUseHeat(name){
                if (name==='name1') {
                    getZoneDayHeat(this.builds,
                        this.selectedTreeNode.type,
                        this.selectedTreeNode.name,
                        this.dayValue)
                        .then((respose) => {
                            this.dayHeat = respose.data.result;
                        }).catch(function (error) {
                        console.log(error);
                    });
                }
                else if(name==='name2'){
                    getZoneMonthHeat(this.builds,
                        this.selectedTreeNode.type,
                        this.selectedTreeNode.name,
                        this.monthValue+"/01")
                        .then((respose) => {
                            this.monthHeat = respose.data.result;
                        }).catch(function (error) {
                        console.log(error);
                    });
                }
            },
            searchClick(){
                this.initLastNodeData();
            },
            tabClick(name){
                this.tabValue=name;
                if (name==='name1'&&this.dayHeat.length===0) {
                    this.initUseHeat(name);
                }
                if (name==='name2'&&this.monthHeat.length===0) {
                    this.initUseHeat(name);
                }

            },
            searchClick(){
                this.initUseHeat(this.tabValue);
            },
            dateChange(date){
                if(this.tabValue==='name1'){
                    this.dayValue=date;
                }
                else {
                    this.monthValue=date;
                }
            }
        },
        mounted () {
            this.initUseHeat(this.tabValue);

        },
        watch: {
            selectedTreeNode(){
                this.initUseHeat(this.tabValue);
            },

        },
        created(){
            this.init();
        }
    }
</script>
