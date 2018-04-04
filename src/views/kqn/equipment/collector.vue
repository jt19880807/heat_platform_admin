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
                        采集器列表
                    </p>
                    <Row style="margin: 10px; text-align: right">
                        <Button type="primary" v-has="'collector_import'" icon="ios-cloud-upload-outline" @click="importData()">导入</Button>
                        <Button type="primary" v-has="'collector_export'" icon="ios-cloud-download-outline" @click="exportData()" v-bind:disabled="data.length==0">导出</Button>
                    </Row>
                    <Row>
                        <Table border stripe ref="selection" :columns="columns" :data="data" @on-selection-change="onDataSelect"></Table>
                    </Row>
                    <Row style="margin: 10px">
                        <Col span="8">
                            <Button type="primary" v-has="'collector_add'" @click="addCollector" icon="plus">新增</Button>
                            <Button type="primary" v-has="'collector_edit'" @click="editCollector" icon="edit" v-bind:disabled="selectData.length!==1">编辑</Button>
                            <Button type="error" v-has="'collector_del'" @click="deleteCollector" v-bind:disabled="selectData.length==0" icon="trash-a">删除</Button>
                        </Col>
                        <Col span="8" offset="8" style="text-align: right">
                            <Page v-bind:total="total" show-total v-bind:pageSize="pageSize" @on-change="pageChange"></Page>
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
                        <Select v-model="formValidate.building_id" filterable>
                            <Option v-for="item in buildingList" :value="item.id" :key="item.title">{{ item.title }}</Option>
                        </Select>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="编号" prop="number">
                        <Input v-model="formValidate.number"/>
                    </FormItem>
                </Row>

            </Form>
        </Modal>
        <Modal title="导入采集器" :closable=false :mask-closable=false v-model="showImportData">
            <div slot="footer">
                <Button type="error" size="large" @click="closeUploadModal">关闭</Button>
            </div>
            <Row>
                <Col span="18">
                    <Upload ref="uploadFile"
                            action="//192.168.5.21:8082/importCollector"
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
    import {getCollectors,batchDelCollectors,insertCollector,updateCollector,getProjectTree,getBuildingWithIDAndAreaName,getProjectsList} from '../../../axios/http';
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
                                h('strong', params.row.building.project.name)
                            ]);
                        }
                    },{
                        title: '小区',
                        key: 'area_name',
                        render: (h, params) => {
                            return h('div', [
                                h('strong', params.row.building.area.name+params.row.building.name)
                            ]);
                        }
                    },
                    {
                        title: '编号',
                        key: 'number'
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
                    building_id:'',//选定的小区
                },
                ruleValidate: {
                    number: [
                        { required: true, message: '请输入采集器编号', trigger: 'blur' }
                    ],
                    building_id: [
                        { type: 'number',required: true, message: '请选择楼栋', trigger: 'change' },
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
                tree_area_id:0,//筛选过滤的
                tree_project_id:0,//筛选过滤的
                tree_building_id:0,
                defaultProjectId:0,//默认加载第一个项目
                showImportData:false,
                showImportResult:false,
                importCount:0,
                importErrorResult:[],
            }
        },
        methods: {
            //加载数据
            initCollector(projectId,areaId,buildingId){
                getCollectors(projectId,areaId,buildingId,this.currentPage,this.pageSize).then((response)=>{
                    this.total=response.data.total;
                    this.data=response.data.list;
                    //console.log(this.data);
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
                    this.initCollector(this.defaultProjectId, 0, 0);
                    //console.log(JSON.stringify(this.treeData));
                }).catch(function (error) {
                    console.log(error);
                });
            },
            pageChange(page){
                this.currentPage=page;
                this.initCollector(this.tree_project_id, this.tree_area_id, this.tree_building_id);
            },
            onDataSelect(selection){
                this.selectData=selection;
            },
            //批量删除
            deleteCollector(){//删除选定数据
                this.$Modal.confirm({
                    title: '删除数据',
                    content: '<p>确定要删除选定的数据？</p>',
                    onOk: () => {
                        this.total=this.total-this.selectData.length;
                        batchDelCollectors(this.selectData).then((response)=>{
                            if (response.data.result===this.selectData.length){
                                this.initCollector(this.defaultProjectId, 0, 0);
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
            saveCollector(){
                var param={
                    building_id:this.formValidate.building_id,
                    number: this.formValidate.number,
                    create_by: Cookies.get('userid'),
                    update_by: Cookies.get('userid'),
                };
                if(this.isadd){
                    insertCollector(param).then((response)=>{
                        if(response.data.result===1){
                            this.initCollector(this.defaultProjectId, 0, 0);
                            this.closeModal();
                        }
                        }).catch(function (error) {
                            console.log(error);
                    });
                }else {
                    updateCollector(this.selectData[0].id,param).then((response)=>{
                        if(response.data.result===1){
                            this.initCollector(this.defaultProjectId, 0, 0);
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
                        this.saveCollector();
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
                    this.initCollector(this.defaultProjectId, 0, 0);
                }
            },
            editCollector(){
//                console.log(this.selectData[0]);
//                console.log(JSON.stringify(this.selectData));
                this.formValidate.number=this.selectData[0].number;
                this.formValidate.project_id=this.selectData[0].building.project_id;
                this.formValidate.building_id=this.selectData[0].building_id;
                this.showCurrentTableData=true;
                this.isadd=false;
                this.modalTitle="修改采集器信息";
            },
            addCollector(){
                this.showCurrentTableData=true;
                this.isadd=true;
                this.modalTitle="添加采集器信息";
            },
            projectChange(option){//项目下拉框发生改变时
                //alert(Option);
                if(option==''){
                    this.buildingList=[];
                }else {
                    this.initBuildingList(option);
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
                    this.initCollector(this.tree_project_id, this.tree_area_id, this.tree_building_id);
                }
            },
            importData(){//导入数据
                this.showImportData=true;
            },
            handleSuccess (res, file) {
//              console.log(file);

//                console.log("Success");
                console.log(res);
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
                uploadImportTemplates("采集器导入模板.xlsx");
            },
            exportData(){//导出数据
                window.location.href="http://192.168.5.21:8082/exportcollectors?projectId="+this.tree_project_id+"&areaId="+this.tree_area_id+"&buildingId="+this.tree_building_id
            }
        },
        created(){
            this.projecIds=Cookies.get("projects");
            this.initProject();
            this.initProjectTree();
        }
    }
</script>
