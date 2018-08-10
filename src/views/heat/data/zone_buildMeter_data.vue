<style lang="less">
    @import "../../../components/styles/home.less";
    @import "../../../components/styles/common.less";
</style>
<template>
    <div class="home-main">
        <div class="header-title-div">
            <div class="header-title" >
                明光1号楼大表实时数据
            </div>
        </div>
        <Row>
            <div class="tools_div">
                <Row style="padding-top: 10px;margin-left: 20px;">
                    <Col span="6">
                    进水温度：<Input-number :max="100" :min="1" v-model="value1" size="small"></Input-number>
                    --<Input-number :max="100" :min="1" v-model="value2" size="small"></Input-number>
                    </Col>
                    <Col span="6"></Col>
                    <Col span="6"></Col>
                    <Col span="6">
                    <Button>搜索</Button>
                    <Button>导出</Button>
                    </Col>
                </Row>
                <br/>
                <Row style="margin-left: 20px;">
                    <Checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
                        <Checkbox label="jlfs">故障</Checkbox>
                        <Checkbox label="ljrl">累积热量</Checkbox>
                        <Checkbox label="rgl">热功率</Checkbox>
                        <Checkbox label="ljll">累积流量</Checkbox>
                        <Checkbox label="ssll">瞬时流量</Checkbox>
                        <Checkbox label="gswd">供水温度</Checkbox>
                        <Checkbox label="hswd">回水温度</Checkbox>
                        <Checkbox label="wc">温差</Checkbox>
                        <Checkbox label="dyzt">电压状态</Checkbox>
                        <Checkbox label="cbsj">抄表时间</Checkbox>
                    </Checkbox-group>
                </Row>
            </div>
        </Row>
        <br/>
        <Row>
            <Table border stripe  :columns="tableColumns" :data="data" ></Table>
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
                        title: '房间',
                        key: 'fj'
                    },
                    {
                        title: '户主',
                        key: 'hz'
                    },
                    {
                        title: '房间位置',
                        key: 'fjwz',
                    },
                    {
                        title: '供热面积',
                        key: 'grmj'
                    },
                    {
                        title: '供热状态',
                        key: 'grzt'
                    },
                    {
                        title: '计量方式',
                        key: 'jlfs'
                    },
                    {
                        title: '表号',
                        key: 'bh'
                    },
                    {
                        title: '累积热量',
                        key: 'ljrl'
                    },
                    {
                        title: '热功率',
                        key: 'rgl'
                    },
                    {
                        title: '累积流量',
                        key: 'ljll'
                    },
                    {
                        title: '瞬时流量',
                        key: 'ssll'
                    },
                    {
                        title: '供水温度',
                        key: 'gswd'
                    },
                    {
                        title: '回水温度',
                        key: 'hswd'
                    },
                    {
                        title: '温差',
                        key: 'wc'
                    },
                    {
                        title: '电压状态',
                        key: 'dyzt'
                    },
                    {
                        title: '抄表时间',
                        key: 'cbsj'
                    }
                ],
                self: this,
                data: this.mockTableData(),
                tableColumns: [],
                tableColumnsChecked: ['gz', 'ljrl', 'rgl', 'ljll', 'ssll', 'gswd', 'hswd', 'wc', 'dyzt','cbsj'],
                value1:45,
                value2:50,
            }
        },
        methods:{
            mockTableData () {
                let data = [];
                function getNum() {
                    return Math.floor(Math.random () * 10000 + 1);
                }
                for (let i = 0; i < 10; i++) {
                    data.push({
                        fj: "1-10"+i,
                        hz: "张XX"+i,
                        fjwz: "边侧",
                        grmj: getNum(),
                        grzt: "正常",
                        jlfs: "热计量",
                        bh: "4122516"+i,
                        ljrl: getNum(),
                        rgl: getNum(),
                        ljll: getNum(),
                        ssll: getNum(),
                        gswd: getNum(),
                        hswd: getNum(),
                        wc: getNum(),
                        dyzt: "正常",
                        cbsj: "2018-8-09",

                    })
                }
                return data;
            },
            getTableColumns () {
                const tableColumnList = {
                    gz:{
                        title: '故障',
                        key: 'gz'
                    },
                    szwz:{
                        title: '所在位置',
                        key: 'szwz'
                    },
                    lx:{
                        title: '类型',
                        key: 'lx',
                    },
                    mc:{
                        title: '名称',
                        key: 'mc'
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
