var endorTable = null;
$(function () {
    $('#previewPolicy').hide();
    $('#modifyCustomerInfo').hide();
    if (endorTable == null) {
        endorTable = $('#table-endor').dataTable({
            "bAutoWidth": true,
            "bProcessing": false,
            "aoColumns": [
                {"data": "policyHistory.policyNo", "defaultContent": ""},
                {"data": "endorNo", "defaultContent": ""},
                {"data": "customer.name", "defaultContent": ""},
                {"data": "customer.companyName", "defaultContent": ""},
                {"data": "policyHistory.model", "defaultContent": ""},
                {"data": "modifyType", "defaultContent": "", "mRender": function (data, type, row) {
                    return getModifyTypeName(data);
                }},
                {"data": "underWriteInd", "defaultContent": "", "mRender": function (data, type, row) {
                    return getModifyStatusName(data);
                }},
                {"data": "modifier", "defaultContent": ""},
                {"data": "createdAt", "defaultContent": "", "mRender": function (data, type, row) {
                    return new Date(data).format('yyyy-MM-dd');
                }
                },
                {"data": "_id", "mRender": function (data, type, row) {
                    return '<a  data-toggle="tooltip" onclick="getEndorDetail(\'' + data + '\',\'' + row.policyHistory._id + '\');" data-placement="left" title="查看详细" href="#"><i class="icon-edit icon-large"></i></a>'
                }}
            ],
            "bServerSide": true,
            "bFilter": false,
            "bLengthChange": false,
            "iDisplayLength": 10,
            "sAjaxSource": '/policy/endor/query',
            "fnServerData": retrieveData,
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

    $('#queryPolicyForm').submit(function () {
        endorTable.fnDraw();
        return false;
    });
    initVehicleForm();
    initBankInfo();
    initCancelPolicyForm();
});

function retrieveData(sSource, aoData, fnCallback) {
    var json = $('#queryPolicyForm').serializeJson();
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

    jsonData._csrf = $('[name="_csrf"]').val();
    $.post(sSource, jsonData, function (data, status) {
        $('[name="_csrf"]').val(data._csrf);
        fnCallback(data);
    });
}


function getEndorDetail(endorId, policyId) {
    $('input[name="policyId"]').val(policyId);
    $.ajax({
        url: '/policy/' + policyId + '/history/get',
        type: 'get',
        dataType: 'json'
    })
        .done(function (data, status) {
            for (var item in data.policy) {
                if (item.indexOf('Date') > 0) {
                    data.policy[item] = new Date(data.policy[item]).format('yyyy-MM-dd');
                }
            }
            for (var item in data.customer) {
                if (item.indexOf('Date') > 0) {
                    data.policy.customer[item] = new Date(data.policy.customer[item]).format('yyyy-MM-dd');
                }
            }
            if (data.policy.overrideVinErrors) {
                data.policy.overrideVinErrorsName = '允许';
            } else {
                data.policy.overrideVinErrorsName = '不允许';
            }
            if (data.policy.status == '0') {
                data.statusName = '已生效';
            }

            if (data.policy.specialCase == '00') {
                data.policy.specialCaseName = '非专案';
            } else {
                data.policy.specialCaseName = '专案';
            }
            policyData = data;
            $.ajax({
                url: '/policy/endor/' + endorId + '/get',
                type: 'get',
                dataType: 'json'
            }).done(function (endorData, status) {
                if (endorData.underWriteInd == "2") {
                    $('#modifyPolicyButton').show();
                } else {
                    $('#modifyPolicyButton').hide();
                }
                for (var item in policyData.policy) {
                    policyChangeData[item] = policyData.policy[item];
                }
                policyChangeData.customer.customerTypeName = policyData.customerTypeName;
                policyChangeData.customer.customerTitleName = policyData.customerTitleName;
                policyChangeData.customer = policyData.policy.customer;
                policyChangeData.policyNo = policyData.policy.policyNo;
                policyChangeData.branch = policyData.branch;
                policyChangeData.status = policyData.policy.status;
                policyChangeData.statusName = policyData.statusName;
                policyChangeData.makeName = policyData.makeName;
                if (endorData.modifyType != '2') {
                    policyChangeData.modifier = endorData.modifier;
                    policyChangeData.modifierMobile = endorData.modifierMobile;
                    policyChangeData.modifyReason = endorData.modifyReason;
                    policyChangeData.modifyRemark = endorData.modifyRemark;
                    policyChangeData.endorNo = endorData.endorNo;
                    policyChangeData.modifyType = endorData.modifyType;
                    if (endorData.cancelDate) {
                        policyChangeData.cancelDate = new Date(endorData.cancelDate).format('yyyy-MM-dd');
                        policyChangeData.surrenderType = endorData.surrenderType;
                        policyChangeData.surrenderReason = endorData.surrenderReason;
                        policyChangeData.endorRemark = endorData.endorRemark;
                    }

                    for (var i = 0; i < endorData.changeDatas.length; i++) {
                        policyChangeData[endorData.changeDatas[i].item] = endorData.changeDatas[i].newData;
                    }
                    policyChangeData.changeDatas = generateChangeDatas(policyData.policy, policyChangeData, endorData.changeDatas);
                    if (endorData.modifyType == '3') {
                        dust.render("_previewPolicyChangeDetail", policyChangeData, function (err, out) {
                            $('#' + SEARCH_PANEL_ID).hide();
                            $('#' + POLICY_REVIEW_CONTAINER).html(out);
                            $('#' + POLICY_PANEL_ID).find('.baseInfo').each(function () {
                                $(this).baseInfoFlash();
                            });
                            for (var i = 0; i < policyChangeData.changeDatas.length; i++) {
                                $('#' + POLICY_REVIEW_CONTAINER).find('[name="' + policyChangeData.changeDatas[i].item + '"]').css('color', 'red');
                            }
                            $('#' + POLICY_PANEL_ID).show();
                        });
                    } else if (endorData.modifyType == '1') {
                        dust.render("_previewPolicyCancelDetail", policyChangeData, function (err, out) {
                            $('#' + SEARCH_PANEL_ID).hide();
                            $('#' + POLICY_REVIEW_CONTAINER).html(out);
                            $('#' + POLICY_PANEL_ID).find('.baseInfo').each(function () {
                                $(this).baseInfoFlash();
                            });
                            for (var i = 0; i < policyChangeData.changeDatas.length; i++) {
                                $('#' + POLICY_REVIEW_CONTAINER).find('[name="' + policyChangeData.changeDatas[i].item + '"]').css('color', 'red');
                            }
                            $('#' + POLICY_PANEL_ID).show();
                        });
                    }
                }else{
                    var newCustomerId=endorData.changeDatas[0].newData;
                    $.get('/policy/customer/' + newCustomerId + '/query', '', function (data, status) {
                        policyChangeData.newCustomer= data.customer;
                        policyChangeData.newCustomer.customerTypeName = data.customerTypeName;
                        policyChangeData.newCustomer.customerTitleName = data.customerTitleName;
                        dust.render("_previewPolicyChangeCustomerDetail", policyChangeData, function (err, out) {
                            $('#' + SEARCH_PANEL_ID).hide();
                            $('#' + POLICY_REVIEW_CONTAINER).html(out);
                            $('#' + POLICY_PANEL_ID).find('.baseInfo').each(function () {
                                $(this).baseInfoFlash();
                            });
                            $('#' + POLICY_PANEL_ID).show();
                        });
                    });
                }

            });


        })
}

var backSearch = function () {
    $('#' + POLICY_REVIEW_CONTAINER).html('');
    $('#' + POLICY_PANEL_ID).hide();
    $('#' + CHANGE_CUSTOMER_PANEL_ID).hide();
    $('#' + CANCEL_PANEL_ID).hide();
    $('#' + SEARCH_PANEL_ID).show();
}

var beginModify = function () {
    if (policyChangeData.modifyType == '3') {
        beginModifyPolicyInfo();
    } else if (policyChangeData.modifyType == '1') {
        beginModifyCancelPolicy();
    }
}

var initCancelPolicyForm = function () {
    $('#' + CANCEL_FORM_ID + ' .baseInfo').each(function () {
        $(this).baseInfoFlash();
    });
}

var beginModifyCancelPolicy = function () {
    $('#' + CANCEL_FORM_ID + ' [name]').each(function (idx, ele) {
        var name = $(ele).attr('name');
        if (policyChangeData[name]) {
            if (name == 'overrideVinErrors') {
                if (policyChangeData.overrideVinErrors) {
                    $(ele).attr('checked', 'true');
                }
            } else if (name == 'sellingDealerOrg') {
                $(ele).val(policyChangeData.sellingDealerOrg);
            } else {
                $(ele).val(policyChangeData[name]);
            }
        }
    });

    $('[name="surrenderType"]').change(function () {
        if ($(this).val() == "2") {
            $('[name="surrenderAmount"]').removeAttr('disabled');
            $('[name="surrenderAmount"]').show();
            $('#surrenderAmountLabel').show();
        } else {
            $('[name="surrenderAmount"]').attr('disabled', 'disabeld');
            $('[name="surrenderAmount"]').val('');
            $('[name="surrenderAmount"]').hide();
            $('#surrenderAmountLabel').hide();

        }
    });
    $('#' + POLICY_PANEL_ID).hide();
    //initBankInfo();
    if (!isPay(policyData.policy.policyNo, policyData.policy.sellingDealerOrg)) {
        $('#' + BANK_INFO_FILL_PANEL_ID).hide();
        $('#' + BANK_INFO_PREVIEW_PANEL_ID).hide();
    } else {
        if (policyChangeData.cardType) {
            dust.render("_previewBankInfo", policyChangeData, function (err, out) {
                $('#' + BANK_INFO_PREVIEW_CONTAINER_ID).html(out);
            });
            $('#' + BANK_INFO_FILL_PANEL_ID).hide();
            $('#' + BANK_INFO_PREVIEW_PANEL_ID).show();
        } else {
            $('#' + BANK_INFO_PREVIEW_PANEL_ID).hide();
            $('#' + BANK_INFO_FILL_PANEL_ID).show();
        }
    }

    $('#' + CANCEL_FORM_ID).validate({
        submitHandler: function () {
            var json = $('#' + CANCEL_FORM_ID).serializeJson();
            putDateToPolicy(json);
            policyChangeData.changeDatas = generateCancelChangeDatas();
            policyChangeData.policyId = policyData.policy._id;
            policyChangeData.policyNo = policyData.policy.policyNo;
            policyChangeData.sellingDealerOrg = policyData.policy.sellingDealerOrg;
            policyChangeData.customer = policyData.policy.customer._id;
            putDateToPolicy(json);
            policyChangeData._csrf = $('[name="_csrf"]').val();
            $.post('/policy/' + policyChangeData.policyId + '/cancel', policyChangeData, function (data, status) {
                if (data.data && data.data.reponseHeadDTO.status == "1") {
                    alert('提交取消保单成功！');
                    window.location.reload();
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

            });
        }
    });

    $('#' + CANCEL_PANEL_ID).show();
}

function beginModifyPolicyInfo() {
    $('#' + POLICY_PANEL_ID).hide();
    $('#' + SEARCH_PANEL_ID).hide();
    $('.datepicker').datepicker({"format": "yyyy-mm-dd", "autoclose": true, "language": "zh-CN"});
    $('input[name="manuWarStartDate"]').datepicker({"format": "yyyy-mm-dd", "autoclose": true, "language": "zh-CN"}).on('changeDate', function (ev) {
        $('#divManuWarMonths').attr('data-date', $(this).val()).attr('data-brand', $('select[name="make"]').val()).baseInfoFlash();
        $('#divManuWarMileage').attr('data-date', $(this).val()).attr('data-brand', $('select[name="make"]').val()).baseInfoFlash();
    });
    getModels();
    $('#' + BASE_FORM_ID).validate({
        submitHandler: function () {
            showProduct();
            return false;
        }
    });

    $('#' + BASE_BUTTON_RE_EDIT).click(function () {
        $('#' + BASE_BUTTON_RE_EDIT).hide();
        $('#showProduct').show();
        disableForm('base');
        $('#productContainer').hide();
    });
    $('#modifyPolicyInfo [name]').each(function (idx, ele) {
        var name = $(ele).attr('name');
        if (policyChangeData[name]) {
            if (name == 'overrideVinErrors') {
                if (policyChangeData.overrideVinErrors) {
                    $(ele).attr('checked', 'true');
                }
            } else if (name == 'sellingDealerOrg') {
                $(ele).val(policyChangeData.sellingDealerOrg);
            } else {
                $(ele).val(policyChangeData[name]);
            }
        }
    });
    if ($('input[name="regNo"]').val() == "新车") {
        $('#chkNewVehicle')[0].checked = true;
        $('input[name="regNo"]').attr('readonly', 'readonly');
    } else {
        $('#chkNewVehicle')[0].checked = false;
        $('input[name="regNo"]').removeAttr('readonly');
    }
    $('[name="receiptName"]').attr('readonly', 'readonly');
    $('#divManuWarMonths').attr('data-date', policyChangeData.manuWarStartDate).attr('data-brand', $('select[name="make"]').val()).baseInfoFlash(function () {
        $('#divManuWarMileage').attr('data-date', policyChangeData.manuWarStartDate).attr('data-brand', $('select[name="make"]').val()).baseInfoFlash(function () {
            showProduct();
            $('#modifyPolicyInfo').show();
        });
    });
}

var getModels = function () {
    var $obj = $('select[name="model"]');
    $.ajax({
        url: "/baseData/service/brand/" + $('select[name="make"]').val() + "/category/ALL?" + new Date().getTime(),
        type: 'get',
        async: false,
        dataType: 'json',
        success: function (data, status) {
            if (status === 'success') {
                $obj.html('');
                $obj.append('<option value="">请选择</option>');
                for (var i = 0, l = data.result.length; i < l; i++) {
                    $obj.append('<option value="' + data.result[i].key + '">' + data.result[i].value + '</option>');
                }
                $obj.val(policyChangeData.model);
            }
        }
    });
}

var initVehicleForm = function () {
    $('#' + VEHICLE_FORM_ID).validate({
        submitHandler: function () {
            var json = $('#' + VEHICLE_FORM_ID).serializeJson();
            if (json.vehicleSoldPrice * 1 <= policyChangeData.coverAmount * 1) {
                bootbox.dialog({
                    message: '车辆出售价格必须大于产品金额【' + policyChangeData.coverAmount + '】',
                    title: "信息提示",
                    buttons: {
                        success: {
                            label: "确定",
                            className: "btn-primary"
                        }
                    }
                });
            } else {
                putDateToPolicy(json);
                policyChangeData._csrf = $('input[name="_csrf"]').val();
                $.post('/rule/' + $('select[name="make"]').val() + "/info", policyChangeData, function (data, status) {
                    $('[name="_csrf"]').val(data._csrf);
                    putDateToPolicy(data);
                    $('#' + VEHICLE_PANEL_ID).hide();
                    initModifyReasonForm();
                    policyChangeData.changeDatas = comparePolicyData(policyData.policy, policyChangeData);
                    policyChangeData.bankPayType = null;
                    for (var i = 0; i < policyChangeData.changeDatas.length; i++) {
                        if (policyChangeData.changeDatas[i].item == 'coverAmount') {
                            if (policyChangeData.changeDatas[i].newData * 1 > policyChangeData.changeDatas[i].oldData * 1) {
                                $('#moneyInfo').html('<strong>此次变更需要向客户收取【' + (policyChangeData.changeDatas[i].newData * 1 - policyChangeData.changeDatas[i].oldData) + '】元</strong>');
                                $('#' + BANK_INFO_FILL_MODIFYPOLICY_PANEL_ID).hide();
                                $('#' + BANK_INFO_PREVIEW_PANEL_ID).hide();
                            } else {
                                $('#moneyInfo').html('<strong>此次变更需要退还【' + (policyChangeData.changeDatas[i].oldData * 1 - policyChangeData.changeDatas[i].newData * 1) + '】元</strong>');
                                if (!isPay(policyData.policy.policyNo, policyData.policy.sellingDealerOrg)) {
                                    $('#' + BANK_INFO_FILL_MODIFYPOLICY_PANEL_ID).hide();
                                    $('#' + BANK_INFO_PREVIEW_MODIFYPOLICY_PANEL_ID).hide();
                                } else {
                                    if (policyChangeData.cardType) {
                                        dust.render("_previewBankInfo", policyChangeData, function (err, out) {
                                            $('#' + BANK_INFO_PREVIEW_MODIFYPOLICY_CONTAINER_ID).html(out);
                                        });
                                        $('#' + BANK_INFO_FILL_MODIFYPOLICY_PANEL_ID).hide();
                                        $('#' + BANK_INFO_PREVIEW_MODIFYPOLICY_PANEL_ID).show();
                                    } else {
                                        $('#' + BANK_INFO_PREVIEW_MODIFYPOLICY_PANEL_ID).hide();
                                        $('#' + BANK_INFO_FILL_MODIFYPOLICY_PANEL_ID).show();
                                    }
                                }
                            }
                            $('#moneyInfo').show();
                            break;
                        }
                    }

                    $('#' + POLICY_MODIFY_REASON_PANEL_ID).show();

                });
            }
        }
    });
}

var initModifyReasonForm = function () {
    $('#divModifyReason').baseInfoFlash();
    $('#' + POLICY_MODIFY_REAOSN_FORM_ID).validate({
        submitHandler: function () {
            putDateToPolicy($('#' + POLICY_MODIFY_REAOSN_FORM_ID).serializeJson());
            if (policyChangeData.changeDatas.length == 0) {
                bootbox.dialog({
                    message: '没有数据变更',
                    title: "信息提示",
                    buttons: {
                        success: {
                            label: "确定",
                            className: "btn-primary"
                        }
                    }
                });
            } else {
                dust.render("_previewPolicyChange", policyChangeData, function (err, out) {
                    $('#' + POLICY_REVIEW_CONTAINER + "2").html(out);
                    initPolicyChangeForm();
                    $('#' + POLICY_MODIFY_REASON_PANEL_ID).hide();
                    for (var i = 0; i < policyChangeData.changeDatas.length; i++) {
                        $('#' + POLICY_REVIEW_CONTAINER + "2").find('[name="' + policyChangeData.changeDatas[i].item + '"]').css('color', 'red');
                    }
                    $('#' + POLICY_CHANGE_PANEL_ID).show();
                });
            }

        }
    });
}

function showProduct() {
    var baseJson = $('#base').serializeJson();
    if (baseJson['overrideVinErrors']) {
        baseJson.overrideVinErrorsName = '允许';
    } else {
        baseJson.overrideVinErrorsName = '不允许';
    }
    putDateToPolicy(baseJson);
    disableForm('base', 'disabled');
    $('#reEdit').show();
    $('#showProduct').hide();
    initProductForm();
}

var isFirst = true;
var initProductForm = function () {
    putDateToPolicy($('#base').serializeJson());
    policyChangeData._csrf = $('input[name="_csrf"]').val();
    policyChangeData.policyId = policyData.policy._id;
    $.post('/rule/' + $('select[name="make"]').val(), policyChangeData, function (data, status) {
        $('[name="_csrf"]').val(data._csrf);
        if (data && data.resultCode == '0') {
            generateProductSelectOptions($('select[name="termMths"]'), data.termMths);
            generateProductSelectOptions($('select[name="schemeId"]'), data.schema);
            generateProductSelectOptions($('select[name="coverType"]'), data.coverType);
            $('[name="coverAmount"]').val('');
            disableForm(BASE_FORM_ID, ATTR_DISABLED);
            $('#' + BASE_BUTTON_SHOW_PRODUCT).hide();

            if (isFirst) {
                $('[name="termMths"]').val(policyChangeData.termMths);
                $('[name="coverType"]').val(policyChangeData.coverType);
                $('[name="coverAmount"]').val(policyChangeData.coverAmount);
                isFirst = false;
            }

            $('#' + BASE_BUTTON_RE_EDIT).show();
            $('#' + PRODUCT_DIV_CONTAINER).show();
            $('#' + PRODUCT_DIV_FOOTER).show();
        } else {
            $('[name="coverAmount"]').val('');
            bootbox.dialog({
                message: data.resultMessage,
                title: "信息提示",
                buttons: {
                    success: {
                        label: "确定",
                        className: "btn-primary"
                    }
                }
            });
        }
    });

    $('#' + PRODCTU_FORM_ID + ' select').each(function () {
        $(this).change(function () {
            var hasValue = true;
            $('#' + PRODCTU_FORM_ID + ' select').each(function () {
                if ($(this).val().length == 0) {
                    hasValue = false;
                }
            });

            if (hasValue) {
                policyData._csrf = $('input[name="_csrf"]').val();
                var baseJson = $('#' + PRODCTU_FORM_ID).serializeJson();
                putDateToPolicy(baseJson);
                $.post('/policy/quotation', policyChangeData, function (data, status) {
                    $('[name="_csrf"]').val(data._csrf);
                    if (data.data && data.data.reponseHeadDTO.status == "1") {
                        $('input[name="coverAmount"]').val(data.data.quotationResDTO.uwPremium);
                        var baseJson = $('#' + PRODCTU_FORM_ID).serializeJson();
                        putDateToPolicy(baseJson);
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

                });

            } else {
                $('input[name="coverAmount"]').val('');
            }
        });
    });
    $('#' + PRODCTU_FORM_ID).validate({
        submitHandler: function () {
            var baseJson = $('#' + PRODCTU_FORM_ID).serializeJson();
            putDateToPolicy(baseJson);
            $('#' + BASE_PANEL_ID).hide();
            $('#' + VEHICLE_PANEL_ID).show();
            return false;
        }
    });
}
var generateProductSelectOptions = function ($obj, array) {
    $obj.html('');
    if (array) {
        if (array.length > 1) {
            $obj.append('<option value="">请选择</option>');
        }
        for (var i = 0, l = array.length; i < l; i++) {
            $obj.append('<option value="' + array[i].key + '">' + array[i].value + '</option>');
        }
    }
}

var putDateToPolicy = function (json) {
    $.each(json, function (k, v) {
        policyChangeData[k] = v;
    });
}

var initPolicyChangeForm = function () {
    $('#policyChange').validate({
        submitHandler: function () {
            policyChangeData._csrf = $('[name="_csrf"]').val();
            policyChangeData.customer = policyChangeData.customer._id;
            $.post('/policy/' + policyChangeData.policyId + '/change', policyChangeData, function (data, status) {
                if (data.data && data.data.reponseHeadDTO.status == "1") {
                    alert('提交批单修改成功！');
                    window.location.reload();
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

            });
        }
    });
}

var showVehicleInfo = function () {
    if ($('[name="receiptName"]').val() == "") {
        $('[name="receiptName"]').val($('[name="sellingDealerOrg"] option:selected').text());
    }
    $('#' + BASE_PANEL_ID).hide();
    $('#' + POLICY_MODIFY_REASON_PANEL_ID).hide();
    $('#' + POLICY_CHANGE_PANEL_ID).hide();
    $('#' + VEHICLE_PANEL_ID).show();
}

var showBaseInfo = function () {
    $('#' + VEHICLE_PANEL_ID).hide();
    $('#' + POLICY_MODIFY_REASON_PANEL_ID).hide();
    $('#' + POLICY_CHANGE_PANEL_ID).hide();
    $('#' + BASE_PANEL_ID).show();
}
var showModifyReason = function () {
    $('#' + VEHICLE_PANEL_ID).hide();
    $('#' + POLICY_CHANGE_PANEL_ID).hide();
    $('#' + BASE_PANEL_ID).hide();
    $('#' + POLICY_MODIFY_REASON_PANEL_ID).show();
}


var changeNewVehicle = function (obj) {
    if (obj.checked) {
        $('input[name="regNo"]').val('新车');
        $('input[name="regNo"]').attr('readonly', 'readonly');
    } else {
        $('input[name="regNo"]').val('');
        $('input[name="regNo"]').removeAttr('readonly');
    }
}

var modifyTypeArray = null;
var getModifyTypeName = function (key) {
    var returnValue = '';
    if (key) {
        if (modifyTypeArray == null) {
            modifyTypeArray = getBaseData('YQAD', 'MT');
        }
        for (var i = 0; i < modifyTypeArray.length; i++) {
            if (modifyTypeArray[i].key == key) {
                returnValue = modifyTypeArray[i].value;
                break;
            }
        }

    }
    return returnValue;
}
var modifyStatusArray = null;
var getModifyStatusName = function (key) {
    var returnValue = '';
    if (key) {
        if (modifyStatusArray == null) {
            modifyStatusArray = getBaseData('YQAD', 'ES');
        }
        for (var i = 0; i < modifyStatusArray.length; i++) {
            if (modifyStatusArray[i].key == key) {
                returnValue = modifyStatusArray[i].value;
                break;
            }
        }
    }
    return returnValue;
}

function disableForm(formId, isDisabled) {
    var attr = "disable";
    if (!isDisabled) {
        attr = "enable";
        $("form[id='" + formId + "'] :text").removeAttr("disabled");
        $("form[id='" + formId + "'] textarea").removeAttr("disabled");
        $("form[id='" + formId + "'] select").removeAttr("disabled");
        $("form[id='" + formId + "'] :radio").removeAttr("disabled");
        $("form[id='" + formId + "'] :checkbox").removeAttr("disabled");
    } else {
        $("form[id='" + formId + "'] :text").attr("disabled", isDisabled);
        $("form[id='" + formId + "'] textarea").attr("disabled", isDisabled);
        $("form[id='" + formId + "'] select").attr("disabled", isDisabled);
        $("form[id='" + formId + "'] :radio").attr("disabled", isDisabled);
        $("form[id='" + formId + "'] :checkbox").attr("disabled", isDisabled);
    }

}
