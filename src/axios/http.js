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
 axios.defaults.baseURL='http://127.0.0.1:8082';
// //设置默认请求头
// axios.defaults.headers = {
//     "Content-Type": "application/x-www-form-urlencoded"
// };
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
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



//获取项目信息
export const getProjects=ids=>{
  return axios.get("/projects/"+ids);
};
//批量删除项目信息
export const batchDelProjects=params=>{
  return axios.post("/projects-del",params);
};


