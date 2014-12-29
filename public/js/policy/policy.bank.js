/**
 * Created by lenovo on 2014/10/24.
 */
var isFirstBankRelatedQuery = true;
var cardTypeDTOList=null;
var bankPayTypeDTOList=null;

var initBankInfo = function () {
    $.ajax({
        url: '/baseData/bankInfo',
        type: "GET",
        async: false,
        data: {queryType: '0'},
        success: function (data, status) {
            if (data.data && data.data.reponseHeadDTO.status == "1") {
                generateSelectOptions('cardType', data.data.baseDataQueryResDTO.cardTypeDTOList, 'codeCode', 'codeCName');
                generateSelectOptions('bankPayType', data.data.baseDataQueryResDTO.bankPayTypeDTOList, 'bankPayTypeCode', 'bankPayTypeCName');
                cardTypeDTOList=data.data.baseDataQueryResDTO.cardTypeDTOList;
                bankPayTypeDTOList=data.data.baseDataQueryResDTO.bankPayTypeDTOList;
            } else {
                bootbox.dialog({
                    message: data.data.reponseHeadDTO.message,
                    title: "信息提示",
                    buttons: {
                        success: {
                            label: "确定",
                            className: "btn-primary"
                        }
                    }
                });
            }
        }
    });

    $('select[name="payeeBankCode"]').change(function () {
        $.ajax({
            url: '/baseData/bankInfo',
            type: "GET",
            async: false,
            success: function (data, status) {
                if (data.data && data.data.reponseHeadDTO.status == "1") {

                } else {
                    bootbox.dialog({
                        message: data.data.reponseHeadDTO.message,
                        title: "信息提示",
                        buttons: {
                            success: {
                                label: "确定",
                                className: "btn-primary"
                            }
                        }
                    });
                }
            }
        });
    });
}

var isPay = function (policyNo,sellingDealerOrg) {
    var resultValue = false;
    $.ajax({
        url: '/policy/isPay',
        type: "GET",
        async: false,
        data: {policyNo: policyNo,sellingDealerOrg:sellingDealerOrg},
        success: function (data, status) {
            if (data.data && data.data.reponseHeadDTO.status == "1") {
                if (data.data.isPayResDTO.result == '1') {
                    resultValue = true;
                }
                if(data.receiveAccount&&data.receiveAccount.cardType){
                    var cardTypeName=getTypeName(cardTypeDTOList, 'codeCode', 'codeCName',data.receiveAccount.cardType);
                    var bankPayTypeName=getTypeName(bankPayTypeDTOList, 'bankPayTypeCode', 'bankPayTypeCName',data.receiveAccount.bankPayType);
                    putDateToPolicy(data.receiveAccount);
                    putDateToPolicy({cardTypeName:cardTypeName,bankPayTypeName:bankPayTypeName});
                }
            } else {
                bootbox.dialog({
                    message: data.data.reponseHeadDTO.message,
                    title: "信息提示",
                    buttons: {
                        success: {
                            label: "确定",
                            className: "btn-primary"
                        }
                    }
                });
            }
        }
    });
    return resultValue;
}

var generateSelectOptions = function (eleName, list, code, name) {
    $obj = $('select[name="' + eleName + '"]');
    $obj.html('');
    $obj.append('<option value="">请选择</option>');
    for (var i = 0; i < list.length; i++) {
        $obj.append('<option value="' + list[i][code] + '">' + list[i][name] + '</option>');
    }
}
var getTypeName = function ( list, code, name,value) {
    for (var i = 0; i < list.length; i++) {
        if(list[i][code]==value){
            return list[i][name];
        }
    }
}
var bankTable = null;
var bankRelateTable = null;
$(function () {
    if (bankTable == null) {
        bankTable = $('#table-bank').dataTable({
            "bAutoWidth": true,
            "bProcessing": false,
            "aoColumns": [
                {"data": "code", "defaultContent": "", width: "50%"},
                {"data": "name", "defaultContent": "", width: "50%"}
            ],
            "bServerSide": true,
            "bFilter": false,
            "bLengthChange": false,
            "iDisplayLength": 10,
            "sAjaxSource": '/baseData/bankInfo',
            "fnServerData": retrieveBankData,
            "oLanguage": {
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sZeroRecords": "没有检索到数据",
                "sInfo": "显示 _START_ 至 _END_ 条 &nbsp;&nbsp;共 _TOTAL_ 条",
                "sInfoEmtpy": "没有数据",
                "sProcessing": "正在加载数据...",
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": "前一页",
                    "sNext": "后一页",
                    "sLast": "尾页"
                }
            }
        });
    }
    if (bankRelateTable == null) {
        bankRelateTable = $('#table-bankRelate').dataTable({
            "bAutoWidth": true,
            "bProcessing": false,
            "aoColumns": [
                {"data": "code", "defaultContent": "", width: "15%"},
                {"data": "name", "defaultContent": "", width: "35%"},
                {"data": "standardareaCode", "defaultContent": "", width: "15%"},
                {"data": "standardareaName", "defaultContent": "", width: "35%"}
            ],
            "bServerSide": true,
            "bFilter": false,
            "bLengthChange": false,
            "iDisplayLength": 10,
            "sAjaxSource": '/baseData/bankInfo',
            "fnServerData": retrieveBankRelateData,
            "oLanguage": {
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sZeroRecords": "没有检索到数据",
                "sInfo": "显示 _START_ 至 _END_ 条 &nbsp;&nbsp;共 _TOTAL_ 条",
                "sInfoEmtpy": "没有数据",
                "sProcessing": "正在加载数据...",
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": "前一页",
                    "sNext": "后一页",
                    "sLast": "尾页"
                }
            }
        });
    }
    //background-color:#b0bed9
    $('#table-bank tbody ').on('click', 'tr', function () {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        }
        else {
            $('#table-bank tbody tr').removeClass('active');
            $(this).addClass('active');
        }
    });
    $('#table-bank tbody ').on('dblclick', 'tr', function () {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        }
        else {
            $('#table-bank tbody tr').removeClass('active');
            $(this).addClass('active');
        }
        chooseBank($(this));
    });

    $('#chooseBankBtn').click(function () {
        var $tr = $('#table-bank tbody').find('.active');
        if (!$tr) {
            alert('请选择一个银行');
            return;
        }
        chooseBank($tr);
    });
    $('#table-bankRelate tbody ').on('click', 'tr', function () {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        }
        else {
            $('#table-bankRelate tbody tr').removeClass('active');
            $(this).addClass('active');
        }
    });
    $('#table-bankRelate tbody ').on('dblclick', 'tr', function () {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        }
        else {
            $('#table-bankRelate tbody tr').removeClass('active');
            $(this).addClass('active');
        }
        chooseRelateBank($(this));
    });

    $('#chooseBankBtn').click(function () {
        var $tr = $('#table-bankRelate tbody').find('.active');
        if (!$tr) {
            alert('请选择一个联行');
            return;
        }
        chooseRelateBank($tr);
    });

    $('#chooseRelateBankModalBtn').click(function(){
        if($('[name="payeeBankCode"]').val()==''){
            alert('请选择一个银行');
            return;
        }else{
            bankRelateTable.fnDraw();
            $('#chooseRelateBankModal').modal('show');
        }
    });

    $('#queryBankForm').submit(function () {
        bankTable.fnDraw();
        return false;
    });
    $('#queryRelateBankForm').submit(function () {
        bankRelateTable.fnDraw();
        return false;
    });
});

var chooseBank = function ($obj) {
    $('[name="payeeBankCode"]').val($obj.find('td:first').text());
    $('[name="bankBranchName"]').val($obj.find('td:last').text());
    $('[name="payeeRelateCode"]').val('');
    $('[name="payeeBankName"]').val('');
    $('[name="payeeBankCityCode"]').val('');
    $('[name="payeeBankCityName"]').val('');
    $('#chooseBankModal').modal('hide');
}
var chooseRelateBank = function ($obj) {
    $('[name="payeeRelateCode"]').val($obj.find('td:first').text());
    $('[name="payeeBankName"]').val($obj.find('td:eq(1)').text());
    $('[name="payeeBankCityCode"]').val($obj.find('td:eq(2)').text());
    $('[name="payeeBankCityName"]').val($obj.find('td:last').text());
    $('#chooseRelateBankModal').modal('hide');
}

function retrieveBankData(sSource, aoData, fnCallback) {
    var json = $('#queryBankForm').serializeJson();
    var jsonData = {};
    for (var item in json) {
        jsonData[item] = json[item];
    }
    $.each(aoData, function (i, item) {
        var result = item.value;
        if (result) {
            result = $.trim(result);
            if (result != "") {
                jsonData[item.name] = result;
            }
        }
    });
    $.get(sSource, jsonData, function (data, status) {
        var model = {};
        model.aaData = data.data.baseDataQueryResDTO.bankDTOList;
        model.iTotalDisplayRecords = data.data.baseDataQueryResDTO.bankSize;
        model.iTotalRecords = data.data.baseDataQueryResDTO.bankSize;
        fnCallback(model);
    });
}
function retrieveBankRelateData(sSource, aoData, fnCallback) {
    if(!isFirstBankRelatedQuery){
        var json = $('#queryRelateBankForm').serializeJson();
        var jsonData = {};
        for (var item in json) {
            jsonData[item] = json[item];
        }
        $.each(aoData, function (i, item) {
            var result = item.value;
            if (result) {
                result = $.trim(result);
                if (result != "") {
                    jsonData[item.name] = result;
                }
            }
        });
        jsonData.bankCode=$('[name="payeeBankCode"]').val();

        $.get(sSource, jsonData, function (data, status) {
            var model = {};
            model.aaData = data.data.baseDataQueryResDTO.banklocationsDTOList;
            model.iTotalDisplayRecords = data.data.baseDataQueryResDTO.banklocationsSize;
            model.iTotalRecords = data.data.baseDataQueryResDTO.banklocationsSize;
            fnCallback(model);
        });
    }else{
        isFirstBankRelatedQuery=false;
    }

}

var beginModifyBankInfo=function(){
    $('#'+BANK_INFO_FILL_PANEL_ID).find('[name]').each(function(){
        var name=$(this).attr('name');
        if(policyChangeData[name]){
            $(this).val(policyChangeData[name]);
        }
    });
    $('#'+BANK_INFO_PREVIEW_PANEL_ID).hide();
    $('#'+BANK_INFO_FILL_PANEL_ID).show();
}

var beginModifyPolicyBankInfo=function(){
    $('#'+BANK_INFO_FILL_MODIFYPOLICY_PANEL_ID).find('[name]').each(function(){
        var name=$(this).attr('name');
        if(policyChangeData[name]){
            $(this).val(policyChangeData[name]);
        }
    });
    $('#'+BANK_INFO_PREVIEW_MODIFYPOLICY_PANEL_ID).hide();
    $('#'+BANK_INFO_FILL_MODIFYPOLICY_PANEL_ID).show();
}

