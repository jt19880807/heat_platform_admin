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
                        电表列表
                    </p>
                    <Row style="margin: 10px">
                        <Col span="12">
                        <span>采集器&nbsp;&nbsp;</span>
                            <Select v-model="filter_collector_id" filterable @on-change="collectorChange" style="width:200px">
                                <Option :value="0" >全部</Option>
                                <Option v-for="item in filter_collectorList" :value="item.id" :key="item.number">{{ item.number }}</Option>
                            </Select>
                        </Col>
                        <Col span="12" style="text-align: right">
                            <Button type="primary" v-has="'ammeter_import'" icon="ios-cloud-upload-outline" @click="importData()">导入</Button>
                            <Button type="primary" v-has="'ammeter_export'" icon="ios-cloud-download-outline" @click="exportData()" v-bind:disabled="data.length==0">导出</Button>
                        </Col>
                    </Row>
                    <Row><Table border stripe ref="selection" :columns="columns" :data="data" @on-selection-change="onDataSelect"></Table></Row>
                    <Row style="margin: 10px">
                        <Col span="8">
                            <Button type="primary" v-has="'ammeter_add'" @click="addMeter" icon="plus">新增</Button>
                            <Button type="primary" v-has="'ammeter_edit'" @click="editMeter" icon="edit" v-bind:disabled="selectData.length!==1">编辑</Button>
                            <Button type="error" v-has="'ammeter_del'" @click="deleteMeter" v-bind:disabled="selectData.length==0" icon="trash-a">删除</Button>
                        </Col>
                        <Col span="8" offset="8" style="text-align: right">
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
        <Modal title="导入电表" :closable=false :mask-closable=false v-model="showImportData">
            <div slot="footer">
                <Button type="error" size="large" @click="closeUploadModal">关闭</Button>
            </div>
            <Row>
                <Col span="18">
                <Upload ref="uploadFile"
                        action="//192.168.5.21:8082/importMeters?meterType=2"
                        name="multipartFile"
                        accept="'.xlsx'"
                        :on-success="handleSuccess"
                        :on-error="handleError"
                        :before-upload="beforeUpload">
                    <Button type="ghost" icon="ios-cloud-upload-outline">选择文件(.xlsx)</Button>
                </Upload>
                </Col>
                <Col span="6">
                <Button type="ghost" icon="ios-cloud-download-outline" @click="uploadTemplate">下载模板</Button>
                </Col>
            </Row>
            <Row v-if="showImportResult">
                <Col style="color: green">共计导入{{importCount}}条数据</Col>
            </Row>
            <Row v-if="importErrorResult.length>0">
                <Col style="color: red">错误列表</Col>
                <Col v-for="item in importErrorResult" style="color: red">{{item}}</Col>
            </Row>
        </Modal>
    </div>
</template>
<script>
    import {getMeters,batchDelMeters,insertMeter,updateMeter,getProjectTree,getBuildingWithIDAndAreaName,getProjectsList,getCollectorWithIDAndNumber} from '../../../axios/http';
    import Cookies from 'js-cookie';
    import {uploadImportTemplates} from '../../../utils/index';
    export default {
        data () {
            return {
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '项目',
                        key: 'project_name',
                        render: (h, params) => {
                            return h('div', [
                                h('strong', params.row.collector.building.project.name)
                            ]);
                        }
                    },{
                        title: '小区',
                        key: 'area_name',
                        render: (h, params) => {
                            return h('div', [
                                h('strong', params.row.collector.building.area.name+params.row.collector.building.name)
                            ]);
                        }
                    },
                    {
                        title: '采集器',
                        key: 'collector_number',
                        render: (h, params) => {
                            return h('div', [
                                h('strong', params.row.collector.number)
                            ]);
                        }
                    },
                    {
                        title: '设备编号',
                        key: 'number'
                    },
                    {
                        title: '厂家',
                        key: 'factory'
                    },
                    {
                        title: '型号',
                        key: 'model'
                    },

                    {
                        title: '安装时间',
                        key: 'create_time'
                    }
                ],
                data: [],
                treeData:[],
                selectData:[],
                formValidate: {
                    number: '',
                    project_id:'',//选定的项目
                    building_id:'',//选定的楼栋
                    collector_id:'',//选定的采集器
                    factory:'',//厂家
                    model:''//型号
                },
                ruleValidate: {
                    number: [
                        { required: true, message: '请输入电表编号', trigger: 'blur' }
                    ],
                    collector_id: [
                        { type: 'number',required: true, message: '请选择采集器', trigger: 'change' },
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
                filter_collectorList:[],//采集器列表
                select_collectorList:[],//采集器列表
                tree_area_id:0,//筛选过滤的
                tree_project_id:0,//筛选过滤的
                tree_building_id:0,
                defaultProjectId:0,//默认加载第一个项目
                filter_collector_id:0,
                meterType:2,//表计类型
                showImportData:false,
                showImportResult:false,
                importCount:0,
                importErrorResult:[],
            }
        },
        methods: {
            //加载数据
            initMeter(projectId,areaId,buildingId){
                getMeters(projectId,areaId,buildingId,this.filter_collector_id,this.meterType,this.currentPage,this.pageSize).then((response)=>{
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
                    this.tree_project_id=this.treeData[0].id;
                    this.initFilterCollector(this.defaultProjectId, this.tree_area_id, this.tree_building_id);
                    this.initMeter(this.defaultProjectId, 0, 0);
                    //console.log(JSON.stringify(this.treeData));
                }).catch(function (error) {
                    console.log(error);
                });
            },
            initFilterCollector(projectId,areaId,buildingId){
                getCollectorWithIDAndNumber(projectId,areaId,buildingId).then((response)=>{
                    this.filter_collectorList=response.data.result;
                }).catch(function (error) {
                    console.log(error);
                });
            },
            initSelectCollector(projectId,areaId,buildingId){
                getCollectorWithIDAndNumber(projectId,areaId,buildingId).then((response)=>{
                    this.select_collectorList=response.data.result;
                }).catch(function (error) {
                    console.log(error);
                });
            },
            pageChange(page){
                this.currentPage=page;
                this.initMeter(this.tree_project_id, this.tree_area_id, this.tree_building_id);
            },
            onDataSelect(selection){
                this.selectData=selection;
            },
            //批量删除
            deleteMeter(){//删除选定数据
                this.$Modal.confirm({
                    title: '删除数据',
                    content: '<p>确定要删除选定的数据？</p>',
                    onOk: () => {
                        this.total=this.total-this.selectData.length;
                        batchDelMeters(this.selectData).then((response)=>{
                            if (response.data.result===this.selectData.length){
                                this.initMeter(this.defaultProjectId, 0, 0);
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
                    insertMeter(param).then((response)=>{
                        if(response.data.result===1){
                            this.tree_project_id=this.formValidate.project_id;
                            this.tree_area_id=0;
                            this.tree_building_id=0;
                            this.initMeter(this.tree_project_id, this.tree_area_id, this.tree_building_id);
                            this.closeModal();
                        }
                        }).catch(function (error) {
                            console.log(error);
                    });
                }else {
                    updateMeter(this.selectData[0].id,param).then((response)=>{
                        if(response.data.result===1){
                            this.initMeter(this.tree_project_id, this.tree_area_id, this.tree_building_id);
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
            closeUploadModal(){
                this.$refs['uploadFile'].clearFiles();
                this.showImportResult=false;
                this.importErrorResult=[];
                this.showImportData=false;
                if (this.importCount>0){
                    this.initMeter(this.tree_project_id, this.tree_area_id, this.tree_building_id);
                }
            },
            editMeter(){
                this.formValidate.number=this.selectData[0].number;
                this.formValidate.project_id=this.selectData[0].collector.building.project_id;
                this.formValidate.building_id=this.selectData[0].collector.building_id;
                this.formValidate.collector_id=this.selectData[0].collector.id;
                this.formValidate.factory=this.selectData[0].factory;
                this.formValidate.model=this.selectData[0].model;
                this.showCurrentTableData=true;
                this.isadd=false;
                this.modalTitle="修改电表信息";
            },
            addMeter(){
                this.showCurrentTableData=true;
                this.isadd=true;
                this.modalTitle="添加电表信息";
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
                    this.initSelectCollector(this.formValidate.project_id,0,this.formValidate.building_id);
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
                    this.initFilterCollector(this.tree_project_id, this.tree_area_id, this.tree_building_id);
                    this.initMeter(this.tree_project_id, this.tree_area_id, this.tree_building_id);
                }
            },
            collectorChange(option){
              this.filter_collector_id=option;
              this.initMeter(this.tree_project_id, this.tree_area_id, this.tree_building_id);
            },
            importData(){//导入数据
                this.showImportData=true;
            },
            handleSuccess (res, file) {
                this.showImportResult=true;
                this.importCount=res.result[0].count;
                this.importErrorResult=res.result[0].results;
            },
            handleError(error,file){
                console.log("error");
            },
            beforeUpload(file){
                this.$refs['uploadFile'].clearFiles();
                //console.log("beforeUpload");
            },
            //下载模板
            uploadTemplate(){
                uploadImportTemplates("电表导入模板.xlsx");
            },
            exportData(){//导出数据
                window.location.href="http://192.168.5.21:8082/exportMeters?projectId="+this.tree_project_id+"&areaId="+this.tree_area_id+"&buildingId="+this.tree_building_id+"&collectorId="+this.filter_collector_id+"&meterType="+this.meterType
            }
        },
        created(){
            this.projecIds=Cookies.get("projects");
            this.initProject();
            this.initProjectTree();
        }
    }
</script>
