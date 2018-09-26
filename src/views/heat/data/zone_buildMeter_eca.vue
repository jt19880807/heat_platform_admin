<style lang="less">
    @import "../../../components/styles/home.less";
    @import "../../../components/styles/common.less";
</style>
<template>
    <div class="home-main">
        <div class="header-title-div">
            <div class="header-title" >
                {{title}}热量表能耗分析
            </div>
        </div>
        <Row>
            <div class="tools_div">
                <Row style="padding-top: 10px;margin-left: 20px;">
                    <Col span="6">
                    日期：<DatePicker :value="dateValue"
                                   type="daterange"
                                   format="yyyy/MM/dd"
                                   placement="bottom-end"
                                   split-panels
                                   style="width: 200px"
                                   @on-change="dateChange"/></Col>

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
                    <TabPane label="表格" name="name1">
                        <Table border stripe  :columns="tableColumn" :data="dayHeat" ></Table>
                    </TabPane>
                    <TabPane label="图表" name="name2">
                        <Row>
                            <ve-histogramfrom :data="contrastHeat" :settings="chartSettings"></ve-histogramfrom>
                        </Row>
                        <Row>
                            <ve-histogramfrom :data="contrastHeat" :settings="chartSettings"></ve-histogramfrom>
                        </Row>
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
                selectedTreeNode:{},
                builds:'',
                dateValue:[],
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
                tabValue:'name1',
            }
        },
        components: {
            VeHistogramfrom,
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
            },
            initDate(){
                var inDate=initDate();
                this.$set(this.dateValue,0,inDate[0]);
                this.$set(this.dateValue,1,inDate[1]);
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
            this.initDate();
            this.init();
        }
    }
</script>
