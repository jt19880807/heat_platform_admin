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
            <Button type="error" @click="deletedata" v-bind:disabled="selectdata.length==0" icon="trash-a">删除选定</Button>
            </Col>
            <Col span="8" offset="8" style="text-align: right">
            <Page :total="this.data.length" show-total :pageSize=20 @on-change="pageChange"></Page>
            </Col>
        </Row>
    </div>
</template>
<script>
    import {getAllPermissionss,insertPermission,updatePermission} from '../../axios/http';
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
                        key: 'name'
                    },
                    {
                        title: '路径',
                        key: 'path'
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
                            const color = 'black';
                            const text = row.menu_type === 1? '菜单' : row.status === 2 ? '按钮' : '';
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
                selectdata:[],
            }
        },
        methods: {
            //加载数据
            initdata(){
                getAllPermissionss().then((response)=>{
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
