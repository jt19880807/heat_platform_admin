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
                <Button type="primary" v-has="'area_add'" @click="addArea" icon="plus">新增</Button>
                <Button type="primary" v-has="'area_edit'" @click="editArea" icon="edit" v-bind:disabled="selectData.length!==1">编辑</Button>
                <Button type="error" v-has="'area_del'" @click="deleteArea" v-bind:disabled="selectData.length==0" icon="trash-a">删除</Button>
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
                    <FormItem label="小区名称" prop="name">
                        <Input v-model="formValidate.name"/>
                    </FormItem>
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
    import {getAreas,batchDelAreas,insertArea,updateArea} from '../../axios/http';
    import {citys} from '../../static/js/citydata';
    import {selectCityValue} from '../../utils/index'
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
                        title: '小区名',
                        key: 'name'
                    },
                    {
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
                    district:'',
                    address:'',
                    cityValue:[],//选中的城市Value
                },
                ruleValidate: {
                    name: [
                        { required: true, message: '请输入小区名称', trigger: 'blur' }
                    ],
                    cityValue: [
                        { required: true,type: 'array', message: '请选择所属地区', trigger: 'change' },
//                        { type: 'array', max: 2, message: 'Choose two hobbies at best', trigger: 'change' }
                    ],
                },
                showCurrentTableData: false,
                modalTitle:"",//弹出层标题
                isAdd:true,//是否添加
                currentPage:1,//当前页码
                pageSize:6,//每页数据量
                total:0,//数据总量
                keyWords:"",//搜索关键词
                cityData:[],
                cityText:"",
            }
        },
        methods: {
            //加载数据
            initData(){
                getAreas(this.currentPage,this.pageSize,this.keyWords).then((response)=>{
                    this.total=response.data.total;
                    this.data=response.data.list;
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
            deleteArea(){//删除选定数据
                this.$Modal.confirm({
                    title: '删除数据',
                    content: '<p>确定要删除选定的数据？</p>',
                    onOk: () => {
                        this.total=this.total-this.selectData.length;
                        batchDelAreas(this.selectData).then((response)=>{
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
            saveArea(){
                var param={
                    name: this.formValidate.name,
                    create_by: Cookies.get('userid'),
                    update_by: Cookies.get('userid'),
                    district:this.formValidate.district,
                    address:this.formValidate.address
                };
                if(this.isadd){
                    insertArea(param).then((response)=>{
                        if(response.data.result===1){
                            this.initData();
                            this.closeModal();
                        }
                        }).catch(function (error) {
                            console.log(error);
                    });
                }else {
                    updateArea(this.selectData[0].id,param).then((response)=>{
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
                        this.saveArea();
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
            editArea(){
                this.formValidate.name=this.selectData[0].name;
                this.formValidate.district=this.selectData[0].district;
                this.formValidate.address=this.selectData[0].address;
                this.showCurrentTableData=true;
                this.isadd=false;
                this.formValidate.cityValue=selectCityValue(this.selectData[0].district,this.cityData);
                this.modaTitle="修改小区信息";
            },
            addArea(){
                this.showCurrentTableData=true;
                this.isadd=true;
                this.modalTitle="添加小区信息";
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
