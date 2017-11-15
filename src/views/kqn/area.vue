<template>
    <div>
        <Row style="margin: 10px">
            <Col span="8">

            </Col>
            <Col span="8" offset="8" style="text-align: right">
                <Input placeholder="请输入关键词搜索." v-model="keyWords"  style="width: 200px;" />
                <span  style="margin: 0 10px;">
                    <Button type="primary" @click="initdata"  icon="search">搜索</Button>
                </span>
            </Col>
        </Row>
        <Row><Table border stripe ref="selection" :columns="columns" :data="data" @on-selection-change="onDataSelect"></Table></Row>
        <Row style="margin: 10px">
            <Col span="8">
                <Button type="primary" @click="add" icon="plus">新增</Button>
                <Button type="primary" @click="editArea" icon="edit" v-bind:disabled="selectdata.length!==1">编辑</Button>
                <Button type="error" @click="deletedata" v-bind:disabled="selectdata.length==0" icon="trash-a">删除</Button>
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
                    <FormItem label="小区名称" prop="name">
                        <Input v-model="formValidate.name"/>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="所属地区" prop="district">
                        <Input v-model="formValidate.district" />
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
                selectdata:[],
                formValidate: {
                    name: '',
                    district:'',
                    address:''
                },
                ruleValidate: {
                    name: [
                        { required: true, message: '请输入小区名称', trigger: 'blur' }
                    ],
                },
                showCurrentTableData: false,
                modalTitle:"",//弹出层标题
                isAdd:true,//是否添加
                currenPage:1,//当前页码
                pageSize:6,//每页数据量
                total:0,//数据总量
                keyWords:""//搜索关键词
            }
        },
        methods: {
            //加载数据
            initdata(){
                getAreas(this.currenPage,this.pageSize,this.keyWords).then((response)=>{
                    this.total=response.data.total;
                    this.data=response.data.list;
                }).catch(function (error) {
                    console.log(error);
                });
            },
            pageChange(page){
                this.currenPage=page;
                this.initdata();
            },
            onDataSelect(selection){
                this.selectdata=selection;
            },
            //批量删除
            deletedata(){//删除选定数据
                this.$Modal.confirm({
                    title: '删除数据',
                    content: '<p>确定要删除选定的数据？</p>',
                    onOk: () => {
                        this.total=this.total-this.selectdata.length;
                        batchDelAreas(this.selectdata).then((response)=>{
                            if (response.data.result===this.selectdata.length){
                                this.initdata();
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
                            this.initdata();
                            this.$refs['formValidate'].resetFields();
                            this.showCurrentTableData=false;
                        }
                        }).catch(function (error) {
                            console.log(error);
                    });
                }else {
                    updateArea(this.selectdata[0].id,param).then((response)=>{
                        if(response.data.result===1){
                            this.initdata();
                            this.$refs['formValidate'].resetFields();//清楚Fields
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
                        this.saveArea();
//                        this.showCurrentTableData=false;
                       // this.$Message.success('Success!');
                    } else {
                        //this.$Message.error('Fail!');
                    }
                });

            },
            cancel(){
                this.$refs['formValidate'].resetFields();
            },
            editArea(){
                this.formValidate.name=this.selectdata[0].name;
                this.formValidate.district=this.selectdata[0].district;
                this.formValidate.address=this.selectdata[0].address;
                this.showCurrentTableData=true;
                this.isadd=false;
                this.modaTitle="修改小区信息";
            },
            add(){
                this.showCurrentTableData=true;
                this.isadd=true;
                this.modalTitle="添加小区信息";
            }

        },
        created(){
            this.initdata();
        }

    }
</script>
