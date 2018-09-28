<style lang="less">
    @import "../../../components/styles/home.less";
    @import "../../../components/styles/common.less";
</style>
<template>
    <div class="home-main">
        <div class="header-title-div">
            <div class="header-title" >
                {{title}}报警数据
            </div>
        </div>
        <Row>
            <div class="tools_div">
                <Row style="padding-top: 10px;margin-left: 20px;">
                    <Col span="6">
                    报警类型：
                    <Select v-model="currentAlermType" style="width:200px">
                        <Option  :value="0" :key="0">全部</Option>
                        <Option v-for="item in alermTypes" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
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
                <Table border stripe  :columns="tableColumn" :data="alermData" ref="table"></Table>
                 <Row style="margin: 10px">
                     <Col span="8">
                                &nbsp;
                     </Col>
                      <Col span="16" style="text-align: right">
                        <Page :total="page.total" :current="page.currentPage" show-total  :pageSize="page.pageSize" @on-change="pageChange"/>
                      </Col>
                  </Row>
            </Card>

        </Row>
    </div>
</template>
<script>
    import inforCard from '../../../components/inforCard.vue';
    import VeRing from 'v-charts/lib/ring.common';
    import VeHistogramfrom from 'v-charts/lib/histogram.common';
    import dataIcon from "../../../components/dataIcon.vue";
    import {getNodeAlermInfo,getAlermTypes} from '../../../axios/http';
    import {formatDate,initDate} from '../../../utils';
    export default {
        data(){
            return {
                self: this,
                selectedTreeNode:{},
                builds:'',
                tableColumn:[
                    {
                        title: '小区',
                        key: 'z_name'
                    },
                    {
                        title: '楼号',
                        key: 'b_name'
                    },
                    {
                        title: '房间',
                        key: 'user_code'
                    },
                    {
                        title: '报警类型',
                        key: 'alerm_type',
                    },
                    {
                        title: '报警时间',
                        key: 'alerm_time'
                    }
                ],
                page:{
                    currentPage:1,//当前页码
                    pageSize:10,//每页数据量
                    total:0,//数据总量
                },
                currentAlermType:0,
                alermData:[],
                alermTypes:[
                    {"id":1,
                      "name":"通讯故障"
                    },
                    {"id":2,
                        "name":"多天通讯故障"
                    },
                    {"id":3,
                        "name":"电池欠压"
                    },
                    {"id":4,
                        "name":"流量过小"
                    },
                    {"id":5,
                        "name":"供回水接反"
                    },
                    {"id":6,
                        "name":"流量超限"
                    },{"id":7,
                        "name":"进水温度低"
                    },{"id":8,
                        "name":"进水温度高"
                    },{"id":9,
                        "name":"出水温度低"
                    },{"id":10,
                        "name":"供暖日用量为零"
                    },{"id":11,
                        "name":"未供暖用量非零"
                    },{"id":12,
                        "name":"温差过大"
                    },{"id":13,
                        "name":"典型测温故障"
                    },{"id":14,
                        "name":"瞬时流量为零"
                    },



                ],
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
                this.currentAlermType=this.$store.state.alermType;
                this.builds=sessionStorage.getItem("builds");
                var date=new Date();
                this.dayValue=formatDate(date,"yyyy/MM/dd");
                this.monthValue=formatDate(date,"yyyy/MM");
            },
//            initAlermTypes(){
//                getAlermTypes()
//                    .then((respose) => {
//                        this.alermTypes = respose.data.result;
//                        this.currentAlermType=this.$store.state.alermType;
//                        console.log(this.currentAlermType);
//                    }).catch(function (error) {
//                    console.log(error);
//                });
           // },
            initAlermData(){
                getNodeAlermInfo(this.builds,
                    this.selectedTreeNode.type,
                    this.selectedTreeNode.name,
                    this.currentAlermType,
                    this.page.currentPage,
                    this.page.pageSize)
                    .then((respose) => {
                        this.page.total=respose.data.total;
                        this.alermData = respose.data.list;
                    }).catch(function (error) {
                    console.log(error);
                });
            },
            searchClick(){
                this.initAlermData();
            },
            searchClick(){
                this.initAlermData();
            },
            pageChange(page){
                this.page.currentPage=page;
                this.initAlermData();
            },
            exportClick(){
                this.$refs.table.exportCsv({
                    filename: this.selectedTreeNode.name+"报警数据"
                });
            },
        },
        mounted () {
            this.initAlermData();

        },
        watch: {
            selectedTreeNode(){

                this.initAlermData(this.tabValue);
            },

        },
        created(){
//            console.log("created");
//            this.initAlermTypes();
            this.init();

        }
    }
</script>
