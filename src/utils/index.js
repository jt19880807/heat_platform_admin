
export const selectCityValue=(cityText,cityData)=>{
    var citys=cityText.split("/");
    var result=[];
    for (var i=0;i<cityData.length;i++){
        if (cityData[i].label===citys[0]){
            result.push(cityData[i].value);
            for (var j=0;j<cityData[i].children.length;j++){
                if (cityData[i].children[j].label===citys[1]){
                    //this.cityvalue[1]=this.cityData[i][j].value;
                    result.push(cityData[i].children[j].value);
                }
            }
        }
    }
    return result;
};
export const checkeAllPermissions=(permissions)=>{
  for (var p in permissions){
      permissions[p].checked=true;
      permissions[p].expand=true;
      // if (permissions[p].children.length>0){
           checkeAllPermissions(permissions[p].children);
      // }
  }
};
export const checkePartPermissions=(permissions,rights)=>{

    //var allRights=rights.split(",");
    //console.log(allRights);
    for (var p in permissions){
        permissions[p].expand=true;

        if(rights.includes(permissions[p].id)){
            permissions[p].checked=true;
        }
        else {
            permissions[p].checked=false;
        }

        // if (permissions[p].children.length>0){
        checkePartPermissions(permissions[p].children,rights);
        // }
    }
};
export const uploadImportTemplates=(name)=>{
    window.open("http://localhost:8082/import/"+name);
};
// 格式化日期
export const formatDate=(date,fmt)=> {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
};
function padLeftZero(str) {
    return ('00' + str).substr(str.length);
};
//初始化日期
export const initDate=()=>{
    var date=new Date();
    let mouth=date.getMonth()+1;
    let day=date.getDay();
    var start='';
    var end='';
    // console.log("mouth=>"+mouth);
    if (mouth>3&&mouth<11){//4月到10月
       start=(date.getFullYear()-1)+"/11/15";
       end=date.getFullYear()+"/03/15";
    }
    if (mouth===3){
        if (day>15){
            start=(date.getFullYear()-1)+"/11/15";
            end=date.getFullYear()+"/03/15";
        }else {
            start=(date.getFullYear()-1)+"/11/15";
            end=date.getFullYear()+"/03/"+day;
        }
    }
    if (mouth<3){
        start=(date.getFullYear()-1)+"/11/15";
        end=date.getFullYear()+"/"+mouth+"/"+day;
    }
    if (mouth===11){
        if (day<15){
            start=(date.getFullYear()-1)+"/11/15";
            end=date.getFullYear()+"/03/15";
        }else {
            start=date.getFullYear()+"/11/15";
            end=date.getFullYear()+"/11/"+day;
        }
    }
    if (mouth>11){
        start=date.getFullYear()+"/11/15";
        end=date.getFullYear()+"/"+mouth+"/"+day;
    }
    return [start,end];
};

export const initHeatSession=()=>{
      var heatSession=[];
      var date=new Date();
      let mouth=date.getMonth()+1;
      var year=date.getFullYear();
      for (var i=0;i<5;i++){

          heatSession.push({
              "value":year,
              "label":year,
          });
          year-=1;
      }
      return heatSession;
};

