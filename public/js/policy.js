var policyData = {};

var BASE_FORM_ID = 'base',
    BASE_DIV_CONTAINER = 'baseContainer',
    BASE_BUTTON_RE_EDIT = 'reEdit',
    BASE_BUTTON_SHOW_PRODUCT = 'showProduct';
var PRODUCT_DIV_CONTAINER = 'productContainer',
    PRODCTU_FORM_ID = 'product';

var CUSTOMER_DIV_CONTAINER = 'customerContainer',
    CUSTOMER_QUERY_FORM_ID = 'queryCustomerForm',
    CUSTOMER_DIV_PREVIEW_CONTAINER = 'customerPreviewContainer';

var VEHICLE_FORM_ID = 'vehicle',
    VEHICLE_DIV_CONTAINER = 'vehicleContainer';
var POLICY_REVIEW_CONTAINER = 'previewPolicyContainer',
    POLICY_FROM_ID='policy';

var ATTR_DISABLED = 'disabled';

var initBaseForm = function () {
    $('.datepicker').datepicker({"format": "yyyy-mm-dd", "autoclose": true, "language": "zh-CN"});
    $('input[name="policySoldDate"]').datepicker("setDate", new Date());
    $('#' + PRODUCT_DIV_CONTAINER).hide();
    $('#' + CUSTOMER_DIV_CONTAINER).hide();
    $('#' + BASE_BUTTON_RE_EDIT).hide();
    $('#previewPolicy').hide();
    $('#' + VEHICLE_DIV_CONTAINER).hide();
    $('#' + CUSTOMER_DIV_PREVIEW_CONTAINER).hide();
    $('#' + BASE_BUTTON_RE_EDIT).click(function () {
        $('#' + BASE_BUTTON_RE_EDIT).hide();
        $('#' + BASE_BUTTON_SHOW_PRODUCT).show();
        disableForm(BASE_FORM_ID);
        $('#' + PRODUCT_DIV_CONTAINER).hide();
        $('#' + PRODCTU_FORM_ID)[0].reset();
    });
    $('#' + BASE_FORM_ID).validate({
        submitHandler: function () {
            showProduct();
            return false;
        }
    });

    $('select').each(function () {
        $(this).find('option:last').attr('selected', true);
    });
}
var initProductForm = function () {
    $('#' + PRODUCT_DIV_CONTAINER).show();
    $('select').each(function () {
        $(this).change(function () {
            var hasValue = true;
            $('select').each(function () {
                if ($(this).val().length == 0) {
                    hasValue = false;
                }
            });
            if (hasValue) {
                $('input[name="coverAmount"]').val(Math.ceil(Math.random() * 10000));
            } else {
                $('input[name="coverAmount"]').val('');
            }
        });
    });
    $('#' + PRODCTU_FORM_ID).submit(function () {
        var baseJson = $('#' + PRODCTU_FORM_ID).serializeJson();
        policyData.product = baseJson;

        $('#' + BASE_DIV_CONTAINER).hide();
        $('#' + PRODUCT_DIV_CONTAINER).hide();
        $('#' + CUSTOMER_DIV_CONTAINER).show();
        return false;
    });
}
var customersTable=null;
var isFirstQuery=null;
var initCustomerQueryForm = function () {
    if (customersTable == null) {
        customersTable = $('#table-style').dataTable({
            "bAutoWidth": true,
            "bProcessing": false,
            "aoColumns": [
                {"data": "name","defaultContent":""},
                {"data": "companyName","defaultContent":""},
                {"data": "address","defaultContent":""},
                {"data": "contactTel","defaultContent":""},
                {"data": "_id"}
            ],
            "bServerSide": true,
            "bFilter": false,
            "bLengthChange": false,
            "iDisplayLength": 10,
            "sAjaxSource": '/policy/customer/query',
            "fnServerData": retrieveCustomersData,
            "fnRowCallback": function(nRow, aData, iDisplayIndex) {
                $('td:eq(-1)', nRow).html("<button class='btn btn-primary choose-button' onclick=\"chooseCustomer('"+aData._id+"')\" type='button'>选择</button>");
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
    if(isFirstQuery){
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

        $.post(sSource, jsonData, function (data, status) {
            $('#' + CUSTOMER_QUERY_FORM_ID).find('[name="_csrf"]').val(data._csrf);
            fnCallback(data);
        });
    }else{
        fnCallback({aaData:[],iTotalDisplayRecords:0,iTotalRecords:0});
    }
    isFirstQuery=true;
}


var initVehicleForm = function () {
    $('#' + VEHICLE_FORM_ID).validate({
        submitHandler: function () {
            var json = $('#' + VEHICLE_FORM_ID).serializeJson();
            policyData.vehicle = json;
            //alert(JSON.stringify(json));
            dust.render("_previewPolicy", policyData, function (err, out) {
                $('#' + POLICY_REVIEW_CONTAINER).html(out);
                $('#accordion').hide();
                $('#previewPolicy').show();
                $('#POLICY_REVIEW_CONTAINER').show();
                initPolicyForm();
            });
            return false;
        }
    });
}

var initPolicyForm=function(){
    $('#'+POLICY_FROM_ID).submit(function(){
        $.post('/policy/add',{policy:policyData,_csrf:$('input[name="_csrf"]').val()},function(data,status){
            alert(status);
        });

        return false;
    });
}

var customerOperateFormatter = function (id, row) {
    return  '<button type="button" onclick="chooseCustomer(\'' + id + '\');" class="btn btn-primary">选择</button>';
}

var chooseCustomer = function (id) {
    $.get('/policy/customer/' + id + '/query', '', function (data, status) {
        dust.render("_previewCustomer", data, function (err, out) {
            $('#' + CUSTOMER_DIV_CONTAINER).hide();
            $('#' + CUSTOMER_DIV_PREVIEW_CONTAINER).show();
            $('#' + CUSTOMER_DIV_PREVIEW_CONTAINER).html(out);
            policyData.customer = data.customer;
        });
    });
}

var rechooseCustomer = function () {
    $('#' + CUSTOMER_DIV_CONTAINER).show();
    $('#' + CUSTOMER_DIV_PREVIEW_CONTAINER).hide();
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
    $('#' + VEHICLE_DIV_CONTAINER).show();
    //alert(JSON.stringify(policyData));
}


function showProduct() {
    var baseJson = $('#' + BASE_FORM_ID).serializeJson();
//    alert(JSON.stringify(baseJson));
    policyData.base = baseJson;
    disableForm(BASE_FORM_ID, ATTR_DISABLED);
    $('#' + BASE_BUTTON_RE_EDIT).show();
    $('#' + BASE_BUTTON_SHOW_PRODUCT).hide();
    initProductForm();
}


function reEdit() {
    $('#' + BASE_BUTTON_RE_EDIT).hide();
    $('#' + BASE_BUTTON_SHOW_PRODUCT).show();
}


//禁用form表单中所有的input[文本框、复选框、单选框],select[下拉选],多行文本框[textarea]
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




