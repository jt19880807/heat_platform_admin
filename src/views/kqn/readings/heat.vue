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
                            <Select v-model="filter_meter_id" filterable @on-change="meterChange" style="width:200px">
                                <Option :value="0" >全部</Option>
                                <Option v-for="item in filter_meterList" :value="item.id" :key="item.number">{{ item.number }}</Option>
                            </Select>
                            <Select v-model="filter_meter_error" filterable @on-change="meterErrorChange" style="width:80px">
                                <Option :value="0" >全部</Option>
                                <Option :value="1" >正常</Option>
                                <Option :value="2" >异常</Option>
                            </Select>
                        </Col>
                        <Col span="16" style="text-align: right">
                            <span>开始日期&nbsp;&nbsp;</span>
                            <DatePicker size="small" type="date" format="yyyy/MM/dd" @on-change="startDateChange" placeholder="Select date" :value="startDate"  style="width: 120px"></DatePicker>
                            <span>结束日期&nbsp;&nbsp;</span>
                            <DatePicker size="small" type="date" format="yyyy/MM/dd" @on-change="endDateChange" placeholder="Select date" :value="endDate" style="width: 120px"></DatePicker>
                            <Button type="primary" icon="ios-search" @click="searchData">查询</Button>
                            <Button type="primary" icon="ios-download-outline" @click="exportData()" v-bind:disabled="data.length==0">导出</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Table border stripe ref="selection" :columns="columns" :data="data" @on-selection-change="onDataSelect" size="small" ></Table>
                    </Row>
                    <Row style="margin: 10px">
                        <Col span="8">
                            <Button type="primary" v-has="'heatreading_add'" @click="addHeatMeterReading" icon="plus">新增</Button>
                            <Button type="primary" v-has="'heatreading_edit'" @click="editHeatMeterReading" icon="edit" v-bind:disabled="selectData.length!==1">编辑</Button>
                            <Button type="error" v-has="'heatreading_del'" @click="deleteHeatMeterReading" v-bind:disabled="selectData.length==0" icon="trash-a">删除</Button>
                        </Col>
                        <Col span="16" style="text-align: right">
                            <Page v-bind:total="total" :current="currentPage" show-total v-bind:pageSize="pageSize" @on-change="pageChange" show-sizer @on-page-size-change="pageSizeChange"></Page>
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
                    <FormItem label="表号" prop="meter_id">
                        <Select v-model="formValidate.meter_id">
                            <Option v-for="item in filter_meterList" :value="item.id" :key="item.number">{{ item.number }}</Option>
                        </Select>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="读数日期" prop="date">
                        <DatePicker size="small" type="datetime" format="yyyy/MM/dd HH:mm" @on-change="selectDateChange" placeholder="Select date" :value="formValidate.date"  style="width: 150px"></DatePicker>
                    </FormItem>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="累计热量" prop="accumulationheat">
                            <InputNumber :min="0" :max="10000" :step="1.5" v-model="formValidate.accumulationheat"/>&nbsp;MWH
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="功率" prop="power">
                            <InputNumber :min="0" :max="10000" :step="1.5" v-model="formValidate.power"/>&nbsp;KW
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                    <FormItem label="瞬时流量" prop="instantaneousflow">
                        <InputNumber :min="0" :max="10000" :step="1.5" v-model="formValidate.instantaneousflow"/>&nbsp;m³/h
                    </FormItem>
                    </Col>
                    <Col span="12">
                    <FormItem label="累计冷量" prop="accumulationcooling">
                        <InputNumber :min="0" :max="10000" :step="1.5" v-model="formValidate.accumulationcooling"/>&nbsp;KWH
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                    <FormItem label="供水温度" prop="supplywatertemp">
                        <InputNumber :min="0" :max="10000" :step="1.5" v-model="formValidate.supplywatertemp"/>&nbsp;℃
                    </FormItem>
                    </Col>
                    <Col span="12">
                    <FormItem label="回水温度" prop="accumulationcooling">
                        <InputNumber :min="0" :max="10000" :step="1.5" v-model="formValidate.returnwatertemp"/>&nbsp;℃
                    </FormItem>
                    </Col>
                </Row>
            </Form>
        </Modal>
    </div>
</template>
<script>
    import {getHeatMeterReadings,batchDelHeatMeterReadings,insertHeatMeterReading,updateHeatMeterReading,getProjectTree,getBuildingWithIDAndAreaName,getProjectsList,getMetersWithIDAndNumber} from '../../../axios/http';
    import Cookies from 'js-cookie';
    export default {
        data () {
            return {
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                        fixed: 'left'
                    },
                    {
                        title: '表号',
                        key: 'number',
                        fixed: 'left',
                        width: 150,
                        render: (h, params) => {
                            return h('div', [
                                h('strong', params.row.meter.number)
                            ]);
                        }
                    },{
                        title: '读数日期',
                        width:140,
                        key: 'date',
                        fixed: 'left',
                    },{
                        title: '累计热量(MWH)',
                        key: 'accumulationheat',
                        width: 130,
                    },
                    {
                        title: '累计冷量(KWH)',
                        key: 'accumulationcooling',
                        width: 130,
                    },
                    {
                        title: '瞬时流量(m³/h)',
                        key: 'instantaneousflow',
                        width: 130,
                    },
                    {
                        title: '功率(KW)',
                        key: 'power',
                        width: 130,
                    },
                    {
                        title: '供水温度(℃)',
                        key: 'supplywatertemp',
                        width: 130,
                    },

                    {
                        title: '回水温度(℃)',
                        key: 'returnwatertemp',
                        width: 130,
                    },
                    {
                        title:'温差(℃)',
                        key:'tempdiff',
                        width: 130,
                    },
                    {
                        title:'状态',
                        key:'status',
                        fixed: 'right',
                        width: 120,
                        render: (h, params) => {
                            const row = params.row;
                            const color = row.status === '正常' ? 'green' : 'red';
                            const text = row.status=== '正常' ?'正常':'异常';
                            if (row.status=== '正常'){
                                return h('Tag', {
                                props: {
                                    type: 'dot',
                                    color: color
                                }
                            }, text);
                            }
                            else {
                                return h('Tooltip', {
                                    props: {
                                        trigger: 'hover',
                                        placement: 'left-start',
                                        transfer:true
                                    }
                                }, [
                                    h('Tag', {
                                        props: {
                                            type: 'dot',
                                            color: color,
                                        }
                                    }, text),
                                    h('div', {
                                        slot: 'content'
                                    }, [
                                        h('div', row.status.split(',').map(item => {
                                            return h('p', {
                                                style: {
                                                    textAlign: 'center',
                                                    padding: '4px'
                                                }
                                            }, item)
                                        }))
                                    ])
                                ]);
                            }
                        }
                    }
                ],
                data: [],
                treeData:[],
                selectData:[],
                formValidate: {
                    date:'',//读数日期
                    meter_id:0,
                    instantaneousflow:0,//瞬时流量
                    power:0,//功率
                    accumulationheat:0,//累积热量
                    accumulationcooling:0,//累积冷量
                    supplywatertemp:0,//供水温度
                    returnwatertemp:0//回水温度
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
                pageSize:10,//每页数据量
                total:0,//数据总量
                projectList:[],//项目列表
                buildingList:[],//楼栋列表
                filter_meterList:[],//表计列表
                select_collectorList:[],//采集器列表
                tree_area_id:0,//筛选过滤的
                tree_project_id:0,//筛选过滤的
                tree_building_id:0,
                defaultProjectId:0,//默认加载第一个项目
                filter_meter_id:0,
                filter_meter_error:0,
                startDate:'',
                endDate:'',
                meterId:0,
                meterType:1,
                allExportData:[],
            }
        },
        methods: {
            //加载数据
            initHeatMeterReadings(projectId,areaId,buildingId,meterId,num){
                getHeatMeterReadings(projectId,areaId,buildingId,meterId,this.filter_meter_error,this.startDate,this.endDate+" 23:59:59",num,this.pageSize)
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
                getMetersWithIDAndNumber(projectId,areaId,buildingId,this.meterType).then((response)=>{
                    this.filter_meterList=response.data.result;
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
                this.initHeatMeterReadings(this.tree_project_id, this.tree_area_id, this.tree_building_id,this.meterId,this.currentPage);
            },
            pageSizeChange(pageSize){
                this.pageSize=pageSize;
                this.initHeatMeterReadings(this.tree_project_id, this.tree_area_id, this.tree_building_id,this.meterId,this.currentPage);
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
            saveHeatMeterReading(){
                var param={
                    meter_id:this.formValidate.meter_id,
                    date:this.formValidate.date,
                    instantaneousflow: this.formValidate.instantaneousflow,
                    power:this.formValidate.power,
                    accumulationheat:this.formValidate.accumulationheat,
                    accumulationcooling:this.formValidate.accumulationcooling,
                    supplywatertemp:this.formValidate.supplywatertemp,
                    returnwatertemp:this.formValidate.returnwatertemp,
                };
                if(this.isadd){
                    insertHeatMeterReading(param).then((response)=>{
                        if(response.data.result===1){
                            this.tree_area_id=0;
                            this.tree_building_id=0;
                            this.filter_meter_id=0;
                            this.initHeatMeterReadings(this.tree_project_id, this.tree_area_id,this.tree_building_id,this.filter_meter_id);
                            this.closeModal();
                        }
                        }).catch(function (error) {
                            console.log(error);
                    });
                }else {
                    updateHeatMeterReading(this.selectData[0].id,param).then((response)=>{
                        if(response.data.result===1){
                            this.initHeatMeterReadings(this.tree_project_id, this.tree_area_id, this.tree_building_id,this.filter_meter_id);
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
                        this.saveHeatMeterReading();
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
                this.formValidate.meter_id=this.selectData[0].meter_id;
                this.formValidate.date=this.selectData[0].date;
                this.formValidate.instantaneousflow=this.selectData[0].instantaneousflow;
                this.formValidate.power=this.selectData[0].power;
                this.formValidate.accumulationheat=this.selectData[0].accumulationheat;
                this.formValidate.accumulationcooling=this.selectData[0].accumulationcooling;
                this.formValidate.supplywatertemp=this.selectData[0].supplywatertemp;
                this.formValidate.returnwatertemp=this.selectData[0].returnwatertemp;
                this.showCurrentTableData=true;
                this.isadd=false;
                this.modalTitle="修改热量";
            },
            addHeatMeterReading(){
                this.showCurrentTableData=true;
                this.isadd=true;
                this.modalTitle="添加热量";
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
                    this.filter_meter_id=0;
                    this.initFilterMeter(this.tree_project_id, this.tree_area_id, this.tree_building_id);
                    this.initHeatMeterReadings(this.tree_project_id, this.tree_area_id, this.tree_building_id,this.filter_meter_id);
                }
            },
            meterChange(option){
              this.filter_meter_id=option;
                this.filter_meter_error=0;
              this.initHeatMeterReadings(this.tree_project_id, this.tree_area_id, this.tree_building_id,this.filter_meter_id);
            },
            meterErrorChange(option){
                this.currentPage=1;
                this.filter_meter_error=option;
                this.initHeatMeterReadings(this.tree_project_id, this.tree_area_id, this.tree_building_id,this.filter_meter_id,this.currentPage);
            },
            searchData(){
                this.currentPage=1;
                this.initHeatMeterReadings(this.tree_project_id, this.tree_area_id, this.tree_building_id,this.filter_meter_id,this.currentPage);
            },
            startDateChange(date){
              this.startDate=date;
            },
            endDateChange(date){
                this.endDate=date;
            },
            selectDateChange(date){
              this.formValidate.date=date;
            },
            //导出数据
            exportData(){
                window.location.href="http://192.168.5.21:8082/heatMeterReading/export?projectId="+this.tree_project_id+"&areaId="+this.tree_area_id+"&buildingId="+this.tree_building_id+"&meterId="+this.filter_meter_id+"&errorCode="+this.filter_meter_error+"&startDate="+this.startDate+"&endDate="+this.endDate+" 23:59:59";
            }
        },
        created(){
            this.initDate();
            this.projecIds=Cookies.get("projects");
            this.initProject();
            this.initProjectTree();
            this.initHeatMeterReadings(this.tree_project_id, this.tree_area_id, this.tree_building_id,this.meterId,1);
        }
    }
</script>
