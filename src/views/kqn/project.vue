<template>
    <div>
        <Row style="margin: 10px">
            <Col span="8">

            </Col>
            <Col span="8" offset="8" style="text-align: right">
                <Input placeholder="请输入关键词搜索." v-model="keyWords"  style="width: 200px;" />
                <span  style="margin: 0 10px;">
                    <Button type="primary" @click="initData"  icon="search">搜索</Button>
                </span>
            </Col>
        </Row>
        <Row><Table border stripe ref="selection" :columns="columns" :data="data" @on-selection-change="onDataSelect"></Table></Row>
        <Row style="margin: 10px">
            <Col span="8">
                <Button type="primary" @click="addProject" icon="plus">新增</Button>
                <Button type="primary" @click="editProject" icon="edit" v-bind:disabled="selectData.length!==1">编辑</Button>
                <Button type="error" @click="deletedata" v-bind:disabled="selectData.length==0" icon="trash-a">删除</Button>
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
                    <FormItem label="项目名称" prop="name">
                        <Input v-model="formValidate.name"/>
                    </FormItem>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="负责人" prop="principal">
                            <Input v-model="formValidate.principal" />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="联系人" prop="contact">
                            <Input v-model="formValidate.contact" />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                    <FormItem label="建设单位" prop="party_a">
                        <Input v-model="formValidate.party_a" />
                    </FormItem>
                    </Col>
                    <Col span="12">
                    <FormItem label="施工单位" prop="construction_unit">
                        <Input v-model="formValidate.construction_unit" />
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="监理单位" prop="supervisor_unit">
                            <Input v-model="formValidate.supervisor_unit" />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="设计单位" prop="design_unit">
                            <Input v-model="formValidate.design_unit" />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="使用单位" prop="use_unit">
                            <Input v-model="formValidate.use_unit" />
                        </FormItem>
                    </Col>
                    <Col span="12">

                    </Col>
                </Row>
                <Row>
                    <FormItem label="所属地区" prop="cityValue">
                        <Cascader :data="cityData" v-model="formValidate.cityValue" @on-change="cityChange"></Cascader>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="详细地址" prop="address">
                        <Input v-model="formValidate.address" />
                    </FormItem>
                </Row>
            </Form>
        </Modal>
    </div>
</template>
<script>
    import {getProjects,batchDelProjects,insertProject,updateProject} from '../../axios/http';
    import {citys} from '../../static/js/citydata';
    import {selectCityValue} from '../../utils/index';
    import Cookies from 'js-cookie';
    import qs from 'qs';
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
                        title: '项目名',
                        key: 'name'
                    },
                    {
                        title: '负责人',
                        key: 'principal'
                    },
                    {
                        title: '联系人',
                        key: 'contact'
                    },
                    {
                        title: '建设单位',
                        key: 'party_a'
                    },
                    {
                        title: '施工单位',
                        key: 'construction_unit'
                    },
                    {
                        title: '监理单位',
                        key: 'supervisor_unit'
                    },
                    {
                        title: '设计单位',
                        key: 'design_unit'
                    },
                    {
                        title: '使用单位',
                        key: 'use_unit'
                    },  {
                        title: '所属地区',
                        key: 'district'
                    },
                    {
                        title: '详细地址',
                        key: 'address'
                    }
                ],
                data: [],
                selectData:[],
                formValidate: {
                    name: '',
                    principal:'',
                    contact:'',
                    party_a:'',
                    construction_unit:'',
                    supervisor_unit:'',
                    design_unit:'',
                    use_unit:'',
                    district:'',
                    address:'',
                    cityValue:[],//选中的城市Value
                },
                ruleValidate: {
                    name: [
                        { required: true, message: '请输入项目名称', trigger: 'blur' }
                    ],
                    cityValue: [
                        { required: true,type: 'array', message: '请选择所属地区', trigger: 'change' },
                    ],
                },
                showCurrentTableData: false,
                modalTitle:"",//弹出层标题
                isAdd:true,//是否添加
                currentPage:1,//当前页码
                pageSize:6,//每页数据量
                total:0,//数据总量
                keyWords:"",//搜索关键词
                cityData:[],//JSON格式的省市列表数据
                cityText:"",//选中的城市Text
            }
        },
        methods: {
            //加载数据
            initData(){
                getProjects(Cookies.get('projects'),this.currentPage,this.pageSize,this.keyWords).then((response)=>{
                    this.total=response.data.total;
                    this.data=response.data.list;
                }).catch(function (error) {
                    console.log(error);
                });
            },
            pageChange(page){
                // 页码发生改变的时候调用
                //alert(page);
                this.currentPage=page;
                this.initData();
            },
            onDataSelect(selection){
                //console.log(selection.length);
                this.selectData=selection;
            },
            //批量删除
            deletedata(){//删除选定数据
                this.$Modal.confirm({
                    title: '删除数据',
                    content: '<p>确定要删除选定的数据？</p>',
                    onOk: () => {
                        this.total=this.total-this.selectData.length;
                        batchDelProjects(this.selectData).then((response)=>{
                            if (response.data.result===this.selectData.length){
                                this.initData();
                                //this.currentPage=this.selectData.length==this.pageSize?this.currentPage-1:this.currentPage;
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
            saveProject(){
                var param={
                    name: this.formValidate.name,
                    principal:this.formValidate.principal,
                    contact:this.formValidate.contact,
                    party_a:this.formValidate.party_a,
                    construction_unit:this.formValidate.construction_unit,
                    supervisor_unit:this.formValidate.supervisor_unit,
                    design_unit:this.formValidate.design_unit,
                    use_unit:this.formValidate.use_unit,
                    district:this.formValidate.district,
                    address:this.formValidate.address,
                    create_by: Cookies.get('userid'),
                    update_by: Cookies.get('userid'),
                };
                if(this.isadd){
                    insertProject(param).then((response)=>{
                        if(response.data.result===1){
                            this.initData();
                            this.closeModal();
                        }
                        }).catch(function (error) {
                            console.log(error);
                    });
                }else {
                    updateProject(this.selectData[0].id,param).then((response)=>{
                        if(response.data.result===1){
                            this.initData();
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
                        this.saveProject();
                    } else {
                        //this.$Message.error('Fail!');
                    }
                });

            },
            closeModal(){
                this.$refs['formValidate'].resetFields();
                this.formValidate.cityValue=[];
                this.showCurrentTableData=false;
            },
            editProject(){
                this.formValidate.name=this.selectData[0].name;
                this.formValidate.principal=this.selectData[0].principal;
                this.formValidate.contact=this.selectData[0].contact;
                this.formValidate.party_a=this.selectData[0].party_a;
                this.formValidate.construction_unit=this.selectData[0].construction_unit;
                this.formValidate.supervisor_unit=this.selectData[0].supervisor_unit;
                this.formValidate.design_unit=this.selectData[0].design_unit;
                this.formValidate. use_unit=this.selectData[0].use_unit;
                this.formValidate.district=this.selectData[0].district;
                this.formValidate. address=this.selectData[0].address;
                this.showCurrentTableData=true;
                this.formValidate.cityValue=selectCityValue(this.selectData[0].district,this.cityData);
                this.isadd=false;
                this.modalTitle="修改项目信息";
            },
            addProject(){
                this.showCurrentTableData=true;
                this.isadd=true;
                this.modalTitle="添加项目信息";
            },
            cityChange(value,selectedData ){
                this.formValidate.district=selectedData[0].label+"/"+selectedData[1].label;
            },

        },
        created(){
            this.cityData=citys;
            this.initData();
        }

    }
</script>
