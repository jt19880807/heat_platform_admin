import axios from 'axios'
 //axios.defaults.baseURL='http://192.168.5.21:8082';
  axios.defaults.baseURL='http://192.168.5.21:8088';
// //设置默认请求头
axios.defaults.headers = {
    "Content-Type": "application/json",
    "Accept":"application/json"
};
export const login=params=>{
    return axios.post("/login",params)
};

//获取项目的地图数据
export const getProjectMapData=(ids)=>{
    return axios.get("/projectMapData/"+ids);
};
//获取项目的基础信息
export const getProjectBaseInfo=(ids)=>{
    return axios.get("/projectBaseInfo/"+ids);
};
//获取项目树信息
export const getProjectTree=(ids)=>{
    return axios.get("/projectTree/"+ids);
};
//获取项目树信息
export const getHouseholdsAndArea=(buildIds,type,name)=>{
    return axios.get("/householdsAndArea?buildIds="+buildIds+"&type="+type+"&name="+name);
};
//获取单位面积热耗
export const getAreaHeat=(buildIds,type,name,startDate,endDate)=>{
    return axios.get("/areaHeat?buildIds="+buildIds+"&type="+type+"&name="+name+"&startDate="+startDate+"&endDate="+endDate);
};
//获取进水温度分析
export const entrance_temp_analyse=(buildIds,type,name)=>{
    return axios.get("/entrance_temp_analyse?buildIds="+buildIds+"&type="+type+"&name="+name);
};

//户表数据
//获取户表实时数据
export const getLastNodeData=(buildIds,type,name,entrancetemp,num,size)=>{
    return axios.get("/lastNodeData?buildIds="+buildIds+"&type="+type+"&name="+name+"&entrancetemp="+entrancetemp+"&num="+num+"&size="+size);
};
//获取户表历史数据
export const getHistoryNodeData=(buildIds,type,name,startDate,endDate,num,size)=>{
    return axios.get("/historyNodeData?buildIds="+buildIds+"&type="+type+"&name="+name+"&startDate="+startDate+"&endDate="+endDate+"&num="+num+"&size="+size);
};
//获取小区的日用热量
export const getZoneDayHeat=(buildIds,type,name,date)=>{
    return axios.get("/zoneDayHeat?buildIds="+buildIds+"&type="+type+"&name="+name+"&date="+date);
};
//获取小区的月用热量
export const getZoneMonthHeat=(buildIds,type,name,date)=>{
    return axios.get("/zoneMonthHeat?buildIds="+buildIds+"&type="+type+"&name="+name+"&date="+date);
};
//获取楼栋的日用热量
export const getBuildDayHeat=(buildIds,type,name,date,num,size)=>{
    return axios.get("/buildDayHeat?buildIds="+buildIds+"&type="+type+"&name="+name+"&date="+date+"&num="+num+"&size="+size);
};
//获取楼栋的月用热量
export const getBuildMonthHeat=(buildIds,type,name,date,num,size)=>{
    return axios.get("/buildMonthHeat?buildIds="+buildIds+"&type="+type+"&name="+name+"&date="+date+"&num="+num+"&size="+size);
};

//获取小区的历史对比数据
export const getZoneContrast=(buildIds,type,name,date)=>{
    return axios.get("/zoneContrast?buildIds="+buildIds+"&type="+type+"&name="+name+"&date="+date);
};
//获取楼栋的历史对比数据
export const getBuildContrast=(buildIds,type,name,date,num,size)=>{
    return axios.get("/buildContrast?buildIds="+buildIds+"&type="+type+"&name="+name+"&date="+date+"&num="+num+"&size="+size);
};








// 旧的项目
//获取所有住户信息
export const getUsers=(keywords,num,size)=>{
    return axios.get('/users?keywords='+keywords+'&num='+num+'&size='+size);
};
//批量删除住户信息
export const batchDelUsers=params=>{
    return axios.post("/users-del",params);
};
// 插入用户信息
export const insertUser=params=>{
    return axios.post("/user",params);
};
// 修改用户信息
export const updateUser=(userId,params)=>{
    return axios.put("/user/"+userId,params);
};

//角色信息
//获取所有的角色信息
export const getAllRoles=()=>{
  return axios.get("/roles");
};
//批量删除角色信息
export const batchDelRoles=params=>{
    return axios.post("/roles-del",params);
};
// 插入角色信息
export const insertRole=params=>{
    return axios.post("/role",params);
};
// 修改角色信息
export const updateRole=(roleId,params)=>{
    return axios.put("/role/"+roleId,params);
};
//修改指定角色的权限信息
export const updateRolePermission=(roleId,params)=>{
    return axios.put("/editRolePermission/"+roleId,params);
};

//权限信息
//获取所有的权限信息
export const getAllPermissions=()=>{
    return axios.get("/permissions");
};
export const getPermissions_Tree=()=>{
    return axios.get("/permissions-tree");
};
//批量删除权限信息
export const batchDelPermissions=params=>{
    return axios.post("/permissions-del",params);
};
// 插入权限信息
export const insertPermission=params=>{
    return axios.post("/permission",params);
};
// 修改权限信息
export const updatePermission=(roleId,params)=>{
    return axios.put("/permission/"+roleId,params);
};


//分页获取指定ID或者全部的带搜索关键字的项目信息
export const getProjects=(ids,num,size,keywords)=>{
  return axios.get("/projects/"+ids+"?num="+num+"&size="+size+"&keywords="+keywords);
};
//分页获取指定ID或者全部的项目信息,包含下面的小区楼栋信息
// export const getProjectTree=(ids)=>{
//     return axios.get("/projectree/"+ids);
// };
//分页获取指定ID或者全部的项目信息,不包含下面的小区楼栋信息
export const getProjectTreeNoChildren=(ids)=>{
    return axios.get("/projecTreeNoChildren/"+ids);
};
//获取指定ID或者全部项目信息，用于下拉框，只返回ID和name
export const getProjectTransferModel=(ids)=>{
  return axios.get("/projecTransferModel/"+ids);
};
//获取指定ID或者全部项目信息，用于下拉框，只返回ID和name
export const getProjectsList=(ids)=>{
    return axios.get("/projects-list/"+ids);
};
//批量删除项目信息
export const batchDelProjects=params=>{
  return axios.post("/projects-del",params);
};
// 插入项目信息
export const insertProject=params=>{
  return axios.post("/project",params);
};
// 修改项目信息
export const updateProject=(projectId,params)=>{
    return axios.put("/project/"+projectId,params);
};

//获取小区信息
export const getAreas=(num,size,keywords)=>{
    return axios.get("/areas?num="+num+"&size="+size+"&keywords="+keywords);
};
//获取指定ID或者全部小区信息，用于下拉框，只返回ID和name
export const getAreaWithIDAndName=(projectids)=>{
    return axios.get("/selectAreaWithIDAndName/"+projectids);
};
//批量删除小区信息
export const batchDelAreas=params=>{
    return axios.post("/areas-del",params);
};
// 插入小区信息
export const insertArea=params=>{
    return axios.post("/area",params);
};
// 修改小区信息
export const updateArea=(areaId,params)=>{
    return axios.put("/area/"+areaId,params);
};

//获取楼栋信息
export const getBuildings=(projectIds,areaId,num,size)=>{
    return axios.get("/buildings/"+projectIds+"?areaId="+areaId+"&num="+num+"&size="+size);
};
//根据项目ID获取项目下的楼栋信息，格式为xxx小区xx栋楼
export const getBuildingWithIDAndAreaName=projectId=>{
    return axios.get("/buildingWithIDAndAreaName/"+projectId);
};
//批量删除楼栋信息
export const batchDelBuildings=params=>{
    return axios.post("/buildings-del",params);
};
// 插入楼栋信息
export const insertBuilding=params=>{
    return axios.post("/building",params);
};
// 修改楼栋信息
export const updateBuilding=(buildingId,params)=>{
    return axios.put("/building/"+buildingId,params);
};

//分页获取采集器信息
export const getCollectors=(projectId,areaId,buildingId,num,size)=>{
    return axios.get("/collectors?projectId="+projectId+"&areaId="+areaId+"&buildingId="+buildingId+"&num="+num+"&size="+size);
};
//根据项目ID或者小区ID或者楼栋ID查找下面的采集器,仅返回ID和Number
export const getCollectorWithIDAndNumber=(projectId,areaId,buildingId)=>{
    return axios.get("/collectorsWithIDAndNumber?projectId="+projectId+"&areaId="+areaId+"&buildingId="+buildingId);
};
//批量删除采集器信息
export const batchDelCollectors=params=>{
    return axios.post("/collectors-del",params);
};
// 插入采集器信息
export const insertCollector=params=>{
    return axios.post("/collector",params);
};
// 修改采集器信息
export const updateCollector=(buildingId,params)=>{
    return axios.put("/collector/"+buildingId,params);
};

//获取表计信息
export const getMeters=(projectId,areaId,buildingId,collectorId,meterType,num,size)=>{
    return axios.get("/meters?projectId="+projectId+"&areaId="+areaId+"&buildingId="+buildingId+"&collectorId="+collectorId+"&meterType="+meterType+"&num="+num+"&size="+size);
};
//根据项目ID或者小区ID或者楼栋ID查找下面的采集器,仅返回ID和Number
export const getMetersWithIDAndNumber=(projectId,areaId,buildingId,meterType)=>{
    return axios.get("/metersWithIDAndNumber?projectId="+projectId+"&areaId="+areaId+"&buildingId="+buildingId+"&meterType="+meterType);
};
//批量删除表计信息
export const batchDelMeters=params=>{
    return axios.post("/meters-del",params);
};
// 插入表计信息
export const insertMeter=params=>{
    return axios.post("/meter",params);
};
// 修改表计信息
export const updateMeter=(meterId,params)=>{
    return axios.put("/meter/"+meterId,params);
};

//获取热量信息
export const getHeatMeterReadings=(projectId,areaId,buildingId,meterId,errorCode,startDate,endDate,num,size)=>{
    return axios.get("/heatMeterReadings?projectId="+projectId+"&areaId="+areaId+"&buildingId="+buildingId+"&meterId="+meterId+"&errorCode="+errorCode+"&startDate="+startDate+"&endDate="+endDate+"&num="+num+"&size="+size);
};
//批量删除热量信息
export const batchDelHeatMeterReadings=params=>{
    return axios.post("/heatMeterReadings-del",params);
};
// 插入热量信息
export const insertHeatMeterReading=params=>{
    return axios.post("/heatMeterReading",params);
};
// 修改热量信息
export const updateHeatMeterReading=(meterId,params)=>{
    return axios.put("/heatMeterReading/"+meterId,params);
};

//获取耗电量信息
export const getPowerConsumptions=(projectId,areaId,buildingId,meterId,startDate,endDate,num,size)=>{
    return axios.get("/powerConsumptions?projectId="+projectId+"&areaId="+areaId+"&buildingId="+buildingId+"&meterId="+meterId+"&startDate="+startDate+"&endDate="+endDate+"&num="+num+"&size="+size);
};
//获取平均温度信息
export const getAverageTemps=(projectId,errorCode,startDate,endDate,num,size)=>{
    return axios.get("/averageTemps?projectId="+projectId+"&errorCode="+errorCode+"&startDate="+startDate+"&endDate="+endDate+"&num="+num+"&size="+size);
};

//获取能耗分析
export const getEnergys=(projectId,startDate,endDate)=>{
    return axios.get("/energys?projectId="+projectId+"&startDate="+startDate+"&endDate="+endDate);
};

//获取历史数据
export const getHisttoryData=(projectId,startDate,endDate,count)=>{
    return axios.get("/historydata?projectId="+projectId+"&startDate="+startDate+"&endDate="+endDate+"&count="+count);
};
//导出历史数据
export const exportHisttoryData=(projectId,startDate,endDate,count)=>{
    return axios.get("/historydata/export?projectId="+projectId+"&startDate="+startDate+"&endDate="+endDate+"&count="+count);
};
//获取能耗报告
export const getEnergyReport=(projectId,startDate,endDate)=>{
    return axios.get("/energyReport?projectId="+projectId+"&startDate="+startDate+"&endDate="+endDate);
};

//导出能耗报告
export const exportEnergyReport=()=>{
    return axios.get("/exportEnergyReport");
};

export const uploadPic=params=>{
    return axios.post("/uploadpic",params)
};

//获取最近一个月的耗电量
export const getLastMonthPowerConsumptions=(projectId,startDate,endDate)=>{
    return axios.get("/lastMonthPowerConsumptions?projectId="+projectId+"&startDate="+startDate+"&endDate="+endDate);
};
//获取最近一个月的耗热量
export const getLastMonthHeatConsumptions=(projectId,startDate,endDate)=>{
    return axios.get("/lastMonthHeatConsumptions?projectId="+projectId+"&startDate="+startDate+"&endDate="+endDate);
};
//获取指定项目的最新的平均温度等信息
export const getLastAverageTemps=(projectId)=>{
    return axios.get("/lastAverageTempsByProjectId?projectId="+projectId);
};






