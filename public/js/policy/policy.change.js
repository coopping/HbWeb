$(function () {
    initVehicleForm();
    initBankInfo();
});

var backSearch = function () {
    $('#' + POLICY_REVIEW_CONTAINER).html('');
    $('#' + POLICY_PANEL_ID).hide();
    $('#' + CHANGE_CUSTOMER_PANEL_ID).hide();
    $('#' + SEARCH_PANEL_ID).show();
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
        if (policyData.policy[name]) {
            if (name == 'overrideVinErrors') {
                if (policyData.policy.overrideVinErrors) {
                    $(ele).attr('checked', 'true');
                }
            } else if (name == 'sellingDealerOrg') {
                $(ele).val(policyData.policy.sellingDealerOrg);
            } else {
                $(ele).val(policyData.policy[name]);
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
    $('#divManuWarMonths').attr('data-date', policyData.policy.manuWarStartDate).attr('data-brand', $('select[name="make"]').val()).baseInfoFlash(function () {
        $('#divManuWarMileage').attr('data-date', policyData.policy.manuWarStartDate).attr('data-brand', $('select[name="make"]').val()).baseInfoFlash(function () {
            showProduct();
            $('#modifyPolicyInfo').show();
        });
    });
    initVinNoValidate();
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
                $obj.val(policyData.policy.model);
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
                    policyChangeData.customer = policyData.policy.customer;
                    policyChangeData.customer.customerTypeName = policyData.customerTypeName;
                    policyChangeData.customer.customerTitleName = policyData.customerTitleName;
                    policyChangeData.policyNo = policyData.policy.policyNo;
                    policyChangeData.status = policyData.policy.status;
                    policyChangeData.statusName = policyData.statusName;
                    policyChangeData.branch = policyData.branch;
                    $('#' + VEHICLE_PANEL_ID).hide();
                    initModifyReasonForm();
                    policyChangeData.changeDatas = comparePolicyData(policyData.policy, policyChangeData);
                    policyChangeData.bankPayType=null;
                    for (var i = 0; i < policyChangeData.changeDatas.length; i++) {
                        if (policyChangeData.changeDatas[i].item == 'coverAmount') {
                            if (policyChangeData.changeDatas[i].newData * 1 > policyChangeData.changeDatas[i].oldData * 1) {
                                $('#moneyInfo').html('<strong>此次变更需要向客户收取【' + (policyChangeData.changeDatas[i].newData * 1 - policyChangeData.changeDatas[i].oldData) + '】元</strong>');
                                $('#'+BANK_INFO_FILL_PANEL_ID).hide();
                                $('#'+BANK_INFO_PREVIEW_PANEL_ID).hide();
                            } else {
                                $('#moneyInfo').html('<strong>此次变更需要退还【' + (policyChangeData.changeDatas[i].oldData * 1 - policyChangeData.changeDatas[i].newData * 1) + '】元</strong>');
                                if(!isPay(policyData.policy.policyNo,policyData.policy.sellingDealerOrg)){
                                    $('#'+BANK_INFO_FILL_PANEL_ID).hide();
                                    $('#'+BANK_INFO_PREVIEW_PANEL_ID).hide();
                                }else{
                                    if(policyChangeData.cardType){
                                        dust.render("_previewBankInfo", policyChangeData, function (err, out) {
                                            $('#'+BANK_INFO_PREVIEW_CONTAINER_ID).html(out);
                                        });
                                        $('#'+BANK_INFO_FILL_PANEL_ID).hide();
                                        $('#'+BANK_INFO_PREVIEW_PANEL_ID).show();
                                    }else{
                                        $('#'+BANK_INFO_PREVIEW_PANEL_ID).hide();
                                        $('#'+BANK_INFO_FILL_PANEL_ID).show();
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

                showChangePreview();
            }

        }
    });
}

var showChangePreview=function(){
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
                $('[name="termMths"]').val(policyData.policy.termMths);
                $('[name="coverType"]').val(policyData.policy.coverType);
                $('[name="coverAmount"]').val(policyData.policy.coverAmount);
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
