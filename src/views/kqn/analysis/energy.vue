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
                        能耗分析
                    </p>
                    <Row style="margin: 10px">
                        <Col span="24" style="text-align: right">
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
                        <Col span="2" style="">
                        &nbsp;&nbsp;
                        </Col>
                        <Col span="4" style="text-align: right">
                        &nbsp;&nbsp;耗热量(MJ)&nbsp;&nbsp;
                        </Col>
                        <Col span="18" >
                            <label style="border-bottom:#000000 solid 1px; width:60%; display:block;text-align: center"> {{heat}}</label>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="2" style="">
                        &nbsp;&nbsp;
                        </Col>
                        <Col span="4" style="text-align: right">
                        &nbsp;&nbsp;耗电量(KWH)&nbsp;&nbsp;
                        </Col>
                        <Col span="18" >
                        <label style="border-bottom:#000000 solid 1px; width:60%; display:block;text-align: center"> {{powerConsumption}}</label>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="2" style="">
                        &nbsp;&nbsp;
                        </Col>
                        <Col span="4" style="text-align: right">
                        &nbsp;&nbsp;平均温度(≥16)&nbsp;&nbsp;
                        </Col>
                        <Col span="18" >
                        <label style="border-bottom:#000000 solid 1px; width:60%; display:block;text-align: center"> {{averageTemp}}</label>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="2" style="">
                        &nbsp;&nbsp;
                        </Col>
                        <Col span="4" style="text-align: right">
                        &nbsp;&nbsp;最高温度(≤24)&nbsp;&nbsp;
                        </Col>
                        <Col span="18" >
                        <label style="border-bottom:#000000 solid 1px; width:60%; display:block;text-align: center"> {{maxTemp}}</label>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="2" style="">
                        &nbsp;&nbsp;
                        </Col>
                        <Col span="4" style="text-align: right">
                        &nbsp;&nbsp;最低温度(≥18)&nbsp;&nbsp;
                        </Col>
                        <Col span="18" >
                        <label style="border-bottom:#000000 solid 1px; width:60%; display:block;text-align: center"> {{minTemp}}</label>
                        </Col>
                    </Row>
                    <br>
                    <Row>
                        <Col span="2" style="">
                        &nbsp;&nbsp;
                        </Col>
                        <Col span="4" style="text-align: right">
                        &nbsp;&nbsp;总能耗(kgcc)&nbsp;&nbsp;
                        </Col>
                        <Col span="18" >
                            <label style="border-bottom:#000000 solid 1px; width:60%; display:block;text-align: center"> {{totalEnergyConsumption}}</label>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="2" style="">
                        &nbsp;&nbsp;
                        </Col>
                        <Col span="4" style="text-align: right">
                        &nbsp;&nbsp;SCOP(≥1.8)&nbsp;&nbsp;
                        </Col>
                        <Col span="18" >
                        <label style="border-bottom:#000000 solid 1px; width:60%; display:block;text-align: center"> {{SCOP}}</label>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="2" style="">
                        &nbsp;&nbsp;
                        </Col>
                        <Col span="4" style="text-align: right">
                        &nbsp;&nbsp;常规能源供热能耗(kgcc)&nbsp;&nbsp;
                        </Col>
                        <Col span="18" >
                        <label style="border-bottom:#000000 solid 1px; width:60%; display:block;text-align: center"> {{conventionalEnergy}}</label>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="2" style="">
                        &nbsp;&nbsp;
                        </Col>
                        <Col span="4" style="text-align: right">
                        &nbsp;&nbsp;常规能源替代量(kgcc)&nbsp;&nbsp;
                        </Col>
                        <Col span="18" >
                        <label style="border-bottom:#000000 solid 1px; width:60%; display:block;text-align: center"> {{replaceEnergy}}</label>
                        </Col>
                    </Row>
                    <br>
                    <Row>
                        <Col span="2" style="">
                        &nbsp;&nbsp;
                        </Col>
                        <Col span="4" style="text-align: right">
                        &nbsp;&nbsp;CO2减排量(kg)&nbsp;&nbsp;
                        </Col>
                        <Col span="18" >
                        <label style="border-bottom:#000000 solid 1px; width:60%; display:block;text-align: center"> {{CO2}}</label>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="2" style="">
                        &nbsp;&nbsp;
                        </Col>
                        <Col span="4" style="text-align: right">
                        &nbsp;&nbsp;SO2减排量(kg)&nbsp;&nbsp;
                        </Col>
                        <Col span="18" >
                        <label style="border-bottom:#000000 solid 1px; width:60%; display:block;text-align: center"> {{SO2}}</label>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="2" style="">
                        &nbsp;&nbsp;
                        </Col>
                        <Col span="4" style="text-align: right">
                        &nbsp;&nbsp;氮氧化物减排量(kg)&nbsp;&nbsp;
                        </Col>
                        <Col span="18" >
                        <label style="border-bottom:#000000 solid 1px; width:60%; display:block;text-align: center"> {{nitrogenOxides}}</label>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="2" style="">
                        &nbsp;&nbsp;
                        </Col>
                        <Col span="4" style="text-align: right">
                        &nbsp;&nbsp;颗粒物减排量(kg)&nbsp;&nbsp;
                        </Col>
                        <Col span="18" >
                        <label style="border-bottom:#000000 solid 1px; width:60%; display:block;text-align: center"> {{particulates}}</label>
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
            }
        },
        methods: {
            //加载数据
            initEnergys(projectId){
                getEnergys(projectId,this.startDate,this.endDate+" 23:59:59")
                    .then((response)=>{
                    if (response.data.result[0]!=null) {
                        this.heat = response.data.result[0].heat;
                        this.powerConsumption = response.data.result[0].powerConsumption;
                        this.averageTemp = response.data.result[0].averageTemp;
                        this.maxTemp = response.data.result[0].maxTemp;
                        this.minTemp = response.data.result[0].minTemp;
                        this.totalEnergyConsumption = response.data.result[0].totalEnergyConsumption;
                        this.SCOP = response.data.result[0].SCOP;
                        this.conventionalEnergy = response.data.result[0].conventionalEnergy;
                        this.replaceEnergy = response.data.result[0].replaceEnergy;
                        this.CO2 = response.data.result[0].CO2;
                        this.SO2 = response.data.result[0].SO2;
                        this.nitrogenOxides = response.data.result[0].nitrogenOxides;
                        this.particulates = response.data.result[0].particulates;
                    }
                    else {

                        this.heat = '无数据';
                        this.powerConsumption = '无数据';
                        this.averageTemp = '无数据';
                        this.maxTemp = '无数据';
                        this.minTemp = '无数据';
                        this.totalEnergyConsumption = '无数据';
                        this.SCOP = '无数据';
                        this.conventionalEnergy ='无数据';
                        this.replaceEnergy = '无数据';
                        this.CO2 = '无数据';
                        this.SO2 = '无数据';
                        this.nitrogenOxides = '无数据';
                        this.particulates = '无数据';
                    }
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
