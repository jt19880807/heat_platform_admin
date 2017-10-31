<style lang="less">
	@import './login.less';
</style>
<template>
	<div class="login">
		<div class="login-con">
			<Card :bordered="false">
        <p slot="title">
          <Icon type="log_in"></Icon>
          登录
        </p>
        <div class="form-con">
          <Form ref="loginForm" :model="form" :rules="rules">
            <FormItem prop="userName">
              <Input v-model="form.userName" size="large" placeholder="用户名">
                <span slot="prepend">
                  <Icon :size="16" type="person"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input v-model="form.password" type="password" size="large" placeholder="密码">
                <span slot="prepend">
                   <Icon :size="14" type="locked"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem>
              <Button @click="handleSubmit" type="primary" long>登录</Button>
            </FormItem>
          </Form>
          <p class="login-tip">输入任意用户名和密码即可</p>
        </div>
      </Card>
		</div>

	</div>
</template>
<script>
    import {login,test} from '../../axios/http.js';
    import qs from 'qs';
  export default {
    data(){
      return{
        form:{
          userName:'',
          password:''
        },
        rules:{
          userName: [
            { required: true, message: '账号不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods:{
      handleSubmit(){
          this.$refs['loginForm'].validate((valid)=>{
            if(valid){

                let params = new URLSearchParams();
                params.append('username', 'admin');
                params.append('password', 'admin');
                console.log(params);
//                test(params).then((response)=>{
//                    alert(response);
//                    console.log(response);
//                }).catch(function (error) {
//                    console.log(error);
//                });
                login(params).then((response)=>{
                    console.log(response);
                }).catch(function (error) {
                    console.log(error);
                });
              //alert(this.form.userName+":"+this.form.password);
//                this.$router.push({
//                    name: 'home_index'
//                });
            }
          })
      }
    }
  }
</script>

