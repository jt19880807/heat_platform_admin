<template>
    <div>
        <Row>
            <Col span="4">
                <Card>
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        项目列表
                    </p>
                    <Tree :data="treeData" ></Tree>
                </Card>
            </Col>
            <Col span="20">
                <Card>
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        采集器列表
                    </p>
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
                            <Button type="primary" @click="addCollector" icon="plus">新增</Button>
                            <Button type="primary" @click="editCollector" icon="edit" v-bind:disabled="selectData.length!==1">编辑</Button>
                            <Button type="error" @click="deleteCollector" v-bind:disabled="selectData.length==0" icon="trash-a">删除</Button>
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
    </div>
</template>
<script>
    import {getCollectors,batchDelCollectors,insertCollector,updateCollector,getProjectTree,getBuildingWithIDAndAreaName} from '../../axios/http';
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
                        key: 'collector_height'
                    },{
                        title: '建筑类型',
                        key: 'collector_type'
                    },{
                        title: '建筑年限(年)',
                        key: 'collector_years'
                    },{
                        title: '制热面积(㎡)',
                        key: 'heating_area'
                    },{
                        title: '户数(户)',
                        key: 'house_count'
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
                pageSize:6,//每页数据量
                total:0,//数据总量
                projectList:[],//项目列表
                buildingList:[],//楼栋列表
                filter_area_id:0,//筛选过滤的
                filter_project_id:0,//筛选过滤的
                projectIds:''//要查询的项目IDS

            }
        },
        methods: {
            //加载数据
            initCollector(projectIds){
                getCollectors(projectIds,this.filter_area_id,this.currentPage,this.pageSize).then((response)=>{
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
                    this.buildingList=response.data.list;
                }).catch(function (error) {
                    console.log(error);
                });
            },
            initProjectTree(){
                getProjectTree(Cookies.get("projects")).then((response)=>{
                    this.total=response.data.total;
                    this.treeData=response.data.result;
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
            deleteCollector(){//删除选定数据
                this.$Modal.confirm({
                    title: '删除数据',
                    content: '<p>确定要删除选定的数据？</p>',
                    onOk: () => {
                        this.total=this.total-this.selectData.length;
                        batchDelCollectors(this.selectData).then((response)=>{
                            if (response.data.result===this.selectData.length){
                                this.projecIds=Cookies.get("projects");
                                this.initCollector(this.projecIds);
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
                    project_id:this.formValidate.project_id,
                    area_id:this.formValidate.area_id,
                    collector_years: this.formValidate.collector_years,
                    collector_height: this.formValidate.collector_height,
                    house_count: this.formValidate.house_count,
                    heating_area: this.formValidate.heating_area,
                    collector_type: this.formValidate.collector_type,
                    name: this.formValidate.name,
                    create_by: Cookies.get('userid'),
                    update_by: Cookies.get('userid'),
                };
                if(this.isadd){
                    insertCollector(param).then((response)=>{
                        if(response.data.result===1){
                            this.projecIds=Cookies.get("projects");
                            this.initCollector(this.projecIds);
                            this.closeModal();
                        }
                        }).catch(function (error) {
                            console.log(error);
                    });
                }else {
                    updateCollector(this.selectData[0].id,param).then((response)=>{
                        if(response.data.result===1){
                            this.initCollector(this.projecIds);
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
            editCollector(){
//                console.log(this.selectData[0]);
                this.formValidate.name=this.selectData[0].name;
                this.formValidate.collector_years=this.selectData[0].collector_years;
                this.formValidate.collector_height=this.selectData[0].collector_height;
                this.formValidate.house_count=this.selectData[0].house_count;
                this.formValidate.heating_area=this.selectData[0].heating_area;
                this.formValidate.collector_type=this.selectData[0].collector_type;
                this.formValidate.project_id=this.selectData[0].project_id;
                this.formValidate.area_id=this.selectData[0].area_id;
                this.showCurrentTableData=true;
                this.isadd=false;
                this.modalTitle="修改采集器信息";
            },
            addCollector(){
                this.showCurrentTableData=true;
                this.isadd=true;
                this.modalTitle="添加采集器信息";
            },
            projectChange(Option){//项目下拉框发生改变时
//                if (Option===0){
//                    this.projecIds=Cookies.get("projects");
//                }
//                else {
//                    this.projecIds = Option;
//                }
                this.initBuildingList(this.Option);
            },
            areaChange(Option){
                this.filter_area_id=Option;
                this.initCollector(this.projecIds);
            },
            modalStateChange(state){
               alert(state);
            },
        },
        created(){
            this.projecIds=Cookies.get("projects");
            this.initProject();
//            this.initArea();
            this.initProjectTree();
            //this.initCollector(this.projecIds);
        }

    }
</script>
<!--<template>-->
    <!--<div>-->
        <!--<Tree :data="data1" @on-select-change="change"></Tree>-->
    <!--</div>-->
<!--</template>-->
<!--<script>-->
    <!--export default {-->
        <!--data () {-->
            <!--return {-->
                <!--data1: [-->
                    <!--{-->
                        <!--title: 'parent 1',-->
                        <!--type:'level1',-->
                        <!--expand: true,-->
                        <!--children: [-->
                            <!--{-->
                                <!--title: 'parent 1-1',-->
                                <!--type:'level2',-->
                                <!--expand: true,-->
                                <!--children: [-->
                                    <!--{-->
                                        <!--title: 'leaf 1-1-1',-->
                                        <!--type:'level3',-->
                                    <!--},-->
                                    <!--{-->
                                        <!--title: 'leaf 1-1-2',-->
                                        <!--type:'level3',-->
                                    <!--}-->
                                <!--]-->
                            <!--},-->
                            <!--{-->
                                <!--title: 'parent 1-2',-->
                                <!--type:'level2',-->
                                <!--expand: true,-->
                                <!--children: [-->
                                    <!--{-->
                                        <!--title: 'leaf 1-2-1',-->
                                        <!--type:'level3',-->
                                    <!--},-->
                                    <!--{-->
                                        <!--title: 'leaf 1-2-1',-->
                                        <!--type:'level3',-->
                                    <!--}-->
                                <!--]-->
                            <!--}-->
                        <!--]-->
                    <!--}-->
                <!--]-->
            <!--}-->
        <!--},-->
        <!--methods:{-->
            <!--change(option){-->
                <!--console.log(JSON.stringify(option));-->
            <!--}-->
        <!--}-->

    <!--}-->
<!--</script>-->
