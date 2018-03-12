<template>
    <div>
        <Row style="margin: 10px">
            <Col span="8">
                &nbsp;
            </Col>
            <Col span="8" offset="8" style="text-align: right">
                <Input placeholder="请输入姓名" style="width: 200px; ;" />
                <span  style="margin: 0 10px;"><Button type="primary" icon="search">搜索</Button></span>
            </Col>
        </Row>
        <Row><Table border stripe ref="selection" :columns="columns" :data="data" @on-selection-change="onDataSelect"></Table></Row>
        <Row style="margin: 10px">
            <Col span="8">
                <Button type="primary" v-has="'user_add'" @click="addUser" icon="plus">新增</Button>
            <Button type="primary" @click="editUser" icon="edit" v-bind:disabled="selectData.length!==1">编辑</Button>
                <Button type="error" @click="deletedata" v-bind:disabled="selectData.length==0" icon="trash-a">删除</Button>
            </Col>
            <Col span="8" offset="8" style="text-align: right">
                <Page :total="this.data.length" show-total :pageSize=20 @on-change="pageChange"></Page>
            </Col>
        </Row>
        <Modal v-bind:title="modalTitle" :closable=false :mask-closable=false v-model="showCurrentTableData">
            <div slot="footer">
                <Button type="error" size="large" @click="closeModal">关闭</Button>
                <Button type="primary" size="large" @click="saveData">保存</Button>
            </div>
            <Form ref="formValidate" :model="formValidate"  :rules="ruleValidate" :label-width="80">
                <Row >
                    <FormItem label="用户名" prop="userName">
                        <Input v-model="formValidate.userName"/>
                    </FormItem>
                </Row>
                <Row v-show="isAdd">
                    <FormItem label="密码" prop="password">
                        <Input type="password" v-model="formValidate.password"/>
                    </FormItem>
                </Row>
                <Row v-show="isAdd">
                    <FormItem label="确认密码" prop="passwdCheck">
                        <Input type="password" v-model="formValidate.passwdCheck"/>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="角色" prop="roleId">
                        <Select v-model="formValidate.roleId" filterable>
                            <Option v-for="item in roleList" :value="item.id" :key="item.name">{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                </Row>
                <Row>
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
    import {getAllUsers,batchDelUsers,insertUser,updateUser,getAllRoles} from '../../axios/http';
    export default {
        data () {
            const validateName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入用户名'));
                }
            };
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('密码不能为空'));
                } else {
//                    if (this.formValidate.passwdCheck !== '') {
//                        // 对第二个密码框单独验证
//                        this.$refs['ruleValidate'].validateField('passwdCheck');
//                    }
                    callback();
                }
            };
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.formValidate.password) {
                    callback(new Error('两次密码输入不一致'));
                } else {
                    callback();
                }
            };
            return {
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '用户名',
                        key: 'username'
                    },
                    {
                        title: '角色',
                        key: 'rolename'
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
                    },
                    {
                        title: '最后登录',
                        key: 'last_login'
                    }
                ],
                data: [],
                selectData:[],
                roleList:[],
                formValidate: {
                    userName: '',
                    password:'',
                    passwdCheck:'',
                    roleId:'',
                    status:'正常',
                },
                ruleValidate: {
                    userName: [
                        { required: true, message: '用户名不能为空', trigger: 'blur' }
                    ],
                    password: [
                        { required: true,validator: validatePass, trigger: 'blur' }
                    ],
                    passwdCheck: [
                        { required: true,validator: validatePassCheck, trigger: 'blur' }
                    ],
                    roleId: [
                        { type: 'number',required: true, message: '请选择角色', trigger: 'change' },
                    ],
                },
                showCurrentTableData: false,
                modalTitle:"",//弹出层标题
                isAdd:true,//是否添加
            }
        },
        methods: {
            //加载数据
            initData(){
                getAllUsers().then((response)=>{
                    this.data=response.data.result;
                }).catch(function (error) {
                    console.log(error);
                });
            },
            initRoles(){
                getAllRoles().then((response)=>{
                    this.roleList=response.data.result;
                }).catch(function (error) {
                    console.log(error);
                })
            },
            pageChange(page){

            },
            onDataSelect(selection){
                this.selectData=selection;
            },
            deletedata(){//删除选定数据
                this.$Modal.confirm({
                    title: '删除数据',
                    content: '<p>确定要删除选定的数据？</p>',
                    onOk: () => {
                        console.log(this.selectData);
                        this.total=this.total-this.selectData.length;
                        batchDelUsers(this.selectdata).then((response)=>{
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
            addUser(){
                this.showCurrentTableData=true;
                this.isAdd=true;
                this.modalTitle="添加用户";
            },
            editUser(){
                this.formValidate.userName=this.selectData[0].username;
                this.formValidate.password=this.selectData[0].password;
                this.formValidate.passwdCheck=this.selectData[0].password;
                this.formValidate.roleId=this.selectData[0].role_id;
                this.selectData[0].status==0?this.formValidate.status="正常":this.formValidate.status="锁死";
                this.showCurrentTableData=true;
                this.isAdd=false;
                this.modalTitle="修改用户";
            },
            //保存数据
            saveData(){
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        this.saveUser();
                    } else {
                        //this.$Message.error('Fail!');
                    }
                });
            },
            //保存用户数据(新增或者修改)
            saveUser(){
                var param={
                    username:this.formValidate.userName,
                    password:this.formValidate.password,
                    role_id: this.formValidate.roleId,
                    projects: '*',
                    status: this.formValidate.status=='正常'?0:2,
                };
                if (this.isAdd){
                    insertUser(param).then((response)=>{
                        if(response.data.result===1){
                            this.initData();
                            this.closeModal();
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                }else {
                    updateUser(this.selectData[0].id,param).then((response)=>{
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
        },

        created(){
            this.initRoles();
            this.initData();
        }

    }
</script>
