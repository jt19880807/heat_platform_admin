<template>
    <div>
        <!--<Row style="margin: 10px">-->
            <!--<Col span="8"><Button type="primary" icon="plus">添加用户</Button></Col>-->
            <!--<Col span="8" offset="8" style="text-align: right">-->
            <!--<Input placeholder="请输入姓名" style="width: 200px; ;" />-->
            <!--<span  style="margin: 0 10px;"><Button type="primary" icon="search">搜索</Button></span>-->
            <!--</Col>-->
        <!--</Row>-->
        <Row><Table border stripe ref="selection" :columns="columns" :data="data" @on-selection-change="onDataSelect"></Table></Row>
        <Row style="margin: 10px">
            <Col span="8">
                <Button type="primary" @click="addRole" icon="plus">新增</Button>
                <Button type="primary" @click="editRole" icon="edit" v-bind:disabled="selectData.length==0">编辑</Button>
                <Button type="error" @click="deletedata" v-bind:disabled="selectData.length==0" icon="trash-a">删除</Button>
            </Col>
            <Col span="8" offset="8" style="text-align: right">
            </Col>
        </Row>
    </div>
</template>
<script>
    import {getAllPermissions,insertPermission,updatePermission} from '../../axios/http';
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

                            //const text = row.level === 1? '|-'+row.name : row.level === 2? '  |-'+row.name ?row.level === 3? '    |-'+row.name:"";

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
                selectData:[],
            }
        },
        methods: {
            //加载数据
            initdata(){
                getAllPermissions().then((response)=>{
                    console.log(JSON.stringify(response.data.result));
                    this.data=response.data.result;
                }).catch(function (error) {
                    console.log(error);
                });
            },
            onDataSelect(selection){
                this.selectdata=selection;
            },
            deletedata(){//删除选定数据
                this.$Modal.confirm({
                    title: '删除数据',
                    content: '<p>确定要删除选定的数据？</p>',
                    onOk: () => {
                        batchDelUsers(this.selectdata).then((response)=>{
                            if (response.data.result===this.selectdata.length){
                                for (var i=0;i<this.selectdata.length;i++){
                                    for (var j=0;j<this.data.length;j++){
                                        if (this.data[j].id===this.selectdata[i].id){
                                            this.data.splice(j,1);
                                            break;
                                        }
                                    }
                                }
                                this.$Message.info('删除成功');
                            }
                        }).catch(function (error) {
                            console.log(error);
                        });
                    },
                    onCancel: () => {
                    }
                });
            }
        },
        created(){
            this.initdata();
        }

    }
</script>
