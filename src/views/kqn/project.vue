<template>
    <div>
        <Row style="margin: 10px">
            <Col span="8">

            </Col>
            <Col span="8" offset="8" style="text-align: right">
                <Input placeholder="请输入项目名搜索." :Model="keyWords" style="width: 200px;" />
                <span  style="margin: 0 10px;">
                    <Button type="primary" icon="search">搜索</Button>
                </span>
            </Col>
        </Row>
        <Row><Table border stripe ref="selection" :columns="columns" :data="data" @on-selection-change="onDataSelect"></Table></Row>
        <Row style="margin: 10px">
            <Col span="8">
                <Button type="primary" @click="add" icon="plus">新增</Button>
                <Button type="primary" @click="editProject" icon="edit" v-bind:disabled="selectdata.length!==1">编辑</Button>
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
    import {getProjects,batchDelProjects,inssetProject,updateProject} from '../../axios/http';
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
                selectdata:[],
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
                    address:''
                },
                ruleValidate: {
                    name: [
                        { required: true, message: '请输入项目名称', trigger: 'blur' }
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
                getProjects(Cookies.get('projects'),this.currenPage,this.pageSize).then((response)=>{
                    //alert(response.data.total);
                    this.total=response.data.total;
                    //console.log(response.data.result);
                    this.data=response.data.list;
                }).catch(function (error) {
                    console.log(error);
                });
            },
            pageChange(page){
                // 页码发生改变的时候调用
                //alert(page);
                this.currenPage=page;
                this.initdata();
            },
            onDataSelect(selection){
                //console.log(selection.length);
                this.selectdata=selection;
            },
            //批量删除
            deletedata(){//删除选定数据
                this.$Modal.confirm({
                    title: '删除数据',
                    content: '<p>确定要删除选定的数据？</p>',
                    onOk: () => {
                        this.total=this.total-this.selectdata.length;
                        batchDelProjects(this.selectdata).then((response)=>{
                            if (response.data.result===this.selectdata.length){
//                                for (var i=0;i<this.selectdata.length;i++){
//                                    for (var j=0;j<this.data.length;j++){
//                                        if (this.data[j].id==this.selectdata[i].id){
//                                            console.log(j);
//                                            this.data.splice(j,1);
//                                            break;
//                                        }
//                                    }
//                                }
                                this.initdata();
                                //this.currenPage=this.selectdata.length==this.pageSize?this.currenPage-1:this.currenPage;
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
                        this.$Message.info('Clicked cancel');
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
                    address:this.formValidate.address
                };
                if(this.isadd){
                    inssetProject(param).then((response)=>{
                        if(response.data.result===1){
                            this.initdata();
                            this.$refs['formValidate'].resetFields();
                            this.showCurrentTableData=false;
                        }
                        }).catch(function (error) {
                            console.log(error);
                    });
                }else {
//                    let param = new URLSearchParams();
//                    param.append("username", this.formValidate.name);
//                    param.append("password", this.formValidate.principal);
                    updateProject(this.selectdata[0].id,param).then((response)=>{
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
                        this.saveProject();
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
            editProject(){
                this.formValidate.name=this.selectdata[0].name;
                this.formValidate.principal=this.selectdata[0].principal;
                this.formValidate.contact=this.selectdata[0].contact;
                this.formValidate.party_a=this.selectdata[0].party_a;
                this.formValidate.construction_unit=this.selectdata[0].construction_unit;
                this.formValidate.supervisor_unit=this.selectdata[0].supervisor_unit;
                this.formValidate.design_unit=this.selectdata[0].design_unit;
                this.formValidate. use_unit=this.selectdata[0].use_unit;
                this.formValidate.district=this.selectdata[0].district;
                this.formValidate. address=this.selectdata[0].address;
                this.showCurrentTableData=true;
                this.isadd=false;
                this.modelTitle="修改项目信息";
            },
            add(){
                this.showCurrentTableData=true;
                this.isadd=true;
                this.modelTitle="添加项目信息";
            }

        },
        created(){
            this.initdata();
        }

    }
</script>
