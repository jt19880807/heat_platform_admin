<style lang="less">
    @import "../../../components/styles/home.less";
    @import "../../../components/styles/common.less";
</style>
<template>
    <div class="home-main">
        <div class="header-title-div">
            <div class="header-title" >
                {{title}}大表能耗分析
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
                                   transfer="true"
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
            <Card>
                <Tabs :value="tabValue" @on-click="tabClick">
                    <TabPane label="表格" name="name1">
                        <Table border stripe  :columns="tableColumn" :data="ecaData" ref="table"></Table>
                    </TabPane>
                    <TabPane label="图表" name="name2">
                        <Row>
                            <ve-histogramfrom :data="contrastHeat1" :settings="chartSettings"></ve-histogramfrom>
                        </Row>
                        <Row>
                            <ve-histogramfrom :data="contrastHeat2" :settings="chartSettings2"></ve-histogramfrom>
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
    import {getMeterECA} from '../../../axios/http';
    import {formatDate,initDate} from '../../../utils';
    export default {
        data(){
            return {
                self: this,
                ecaData: [],
                selectedTreeNode:{},
                builds:'',
                dateValue:[],
                tableColumn:[
                    {
                        title: '表号',
                        key: 'meter_addr'
                    },
                    {
                        title: '楼号',
                        key: 'b_name'
                    },
                    {
                        title: '供热面积(㎡)',
                        key: 'area'
                    },
                    {
                        title: '用热量(MWH)',
                        key: 'useHeat'
                    },
                    {
                        title: '单位能耗(MWH/㎡)',
                        key: 'avgHeat'
                    },
                    {
                        title: '平均进水温度(℃)',
                        key: 'avg_in_temp'
                    },
                    {
                        title: '平均回水温度(℃)',
                        key: 'avg_out_temp'
                    },
                ],
                tabValue:'name1',
                contrastHeat1:{
                    columns: ['meter_addr', 'area', 'useHeat'],
                    rows: [
                    ]
                },
                contrastHeat2:{
                    columns: ['meter_addr', 'avgHeat'],
                    rows: [
                    ]
                },
                chartSettings:{
                    axisSite: { right: ['useHeat'] },
                    labelMap: {
                        'area': '面积',
                        'useHeat': '用热量',
                    }
                },
                chartSettings2:{
                    labelMap: {
                        'avgHeat': '单位能耗'
                    }
                },
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
            },
            initDate(){
                var inDate=initDate();
                this.$set(this.dateValue,0,inDate[0]);
                this.$set(this.dateValue,1,inDate[1]);
            },
            initECAData(){
                getMeterECA(this.selectedTreeNode.id,
                    0,
                    0,
                    this.dateValue[0],
                    this.dateValue[1],)
                    .then((respose)=>{
                        this.ecaData=respose.data.result;
                        this.contrastHeat1.rows=respose.data.result;
                        this.contrastHeat2.rows=respose.data.result;
                    }).catch(function (error) {
                    console.log(error);
                });
            },
            exportClick(){
                this.$refs.table.exportCsv({
                    filename: this.selectedTreeNode.name+"大表能耗分析"
                });
            },
            tabClick(name){
            },
            searchClick(){
                this.initECAData();
            },
            dateChange(date){
                this.dayValue=date;
            }
        },
        mounted(){
            this.initECAData();
        },
        watch: {
            selectedTreeNode(){
                this.initECAData();
            },

        },
        created(){
            this.initDate();
            this.init();
        }
    }
</script>
