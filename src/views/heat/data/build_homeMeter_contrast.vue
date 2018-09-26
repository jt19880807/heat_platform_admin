<style lang="less">
    @import "../../../components/styles/home.less";
    @import "../../../components/styles/common.less";
</style>
<template>
    <div class="home-main">
        <div class="header-title-div">
            <div class="header-title" >
                {{title}}历史数据对比
            </div>
        </div>
        <Row>
            <div class="tools_div">
                <Row style="padding-top: 10px;margin-left: 20px;">
                    <Col span="6">
                    供暖季：
                    <Select v-model="currentHeatSession" style="width:200px">
                        <Option v-for="item in heatSessions" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    </Col>
                    <Col span="6"></Col>
                    <Col span="6"></Col>
                    <Col span="6">
                        <Button @click="searchClick">搜索</Button>
                        <Button @click="searchClick">导出</Button>
                    </Col>
                </Row>
            </div>
        </Row>
        <br/>
        <Row>
            <Card>
                <Table border stripe  :columns="tableColumn" :data="contrastHeat" ></Table>
                <Row style="margin: 10px">
                    <Col span="8">
                    &nbsp;
                    </Col>
                    <Col span="16" style="text-align: right">
                    <Page :total="page.total" :current="page.currentPage" show-total  :pageSize="page.pageSize"
                          @on-change="pageChange"/>
                    </Col>
                </Row>
            </Card>

        </Row>
    </div>
</template>
<script>
    import inforCard from '../../../components/inforCard.vue';
    import dataIcon from "../../../components/dataIcon.vue";
    import {getBuildContrast} from '../../../axios/http';
    import {initHeatSession} from '../../../utils';
    export default {
        data(){
            return {
                self: this,
                lastNodeData: [],
                tableColumns: [],
                selectedTreeNode:{},
                builds:'',
                currentHeatSession:'',//当前供暖季
                heatSessions:[],
                contrastHeat:[],
                startDate:'',
                endDate:'',
                tableColumn:[
                    {
                        title: '房间号',
                        key: 'userCode',
                        align: 'center',
                    },
                    {
                        title: '面积',
                        key: 'area',
                        align: 'center',
                    },
                    {
                        title: '位置',
                        key: 'location',
                        align: 'center',
                    },
                    {
                        title: '',
                        key: 'currentHeat',
                        align: 'center',
                    },
                    {
                        title: '',
                        key: 'lastHeat',
                        align: 'center',
                    },
                    {
                        title: '',
                        key: 'beforeHeat',
                        align: 'center',
                    },
                    {
                        title: '',
                        key: 'currentHeat',
                        align: 'center',
                    },
                    {
                        title: '',
                        key: 'lastAvgHeat',
                        align: 'center',
                    },
                    {
                        title: '',
                        key: 'currentAvgHeat',
                        align: 'center',
                    },

                ],
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
                this.heatSessions=initHeatSession();
                this.currentHeatSession=this.heatSessions[0].value;

            },
            initContrastHeat(){
                this.initTableColumn();
                getBuildContrast(this.builds,
                    this.selectedTreeNode.type,
                    this.selectedTreeNode.name,
                    this.startDate,
                    this.endDate,
                this.page.currentPage,
                this.page.pageSize)
                    .then((respose)=>{
                    this.page.total=respose.data.total;
                    this.contrastHeat=respose.data.list;
                }).catch((error)=>{

                    })
            },
            initTableColumn(){
                var session=parseInt(this.currentHeatSession);
                this.tableColumn[3].title=session+"热耗";
                this.tableColumn[4].title=session-1+"热耗";
                this.tableColumn[5].title=session-2+"热耗";
                this.tableColumn[6].title=session+"单位热耗";
                this.tableColumn[7].title=session-1+"单位热耗";
                this.tableColumn[8].title=session-2+"单位热耗";
//                this.label1=session+"";
                this.startDate=session+"/11/01";
                this.endDate=session+1+"/10/31";
            },
            searchClick(){
                this.initContrastHeat();
            },
            dateChange(date){
            },
        },
        mounted () {
            this.initContrastHeat();

        },
        watch: {
            selectedTreeNode(){
                //this.initUseHeat(this.tabValue);
            },

        },
        created(){
            this.init();
        }
    }
</script>
