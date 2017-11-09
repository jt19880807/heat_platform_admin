<template>
    <div>
        <Row style="margin: 10px">
            <Col span="8"><Button type="primary" @click="showEditModal" icon="plus">添加用户</Button></Col>
            <Col span="8" offset="8" style="text-align: right">
            <Input placeholder="请输入项目名搜索." style="width: 200px; ;" />
            <span  style="margin: 0 10px;"><Button type="primary" icon="search">搜索</Button></span>
            </Col>
        </Row>
        <Row><Table border stripe ref="selection" :columns="columns" :data="data" @on-selection-change="onDataSelect"></Table></Row>
        <Row style="margin: 10px">
            <Col span="8">
            <Button type="error" @click="deletedata" v-bind:disabled="selectdata.length==0" icon="trash-a">删除选定</Button>
            </Col>
            <Col span="8" offset="8" style="text-align: right">
            <Page :total="this.data.length" show-total :pageSize=20 @on-change="pageChange"></Page>
            </Col>
        </Row>
        <Modal  v-model="showCurrentTableData">
            <div slot="footer">
                <Button type="text" size="large" @click="cancel">取消</Button>
                <Button type="primary" size="large" @click="ok">确定</Button>
            </div>
            <Form ref="formValidate" :model="formValidate"  :rules="ruleValidate" :label-width="80">
                <FormItem label="项目名称" prop="name">
                    <Input v-model="formValidate.name" placeholder="Enter your name"/>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
    import {getProjects,batchDelProjects} from '../../axios/http';
    import Cookies from 'js-cookie'
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
                //delButtonStatus:true,
                formValidate: {
                    name: '',
                },
                ruleValidate: {
                    name: [
                        { required: true, message: '请输入项目名称', trigger: 'blur' }
                    ],
                },
                showCurrentTableData: false,
                loading:true

            }
        },
        methods: {
            //加载数据
            initdata(){
                getProjects(Cookies.get('projects')).then((response)=>{
                    //console.log(response.data.result);
                    this.data=response.data.result;
                }).catch(function (error) {
                    console.log(error);
                });
            },
            pageChange(page){
                // 页码发生改变的时候调用
                //alert(page);
            },
            onDataSelect(selection){
                //console.log(selection.length);
                this.selectdata=selection;
            },
            deletedata(){//删除选定数据
                this.$Modal.confirm({
                    title: '删除数据',
                    content: '<p>确定要删除选定的数据？</p>',
                    onOk: () => {
                        batchDelProjects(this.selectdata).then((response)=>{
                            if (response.data.result===this.selectdata.length){
                                for (var i=0;i<this.selectdata.length;i++){
                                    for (var j=0;j<this.data.length;j++){
                                        if (this.data[j].id===this.selectdata[i].id){
                                            this.data.splice(j,1);
                                            break;
                                        }
                                    }
                                }
                                this.$Message.success('删除成功');
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
            ok(){
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        this.showCurrentTableData=false;
                       // this.$Message.success('Success!');
                    } else {
                        //this.$Message.error('Fail!');
                    }
                });

            },
            cancel(){
                this.$refs['formValidate'].resetFields();
            },
            showEditModal(){
                this.showCurrentTableData=true;
            },
        },
        created(){
            this.initdata();
        }

    }
</script>
