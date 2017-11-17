<template>
    <div>
        <Row style="margin: 10px">
            <Col span="12">
                <span>项目&nbsp;&nbsp;</span>
                <Select v-model="formValidate.area_id" filterable style="width:200px">
                    <Option v-for="item in protectList" :value="item.id" :key="item.name">{{ item.name }}</Option>
                </Select>
                <span>小区&nbsp;&nbsp;</span>
                <Select v-model="formValidate.area_id" filterable style="width:200px">
                    <Option v-for="item in protectList" :value="item.id" :key="item.name">{{ item.name }}</Option>
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
                <Button type="primary" @click="addBuilding" icon="plus">新增</Button>
                <Button type="primary" @click="editBuilding" icon="edit" v-bind:disabled="selectData.length!==1">编辑</Button>
                <Button type="error" @click="deleteBuilding" v-bind:disabled="selectData.length==0" icon="trash-a">删除</Button>
            </Col>
            <Col span="8" offset="8" style="text-align: right">
                <Page v-bind:total="total" show-total v-bind::pageSize="pageSize" @on-change="pageChange"></Page>
            </Col>
        </Row>
        <Modal v-bind:title="modalTitle" v-model="showCurrentTableData">
            <div slot="footer">
                <Button type="text" size="large" @click="cancel">重置</Button>
                <Button type="primary" size="large" @click="ok">保存</Button>
            </div>
            <Form ref="formValidate" :model="formValidate"  :rules="ruleValidate" :label-width="80">
                <Row>
                    <FormItem label="项目" prop="area_id">
                        <Select v-model="formValidate.area_id" filterable>
                            <Option v-for="item in protectList" :value="item.id" :key="item.name">{{ item.name }}</Option>
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
                            <Input v-model="formValidate.building_height"/>

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
                        <Input v-model="formValidate.building_years"/>
                    </FormItem>
                    </Col>
                    <Col span="12">
                    <FormItem label="制热面积" prop="heating_area">
                        <Input v-model="formValidate.heating_area"/>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                    <FormItem label="户数" prop="house_count">
                        <Input v-model="formValidate.house_count"/>
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
    import {getBuildings,batchDelBuildings,insertBuilding,updateBuilding} from '../../axios/http';
    import {getProjectsList} from '../../axios/http';
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
                        key: 'project.name'
                    },{
                        title: '小区',
                        key: 'area.name'
                    },
                    {
                        title: '编号',
                        key: 'name'
                    },{
                        title: '建筑高度',
                        key: 'building_height'
                    },{
                        title: '建筑类型',
                        key: 'building_type'
                    },{
                        title: '建筑年限',
                        key: 'building_years'
                    },{
                        title: '制热面积',
                        key: 'heating_area'
                    },{
                        title: '户数',
                        key: 'house_count'
                    }
                ],
                data: [],
                selectData:[],
                formValidate: {
                    name: '',
                    building_years: '',
                    building_height: '',
                    house_count: '',
                    heating_area: '',
                    building_type: '',
                    protect_id:'',//选定的项目
                    area_id:'',//选定的小区
                },
                ruleValidate: {
                    name: [
                        { required: true, message: '请输入楼栋编号', trigger: 'blur' }
                    ],
                    protect_id: [
                        { required: true, message: '请选择项目', trigger: 'change' },
                    ],
                    area_id: [
                        { required: true, message: '请选择小区', trigger: 'change' },
                    ],
                },
                showCurrentTableData: false,
                modalTitle:"",//弹出层标题
                isAdd:true,//是否添加
                currentPage:1,//当前页码
                pageSize:6,//每页数据量
                total:0,//数据总量
                protectList:[],//项目列表
                areaList:[],//小区列表

            }
        },
        methods: {
            //加载数据
            initBuilding(){
                getBuildings(Cookies.get('buildings'),this.currentPage,this.pageSize).then((response)=>{
                    this.total=response.data.total;
                    this.data=response.data.list;
                }).catch(function (error) {
                    console.log(error);
                });
            },
            //加载数据
            initProject(){
                getProjectsList(Cookies.get('projects')).then((response)=>{

                    this.protectList=response.data.result;
                    console.log(this.protectList);
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
                                this.initData();
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
                    name: this.formValidate.name,
                    create_by: Cookies.get('userid'),
                    update_by: Cookies.get('userid'),
                    district:this.formValidate.district,
                    address:this.formValidate.address
                };
                if(this.isadd){
                    insertBuilding(param).then((response)=>{
                        if(response.data.result===1){
                            this.initData();
                            this.$refs['formValidate'].resetFields();
                            this.showCurrentTableData=false;
                        }
                        }).catch(function (error) {
                            console.log(error);
                    });
                }else {
                    updateBuilding(this.selectData[0].id,param).then((response)=>{
                        if(response.data.result===1){
                            this.initData();

                            this.$refs['formValidate'].resetFields();//清楚Fields
                            this.formValidate.cityValue=[];
                            this.$refs.selection.selectAll(false);//取消全选
                            this.showCurrentTableData=false;//关闭Modal
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
            cancel(){
                this.$refs['formValidate'].resetFields();
                this.formValidate.cityValue=[];
            },
            editBuilding(){
                this.formValidate.name=this.selectData[0].name;
                this.formValidate.building_years=this.selectData[0].building_years;
                this.formValidate.building_height=this.selectData[0].building_height;
                this.formValidate.house_count=this.selectData[0].house_count;
                this.formValidate.heating_area=this.selectData[0].heating_area;
                this.formValidate.building_type=this.selectData[0].building_type;
                this.formValidate.protect_id=this.selectData[0].protect_id;
                this.formValidate.area_id=this.selectData[0].area_id;
                this.showCurrentTableData=true;
                this.isadd=false;
                this.modaTitle="修改楼栋信息";
            },
            addBuilding(){
                this.showCurrentTableData=true;
                this.isadd=true;
                this.modalTitle="添加楼栋信息";
            },

        },
        created(){
            this.initProject();
            this.initBuilding();
        }

    }
</script>
