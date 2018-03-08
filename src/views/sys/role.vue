<template>
    <div>
        <Row style="margin: 10px">
            <Col span="8">
            &nbsp;
            </Col>
            <Col span="8" offset="8" style="text-align: right">
                <Input placeholder="请输入角色名" style="width: 200px; ;" />
                <span  style="margin: 0 10px;"><Button type="primary" icon="search">搜索</Button></span>
            </Col>
        </Row>
        <Row>
            <Col span="16">
                <Card >
                    <p slot="title">角色列表</p>
                    <Table highlight-row border stripe ref="selection" :columns="columns" :data="data" @on-current-change="onDataSelect">

                    </Table>
                    <Row style="margin: 10px">
                        <Col span="8">
                            <Button type="primary" @click="addRole" icon="plus">新增</Button>
                            <Button type="primary" @click="editRole" icon="edit" v-bind:disabled="selectData.length==0">编辑</Button>
                            <Button type="error" @click="deletedata" v-bind:disabled="selectData.length==0" icon="trash-a">删除</Button>
                        </Col>
                        <Col span="8" offset="8" style="text-align: right">
                        </Col>
                    </Row>
                </Card>
            </Col>
            <Col span="8">
                <Card >
                    <p slot="title">权限列表</p>
                    <p><Tree :data="permissionData" show-checkbox @on-check-change="onPermissionChanged"></Tree> </p>
                    <Row>
                        <Col span="8">
                        &nbsp;
                        </Col>
                        <Col span="8">
                        <Button type="primary" size="large" @click="savePermissions" v-bind:disabled="checkedPermmissions.length==0">保存</Button>
                        </Col>
                        <Col span="8">
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Modal v-bind:title="modalTitle" :closable=false :mask-closable=false v-model="showCurrentTableData">
            <div slot="footer">
                <Button type="error" size="large" @click="closeModal">关闭</Button>
                <Button type="primary" size="large" @click="saveData">保存</Button>
            </div>
            <Form ref="formValidate" :model="formValidate"  :rules="ruleValidate" :label-width="80">
                <Row >
                    <FormItem label="角色名" prop="name">
                        <Input v-model="formValidate.name"/>
                    </FormItem>
                    <FormItem label="角色编码" prop="code">
                        <Input v-model="formValidate.code"/>
                    </FormItem>
                    <FormItem label="描述" prop="des">
                        <Input v-model="formValidate.des"/>
                    </FormItem>
                    <FormItem label="状态" prop="status">
                        <RadioGroup v-model="formValidate.status">
                            <Radio label="正常"></Radio>
                            <Radio label="锁死"></Radio>
                        </RadioGroup>
                    </FormItem>
                </Row>
            </Form>
        </Modal>
    </div>
</template>
<script>
    import {batchDelRoles,getPermissions_Tree,insertRole,updateRole,getAllRoles,updateRolePermission} from '../../axios/http';
    import {checkeAllPermissions,checkePartPermissions} from '../../utils/index';
    export default {
        data () {
            return {
                columns: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '角色名',
                        key: 'name'
                    },
                    {
                        title: '角色编码',
                        key: 'code'
                    },
                    {
                        title: '描述',
                        key: 'des'
                    },
                    {
                        title: '状态',
                        key: 'status',
                        render: (h, params) => {
                            const row = params.row;
                            const color = row.status === 0 ? 'green' : row.status === 2 ? 'red':"";
                            const text = row.status === 0? '正常' : row.status === 2 ? '锁死' : '';
                            return h('Tag', {
                                props: {
                                    color: color
                                }
                            }, text);
                        }
                    }
                ],
                data: [],
                permissionData:[],
                selectData:'',
                formValidate: {
                    name: '',
                    code:'',
                    des:'',
                    status:'正常',
                    rights:'',
                },
                ruleValidate: {
                    name: [
                        { required: true, message: '角色名不能为空', trigger: 'blur' }
                    ]
                },
                showCurrentTableData: false,
                modalTitle:"",//弹出层标题
                isAdd:true,//是否添加
                roleRights:'',
                checkedPermmissions:[],
            }
        },
        methods: {
            //加载数据
            initData(){
                getAllRoles().then((response)=>{
                    this.data=response.data.result;
                   // this.rights=response.data.result.rights;
                }).catch(function (error) {
                    console.log(error);
                });
            },
            initPermissionData(){
                getPermissions_Tree().then((response)=>{
                    this.permissionData=response.data.result;
                }).catch(function (error) {
                    console.log(error);
                });
            },
            onDataSelect(currentRow,oldCurrentRow){
                this.selectData=currentRow;
                this.loadRolePermissions(this.selectData.rights);
            },
            loadRolePermissions(rights){
              if (rights==="*"){//拥有全部权限
                  checkeAllPermissions(this.permissionData);
              } else {//拥有部分权限
                  var intRight=[];
                  var allRights=rights.substring(0,rights.length-1).split(",");
                  for (var a in allRights){
                      intRight.push(parseInt(a));
                  }
                  checkePartPermissions(this.permissionData,rights);
              }
            },
            deletedata(){//删除选定数据
                this.$Modal.confirm({
                    title: '删除数据',
                    content: '<p>确定要删除选定的数据？</p>',
                    onOk: () => {
                        batchDelRoles(this.selectData).then((response)=>{
                            if (response.data.result===1){
                                this.initData();
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
            addRole(){
                this.showCurrentTableData=true;
                this.formValidate.rights='';
                this.isAdd=true;
                this.modalTitle="添加角色";
            },
            editRole(){

                this.formValidate.name=this.selectData.name;
                this.formValidate.code=this.selectData.code;
                this.formValidate.des=this.selectData.des;
                this.selectData.status==0?this.formValidate.status="正常":this.formValidate.status="锁死";
                this.showCurrentTableData=true;
                this.isAdd=false;
                this.modalTitle="修改角色";
            },
            //保存数据
            saveData(){
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        this.saveRole();
                    } else {
                        //this.$Message.error('Fail!');
                    }
                });
            },
            //保存用户数据(新增或者修改)
            saveRole(){
                var param={
                    name:this.formValidate.name,
                    code:this.formValidate.code,
                    des: this.formValidate.des,
                    status: this.formValidate.status=='正常'?0:2,
                    rights:this.formValidate.rights,
                };
                if (this.isAdd){
                    insertRole(param).then((response)=>{
                        if(response.data.result===1){
                            this.initData();
                            this.closeModal();
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                }else {
                    updateRole(this.selectData.id,param).then((response)=>{
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
            //关闭
            closeModal(){
                this.$refs['formValidate'].resetFields();
                this.showCurrentTableData=false;
            },
            //保存权限
            savePermissions(){
                var rights='';
                if (this.checkedPermmissions.length>0) {
                    for (var c in this.checkedPermmissions){
                        rights+=this.checkedPermmissions[c].id+',';
                    }
                }
                this.formValidate.rights=rights;
                var param={
                    rights:this.formValidate.rights,
                };
                updateRolePermission(this.selectData.id,param).then((response)=>{
                    if(response.data.result===1){
                        this.initData();
                        this.closeModal();
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            },
            onPermissionChanged(selection){
               //console.log(JSON.stringify( selection));
                this.checkedPermmissions=selection;
            },
        },

        created(){
            this.initData();
            this.initPermissionData();
        }

    }
</script>
