<template>
    <div>
        <Row style="margin: 10px">
            <Col span="12">
                <span>项目&nbsp;&nbsp;</span>
                <Select v-model="filter_project_id" filterable @on-change="projectChange" style="width:200px">
                    <Option :value="0" >全部</Option>
                    <Option v-for="item in projectList" :value="item.id" :key="item.name">{{ item.name }}</Option>
                </Select>
                <span>小区&nbsp;&nbsp;</span>
                <Select v-model="filter_area_id" filterable @on-change="areaChange" style="width:200px">
                    <Option :value="0" >全部</Option>
                    <Option v-for="item in areaList" :value="item.id" :key="item.name">{{ item.name }}</Option>
                </Select>
            </Col>
            <Col span="12" offset="8" style="text-align: right">
                <!--<Input placeholder="请输入关键词搜索." v-model="keyWords"  style="width: 200px;" />-->
                <!--<span  style="margin: 0 10px;">-->
                    <!--<Button type="primary" @click="initData"  icon="search">搜索</Button>-->
                <!--</span>-->
            </Col>
        </Row>
        <Row><Table border stripe ref="selection" :columns="columns" :data="data" @on-selection-change="onDataSelect"></Table></Row>
        <Row style="margin: 10px">
            <Col span="8">
                <Button type="primary" v-has="'building_add'" @click="addBuilding" icon="plus">新增</Button>
                <Button type="primary" v-has="'building_edit'" @click="editBuilding" icon="edit" v-bind:disabled="selectData.length!==1">编辑</Button>
                <Button type="error" v-has="'building_del'" @click="deleteBuilding" v-bind:disabled="selectData.length==0" icon="trash-a">删除</Button>
            </Col>
            <Col span="8" offset="8" style="text-align: right">
                <Page v-bind:total="total" show-total v-bind::pageSize="pageSize" @on-change="pageChange"></Page>
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
                        <Select v-model="formValidate.project_id" filterable>
                            <Option v-for="item in projectList" :value="item.id" :key="item.name">{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="小区" prop="area_id">
                        <Select v-model="formValidate.area_id" filterable>
                            <Option v-for="item in areaList" :value="item.id" :key="item.name">{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="编号" prop="name">
                        <Input v-model="formValidate.name"/>
                    </FormItem>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="建筑高度" prop="building_height">
                            <InputNumber :min="0" :max="10000" :step="1.5" v-model="formValidate.building_height"/>&nbsp;米
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="建筑类型" prop="building_type">
                            <Input v-model="formValidate.building_type"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="建筑年限" prop="building_years">
                            <InputNumber :min="0" :max="10000"  v-model="formValidate.building_years"/>&nbsp;年
                        </FormItem>
                    </Col>
                    <Col span="12">
                    <FormItem label="制热面积" prop="heating_area">
                        <InputNumber :min="0" :max="10000" :step="1.5" v-model="formValidate.heating_area"/>&nbsp;㎡
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                    <FormItem label="户数" prop="house_count">
                        <InputNumber :min="0" :max="1000"  v-model="formValidate.house_count"/>&nbsp;户
                    </FormItem>
                    </Col>
                    <Col span="12">
                    </Col>
                </Row>
            </Form>
        </Modal>
    </div>
</template>
<script>
    import {getBuildings,batchDelBuildings,insertBuilding,updateBuilding,getAreaWithIDAndName,getProjectsList} from '../../axios/http';
    import Cookies from 'js-cookie';
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
                                h('strong', params.row.project.name)
                            ]);
                        }
                    },{
                        title: '小区',
                        key: 'area_name',
                        render: (h, params) => {
                            return h('div', [
                                h('strong', params.row.area.name)
                            ]);
                        }
                    },
                    {
                        title: '编号',
                        key: 'name'
                    },{
                        title: '建筑高度(米)',
                        key: 'building_height'
                    },{
                        title: '建筑类型',
                        key: 'building_type'
                    },{
                        title: '建筑年限(年)',
                        key: 'building_years'
                    },{
                        title: '制热面积(㎡)',
                        key: 'heating_area'
                    },{
                        title: '户数(户)',
                        key: 'house_count'
                    }
                ],
                data: [],
                selectData:[],
                formValidate: {
                    name: '',
                    building_years: 0,
                    building_height: 0,
                    house_count: 0,
                    heating_area: 0,
                    building_type:'',
                    project_id:'',//选定的项目
                    area_id:'',//选定的小区
                },
                ruleValidate: {
                    name: [
                        { required: true, message: '请输入楼栋编号', trigger: 'blur' }
                    ],
                    project_id: [
                        { type: 'number',required: true, message: '请选择项目', trigger: 'change' },
                    ],
                    area_id: [
                        { type: 'number',required: true, message: '请选择小区', trigger: 'change' },
                    ],
                },
                showCurrentTableData: false,
                modalTitle:"",//弹出层标题
                isAdd:true,//是否添加
                currentPage:1,//当前页码
                pageSize:6,//每页数据量
                total:0,//数据总量
                projectList:[],//项目列表
                areaList:[],//小区列表
                filter_area_id:0,//筛选过滤的
                filter_project_id:0,//筛选过滤的
                projectIds:''//要查询的项目IDS

            }
        },
        methods: {
            //加载数据
            initBuilding(projectIds){
                getBuildings(projectIds,this.filter_area_id,this.currentPage,this.pageSize).then((response)=>{
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
            //加载小区数据
            initArea(){
                getAreaWithIDAndName(Cookies.get('projects')).then((response)=>{
                    this.areaList=response.data.result;
                }).catch(function (error) {
                    console.log(error);
                });
            },
            pageChange(page){
                this.currentPage=page;
                this.initData();
            },
            onDataSelect(selection){
                this.selectData=selection;
            },
            //批量删除
            deleteBuilding(){//删除选定数据
                this.$Modal.confirm({
                    title: '删除数据',
                    content: '<p>确定要删除选定的数据？</p>',
                    onOk: () => {
                        this.total=this.total-this.selectData.length;
                        batchDelBuildings(this.selectData).then((response)=>{
                            if (response.data.result===this.selectData.length){
                                this.projecIds=Cookies.get("projects");
                                this.initBuilding(this.projecIds);
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
            saveBuilding(){
                var param={
                    project_id:this.formValidate.project_id,
                    area_id:this.formValidate.area_id,
                    building_years: this.formValidate.building_years,
                    building_height: this.formValidate.building_height,
                    house_count: this.formValidate.house_count,
                    heating_area: this.formValidate.heating_area,
                    building_type: this.formValidate.building_type,
                    name: this.formValidate.name,
                    create_by: Cookies.get('userid'),
                    update_by: Cookies.get('userid'),
                };
                if(this.isadd){
                    insertBuilding(param).then((response)=>{
                        if(response.data.result===1){
                            this.projecIds=Cookies.get("projects");
                            this.initBuilding(this.projecIds);
                            this.closeModal();
                        }
                        }).catch(function (error) {
                            console.log(error);
                    });
                }else {
                    updateBuilding(this.selectData[0].id,param).then((response)=>{
                        if(response.data.result===1){
                            this.initBuilding(this.projecIds);
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
                        this.saveBuilding();
                    } else {
                        //this.$Message.error('Fail!');
                    }
                });

            },
            closeModal(){
                this.$refs['formValidate'].resetFields();
                this.showCurrentTableData=false;//关闭Modal
            },
            editBuilding(){
//                console.log(this.selectData[0]);
                this.formValidate.name=this.selectData[0].name;
                this.formValidate.building_years=this.selectData[0].building_years;
                this.formValidate.building_height=this.selectData[0].building_height;
                this.formValidate.house_count=this.selectData[0].house_count;
                this.formValidate.heating_area=this.selectData[0].heating_area;
                this.formValidate.building_type=this.selectData[0].building_type;
                this.formValidate.project_id=this.selectData[0].project_id;
                this.formValidate.area_id=this.selectData[0].area_id;
                this.showCurrentTableData=true;
                this.isadd=false;
                this.modalTitle="修改楼栋信息";
            },
            addBuilding(){
                this.showCurrentTableData=true;
                this.isadd=true;
                this.modalTitle="添加楼栋信息";
            },
            projectChange(Option){//项目下拉框发生改变时
                if (Option===0){
                    this.projecIds=Cookies.get("projects");
                }
                else {
                    this.projecIds = Option;
                }
                this.initBuilding(this.projecIds);
            },
            areaChange(Option){
                this.filter_area_id=Option;
                this.initBuilding(this.projecIds);
            },
            modalStateChange(state){
               alert(state);
            },
        },
        created(){
            this.projecIds=Cookies.get("projects");
            this.initProject();
            this.initArea();
            this.initBuilding(this.projecIds);
        }

    }
</script>
