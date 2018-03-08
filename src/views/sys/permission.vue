<template>
    <div>

        <Row>
            <Col span="8">
            <Card >
                <p slot="title">权限列表</p>
                <Row style="margin: 10px">
                    <Button type="primary" @click="addPermission" v-bind:disabled="selectData.length==0" icon="plus">新增</Button>
                    <Button type="primary" @click="editPermission" icon="edit" v-bind:disabled="selectData.length==0">编辑</Button>
                    <Button type="error" @click="deletedata" v-bind:disabled="selectData.length==0" icon="trash-a">删除</Button>
                </Row>
                <Row>
                    <Tree :data="data" @on-select-change="onDataSelect"></Tree>
                </Row>
            </Card>
            </Col>
            <Col span="16">
            <Card >
                <p slot="title">{{modalTitle}}</p>
                <Form ref="formValidate" :model="formValidate"  :rules="ruleValidate" :label-width="80">
                    <Row>
                        <Col span="8">
                        &nbsp;
                        </Col>
                        <Col span="8">
                            <FormItem label="父权限" prop="parentname">
                                <Input v-model="formValidate.parentname" disabled/>
                            </FormItem>
                            <FormItem label="权限名" prop="name">
                                <Input v-model="formValidate.name"/>
                            </FormItem>
                            <FormItem label="路径" prop="path">
                                <Input v-model="formValidate.path"/>
                            </FormItem>
                            <FormItem label="权限编码" prop="code">
                                <Input v-model="formValidate.code"/>
                            </FormItem>
                            <FormItem label="类型" prop="menu_type">
                                <RadioGroup v-model="formValidate.menu_type">
                                    <Radio label="菜单"></Radio>
                                    <Radio label="按钮"></Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem label="状态" prop="status">
                                <RadioGroup v-model="formValidate.status">
                                    <Radio label="正常"></Radio>
                                    <Radio label="锁死"></Radio>
                                </RadioGroup>
                            </FormItem>
                        </Col>
                        <Col span="8">
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                        &nbsp;
                        </Col>
                        <Col span="8">
                            <Button type="primary" size="large" @click="saveData" v-bind:disabled="selectData.length==0">保存</Button>
                        </Col>
                        <Col span="8">
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
    </div>

</template>
<script>
    import {getAllPermissions,getPermissions_Tree,insertPermission,updatePermission,batchDelPermissions} from '../../axios/http';
    export default {
        data () {
            return {
                columns: [
                    {
                        title: '权限名称',
                        key: 'name',
                        render: (h, params) => {
                            const row = params.row;
                            var text = "";
                            if (row.level === 1){
                                text='|-'+row.name;
                                return h('p',text);
                            } else if (row.level === 2){
                                text='|-'+row.name;
                                return h('p',{
                                    style: {
                                        'margin-left': '20px'
                                    }
                                }, text);
                            }
                            else if (row.level === 3){
                                text='|-'+row.name;
                                return h('p',{
                                    style: {
                                        'margin-left': '40px'
                                    }
                                }, text);
                            }
                        }
                    },
                    {
                        title: '路径',
                        key: 'url'
                    },
                    {
                        title: '权限代码',
                        key: 'code'
                    },
                    {
                        title: '类型',
                        key: 'menu_type',
                        render: (h, params) => {
                            const row = params.row;
                            const color = row.menu_type === 1 ? 'green' : row.menu_type === 2 ? 'red':"";
                            const text = row.menu_type === 1? '菜单' : row.menu_type === 2 ? '按钮' : '';
                            return h('Tag', {
                                props: {
                                    color: color
                                }
                            }, text);
                        }
                    },
                    {
                        title: '状态',
                        key: 'status',
                        render: (h, params) => {
                            const row = params.row;
                            const color = row.status === 0 ? 'green' : row.status === 2 ? 'red':"";
                            const text = row.status === 0? '正常' : row.status === 2 ? '禁用' : '';
                            return h('Tag', {
                                props: {
                                    color: color
                                }
                            }, text);
                        }
                    }
                ],
                data: [],
                selectData:'',
                formValidate: {
                    name: '',
                    path:'',
                    code:'',
                    menu_type:'菜单',
                    status:'正常',
                    parentname:'',
                    parent_id:0
                },
                ruleValidate: {
                    name: [
                        { required: true, message: '权限名不能为空', trigger: 'blur' }
                    ]
                },
                showCurrentTableData: false,
                modalTitle:"",//弹出层标题
                isAdd:true,//是否添加
            }
        },
        methods: {
            //加载数据
            initData(){
                getPermissions_Tree().then((response)=>{
                    this.data=response.data.result;
                }).catch(function (error) {
                    console.log(error);
                });
            },
            onDataSelect(selection){
                this.selectData=selection;
                this.editPermission();
            },
            deletedata(){//删除选定数据
                this.$Modal.confirm({
                    title: '删除数据',
                    content: '<p>确定删除此菜单及其子菜单的数据？</p>',
                    onOk: () => {
                        batchDelPermissions(this.selectData[0]).then((response)=>{
                            if (response.data.result>0){
                                this.initData();
                                this.$Message.success('删除成功');

                            }
                        }).catch(function (error) {
                            console.log(error);
                        });
                    },
                    onCancel: () => {
                    }
                });
            },
            addPermission(){
                this.formValidate.parentname=this.selectData[0].name;
                this.formValidate.parent_id=this.selectData[0].id;
                this.formValidate.name='';
                this.formValidate.path='';
                this.formValidate.code='';
                this.formValidate.menu_type="菜单";
                this.formValidate.status="正常";
                this.isAdd=true;
                this.modalTitle="添加权限";

            },
            editPermission(){
                var parentid=this.selectData[0].parent_id;
                var rootData=this.data;
                this.formValidate.parentname="/";
                for (var i=0;i<rootData.length;i++){
                    if (rootData[i].id==parentid){
                        this.formValidate.parentname=rootData[i].name;
                        break;
                    }
                }
                this.formValidate.name=this.selectData[0].name;
                this.formValidate.parent_id=this.selectData[0].parent_id;
                this.formValidate.path=this.selectData[0].url;
                this.formValidate.code=this.selectData[0].code;
                this.selectData[0].menu_type==1?this.formValidate.menu_type="菜单":this.formValidate.menu_type="按钮";
                this.selectData[0].status==0?this.formValidate.status="正常":this.formValidate.status="锁死";
                this.modalTitle="修改权限";
                this.isAdd=false;
            },
            //保存数据
            saveData(){
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        this.savePermission();
                    } else {
                        //this.$Message.error('Fail!');
                    }
                });
            },
            //保存用户数据(新增或者修改)
            savePermission(){
                var param={
                    name:this.formValidate.name,
                    parent_id:this.formValidate.parent_id,
                    url:this.formValidate.path,
                    code:this.formValidate.code,
                    level:this.selectData.level+1,
                    menu_type: this.formValidate.menu_type=='菜单'?1:2,
                    status: this.formValidate.status=='正常'?0:2,
                };
                if (this.isAdd){
                    insertPermission(param).then((response)=>{
                        if(response.data.result===1){
                            this.initData();
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                }else {
                    updatePermission(this.selectData[0].id,param).then((response)=>{
                        if(response.data.result===1){
                            this.initData();
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                }
            },
            //关闭
            closeModal(){
                this.$refs['formValidate'].resetFields();
                this.showCurrentTableData=false;
            },
        },
        created(){
            this.initData();
        }

    }
</script>
