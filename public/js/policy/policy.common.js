/**
 * Created by lenovo on 2014/10/24.
 */
var searchTable = null;
var baseDataArray = {};
var policyData = {};
var policyChangeData = {};

var BASE_FORM_ID = 'base',
    BASE_PANEL_ID = 'panelBaseInfo',
    BASE_DIV_CONTAINER = 'baseContainer',
    BASE_BUTTON_RE_EDIT = 'reEdit',
    BASE_BUTTON_SHOW_PRODUCT = 'showProduct';

var PRODUCT_DIV_CONTAINER = 'productContainer',
    PRODUCT_DIV_FOOTER='productFooter',
    PRODCTU_FORM_ID = 'product';

var CUSTOMER_DIV_CONTAINER = 'customerContainer',
    CUSTOMER_QUERY_FORM_ID = 'queryCustomerForm',
    CUSTOMER_PANEL_ID = 'panelCustomerInfo',
    CUSTOMER_ADD_FORM_ID = 'addCustomerForm',
    CUSTOMER_CHANGE_FORM_ID = 'addCustomerForm',
    CUSTOMER_ADD_DIV_CONTAINER = 'customerAddContainer',
    CUSTOMER_ADD_DIV_FOOTER = 'customerAddFooter',
    CUSTOMER_DIV_PREVIEW_CONTAINER = 'customerPreviewContainer',
    CUSTOMER_DIV_PREVIEW_FOOTER = 'customerPreviewFooter';

var VEHICLE_FORM_ID = 'vehicle',
    VEHICLE_PANEL_ID = 'panelVehicleInfo',
    VEHICLE_DIV_CONTAINER = 'vehicleContainer';
var POLICY_REVIEW_CONTAINER = 'previewPolicyContainer',
    POLICY_PANEL_ID = 'previewPolicy',
    POLICY_FROM_ID = 'policy';
var POLICY_REVIEW_CONFIRM_CONTAINER = 'previewPolicyConfirmContainer',
    POLICY_PANEL_CONFIRM_ID = 'previewPolicyConfirm';

var CANCEL_PANEL_ID = 'cancelPolicyPanel',
    CANCEL_FORM_ID='cancelPolicyForm';
var SEARCH_PANEL_ID = 'searchPolicyPanel';
var CHANGE_CUSTOMER_PANEL_ID = 'modifyCustomerPanel';

var ATTR_DISABLED = 'disabled';

var POLICY_CHANGE_PANEL_ID = 'policyChangePanel',
    POLICY_CHANGE_FORM_ID = 'policyChange';
var POLICY_MODIFY_REASON_PANEL_ID = 'policyModifyReasonPanel',
    POLICY_MODIFY_REAOSN_FORM_ID = 'modifyReasonForm';

var BANK_INFO_FILL_PANEL_ID='bankInfoFillPanel';
var BANK_INFO_FILL_MODIFYPOLICY_PANEL_ID='bankInfoFillModifyPolicyPanel';
var BANK_INFO_PREVIEW_PANEL_ID='previewBankInfo',
    BANK_INFO_PREVIEW_CONTAINER_ID='previewBankInfoContainer';
var BANK_INFO_PREVIEW_MODIFYPOLICY_CONTAINER_ID='previewBankInfoModifyPolicyContainer';
var BANK_INFO_PREVIEW_MODIFYPOLICY_PANEL_ID='previewBankModifyPolicyInfo';


var initVinNoValidate = function () {
    if ($('select[name="make"]') != '') {
        var values = getBaseDatas($('select[name="make"]').val(), 'VN');
        var regStr = '';
        var messageStr = $('select[name="make"] option:selected').text() + "品牌的车架号以";
        for (var i = 0; i < values.length; i++) {
            if (i == 0) {
                regStr += "^" + values[i].key;
                messageStr += values[i].key;
            } else {
                regStr += "|^" + values[i].key;
                messageStr += "、" + values[i].key;
            }
        }
        messageStr += "开头，长度为17位，只能包含大写字母和数字";
        jQuery.validator.addMethod("isVinNo", function (value, element) {
            var reg = new RegExp(regStr);
            return this.optional(element) ||(/^[A-Z0-9]{17}$/.test(value)&&reg.test(value));
        }, messageStr);
    }
}

var getBaseDataName = function (brand, code, key) {
    var returnValue = '';
    if (!baseDataArray[brand + code]) {
        baseDataArray[brand + code] = getBaseDatas(brand, code);
    }
    if (key) {
        for (var i = 0; i < baseDataArray[brand + code].length; i++) {
            if (baseDataArray[brand + code][i].key == key) {
                returnValue = baseDataArray[brand + code][i].value;
                break;
            }
        }
    } else {
        return baseDataArray[brand + code];
    }
    return returnValue;
}

var getBaseDatas = function (brand, code) {
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

var printPolicy=function(policyId){
    window.open('/print/certificate?policyId='+policyData.policy._id, "_blank");
}

function getPolicyDetail(policyId) {
    policyData={};
    policyChangeData={};
    $('input[name="policyId"]').val(policyId);
    $.ajax({
        url: '/policy/' + policyId + '/get',
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
            dust.render("_previewPolicyDetail", data, function (err, out) {
                $('#' + SEARCH_PANEL_ID).hide();
                $('#' + POLICY_REVIEW_CONTAINER).html(out);
                $('#' + POLICY_PANEL_ID).find('.baseInfo').each(function () {
                    $(this).baseInfoFlash();
                });
                $('#' + POLICY_PANEL_CONFIRM_ID).hide();

                if(policyData.policy.status=='0'){
                    $('#printBtn').show();
                }else{
                    $('#printBtn').hide();
                }

                $('#' + POLICY_REVIEW_CONTAINER).show();
                $('#' + POLICY_PANEL_ID).show();
            });
        })
}

//禁用form表单中所有的input[文本框、复选框、单选框],select[下拉选],多行文本框[textarea]
var disableForm = function (formId, isDisabled) {
    var attr = "disable";
    if (!isDisabled) {
        attr = "enable";
        $("[id='" + formId + "'] :text").removeAttr("disabled");
        $("[id='" + formId + "'] textarea").removeAttr("disabled");
        $("[id='" + formId + "'] select").removeAttr("disabled");
        $("[id='" + formId + "'] :radio").removeAttr("disabled");
        $("[id='" + formId + "'] :checkbox").removeAttr("disabled");
    } else {
        $("[id='" + formId + "'] :text").attr("disabled", isDisabled);
        $("[id='" + formId + "'] textarea").attr("disabled", isDisabled);
        $("[id='" + formId + "'] select").attr("disabled", isDisabled);
        $("[id='" + formId + "'] :radio").attr("disabled", isDisabled);
        $("[id='" + formId + "'] :checkbox").attr("disabled", isDisabled);
    }

}

