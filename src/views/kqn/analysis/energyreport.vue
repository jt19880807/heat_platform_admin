<template>
    <div>
        <Row>
            <Col span="4">
                <Card>
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        项目列表
                    </p>
                    <Tree :data="treeData" @on-select-change="treeSelectChange"></Tree>
                </Card>
            </Col>
            <Col span="20">
                <Card>
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        能耗报告
                    </p>
                    <Row style="margin: 10px">
                        <Col span="8" >
                        <Checkbox size="large" v-model="nhxy">能耗效益</Checkbox>
                        <Checkbox v-model="hjxy">环境效益</Checkbox>
                        </Col>
                        <Col span="16" style="text-align: right">
                            <span>开始日期&nbsp;&nbsp;</span>
                           <DatePicker size="small" type="date" format="yyyy/MM/dd" @on-change="startDateChange" placeholder="Select date" :value="startDate"  style="width: 120px"></DatePicker>
                            <span>结束日期&nbsp;&nbsp;</span>
                            <DatePicker size="small" type="date" format="yyyy/MM/dd" @on-change="endDateChange" placeholder="Select date" :value="endDate" style="width: 120px"></DatePicker>
                            &nbsp;&nbsp;
                             <Button type="primary" icon="ios-search" @click="searchData">查询</Button>
                        </Col>
                    </Row>
                    <hr/>
                    <Row>
                        <h2 style="text-align: center">能耗报告</h2>
                    </Row>
                    <br/>
                    <Row style="margin-bottom: 10px;">
                        <Col span="2" style="">
                        &nbsp;&nbsp;
                        </Col>
                        <Col span="4" style="text-align: right">
                        &nbsp;&nbsp;项目名称&nbsp;&nbsp;
                        </Col>
                        <Col span="18" >
                        <label style="border-bottom:#000000 solid 1px; width:60%; display:block;text-align: center"> {{heat}}</label>
                        </Col>
                    </Row>
                    <Row style="margin-bottom: 10px;">
                        <Col span="2" style="">
                        &nbsp;&nbsp;
                        </Col>
                        <Col span="4" style="text-align: right">
                        &nbsp;&nbsp;项目地址&nbsp;&nbsp;
                        </Col>
                        <Col span="12" >
                            <label style="border-bottom:#000000 solid 1px; display:block;text-align: center"> {{heat}}</label>
                        </Col>
                        <Col span="6" style="">
                        &nbsp;&nbsp;
                        </Col>
                    </Row>
                    <Row style="margin-bottom: 10px;">
                        <Col span="2" style="">
                        &nbsp;&nbsp;
                        </Col>
                        <Col span="16" style="text-align: right">
                            <Row>
                                <Col span="6" style="text-align: right">
                                &nbsp;&nbsp;制热/制冷面积&nbsp;&nbsp;
                                </Col>
                                <Col span="6" style="text-align: right">
                                <label style="border-bottom:#000000 solid 1px; display:block;text-align: center"> {{heat}}㎡</label>
                                </Col>
                                <Col span="6" style="text-align: right">
                                &nbsp;&nbsp;建筑性质&nbsp;&nbsp;
                                </Col>
                                <Col span="6" style="text-align: right">
                                <label style="border-bottom:#000000 solid 1px;display:block;text-align: center"> {{heat}}</label>
                                </Col>
                            </Row>
                        </Col>
                        <Col span="6" style="">
                        &nbsp;&nbsp;
                        </Col>
                    </Row>
                    <Row style="margin-bottom: 10px;">
                        <Col span="2" style="">
                        &nbsp;&nbsp;
                        </Col>
                        <Col span="16" style="text-align: right">
                        <Row>
                            <Col span="6" style="text-align: right">
                            &nbsp;&nbsp;建筑年限&nbsp;&nbsp;
                            </Col>
                            <Col span="6" style="text-align: right">
                            <label style="border-bottom:#000000 solid 1px; display:block;text-align: center"> {{heat}}</label>
                            </Col>
                            <Col span="6" style="text-align: right">
                            &nbsp;&nbsp;户数/房间数&nbsp;&nbsp;
                            </Col>
                            <Col span="6" style="text-align: right">
                            <label style="border-bottom:#000000 solid 1px;display:block;text-align: center"> {{heat}}</label>
                            </Col>
                        </Row>
                        </Col>
                        <Col span="6" style="">
                        &nbsp;&nbsp;
                        </Col>
                    </Row>
                    <br>
                    <Row style="margin-bottom: 10px;">
                        <Col span="2" style="">
                        &nbsp;&nbsp;
                        </Col>
                        <Col span="4" style="text-align: right">
                        &nbsp;&nbsp;评估时间&nbsp;&nbsp;
                        </Col>
                        <Col span="12" >
                        <label style="border-bottom:#000000 solid 1px; display:block;text-align: center"> {{heat}}</label>
                        </Col>
                        <Col span="6" style="">
                        &nbsp;&nbsp;
                        </Col>
                    </Row>
                    <Row style="margin-bottom: 10px;">
                        <Col span="2" style="">
                        &nbsp;&nbsp;
                        </Col>
                        <Col span="16" style="text-align: right">
                        <Row>
                            <Col span="6" style="text-align: right">
                            &nbsp;&nbsp;室内平均温度&nbsp;&nbsp;
                            </Col>
                            <Col span="6" style="text-align: right">
                            <label style="border-bottom:#000000 solid 1px; display:block;text-align: center"> {{averageTemp}}℃</label>
                            </Col>
                            <Col span="6" style="text-align: right">
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            </Col>
                            <Col span="6" style="text-align: right">
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            </Col>
                        </Row>
                        </Col>
                        <Col span="6" style="">
                        &nbsp;&nbsp;
                        </Col>
                    </Row>
                    <Row style="margin-bottom: 10px;">
                        <Col span="2" style="">
                        &nbsp;&nbsp;
                        </Col>
                        <Col span="16" style="text-align: right">
                        <Row>
                            <Col span="6" style="text-align: right">
                            &nbsp;&nbsp;温度达标天数&nbsp;&nbsp;
                            </Col>
                            <Col span="6" style="text-align: right">
                            <label style="border-bottom:#000000 solid 1px; display:block;text-align: center"> {{averageTemp}}天</label>
                            </Col>
                            <Col span="6" style="text-align: right">
                            &nbsp;&nbsp;温度达标天数&nbsp;&nbsp;
                            </Col>
                            <Col span="6" style="text-align: right">
                            <label style="border-bottom:#000000 solid 1px; display:block;text-align: center"> {{averageTemp}}天</label>
                            </Col>
                        </Row>
                        </Col>
                        <Col span="6" style="">
                        &nbsp;&nbsp;
                        </Col>
                    </Row>
                    <Row style="margin-bottom: 10px;">
                        <Col span="2" style="">
                        &nbsp;&nbsp;
                        </Col>
                        <Col span="16" style="text-align: right">
                        <Row>
                            <Col span="6" style="text-align: right">
                            &nbsp;&nbsp;总耗电热量&nbsp;&nbsp;
                            </Col>
                            <Col span="6" style="text-align: right">
                            <label style="border-bottom:#000000 solid 1px; display:block;text-align: center"> {{heat}}</label>
                            </Col>
                            <Col span="6" style="text-align: right">
                            &nbsp;&nbsp;总耗电量&nbsp;&nbsp;
                            </Col>
                            <Col span="6" style="text-align: right">
                            <label style="border-bottom:#000000 solid 1px; display:block;text-align: center"> {{powerConsumption}}kwh</label>
                            </Col>
                        </Row>
                        </Col>
                        <Col span="6" style="">
                        &nbsp;&nbsp;
                        </Col>
                    </Row>
                    <Row style="margin-bottom: 10px;">
                        <Col span="2" style="">
                        &nbsp;&nbsp;
                        </Col>
                        <Col span="16" style="text-align: right">
                        <Row>
                            <Col span="6" style="text-align: right">
                            &nbsp;&nbsp;制热性能系数SCOP&nbsp;&nbsp;
                            </Col>
                            <Col span="6" style="text-align: right">
                            <label style="border-bottom:#000000 solid 1px; display:block;text-align: center"> {{SCOP}}</label>
                            </Col>
                            <Col span="6" style="text-align: left" >
                            (不小于1.8)
                            </Col>
                            <Col span="6" style="text-align: right">
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            </Col>
                        </Row>
                        </Col>
                        <Col span="6" style="">
                        &nbsp;&nbsp;
                        </Col>
                    </Row>
                    <Row style="margin-bottom: 10px;">
                        <Col span="2" style="">
                        &nbsp;&nbsp;
                        </Col>
                        <Col span="4" style="text-align: right">
                        &nbsp;&nbsp;<b>评估结果</b>&nbsp;&nbsp;
                        </Col>
                        <Col span="12" >
                        <label style="border-bottom:#000000 solid 1px; display:block;text-align: center"> {{heat}}</label>
                        </Col>
                        <Col span="6" style="">
                        &nbsp;&nbsp;
                        </Col>
                    </Row>

                        <Row style="margin-bottom: 10px;">
                            <Col span="2" style="">
                            &nbsp;&nbsp;
                            </Col>
                            <Col span="16" style="text-align: right">
                            <Card v-if="this.nhxy">
                                <p slot="title" style="text-align: left">
                                    能耗效益
                                </p>
                            <Row>
                                <Col span="6" style="text-align: right">
                                &nbsp;&nbsp;常规能源供热能耗Qt：&nbsp;&nbsp;
                                </Col>
                                <Col span="6" style="text-align: right">
                                <label style="border-bottom:#000000 solid 1px; display:block;text-align: center"> {{conventionalEnergy}}kgcc</label>
                                </Col>
                                <Col span="6" style="" >
                                &nbsp;&nbsp;实际能耗Qr&nbsp;&nbsp;
                                </Col>
                                <Col span="6" style="text-align: right">
                                <label style="border-bottom:#000000 solid 1px; display:block;text-align: center"> {{totalEnergyConsumption}}kgcc</label>
                                </Col>
                            </Row>
                                <Row>
                                    <Col span="6" style="text-align: right">
                                    &nbsp;&nbsp;能源替代量Qs：&nbsp;&nbsp;
                                    </Col>
                                    <Col span="6" style="text-align: right">
                                    <label style="border-bottom:#000000 solid 1px; display:block;text-align: center"> {{replaceEnergy}}kgcc</label>
                                    </Col>
                                    <Col span="6" style="text-align: left" >
                                    (不小于1.8)
                                    </Col>
                                    <Col span="6" style="text-align: right">
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    </Col>
                                </Row>
                            </Card>
                            </Col>
                            <Col span="6" style="">
                            &nbsp;&nbsp;
                            </Col>
                        </Row>

                        <Row style="margin-bottom: 10px;">
                            <Col span="2" style="">
                            &nbsp;&nbsp;
                            </Col>
                            <Col span="16" style="text-align: right">
                            <Card v-if="this.hjxy">
                                <p slot="title" style="text-align: left">
                                    环境效益
                                </p>
                            <Row>
                                <Col span="6" style="text-align: right">
                                &nbsp;&nbsp;二氧化碳减排量：&nbsp;&nbsp;
                                </Col>
                                <Col span="6" style="text-align: right">
                                <label style="border-bottom:#000000 solid 1px; display:block;text-align: center"> {{CO2}}kg</label>
                                </Col>
                                <Col span="6" style="" >
                                &nbsp;&nbsp;二氧化硫减排量：&nbsp;&nbsp;
                                </Col>
                                <Col span="6" style="text-align: right">
                                <label style="border-bottom:#000000 solid 1px; display:block;text-align: center"> {{SO2}}kg</label>
                                </Col>
                            </Row>
                                <Row>
                                    <Col span="6" style="text-align: right">
                                    &nbsp;&nbsp;颗粒物减排量：&nbsp;&nbsp;
                                    </Col>
                                    <Col span="6" style="text-align: right">
                                    <label style="border-bottom:#000000 solid 1px; display:block;text-align: center"> {{particulates}}kg</label>
                                    </Col>
                                    <Col span="6" style="text-align: left" >
                                    &nbsp;&nbsp;氮氧化物减排量：&nbsp;&nbsp;
                                    </Col>
                                    <Col span="6" style="text-align: right">
                                    <label style="border-bottom:#000000 solid 1px; display:block;text-align: center"> {{nitrogenOxides}}kg</label>
                                    </Col>
                                </Row>
                            </Card>
                            </Col>
                            <Col span="6" style="">
                            &nbsp;&nbsp;
                            </Col>
                        </Row>


                </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
    import {getEnergys,getProjectTreeNoChildren} from '../../../axios/http';
    import Cookies from 'js-cookie';
    export default {
        data () {
            return {
                treeData:[],
                tree_project_id:0,//筛选过滤的
                defaultProjectId:0,//默认加载第一个项目
                startDate:'',
                endDate:'',
                heat:0,//耗热量
                powerConsumption:0,//耗电量
                averageTemp:0,//平均温度
                maxTemp:0,//最高温度
                minTemp:0,//最低温度
                totalEnergyConsumption:0,//总能耗
                SCOP:0,//SCOP
                conventionalEnergy:0,//常规能源供热能耗
                replaceEnergy:0,//常规能源替代量
                CO2:0,//CO2减排量
                SO2:0,//SO2减排量
                nitrogenOxides:0,//氮氧化物减排量
                particulates:0,//颗粒物减排量
                nhxy:true,//能耗效益
                hjxy:true,//环境效益
            }
        },
        methods: {
            //加载数据
            initEnergys(projectId){
                getEnergys(projectId,this.startDate,this.endDate+" 23:59:59")
                    .then((response)=>{
                    this.heat=response.data.result[0].heat;
                    this.powerConsumption=response.data.result[0].powerConsumption;
                    this.averageTemp=response.data.result[0].averageTemp;
                    this.maxTemp=response.data.result[0].maxTemp;
                    this.minTemp=response.data.result[0].minTemp;
                    this.totalEnergyConsumption=response.data.result[0].totalEnergyConsumption;
                    this.SCOP=response.data.result[0].SCOP;
                    this.conventionalEnergy=response.data.result[0].conventionalEnergy;
                    this.replaceEnergy=response.data.result[0].replaceEnergy;
                    this.CO2=response.data.result[0].CO2;
                    this.SO2=response.data.result[0].SO2;
                    this.nitrogenOxides=response.data.result[0].nitrogenOxides;
                    this.particulates=response.data.result[0].particulates;
                }).catch(function (error) {
                    console.log(error);
                });
            },
            initProjectTree(){
                getProjectTreeNoChildren(Cookies.get("projects")).then((response)=>{
                    this.treeData=response.data.result;
                    this.tree_project_id = this.treeData[0].id;
                    this.defaultProjectId=this.treeData[0].id;
                    this.initEnergys(this.defaultProjectId);
                }).catch(function (error) {
                    console.log(error);
                });
            },
            initDate(){
                var date=new Date();
                this.startDate=date.getFullYear()+"/"+(date.getMonth()+1)+"/01";
                this.endDate=date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate();
            },
            treeSelectChange(option) {
                if (option.length > 0) {
                    this.tree_project_id = option[0].id;
                    this.initEnergys(this.tree_project_id);
                }
            },
            searchData(){
                this.initEnergys(this.tree_project_id);
            },
            startDateChange(date){
              this.startDate=date;
            },
            endDateChange(date){
                this.endDate=date;
            },
        },
        created(){
            this.initDate();
            this.initProjectTree();
        }

    }
</script>
