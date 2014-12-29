var policyCompareBase = {
    make: {dataName: '品牌'},
    model: {dataName: '型号'},
    specialCase: {dataName: '方案'},
    enginCC: {dataName: '发动机排量'},
    vinNo: {dataName: '车架号(17位值)'},
    overrideVinErrors: {dataName: '允许车架号号码重叠'},
    manuWarStartDate: {dataName: '原厂保修起始日期'},
    manuWarMonths: {dataName: '原厂保修月数'},
    manuWarMileage: {dataName: '制造商保修里程', base: 'ML'},
    mileage: {dataName: '客户签署时里程读数'},
    vehicleSoldDate: {dataName: '汽车售出日期'},
    schemeId: {dataName: '保修类型', base: 'GT'},
    coverType: {dataName: '保障范围', base: 'GR'},
    termMths: {dataName: '购买产品月数'},
    coverAmount: {dataName: '产品金额'},
    regNo: {dataName: '车辆号码'},
    engineNo: {dataName: '发动机号码'},
    vehicleSoldPrice: {dataName: '车辆售出价格'},
    receiptName: {dataName: '发票抬头'},
    salemanName: {dataName: '操作人'},
    salemanMobile: {dataName: '操作人移动电话'},
    guaranteeEndDate: {dataName: '原厂保险终止日期'},
    status: {dataName: '保单状态', base: 'PS'},
    startDate: {dataName: '保单起始日期'},
    endDate: {dataName: '保单终止日期'}
};

var comparePolicyData = function (oldPolicy, newPolicy) {
    var resultArray = new Array();
    for (var item in policyCompareBase) {
        if (oldPolicy[item] != newPolicy[item]) {
            var oldValue = oldPolicy[item];
            var newValue = newPolicy[item];
            var oldName = oldPolicy[item];
            var newName = newPolicy[item];
            if (policyCompareBase[item].base) {
                oldName = getBaseName(oldPolicy.make, policyCompareBase[item].base, oldPolicy[item]);
                newName = getBaseName(newPolicy.make, policyCompareBase[item].base, newPolicy[item]);
            } else if (item == 'model' || item == 'termMths') {
            } else if (item == 'vehicleSoldPrice') {
                resultArray.push({item: item,dataName: '索赔限额（累计）', oldData: oldValue, newData: newValue, oldDataName: oldName, newDataName: newName});
            } else if (newPolicy[item + "Name"]) {
                oldName = oldPolicy[item + "Name"];
                newName = newPolicy[item + "Name"];
            }
            resultArray.push({item: item, dataName: policyCompareBase[item].dataName, oldData: oldValue, newData: newValue, oldDataName: oldName, newDataName: newName});
        }
    }
//    return [{dataName:'型号',oldData:'A1',newData:'A2'}];
    return resultArray;
}

var generateChangeDatas = function (oldPolicy, newPolicy,changeDatas) {
    var resultArray = new Array();
    for (var i = 0; i < changeDatas.length; i++) {
            var item= changeDatas[i].item;
            var oldValue = changeDatas[i].oldData;
            var newValue = changeDatas[i].newData;
            var oldName = changeDatas[i].oldData;
            var newName = changeDatas[i].newData;
            if (policyCompareBase[item].base) {
                oldName = getBaseName(oldPolicy.make, policyCompareBase[item].base, oldValue);
                newName = getBaseName(newPolicy.make, policyCompareBase[item].base, newValue);
            } else if (item == 'model' || item == 'termMths') {
            } else if (item == 'vehicleSoldPrice') {
                resultArray.push({item: item,dataName: '索赔限额（累计）', oldData: oldValue, newData: newValue, oldDataName: oldName, newDataName: newName});
            } else if (newPolicy[item + "Name"]) {
                oldName = oldPolicy[item + "Name"];
                newName = newPolicy[item + "Name"];
            }
            resultArray.push({item: item, dataName: policyCompareBase[item].dataName, oldData: oldValue, newData: newValue, oldDataName: oldName, newDataName: newName});
    }
//    return [{dataName:'型号',oldData:'A1',newData:'A2'}];
    return resultArray;
}

var generateCancelChangeDatas=function(oldPolicy, newPolicy){
    var resultArray = new Array();
    var item='status';
    resultArray.push({item: item, dataName: policyCompareBase[item].dataName, oldData: 0, newData: 1, oldDataName: '已生效', newDataName: '已失效'});
    return resultArray;
}
var generateChangeCustomerChangeDatas=function(oldCustomerId, newCustomerId){
    var resultArray = new Array();
    var item='customer';
    resultArray.push({item: item, dataName: '保单过户', oldData: oldCustomerId, newData: newCustomerId});
    return resultArray;
}

var getBaseName = function (brand, code, key) {
    var returnValue = '';
    $.ajax({
        url: "/baseData/service/baseInfo/brand/" + brand + "/code/" + code + "?key=" + key + "&" + new Date().getTime(),
        type: 'get',
        async: false,
        dataType: 'json',
        success: function (data, status) {
            if (status === 'success') {
                var values = data.values;
                if (values.length > 0) {
                    var value = values[0];
                    returnValue = value.value;
                }
            }
        }
    });

    return returnValue;
}

var getBaseData = function (brand, code, key) {
    var returnValue = [];
    $.ajax({
        url: "/baseData/service/baseInfo/brand/" + brand + "/code/" + code + "?" + new Date().getTime(),
        type: 'get',
        async: false,
        dataType: 'json',
        success: function (data, status) {
            if (status === 'success') {
                var values = data.values;
                if (values.length > 0) {
                    returnValue = values;
                }
            }
        }
    });

    return returnValue;
}