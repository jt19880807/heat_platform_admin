    <style lang="less">
        @import './login.less';
    </style>
    <template>
        <div class="login">
            <div class="login-con">
                <Card :bordered="false" style="background-color:#9ea7b4;opacity:1">
                    <p slot="title" style="text-align: center;font-size: large;color: #fff  ">
                        <!--<Icon type="log-in"></Icon>-->
                        <!--登录-->
                        米诺能源监控管理平台
                    </p>
                    <p slot="title" style="text-align: center;font-size: large;color: #fff">
                        <!--<Icon type="log-in"></Icon>-->
                        <!--登录-->
                        Minol EMP
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
                            <Row>
                                <Col span="16">
                                    <FormItem prop="checkCode">
                                        <Input v-model="form.checkCode" size="large" placeholder="验证码">
                                        <span slot="prepend">
                                           <Icon :size="14" type="code"></Icon>
                                        </span>
                                        </Input>
                                    </FormItem>
                                </Col>
                                <Col span="8">
                                    <div class="code" @click="refreshCode">
                                        <SIdentify :identifyCode="identifyCode"></SIdentify>
                                    </div>
                                </Col>
                            </Row>
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
        import SIdentify from '../../components/identify.vue'
      export default {
          components:{
              SIdentify
          },
        data(){
            const validateUserName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('账号不能为空'));
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
            const validateCheckCode= (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入验证码'));
                } else if (this.form.checkCode.toLowerCase() !== this.identifyCode.toLowerCase()) {
                   // this.refreshCode();
                    callback(new Error("验证码不正确"));

                } else {
                    callback();
                }
            };
          return{
            form:{
              userName:'',
              password:'',
                checkCode:''
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
              ],
                checkCode:[
                    {validator:validateCheckCode,trigger:'blur'}
                ],
            },
              identifyCodes: "23456789abcdefjhgkmnpqrstuvwxyzABCDEFJHJKLMNPQRSTUVWXYZ",
              identifyCode: "",
              clientIP:'',
          }
        },
          mounted() {
              this.identifyCode = "";
              this.makeCode(this.identifyCodes, 4);
              const publicIp = require('public-ip');
              publicIp.v4().then(ip => {
                  this.clientIP=ip;
//                  console.log(this.clientIP);
              });
          },
        methods:{
          handleSubmit(){
              //console.log(this.clientIP);
              this.erromsg.password='';
              this.erromsg.username='';
              this.$refs['loginForm'].validate((valid)=>{
                if(valid){
                    login({
                        username:this.form.userName,
                        password:this.form.password,
                        clientIP:this.clientIP
                    }).then((response)=>{
                        if (response.data.msg=="成功"){
                            console.log(response.data.result[0]);
                            //将用户名保存到Cookie中
                            Cookies.set('username',this.form.userName,{expires: 1});
                            Cookies.set('projects',response.data.result[0].projects,{expires: 1});
                            Cookies.set('buildings',response.data.result[0].projects,{expires: 1});
                            Cookies.set('userid',response.data.result[0].id,{expires: 1});
                            Cookies.set('rolename',response.data.result[0].rolename,{expires: 1});
                            if (response.data.result[0].loginInfo!=undefined) {
                                Cookies.set('lastLoginTime', response.data.result[0].loginInfo.lastlogin_time, {expires: 1});
                                Cookies.set('lastLoginCity', response.data.result[0].loginInfo.lastlogin_city, {expires: 1});
                            }
                            else {
                                Cookies.set('lastLoginTime', '', {expires: 1});
                                Cookies.set('lastLoginIP', '', {expires: 1});
                            }
                            sessionStorage.setItem("rights",response.data.result[0].rights);
                            sessionStorage.setItem("menus",response.data.result[0].menus);
                            sessionStorage.setItem("buttons",response.data.result[0].buttons);
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
          },
            randomNum(min, max) {
                return Math.floor(Math.random() * (max - min) + min);
            },
            refreshCode() {
                this.identifyCode = "";
                this.makeCode(this.identifyCodes, 4);
            },
            makeCode(o, l) {
                for (let i = 0; i < l; i++) {
                    this.identifyCode += this.identifyCodes[
                        this.randomNum(0, this.identifyCodes.length)
                        ];
                }
//                console.log(this.identifyCode);
            }
        }
      }
    </script>
    <style>
        .code {
            /*margin: 400px auto;*/
            width: 100%;
            height: 40px;
           /*// border: 1px solid red;*/
        }
    </style>

