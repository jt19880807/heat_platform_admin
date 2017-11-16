
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
