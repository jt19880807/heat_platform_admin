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
                        电量
                    </p>
                    <Row style="margin: 10px">
                        <!--<Col span="8">-->
                        <!--</Col>-->
                        <Col span="24" style="text-align: right">
                            <span>开始日期&nbsp;&nbsp;</span>
                           <DatePicker size="small" type="date" format="yyyy/MM/dd" @on-change="startDateChange" placeholder="Select date" :value="startDate"  style="width: 120px"></DatePicker>
                            <span>结束日期&nbsp;&nbsp;</span>
                            <DatePicker size="small" type="date" format="yyyy/MM/dd" @on-change="endDateChange" placeholder="Select date" :value="endDate" style="width: 120px"></DatePicker>
                            &nbsp;&nbsp;
                             <Button type="primary" icon="ios-search" @click="searchData">查询</Button>
                        </Col>
                    </Row>
                    <Row><Table border stripe ref="selection" :columns="columns" :data="data" @on-selection-change="onDataSelect"></Table></Row>
                    <Row style="margin: 10px">
                        <!--<Col span="8">-->
                            <!--&lt;!&ndash;<Button type="primary" @click="addPowerConsumption" icon="plus">新增</Button>&ndash;&gt;-->
                            <!--&lt;!&ndash;<Button type="primary" @click="editPowerConsumption" icon="edit" v-bind:disabled="selectData.length!==1">编辑</Button>&ndash;&gt;-->
                            <!--&lt;!&ndash;<Button type="error" @click="deletePowerConsumption" v-bind:disabled="selectData.length==0" icon="trash-a">删除</Button>&ndash;&gt;-->
                        <!--</Col>-->
                        <Col span="24" style="text-align: right">
                            <Page v-bind:total="total" show-total v-bind:pageSize="pageSize" @on-change="pageChange"></Page>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
    import {getPowerConsumptions,getProjectTree,getBuildingWithIDAndAreaName,getProjectsList,getMetersWithIDAndNumber} from '../../../axios/http';
    import Cookies from 'js-cookie';
    export default {
        data () {
            return {
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                    },
                    {
                        title: '表号',
                        key: 'number',
                        render: (h, params) => {
                            return h('div', [
                                h('strong', params.row.meter.number)
                            ]);
                        }
                    },{
                        title: '读数日期',
                        key: 'date'
                    },{
                        title: '日耗电量(KWH)',
                        key: 'consumption'
                    }
                ],
                data: [],
                treeData:[],
                selectData:[],
                formValidate: {
                    date:'',//读数日期
                    meter_id:0,
                    consumption:0,//日耗电量
                },
                ruleValidate: {
                    meter_id: [
                        { type:'number', required: true, message: '请选择表号', trigger: 'change' },
                    ],
                    date:[
                        { required: true, message: '请选择读数日期', trigger: 'change' },
                    ],
                },
                showCurrentTableData: false,
                modalTitle:"",//弹出层标题
                isAdd:true,//是否添加
                currentPage:1,//当前页码
                pageSize:20,//每页数据量
                total:0,//数据总量
                projectList:[],//项目列表
                buildingList:[],//楼栋列表
                filter_meterList:[],//表计列表
                tree_area_id:0,//筛选过滤的
                tree_project_id:0,//筛选过滤的
                tree_building_id:0,
                defaultProjectId:0,//默认加载第一个项目
                startDate:'',
                endDate:'',
                meterType:3,

            }
        },
        methods: {
            //加载数据
            initPowerConsumptions(projectId,areaId,buildingId,meterId){
                getPowerConsumptions(projectId,areaId,buildingId,meterId,this.startDate,this.endDate+" 23:59:59",this.currentPage,this.pageSize)
                    .then((response)=>{
                    this.total=response.data.total;
                    this.data=response.data.list;
                }).catch(function (error) {
                    console.log(error);
                });
            },
            //加载项目数据
//            initProject(){
//                getProjectsList(Cookies.get('projects')).then((response)=>{
//                    this.projectList=response.data.result;
//                }).catch(function (error) {
//                    console.log(error);
//                });
//            },
//            initBuildingList(projectId){
//                getBuildingWithIDAndAreaName(projectId).then((response)=>{
//                    this.buildingList=response.data.result;
//                }).catch(function (error) {
//                    console.log(error);
//                });
//            },
            initProjectTree(){
                getProjectTree(Cookies.get("projects")).then((response)=>{
                    this.total=response.data.total;
                    this.treeData=response.data.result;
                    this.defaultProjectId=this.treeData[0].id;
                    //this.initFilterMeter(this.defaultProjectId, this.tree_area_id, this.tree_building_id);
                    this.initPowerConsumptions(this.defaultProjectId, 0, 0,0);
                }).catch(function (error) {
                    console.log(error);
                });
            },
//            initFilterMeter(projectId,areaId,buildingId){
//                getMetersWithIDAndNumber(projectId,areaId,buildingId,this.meterType).then((response)=>{
//                    this.filter_meterList=response.data.result;
//                }).catch(function (error) {
//                    console.log(error);
//                });
//            },
            initDate(){
                var date=new Date();
                this.startDate=date.getFullYear()+"/"+(date.getMonth()+1)+"/01";
                this.endDate=date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate();
            },
            pageChange(page){
                this.currentPage=page;
                this.initPowerConsumptions(this.tree_project_id, this.tree_area_id, this.tree_building_id,0);
            },
            onDataSelect(selection){
                this.selectData=selection;
            },
            //批量删除
            treeSelectChange(option) {
                if (option.length > 0) {
                    switch (option[0].type) {
                        case "project":
                            this.tree_project_id = option[0].id;
                            this.tree_area_id = 0;
                            this.tree_building_id = 0;
                            break;
                        case "area":
                            this.tree_project_id = option[0].projectId;
                            this.tree_area_id = option[0].id;
                            this.tree_building_id = 0;
                            break;
                        case "building":
                            this.tree_project_id = option[0].projectId;
                            this.tree_area_id = option[0].areaId;
                            this.tree_building_id = option[0].id;
                            break;
                    }
//                    this.filter_meter_id=0;
//                    this.initFilterMeter(this.tree_project_id, this.tree_area_id, this.tree_building_id);
                    this.initPowerConsumptions(this.tree_project_id, this.tree_area_id, this.tree_building_id,0);
                }
            },
            searchData(){
                this.initPowerConsumptions(this.tree_project_id, this.tree_area_id, this.tree_building_id,0);
            },
            startDateChange(date){
              this.startDate=date;
            },
            endDateChange(date){
                this.endDate=date;
            },
//            selectDateChange(date){
//              this.formValidate.date=date;
//            },
        },
        created(){
            this.initDate();
            this.projecIds=Cookies.get("projects");
            //this.initProject();
            this.initProjectTree();

        }

    }
</script>
