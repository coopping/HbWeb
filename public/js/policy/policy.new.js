var initBaseForm = function () {
    $('.datepicker').datepicker({"format": "yyyy-mm-dd", "autoclose": true, "language": "zh-CN"});
    $('input[name="manuWarStartDate"]').datepicker({"format": "yyyy-mm-dd", "autoclose": true, "language": "zh-CN"}).on('changeDate', function (ev) {
        $('#divManuWarMonths').attr('data-date', $(this).val()).attr('data-brand', $('select[name="make"]').val()).baseInfoFlash();
        $('#divManuWarMileage').attr('data-date', $(this).val()).attr('data-brand', $('select[name="make"]').val()).baseInfoFlash();
    });
    $('#' + BASE_BUTTON_RE_EDIT).click(function () {
        $('#' + BASE_BUTTON_RE_EDIT).hide();
        $('#' + BASE_BUTTON_SHOW_PRODUCT).show();
        disableForm(BASE_FORM_ID);
        $('#' + PRODUCT_DIV_CONTAINER).hide();
        $('#' + PRODUCT_DIV_FOOTER).hide();
        $('#' + PRODCTU_FORM_ID)[0].reset();
    });
    $('#' + BASE_FORM_ID).validate({
        submitHandler: function () {
            var baseJson = $('#' + BASE_FORM_ID).serializeJson();
            if (!baseJson['overrideVinErrors']) {
                baseJson.overrideVinErrorsName = '不允许';
                $.ajax({
                    url: '/policy/vinNo/check',
                    type: "GET",
                    async: false,
                    data: 'vinNo=' + baseJson['vinNo'],
                    success: function (data, status) {
                        if (data) {
                            putDateToPolicy(baseJson);
                            showProduct();
                        } else {
                            bootbox.dialog({
                                message: '车架号为【' + baseJson['vinNo'] + '】的车辆已存在有效保单',
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
            } else {
                baseJson.overrideVinErrorsName = '允许';
                putDateToPolicy(baseJson);
                showProduct();
            }

        }
    });
    getModels();
    $('#' + BASE_FORM_ID).find('.baseInfo').each(function () {
        $(this).attr('data-brand', $('select[name="make"]').val()).baseInfoFlash();
    });

    initVinNoValidate();
}

var getModels = function () {
    var $obj = $('select[name="model"]');
    $.get("/baseData/service/brand/" + $('select[name="make"]').val() + "/category/ALL?" + new Date().getTime(), function (data, status) {
        if (status === 'success') {
            $obj.html('');
            $obj.append('<option value="">请选择</option>');
            for (var i = 0, l = data.result.length; i < l; i++) {
                $obj.append('<option value="' + data.result[i].key + '">' + data.result[i].value + '</option>');
            }
        }
    });
}

var showBaseInfo = function () {
    $('#' + CUSTOMER_PANEL_ID).hide();
    $('#' + POLICY_PANEL_ID).hide();
    $('#' + POLICY_PANEL_CONFIRM_ID).hide();
    $('#' + VEHICLE_PANEL_ID).hide();
    $('#' + BASE_PANEL_ID).show();
}

var showVehicleInfo = function () {
    if ($('[name="receiptName"]').val() == "") {
        $('[name="receiptName"]').val($('[name="sellingDealerOrg"] option:selected').text());
    }
    $('#' + CUSTOMER_PANEL_ID).hide();
    $('#' + POLICY_PANEL_ID).hide();
    $('#' + POLICY_PANEL_CONFIRM_ID).hide();
    $('#' + BASE_PANEL_ID).hide();
    $('#' + VEHICLE_PANEL_ID).show();
}

var initProductForm = function () {
    policyData._csrf = $('input[name="_csrf"]').val();
    $.post('/rule/' + $('select[name="make"]').val(), policyData, function (data, status) {
        $('[name="_csrf"]').val(data._csrf);
        if (data && data.resultCode == '0') {
            generateSelectOptions($('select[name="termMths"]'), data.termMths);
            generateSelectOptions($('select[name="schemeId"]'), data.schema);
            generateSelectOptions($('select[name="coverType"]'), data.coverType);
            disableForm(BASE_FORM_ID, ATTR_DISABLED);
            $('#' + BASE_BUTTON_SHOW_PRODUCT).hide();
            $('#' + BASE_BUTTON_RE_EDIT).show();
            $('#' + PRODUCT_DIV_CONTAINER).show();
            $('#' + PRODUCT_DIV_FOOTER).show();
        } else {
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
                $.post('/policy/quotation', policyData, function (data, status) {
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
            $('#' + BASE_PANEL_ID).hide();
            $('#' + CUSTOMER_PANEL_ID).show();
            return false;
        }
    });
}

var generateSelectOptions = function ($obj, array) {
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

var customersTable = null;
var isFirstQuery = null;
var initCustomerQueryForm = function () {
    if (customersTable == null) {
        customersTable = $('#table-style').dataTable({
            "bAutoWidth": true,
            "bProcessing": false,
            "aoColumns": [
                {"data": "name", "defaultContent": "", width: "50px"},
                {"data": "identityNo", "defaultContent": "", width: "150px"},
                {"data": "companyName", "defaultContent": "", width: "200px"},
                {"data": "address", "defaultContent": ""},
                {"data": "mobile", "defaultContent": "", width: "100px"},
                {"data": "_id", width: "30px"}
            ],
            "bServerSide": true,
            "bFilter": false,
            "bLengthChange": false,
            "iDisplayLength": 10,
            "sAjaxSource": '/policy/customer/query',
            "fnServerData": retrieveCustomersData,
            "fnRowCallback": function (nRow, aData, iDisplayIndex) {
                $('td:eq(-1)', nRow).html('<a  onclick="chooseCustomer(\'' + aData._id + '\')" data-toggle="tooltip" data-placement="left" title="选择" href="#"><i class="icon-edit icon-large"></i></a>');
            },
            "oLanguage": {
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sZeroRecords": "没有数据",
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

    $('#' + CUSTOMER_QUERY_FORM_ID).submit(function () {
        customersTable.fnDraw();
        return false;
    });
}

function retrieveCustomersData(sSource, aoData, fnCallback) {
    if (isFirstQuery) {
        var json = $('#' + CUSTOMER_QUERY_FORM_ID).serializeJson();
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
    } else {
        fnCallback({aaData: [], iTotalDisplayRecords: 0, iTotalRecords: 0});
    }
    isFirstQuery = true;
}


var initVehicleForm = function () {
    $('#' + VEHICLE_FORM_ID).validate({
        submitHandler: function () {
            var json = $('#' + VEHICLE_FORM_ID).serializeJson();
            if (json.vehicleSoldPrice * 1 <= policyData.coverAmount * 1) {
                bootbox.dialog({
                    message: '车辆出售价格必须大于产品金额【' + policyData.coverAmount + '】',
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
                policyData._csrf = $('input[name="_csrf"]').val();
                $.post('/rule/' + $('select[name="make"]').val() + "/info", policyData, function (data, status) {
                    $('[name="_csrf"]').val(data._csrf);
                    putDateToPolicy(data);
                    dust.render("_previewPolicyAdd", policyData, function (err, out) {
                        $('#' + POLICY_REVIEW_CONFIRM_CONTAINER).html(out);
                        $('#' + POLICY_REVIEW_CONFIRM_CONTAINER).find('.baseInfo').each(function(){
                            $(this).baseInfoFlash();
                        });
                        $('#' + VEHICLE_PANEL_ID).hide();
                        $('#' + POLICY_REVIEW_CONFIRM_CONTAINER).show();
                        $('#' + POLICY_PANEL_CONFIRM_ID).show();
                        initPolicyForm();
                    });
                });
            }
        }
    });
}
var initPolicyForm = function () {
    $('#' + POLICY_FROM_ID).submit(function () {
        policyData._csrf = $('input[name="_csrf"]').val();
        policyData.customer = policyData.customer._id;
        $.post('/policy/add', policyData, function (data, status) {
            if (data.data.reponseHeadDTO.status == '1') {
                alert('出单成功！');
                getPolicyDetail(data.policyId);
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
        return false;
    });
}

var chooseCustomer = function (id) {
    $.get('/policy/customer/' + id + '/query', '', function (data, status) {
        dust.render("_previewCustomer", data, function (err, out) {
            $('#' + CUSTOMER_DIV_CONTAINER).hide();
            $('#' + CUSTOMER_ADD_DIV_CONTAINER).hide();
            $('#' + CUSTOMER_ADD_DIV_FOOTER).hide();
            $('#' + CUSTOMER_DIV_PREVIEW_CONTAINER).html(out);
            policyData.customer = data.customer;
            policyData.customer.customerTypeName = data.customerTypeName;
            policyData.customer.customerTitleName = data.customerTitleName;
            $('#' + CUSTOMER_DIV_PREVIEW_CONTAINER).show();
            $('#' + CUSTOMER_DIV_PREVIEW_FOOTER).show();

        });
    });

    return false;
}

var editCustomer = function () {
    $('#' + CUSTOMER_DIV_CONTAINER).hide();
    $('#' + CUSTOMER_DIV_PREVIEW_CONTAINER).hide();
    $('#' + CUSTOMER_DIV_PREVIEW_FOOTER).hide();
    $('#' + CUSTOMER_ADD_FORM_ID)[0].reset();
    $('#' + CUSTOMER_ADD_FORM_ID).find('[name]').each(function () {
        var name = $(this).attr('name')
        if (policyData.customer[name.substr(9, name.length - 10)]) {
            $(this).val(policyData.customer[name.substr(9, name.length - 10)]);
        }
    });
    $('#addressInfoAddress').val(policyData.customer['address']);
    $('[name="customerId"]').val(policyData.customer['_id']);
    $('#customerType').change();

    $('#' + CUSTOMER_ADD_DIV_CONTAINER).show();
    $('#' + CUSTOMER_ADD_DIV_FOOTER).show();
}

var showAddCustomer = function () {
    $('#' + CUSTOMER_ADD_FORM_ID)[0].reset();
    $('#' + CUSTOMER_DIV_CONTAINER).hide();
    $('#' + CUSTOMER_DIV_PREVIEW_CONTAINER).hide();
    $('#' + CUSTOMER_DIV_PREVIEW_FOOTER).hide();
    $('#' + CUSTOMER_ADD_DIV_CONTAINER).show();
    $('#' + CUSTOMER_ADD_DIV_FOOTER).show();
}

var showSearchCustomer = function () {
    $('#' + CUSTOMER_ADD_DIV_CONTAINER).hide();
    $('#' + CUSTOMER_ADD_DIV_FOOTER).hide();
    $('#' + CUSTOMER_DIV_PREVIEW_CONTAINER).hide();
    $('#' + CUSTOMER_DIV_PREVIEW_FOOTER).hide();
    $('#' + CUSTOMER_DIV_CONTAINER).show();
}

var rechooseCustomer = function () {
    $('#' + CUSTOMER_DIV_CONTAINER).hide();
    $('#' + CUSTOMER_DIV_PREVIEW_CONTAINER).hide();
    $('#' + CUSTOMER_DIV_PREVIEW_FOOTER).hide();
    $('#' + CUSTOMER_ADD_DIV_CONTAINER).show();
    $('#' + CUSTOMER_ADD_DIV_FOOTER).show();
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

var prepareFillOutVehicle = function () {
    $('#' + CUSTOMER_DIV_CONTAINER).hide();
    $('#' + CUSTOMER_DIV_PREVIEW_CONTAINER).hide();
    $('#' + CUSTOMER_DIV_PREVIEW_FOOTER).hide();
    $('#' + VEHICLE_PANEL_ID).show();
    //alert(JSON.stringify(policyData));
}


function showProduct() {
    initProductForm();
}

var showCustomerInfo = function () {
    $('#' + POLICY_PANEL_ID).hide();
    $('#' + POLICY_PANEL_CONFIRM_ID).hide();
    $('#' + VEHICLE_PANEL_ID).hide();
    $('#' + BASE_PANEL_ID).hide();
    $('#' + CUSTOMER_PANEL_ID).show();
}

var reEdit = function () {
    $('#' + BASE_BUTTON_RE_EDIT).hide();
    $('#' + BASE_BUTTON_SHOW_PRODUCT).show();
}


var putDateToPolicy = function (json) {
    $.each(json, function (k, v) {
        policyData[k] = v;
    });
}






