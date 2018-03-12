import axios from 'axios'
// const Axios = axios.create({
//     baseURL: "http://127.0.0.1:8080", // 因为我本地做了反向代理
//     timeout: 10000,
//     responseType: "json",
//     withCredentials: false, // 是否允许带cookie这些
//     headers: {
//         "Content-Type": "application/x-www-form-urlencoded"
//     }
// });
// //设置请求baseURL
 axios.defaults.baseURL='http://localhost:8082';
// //设置默认请求头
axios.defaults.headers = {
    "Content-Type": "application/json",
    "Accept":"application/json"
};
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// 带cookie请求
axios.defaults.withCredentials = true;
// http request 拦截器
// axios.interceptors.request.use(
//     config => {
//         //if (store.state.userInfo.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
//             config.headers.Authorization = "Bearer eyJhbGciOiJIUzUxMiJ9.eyJhdXRob3JpdGllcyI6IlJPTEVfQURNSU4sQVVUSF9XUklURSIsInN1YiI6ImFkbWluIiwiZXhwIjoxNTA5NTMyNzY4fQ.C77UTIX5m7dPnZKnD9WIrl_ar4cZLaoum7ft5yepGuE6lnhW7ssqgvJbsJKdhypxh72_ZUcktlai6xBrbmx5NA";
//        //}
//         return config;
//     },
//     err => {
//         return Promise.reject(err);
//     });
// axios.interceptors.request.use(function (config) {    // 这里的config包含每次请求的内容
//     //if (store.getters.getToken) {
//         config.headers.Authorization ='Bearer eyJhbGciOiJIUzUxMiJ9.eyJhdXRob3JpdGllcyI6IlJPTEVfQURNSU4sQVVUSF9XUklURSIsInN1YiI6ImFkbWluIiwiZXhwIjoxNTA5NTMyNzY4fQ.C77UTIX5m7dPnZKnD9WIrl_ar4cZLaoum7ft5yepGuE6lnhW7ssqgvJbsJKdhypxh72_ZUcktlai6xBrbmx5NA';
//     //}
//     return config;
// }, function (err) {
//     return Promise.reject(err);
// });
//
// Axios.interceptors.response.use(
//     undefined,
//     error => {
//         let res = error.response;
//         switch (res.status) {
//             case 401:
//                 // 返回 401 清除token信息并跳转到登录页面
//                 // store.commit(types.LOGOUT);
//                 // router.replace({
//                 //     path: '/app/login',
//                 //     query: {redirect: router.currentRoute.fullPath}
//                 // });
//                 break;
//             case 403:
//                 console.log('您没有该操作权限');
//                 break;
//             // alert('您没有该操作权限');
//             case 500:
//                 console.log('服务器错误');
//                 break;
//             // alert('服务器错误');
//         }
//         return Promise.reject(error.response.data)   // 返回接口返回的错误信息
//     });

export const login=params=>{
    return axios.post("/login",params)
};
//获取所有住户信息
export const getAllUsers=()=>{
    return axios.get('/users')
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
export const getProjectTree=(ids)=>{
    return axios.get("/projectree/"+ids);
};
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

//获取采集器信息
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
export const getHeatMeterReadings=(projectId,areaId,buildingId,meterId,startDate,endDate,num,size)=>{
    return axios.get("/heatMeterReadings?projectId="+projectId+"&areaId="+areaId+"&buildingId="+buildingId+"&meterId="+meterId+"&startDate="+startDate+"&endDate="+endDate+"&num="+num+"&size="+size);
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
export const getAverageTemps=(projectId,startDate,endDate,num,size)=>{
    return axios.get("/averageTemps?projectId="+projectId+"&startDate="+startDate+"&endDate="+endDate+"&num="+num+"&size="+size);
};

//获取能耗分析
export const getEnergys=(projectId,startDate,endDate)=>{
    return axios.get("/energys?projectId="+projectId+"&startDate="+startDate+"&endDate="+endDate);
};

//获取历史数据
export const getHisttoryData=(projectId,startDate,endDate)=>{
    return axios.get("/historydata?projectId="+projectId+"&startDate="+startDate+"&endDate="+endDate+"&count=2");
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




