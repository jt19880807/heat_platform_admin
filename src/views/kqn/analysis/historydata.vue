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
                        历史数据
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
                    <Row>
                        <Col span="8">
                        &nbsp;&nbsp;
                        </Col>
                        <Col span="8">
                        <Table border stripe :columns="columns" :data="data"  ></Table>
                        </Col>
                        <Col span="8">
                        &nbsp;&nbsp;
                        </Col>

                    </Row>
                </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
    import {getHisttoryData,getProjectTreeNoChildren} from '../../../axios/http';
    import Cookies from 'js-cookie';
    export default {
        data () {
            return {
                columns: [
                    {
                        title: ' ',

                        key: 'key',
                    },{
                        title: '当前值',

                        key: 'value0'
                    },
                    {
                        title: '去年同期',

                        key: 'value1'
                    }
                ],
                treeData:[],
                tree_project_id:0,//筛选过滤的
                defaultProjectId:0,//默认加载第一个项目
                startDate:'',
                endDate:'',
              data:[],//返回的数据
            }
        },
        methods: {
            //加载数据
            initHistorDatas(projectId){
                getHisttoryData(projectId,this.startDate,this.endDate+" 23:59:59")
                    .then((response)=>{
                   this.data=response.data.result;
                }).catch(function (error) {
                    console.log(error);
                });
            },
            initProjectTree(){
                getProjectTreeNoChildren(Cookies.get("projects")).then((response)=>{
                    this.treeData=response.data.result;
                    this.tree_project_id = this.treeData[0].id;
                    this.defaultProjectId=this.treeData[0].id;
                    this.initHistorDatas(this.defaultProjectId);
                }).catch(function (error) {
                    console.log(error);
                });
            },
            initDate(){
                var date=new Date();
                this.startDate=date.getFullYear()+"/"+(date.getMonth()+1)+"/01";
                this.endDate=date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate();
            },
            treeSelectChange(option) {
                if (option.length > 0) {
                    this.tree_project_id = option[0].id;
                    this.initEnergys(this.tree_project_id);
                }
            },
            searchData(){
                this.initHistorDatas(this.tree_project_id);
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
