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
                        能耗分析
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
                        <!--<Table border stripe ref="selection" :columns="columns" :data="data" ></Table>-->
                        <Col span="2" style="">
                        &nbsp;&nbsp;
                        </Col>
                        <Col span="22" >
                            耗热量&nbsp;&nbsp;
                        <input type="text" disabled="false" v-model="heat" style="width:200px;border:0px;border-bottom:#000000 1px solid;" />
                        </Col>

                    </Row>
                    <Row style="margin: 10px">

                    </Row>
                </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
    import {getEnergys,getProjectTreeNoChildren} from '../../../axios/http';
    import Cookies from 'js-cookie';
    export default {
        data () {
            return {
                treeData:[],
                tree_project_id:0,//筛选过滤的
                defaultProjectId:0,//默认加载第一个项目
                startDate:'',
                endDate:'',
                heat:0,//耗热量
            }
        },
        methods: {
            //加载数据
            initEnergys(projectId){
//                getEnergys(projectId,this.startDate,this.endDate+" 23:59:59",this.currentPage,this.pageSize)
//                    .then((response)=>{
//                    this.total=response.data.total;
//                    this.data=response.data.list;
//                }).catch(function (error) {
//                    console.log(error);
//                });
            },
            initProjectTree(){
                getProjectTreeNoChildren(Cookies.get("projects")).then((response)=>{
                    this.total=response.data.total;
                    this.treeData=response.data.result;
                    this.defaultProjectId=this.treeData[0].id;
                    this.initEnergys(this.defaultProjectId);
                }).catch(function (error) {
                    console.log(error);
                });
            },
            initDate(){
                var date=new Date();
                this.startDate=date.getFullYear()+"/"+(date.getMonth()+1)+"/01";
                this.endDate=date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate();
            },
            pageChange(page){
                this.currentPage=page;
                this.initEnergys(this.tree_project_id);
            },
            treeSelectChange(option) {
                if (option.length > 0) {
                    this.tree_project_id = option[0].id;
                    this.initEnergys(this.tree_project_id);
                }
            },
            searchData(){
                this.initEnergys(this.tree_project_id);
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
