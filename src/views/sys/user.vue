<template>
    <Table border stripe ref="selection" :columns="columns" :data="data"></Table>
</template>
<script>
    import {getAllUsers} from '../../axios/http';
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
                        key: 'status'
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
                data: []
            }
        },
        methods: {
            //加载数据
            initdata(){
                getAllUsers().then((response)=>{
                    console.log(response.data.result);
                    this.data=response.data.result;
                }).catch(function (error) {
                    console.log(error);
                });
            },
            show (index) {
                this.$Modal.info({
                    title: '用户信息',
                   // content: `姓名：${this.data[index].name}<br>年龄：${this.data1[index].age}<br>地址：${this.data1[index].address}`
                })
            },
            remove (index) {
                this.data.splice(index, 1);
            }
        },
        created(){
            this.initdata();
        }

    }
</script>
