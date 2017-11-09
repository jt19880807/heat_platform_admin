<template>
    <div>
        <Row style="margin: 10px">
            <Col span="8"><Button type="primary" icon="plus">添加用户</Button></Col>
            <Col span="8" offset="8" style="text-align: right">
                <Input placeholder="请输入姓名搜搜..." style="width: 200px; ;" />
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
    </div>
</template>
<script>
    import {getAllUsers,batchDelUsers} from '../../axios/http';
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
//                            return h('div', [
//                                h('Icon', {
//                                    props: {
//                                        type: icon,
//                                        color:color,
//                                        size:20
//                                    }
//                                }),
//                                h('strong', text)
//                            ]);
                            return h('Tag', {
                                props: {
                                    //type: icon,
                                    color: color
                                }
                            }, text);
                        }
                    },
                    {
                        title: '最后登录',
                        key: 'last_login'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.show(params.index)
                                        }
                                    }
                                }, '查看'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                data: [],
                selectdata:[],
                //delButtonStatus:true,
            }
        },
        methods: {
            //加载数据
            initdata(){
                getAllUsers().then((response)=>{
                    console.log(response);
                    this.data=response.data.result;
                }).catch(function (error) {
                    console.log(error);
                });
            },
            pageChange(page){
               // 页码发生改变的时候调用
                //alert(page);
            },
            show (index) {
                this.$Modal.info({
                    title: '用户信息',
                   // content: `姓名：${this.data[index].name}<br>年龄：${this.data1[index].age}<br>地址：${this.data1[index].address}`
                })
            },
            remove (index) {
                this.data.splice(index, 1);
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
//                        for (var index=0;index<this.selectdata.length;index++){
//
//                            this.selectdata[index].createtime=this.selectdata[index].createtime.replace(/\s/g,'T');
//                            this.selectdata[index].last_login=this.selectdata[index].last_login.replace(/\s/g,'T');
//                            console.log(this.selectdata[index].createtime);
//                            console.log(this.selectdata[index].last_login);
//                        }
                        batchDelUsers(this.selectdata).then((response)=>{
                            console.log(response.data.result);
                            //this.data=response.data.result;
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
                        this.$Message.info('Clicked cancel');
                    }
                });
            }
        },
        created(){
            this.initdata();
        }

    }
</script>
