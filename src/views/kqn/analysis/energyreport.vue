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
                        <Checkbox size="large" v-model="nhxy" @on-change="nhxyChange">能耗效益</Checkbox>
                        <Checkbox v-model="hjxy" @on-change="hjxyChange">环境效益</Checkbox>
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
                        <Button type="primary" icon="ios-download-outline" @click="down">导出报告</Button>
                    </Row>
                    <br/>
                    <Row style="margin-bottom: 10px;">
                        <Col span="2" style="">
                        &nbsp;&nbsp;
                        </Col>
                        <Col span="4" style="text-align: right">
                        &nbsp;&nbsp;项目名称：&nbsp;&nbsp;
                        </Col>
                        <Col span="18" >
                        <label style="border-bottom:#000000 solid 1px; width:60%; display:block;text-align: center"> {{projectName}}</label>
                        </Col>
                    </Row>
                    <Row style="margin-bottom: 10px;">
                        <Col span="2" style="">
                        &nbsp;&nbsp;
                        </Col>
                        <Col span="4" style="text-align: right">
                        &nbsp;&nbsp;项目地址：&nbsp;&nbsp;
                        </Col>
                        <Col span="12" >
                            <label style="border-bottom:#000000 solid 1px; display:block;text-align: center"> {{projectAddress}}</label>
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
                                &nbsp;&nbsp;制热/制冷面积：&nbsp;&nbsp;
                                </Col>
                                <Col span="6" style="text-align: right">
                                <label style="border-bottom:#000000 solid 1px; display:block;text-align: center"> {{heating_area}}㎡</label>
                                </Col>
                                <Col span="6" style="text-align: right">
                                &nbsp;&nbsp;建筑性质：&nbsp;&nbsp;
                                </Col>
                                <Col span="6" style="text-align: right">
                                <label style="border-bottom:#000000 solid 1px;display:block;text-align: center"> {{building_type}}</label>
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
                            &nbsp;&nbsp;建筑年限：&nbsp;&nbsp;
                            </Col>
                            <Col span="6" style="text-align: right">
                            <label style="border-bottom:#000000 solid 1px; display:block;text-align: center"> {{building_years}}</label>
                            </Col>
                            <Col span="6" style="text-align: right">
                            &nbsp;&nbsp;户数/房间数：&nbsp;&nbsp;
                            </Col>
                            <Col span="6" style="text-align: right">
                            <label style="border-bottom:#000000 solid 1px;display:block;text-align: center"> {{house_count}}</label>
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
                        &nbsp;&nbsp;评估时间：&nbsp;&nbsp;
                        </Col>
                        <Col span="12" >
                        <label style="border-bottom:#000000 solid 1px; display:block;text-align: center"> {{reportTime}}</label>
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
                            &nbsp;&nbsp;室内平均温度：&nbsp;&nbsp;
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
                            &nbsp;&nbsp;温度达标天数：&nbsp;&nbsp;
                            </Col>
                            <Col span="6" style="text-align: right">
                            <label style="border-bottom:#000000 solid 1px; display:block;text-align: center"> {{standardDays}}天</label>
                            </Col>
                            <Col span="6" style="text-align: right">
                            &nbsp;&nbsp;温度未达标天数：&nbsp;&nbsp;
                            </Col>
                            <Col span="6" style="text-align: right">
                            <label style="border-bottom:#000000 solid 1px; display:block;text-align: center"> {{noStandardDays}}天</label>
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
                            &nbsp;&nbsp;总耗热量：&nbsp;&nbsp;
                            </Col>
                            <Col span="6" style="text-align: right">
                            <label style="border-bottom:#000000 solid 1px; display:block;text-align: center"> {{heat}}</label>
                            </Col>
                            <Col span="6" style="text-align: right">
                            &nbsp;&nbsp;总耗电量：&nbsp;&nbsp;
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
                            &nbsp;&nbsp;制热性能系数SCOP：&nbsp;&nbsp;
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
                        &nbsp;&nbsp;<b>评估结果：</b>&nbsp;&nbsp;
                        </Col>
                        <Col span="12" >
                        <label style="border-bottom:#000000 solid 1px; display:block;text-align: center"> {{reportResult}}</label>
                        </Col>
                        <Col span="6" style="">
                        &nbsp;&nbsp;
                        </Col>
                    </Row>
                    <Row >
                        <Col span="2" style="">
                            &nbsp;&nbsp;
                        </Col>
                         <Col span="16" style="text-align: right">
                            <Card v-if="this.nhxy">
                                <p slot="title" style="text-align: left">
                                    能耗效益
                                </p>
                                <Row style="margin-bottom: 10px;">
                                    <Col span="6" style="text-align: right">
                                    &nbsp;&nbsp;常规能源供热能耗Qt：&nbsp;&nbsp;
                                    </Col>
                                    <Col span="6" style="text-align: right">
                                        <label style="border-bottom:#000000 solid 1px; display:block;text-align: center"> {{energyEfficiency.conventionalEnergy}}kgcc</label>
                                    </Col>
                                    <Col span="6" style="" >
                                    &nbsp;&nbsp;实际能耗Qr：&nbsp;&nbsp;
                                    </Col>
                                    <Col span="6" style="text-align: right">
                                    <label style="border-bottom:#000000 solid 1px; display:block;text-align: center"> {{energyEfficiency.totalEnergyConsumption}}kgcc</label>
                                    </Col>
                                </Row>
                                <Row>
                                        <Col span="6" style="text-align: right">
                                        &nbsp;&nbsp;能源替代量Qs：&nbsp;&nbsp;
                                        </Col>
                                        <Col span="6" style="text-align: right">
                                        <label style="border-bottom:#000000 solid 1px; display:block;text-align: center"> {{energyEfficiency.replaceEnergy}}kgcc</label>
                                        </Col>
                                        <Col span="6" style="text-align: left" >
                                        (不小于1.8)
                                        </Col>
                                        <Col span="6" style="text-align: right">
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        </Col>
                                 </Row>
                                <Row>
                                    <div id="energyEfficiency_bar" :style="{ height: '300px'}"></div>
                                </Row>
                            </Card>
                            </Col>
                            <Col span="6" style="">
                            &nbsp;&nbsp;
                            </Col>
                        </Row>
                    <Row >
                            <Col span="2" style="">
                            &nbsp;&nbsp;
                            </Col>
                            <Col span="16" style="text-align: right">
                            <Card v-if="this.hjxy">
                                <p slot="title" style="text-align: left">
                                    环境效益
                                </p>
                                <Row style="margin-bottom: 10px;">
                                <Col span="6" style="text-align: right">
                                &nbsp;&nbsp;二氧化碳减排量：&nbsp;&nbsp;
                                </Col>
                                <Col span="6" style="text-align: right">
                                <label style="border-bottom:#000000 solid 1px; display:block;text-align: center"> {{environmentalBenefits.CO2}}kg</label>
                                </Col>
                                <Col span="6" style="" >
                                &nbsp;&nbsp;二氧化硫减排量：&nbsp;&nbsp;
                                </Col>
                                <Col span="6" style="text-align: right">
                                <label style="border-bottom:#000000 solid 1px; display:block;text-align: center"> {{environmentalBenefits.SO2}}kg</label>
                                </Col>
                            </Row>
                                <Row>
                                    <Col span="6" style="text-align: right">
                                    &nbsp;&nbsp;颗粒物减排量：&nbsp;&nbsp;
                                    </Col>
                                    <Col span="6" style="text-align: right">
                                    <label style="border-bottom:#000000 solid 1px; display:block;text-align: center"> {{environmentalBenefits.particulates}}kg</label>
                                    </Col>
                                    <Col span="6"  >
                                    &nbsp;&nbsp;氮氧化物减排量：&nbsp;&nbsp;
                                    </Col>
                                    <Col span="6" style="text-align: right">
                                    <label style="border-bottom:#000000 solid 1px; display:block;text-align: center"> {{environmentalBenefits.nitrogenOxides}}kg</label>
                                    </Col>
                                </Row>
                                <Row>
                                    <div id="environmentalBenefits_bar" :style="{ height: '300px'}"></div>
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
    // 引入基本模板
    let echarts = require('echarts/lib/echarts');
    // 引入柱状图组件
    require('echarts/lib/chart/bar');
    // 引入提示框和title组件;
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/title');

    import {getEnergyReport,getProjectTreeNoChildren,exportEnergyReport,uploadPic} from '../../../axios/http';
    import Cookies from 'js-cookie';
    export default {
        data () {
            return {
                treeData:[],
                tree_project_id:0,//筛选过滤的
                defaultProjectId:0,//默认加载第一个项目
                startDate:'',
                endDate:'',
                projectName:'',
                projectAddress:'',
                heating_area:'',
                building_type:'',
                building_years:'',
                house_count:'',
                reportTime:'',
                heat:'',//耗热量
                powerConsumption:'',//耗电量
                averageTemp:'',//平均温度
                standardDays:'',
                noStandardDays:'',
                SCOP:'',//SCOP
                reportResult:'',
                energyEfficiency:{
                    totalEnergyConsumption:0,//总能耗
                    conventionalEnergy:'',//常规能源供热能耗
                    replaceEnergy:0,//常规能源替代量
                },
                environmentalBenefits:{
                    CO2:'',//CO2减排量
                    SO2:'',//SO2减排量
                    nitrogenOxides:'',//氮氧化物减排量
                    particulates:'',//颗粒物减排量
                },
                nhxy:true,//能耗效益
                hjxy:true,//环境效益
                energyEfficiency_picinfo:'',
                environmentalBenefits_picinfo:'',
            }
        },
        methods: {
            //加载数据
            initEnergyReport(projectId){
                getEnergyReport(projectId,this.startDate,this.endDate+" 23:59:59")
                    .then((response)=>{
                    if (response.data.status==0) {
                        this.projectName=response.data.result[0].projectName;
                        this.projectAddress=response.data.result[0].projectAddress;
                        this.heating_area=response.data.result[0].heating_area;
                        this.building_type=response.data.result[0].building_type;
                        this.building_years=response.data.result[0].building_years;
                        this.house_count=response.data.result[0].house_count;
                        this.heat=response.data.result[0].heat;
                        this.powerConsumption=response.data.result[0].powerConsumption;
                        this.averageTemp=response.data.result[0].averageTemp;
                        this.standardDays=response.data.result[0].standardDays;
                        this.noStandardDays=response.data.result[0].noStandardDays;
                        this.reportResult=response.data.result[0].reportResult;
                        this.SCOP=response.data.result[0].SCOP;
                        this.energyEfficiency.totalEnergyConsumption=response.data.result[0].energyEfficiency.totalEnergyConsumption;
                        this.energyEfficiency.conventionalEnergy=response.data.result[0].energyEfficiency.conventionalEnergy;
                        this.energyEfficiency.replaceEnergy=response.data.result[0].energyEfficiency.replaceEnergy;
                        this.environmentalBenefits.CO2=response.data.result[0].environmentalBenefits.CO2;
                        this.environmentalBenefits.SO2=response.data.result[0].environmentalBenefits.SO2;
                        this.environmentalBenefits.nitrogenOxides=response.data.result[0].environmentalBenefits.nitrogenOxides;
                        this.environmentalBenefits.particulates=response.data.result[0].environmentalBenefits.particulates;
                        this.initnergyEfficiencyBar();
                        this.initeEnvironmentalBenefitsBar();
                    }
                    else {
                        this.projectName='--';
                        this.projectAddress='--';
                        this.heating_area='--';
                        this.building_type='--';
                        this.building_years='--';
                        this.house_count='--';
                        this.heat='--';
                        this.powerConsumption='--';
                        this.averageTemp='--';
                        this.standardDays='--';
                        this.noStandardDays='--';
                        this.reportResult='--';
                        this.SCOP='--';
                        this.energyEfficiency.totalEnergyConsumption='--';
                        this.energyEfficiency.conventionalEnergy='--';
                        this.energyEfficiency.replaceEnergy='--';
                        this.environmentalBenefits.CO2='--';
                        this.environmentalBenefits.SO2='--';
                        this.environmentalBenefits.nitrogenOxides='--';
                        this.environmentalBenefits.particulates='--';
                    }
                    this.reportTime=this.startDate+"-"+this.endDate;
                }).catch(function (error) {
                    console.log(error);
                });
            },
            initProjectTree(){
                getProjectTreeNoChildren(Cookies.get("projects")).then((response)=>{
                    this.treeData=response.data.result;
                    this.tree_project_id = this.treeData[0].id;
                    this.defaultProjectId=this.treeData[0].id;
                    this.initEnergyReport(this.defaultProjectId);
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
                this.initEnergyReport(this.tree_project_id);
            },
            startDateChange(date){
              this.startDate=date;
            },
            endDateChange(date){
                this.endDate=date;
            },
            //加载能耗参数图表
            initnergyEfficiencyBar() {
                let energyEfficiency_bar = echarts.init(document.getElementById('energyEfficiency_bar'));
                // 绘制图表
                energyEfficiency_bar.setOption({
                    tooltip: {},
                    xAxis: {
                        data: ["总能耗", "常规能源供热能耗", "常规能源替代量"]
                    },
                    yAxis: {},
                    series: [{
                        type: 'bar',
                        data: [this.energyEfficiency.totalEnergyConsumption,
                            this.energyEfficiency.conventionalEnergy,
                            this.energyEfficiency.replaceEnergy,]
                    }]
                });
                this.energyEfficiency_picinfo=energyEfficiency_bar.getDataURL();
                console.log(this.energyEfficiency_picinfo);

            },
            initeEnvironmentalBenefitsBar(){
                let environmentalBenefits_bar = echarts.init(document.getElementById('environmentalBenefits_bar'));
                // 绘制图表
                environmentalBenefits_bar.setOption({
                    //  title: { text: '环境效益' },
                    tooltip: {},
                    xAxis: {
                        data: ["CO2减排量", "SO2减排量", "氮氧化物减排量", "颗粒物减排量"]
                    },
                    yAxis: {},
                    series: [{
                        //name: '销量',
                        type: 'bar',
                        data: [this.environmentalBenefits.CO2,
                            this.environmentalBenefits.SO2,
                            this.environmentalBenefits.nitrogenOxides,
                            this.environmentalBenefits.particulates, ]
                    }]
                });
                this.environmentalBenefits_picinfo=environmentalBenefits_bar.getDataURL();
            },
            down() {
                uploadPic({
                    energyEfficiency_picinfo:this.energyEfficiency_picinfo,
                    environmentalBenefits_picinfo:this.environmentalBenefits_picinfo,
                })
                    .then((response)=>{
                        window.location.href="http://127.0.0.1:8082/exportEnergyReport?projectId="+this.tree_project_id+"&startDate="+this.startDate+"&endDate="+this.endDate+"&shownhxy="+this.nhxy+"&showhjxy="+this.hjxy;
                    }).catch(function (error) {
                    console.log(error);
                });
                //window.location.href="http://127.0.0.1:8082/exportEnergyReport";
            },
            nhxyChange(option){
                this.nhxy=option;
                //alert(option);
                if (option===true){
                    //this.initnergyEfficiencyBar();
                    this.initEnergyReport(this.tree_project_id);
                }
            },
            hjxyChange(option){
                this.hjxy=option;
                if (option===true){
                    this.initEnergyReport(this.tree_project_id);
                }
            },
        },

        created(){
            this.initDate();
            this.initProjectTree();
        }

    }
</script>
