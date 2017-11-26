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
                        热量
                    </p>
                    <Row style="margin: 10px">
                        <Col span="8">
                            <span>表号&nbsp;&nbsp;</span>
                            <Select v-model="filter_collector_id" filterable @on-change="collectorChange" style="width:200px">
                                <Option :value="0" >全部</Option>
                                <Option v-for="item in filter_meterList" :value="item.id" :key="item.number">{{ item.number }}</Option>
                            </Select>
                        </Col>
                        <Col span="16" style="text-align: right">
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
                        <Col span="8">
                            <Button type="primary" @click="addHeatMeterReading" icon="plus">新增</Button>
                            <Button type="primary" @click="editHeatMeterReading" icon="edit" v-bind:disabled="selectData.length!==1">编辑</Button>
                            <Button type="error" @click="deleteHeatMeterReading" v-bind:disabled="selectData.length==0" icon="trash-a">删除</Button>
                        </Col>
                        <Col span="16" style="text-align: right">
                            <Page v-bind:total="total" show-total v-bind::pageSize="pageSize" @on-change="pageChange"></Page>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>

        <Modal v-bind:title="modalTitle" :closable=false :mask-closable=false v-model="showCurrentTableData">
            <div slot="footer">
                <Button type="error" size="large" @click="closeModal">关闭</Button>
                <Button type="primary" size="large" @click="ok">保存</Button>
            </div>
            <Form ref="formValidate" :model="formValidate"  :rules="ruleValidate" :label-width="80">
                <Row>
                    <FormItem label="项目" prop="project_id">
                        <Select v-model="formValidate.project_id" filterable @on-change="projectChange">
                            <Option v-for="item in projectList" :value="item.id" :key="item.name">{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="楼栋" prop="building_id">
                        <Select v-model="formValidate.building_id" filterable @on-change="buildingChange">
                            <Option v-for="item in buildingList" :value="item.id" :key="item.title">{{ item.title }}</Option>
                        </Select>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="采集器" prop="collector_id">
                        <Select v-model="formValidate.collector_id">
                            <Option v-for="item in select_collectorList" :value="item.id" :key="item.number">{{ item.number }}</Option>
                        </Select>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="仪表编号" prop="number">
                        <Input v-model="formValidate.number"/>
                    </FormItem>
                </Row>
                <Row>
                    <Col span="12">
                    <FormItem label="设备厂家" prop="factory">
                        <Input v-model="formValidate.factory" />
                    </FormItem>
                    </Col>
                    <Col span="12">
                    <FormItem label="设备型号" prop="model">
                        <Input v-model="formValidate.model" />
                    </FormItem>
                    </Col>
                </Row>
            </Form>
        </Modal>
    </div>
</template>
<script>
    import {getHeatMeterReadings,batchDelHeatMeterReadings,insertHeatMeterReading,updateHeatMeterReading,getProjectTree,getBuildingWithIDAndAreaName,getProjectsList,getCollectorWithIDAndNumber} from '../../../axios/http';
    import Cookies from 'js-cookie';
    export default {
        data () {
            return {
                columns: [
                    {
                        type: 'selection',
                        width: 40,
                        align: 'center'
                    },
                    {
                        title: '表号',
                        key: 'number',
                    },{
                        title: '读数日期',
                        width:140,
                        key: 'date'
                    },{
                        title: '累计热量',
                        key: 'accumulationheat'
                    },
                    {
                        title: '累计冷量',
                        key: 'accumulationcooling',
                    },
                    {
                        title: '瞬时流量',
                        key: 'instantaneousflow'
                    },
                    {
                        title: '功率',
                        key: 'power'
                    },
                    {
                        title: '供水温度',
                        key: 'supplywatertemp'
                    },

                    {
                        title: '回水温度',
                        key: 'returnwatertemp'
                    }
                ],
                data: [],
                treeData:[],
                selectData:[],
                formValidate: {
                    number: '',//表号
                    date:'',//读数日期
                    instantaneousflow:'',//瞬时流量
                    power:'',//功率
                    accumulationheat:'',//累积热量
                    accumulationcooling:'',//累积冷量
                    supplywatertemp:'',//供水温度
                    returnwatertemp:''//回水温度
                },
                ruleValidate: {
                    number: [
                        { required: true, message: '请输入热量表编号', trigger: 'blur' }
                    ],
                    collector_id: [
                        { type: 'number',required: true, message: '请选择表号', trigger: 'change' },
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
                select_collectorList:[],//采集器列表
                tree_area_id:0,//筛选过滤的
                tree_project_id:0,//筛选过滤的
                tree_building_id:0,
                defaultProjectId:0,//默认加载第一个项目
                filter_collector_id:0,
                startDate:'2017/11/01',
                endDate:'2017/11/26',
                meterId:0,

            }
        },
        methods: {
            //加载数据
            initHeatMeterReadings(projectId,areaId,buildingId,meterId){
                getHeatMeterReadings(projectId,areaId,buildingId,meterId,this.startDate,this.endDate,this.currentPage,this.pageSize)
                    .then((response)=>{
                    this.total=response.data.total;
                    this.data=response.data.list;
                }).catch(function (error) {
                    console.log(error);
                });
            },
            //加载项目数据
            initProject(){
                getProjectsList(Cookies.get('projects')).then((response)=>{
                    this.projectList=response.data.result;
                }).catch(function (error) {
                    console.log(error);
                });
            },
            initBuildingList(projectId){
                getBuildingWithIDAndAreaName(projectId).then((response)=>{
                    this.buildingList=response.data.result;
                }).catch(function (error) {
                    console.log(error);
                });
            },
            initProjectTree(){
                getProjectTree(Cookies.get("projects")).then((response)=>{
                    this.total=response.data.total;
                    this.treeData=response.data.result;
                    this.defaultProjectId=this.treeData[0].id;
                    this.initFilterMeter(this.defaultProjectId, this.tree_area_id, this.tree_building_id);
                    this.initHeatMeterReadings(this.defaultProjectId, 0, 0,0);
                }).catch(function (error) {
                    console.log(error);
                });
            },
            initFilterMeter(projectId,areaId,buildingId){
                getCollectorWithIDAndNumber(projectId,areaId,buildingId).then((response)=>{
                    this.filter_meterList=response.data.result;
                }).catch(function (error) {
                    console.log(error);
                });
            },
            pageChange(page){
                this.currentPage=page;
                this.initHeatMeterReadings(this.tree_project_id, this.tree_area_id, this.tree_building_id,this.meterId);
            },
            onDataSelect(selection){
                this.selectData=selection;
            },
            //批量删除
            deleteHeatMeterReading(){//删除选定数据
                this.$Modal.confirm({
                    title: '删除数据',
                    content: '<p>确定要删除选定的数据？</p>',
                    onOk: () => {
                        this.total=this.total-this.selectData.length;
                        batchDelHeatMeterReadings(this.selectData).then((response)=>{
                            if (response.data.result===this.selectData.length){
                                this.initHeatMeterReadings(this.defaultProjectId, 0, 0);
                                this.$refs.selection.selectAll(false);//取消全选
                                this.$Message.success('删除成功');
                            }
                            else {
                                this.$Message.error('删除失败');
                            }
                        }).catch(function (error) {
                            console.log(error);
                        });
                    },
                    onCancel: () => {
                    }
                });
            },
            //保存数据（新增或者修改）
            saveMeter(){
                var param={
                    collector_id:this.formValidate.collector_id,
                    meter_type:this.meterType,
                    number: this.formValidate.number,
                    factory:this.formValidate.factory,
                    model:this.formValidate.model,
                    position:"0",
                    create_by: Cookies.get('userid'),
                    update_by: Cookies.get('userid'),
                };
                if(this.isadd){
                    insertHeatMeterReading(param).then((response)=>{
                        if(response.data.result===1){
                            this.tree_project_id=this.formValidate.project_id;
                            this.tree_area_id=0;
                            this.tree_building_id=0;
                            this.initHeatMeterReadings(this.tree_project_id, this.tree_area_id,this.tree_building_id,this.meterId);
                            this.closeModal();
                        }
                        }).catch(function (error) {
                            console.log(error);
                    });
                }else {
                    updateHeatMeterReading(this.selectData[0].id,param).then((response)=>{
                        if(response.data.result===1){
                            this.initHeatMeterReadings(this.tree_project_id, this.tree_area_id, this.tree_building_id,this.meterId);
                            this.$refs.selection.selectAll(false);//取消全选
                            this.closeModal();
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                }

            },
            ok(){
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        this.saveMeter();
                    } else {
                        //this.$Message.error('Fail!');
                    }
                });

            },
            closeModal(){
                this.$refs['formValidate'].resetFields();
                this.showCurrentTableData=false;//关闭Modal
            },
            editHeatMeterReading(){
                this.formValidate.number=this.selectData[0].number;
                this.formValidate.project_id=this.selectData[0].collector.building.project_id;
                this.formValidate.building_id=this.selectData[0].collector.building_id;
                this.formValidate.collector_id=this.selectData[0].collector.id;
                this.formValidate.factory=this.selectData[0].factory;
                this.formValidate.model=this.selectData[0].model;
                this.showCurrentTableData=true;
                this.isadd=false;
                this.modalTitle="修改热量";
            },
            addHeatMeterReading(){
                this.showCurrentTableData=true;
                this.isadd=true;
                this.modalTitle="添加热量";
            },
            projectChange(option){
                //项目下拉框发生改变时
                //alert(Option);
                if(option==''){
                    this.buildingList=[];
                }else {
                    this.formValidate.project_id=option;
                    this.initBuildingList(option);
                }
            },
            buildingChange(option){
                if(option==''){
                    this.select_collectorList=[];
                }else {
                    this.formValidate.building_id=option;
                   // this.initSelectCollector(this.formValidate.project_id,0,this.formValidate.building_id);
                }
            },
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
                    this.filter_collector_id=0;
                    this.initFilterMeter(this.tree_project_id, this.tree_area_id, this.tree_building_id);
                    this.initHeatMeterReadings(this.tree_project_id, this.tree_area_id, this.tree_building_id,this.meterId);
                }
            },
            collectorChange(option){
              this.filter_collector_id=option;
              this.initHeatMeterReadings(this.tree_project_id, this.tree_area_id, this.tree_building_id);
            },
            searchData(){
                this.initHeatMeterReadings(this.defaultProjectId, 0, 0,0);
            },
            startDateChange(date){
              this.startDate=date;
            },
            endDateChange(date){
                this.endDate=date;
            }
        },
        created(){
            this.projecIds=Cookies.get("projects");
            this.initProject();
            this.initProjectTree();

        }

    }
</script>
