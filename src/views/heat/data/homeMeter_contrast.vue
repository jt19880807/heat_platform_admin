<style lang="less">
    @import "../../../components/styles/home.less";
    @import "../../../components/styles/common.less";
</style>
<template>
    <div class="home-main">
        <div class="header-title-div">
            <div class="header-title" >
                明光1号楼对比分析
            </div>
        </div>
        <Row>
            <div class="tools_div">
                <Row style="padding-top: 10px;margin-left: 20px;">
                    <Col span="6">
                    查询时间：<DatePicker type="daterange" split-panels placeholder="Select date" style="width: 200px"></DatePicker>
                    </Col>
                    <Col span="6"></Col>
                    <Col span="6"></Col>
                    <Col span="6">
                    <Button>搜索</Button>
                    </Col>
                </Row>
            </div>
        </Row>
        <br/>
        <Row>
            <Table border stripe  :columns="columns" :data="data" ></Table>
        </Row>
        <Row>
            <ve-histogramfrom :data="areaHeatBarData" ></ve-histogramfrom>
        </Row>
    </div>
</template>
<script>
    import inforCard from '../../../components/inforCard.vue';
    import VeRing from 'v-charts/lib/ring.common';
    import VeHistogramfrom from 'v-charts/lib/histogram.common';
    import dataIcon from "../../../components/dataIcon.vue";
    export default {
        data(){
            return {
                columns: [
                    {
                        title: '小区名',
                        key: 'name',
                        align: 'center',
                        width: 200,
                    },
                    {
                        title: '开始时间',
                        align: 'center',
                        key: 'startDate',
                    },
                    {
                        title: '结束时间',
                        align: 'center',
                        key: 'endDate',
                    },
                    {
                        title: '总热耗',
                        align: 'center',
                        key: 'totalHeat',
                    },
                    {
                        title: '去年总热耗',
                        align: 'center',
                        key: 'quNianHeat',
                    },
                    {
                        title: '前年总热耗',
                        align: 'center',
                        key: 'qianNianHeat',
                    }
                ],
                self: this,
                data: [
                    {
                        name: "明光小区",
                        startDate: "2018-08-01",
                        endDate: "2018-08-30",
                        totalHeat: 135,
                        quNianHeat: 121,
                        qianNianHeat: 156,
                    }
                ],
                tableColumns: [],
                tableColumnsChecked: ['grzt', 'jlfs', 'bh', 'ljrl', 'rgl', 'ljll', 'ssll', 'gswd', 'hswd', 'wc', 'dyzt','cbsj'],
                value1:45,
                value2:50,
                areaHeatBarData:{
                    columns: ['title', '用热量'],
                    rows: [
                        { 'title': '今年总热耗', '用热量': 135},
                        { 'title': '去年总热耗', '用热量': 121 },
                        { 'title': '前年总热耗', '用热量': 156 }
                    ]
                },
            }
        },
        components: {
            VeHistogramfrom,
        },
        methods:{
            mockTableData () {
                let data = [];
                function getNum() {
                    return Math.floor(Math.random () * 10000 + 1);
                }
                data.push({
                    name: "明光小区",
                    all_heat: getNum(),
                    all_area: getNum(),
                    all_avg: getNum()+"%",
                    side_heat: getNum(),
                    side_area: getNum(),
                    side_avg: getNum()+"%",
                    top_heat: getNum(),
                    top_area: getNum(),
                    top_avg: getNum()+"%",
                });
                for (let i = 0; i < 5; i++) {
                    data.push({
                        name: (i+1)+"号楼",
                        all_heat: getNum(),
                        all_area: getNum(),
                        all_avg: getNum()+"%",
                        side_heat: getNum(),
                        side_area: getNum(),
                        side_avg: getNum()+"%",
                        top_heat: getNum(),
                        top_area: getNum(),
                        top_avg: getNum()+"%",
                    });
                }
                return data;
            },
            getTableColumns () {
                const tableColumnList = {
                    fj:{
                        title: '房间',
                        key: 'fj'
                    },
                    hz:{
                        title: '户主',
                        key: 'hz'
                    },
                    fjwz:{
                        title: '房间位置',
                        key: 'fjwz',
                    },
                    grmj:{
                        title: '供热面积',
                        key: 'grmj'
                    },
                    grzt:{
                        title: '供热状态',
                        key: 'grzt'
                    },
                    jlfs:{
                        title: '计量方式',
                        key: 'jlfs'
                    },
                    bh:{
                        title: '表号',
                        key: 'bh'
                    },
                    ljrl:{
                        title: '累积热量',
                        key: 'ljrl'
                    },
                    rgl:{
                        title: '热功率',
                        key: 'rgl'
                    },
                    ljll:{
                        title: '累积流量',
                        key: 'ljll'
                    },
                    ssll:{
                        title: '瞬时流量',
                        key: 'ssll'
                    },
                    gswd:{
                        title: '供水温度',
                        key: 'gswd'
                    },
                    hswd:{
                        title: '回水温度',
                        key: 'hswd'
                    },
                    wc:{
                        title: '温差',
                        key: 'wc'
                    },
                    dyzt:{
                        title: '电压状态',
                        key: 'dyzt'
                    },
                    cbsj:{
                        title: '抄表时间',
                        key: 'cbsj'
                    }
                };

                let data = [tableColumnList.fj,tableColumnList.hz,tableColumnList.fjwz,tableColumnList.grmj];

                this.tableColumnsChecked.forEach(col => data.push(tableColumnList[col]));

                return data;
            },
            changeTableColumns () {
                this.tableColumns = this.getTableColumns();
            },
            toggleFav (index) {
                this.tableData2[index].fav = this.tableData2[index].fav === 0 ? 1 : 0;
            }
        },
        mounted () {
            this.changeTableColumns();
        },
        created(){

        }
    }
</script>
