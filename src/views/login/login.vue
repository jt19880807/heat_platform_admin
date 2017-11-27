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

        </div>
      </Card>
		</div>

	</div>
</template>
<script>
    import {login} from '../../axios/http.js';
    import Cookies from 'js-cookie';
  export default {
    data(){
        const validateUserName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('账号不能为空空'));
            } else {
                if (this.erromsg.username == '用户不存在') {
                    callback(new Error(this.erromsg.username));
                }
                callback();
            }
        };
        const validatePassCheck = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('密码不能为空'));
            } else if (this.erromsg.password == '密码错误') {
                callback(new Error(this.erromsg.password));
            } else {
                callback();
            }
        };
      return{
        form:{
          userName:'',
          password:''
        },
         erromsg:{
           username:'',
           password:''
         },
        rules:{
          userName: [
            { validator: validateUserName, trigger: 'blur' }
          ],
          password: [
            { validator: validatePassCheck, trigger: 'blur' }
          ]
        }
      }
    },
    methods:{
      handleSubmit(){
          this.erromsg.password='';
          this.erromsg.username='';
          this.$refs['loginForm'].validate((valid)=>{
            if(valid){
                login({
                    username:this.form.userName,
                    password:this.form.password,
                }).then((response)=>{
                    if (response.data.msg=="成功"){
                       // console.log(response.data.result[0].projects);
                        //将用户名保存到Cookie中
                        Cookies.set('username',this.form.userName,{expires: 1});
                        Cookies.set('projects',response.data.result[0].projects,{expires: 1});
                        Cookies.set('buildings',response.data.result[0].projects,{expires: 1});
                        Cookies.set('userid',response.data.result[0].id,{expires: 1});
                        this.$router.push({
                            name: 'home_index'
                        });
                    }
                    else if (response.data.msg=="密码错误"){
                        this.erromsg.password=response.data.msg;
                        this.$refs.loginForm.validateField('password');
                    }
                    else if (response.data.msg=="用户不存在"){
                        this.erromsg.username=response.data.msg;
                        this.$refs['loginForm'].validateField('userName');
                    }
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

