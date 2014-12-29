var backSearch = function () {
    $('#' + POLICY_REVIEW_CONTAINER).html('');
    $('#' + POLICY_PANEL_ID).hide();
    $('#' + CHANGE_CUSTOMER_PANEL_ID).hide();
    $('#' + SEARCH_PANEL_ID).show();
}

var beginModifyCustomerInfo = function () {
    initCustomerQueryForm();
    $('#' + POLICY_PANEL_ID).hide();
    $('#' + SEARCH_PANEL_ID).hide();
    $('#' + CHANGE_CUSTOMER_PANEL_ID).show();
}

var editCustomer = function () {
    $('#' + CUSTOMER_DIV_CONTAINER).hide();
    $('#' + CUSTOMER_DIV_PREVIEW_CONTAINER).hide();
    $('#' + CUSTOMER_DIV_PREVIEW_FOOTER).hide();
    $('#' + CUSTOMER_CHANGE_FORM_ID)[0].reset();
    $('#' + CUSTOMER_CHANGE_FORM_ID).find('[name]').each(function () {
        var name = $(this).attr('name')
        if(name.length>10){
            if (policyChangeData.customer[name.substr(9, name.length - 10)]) {
                $(this).val(policyChangeData.customer[name.substr(9, name.length - 10)]);
            }
        }

    });
    $('#addressInfoAddress').val(policyChangeData.customer['address']);
    $('[name="customerId"]').val(policyChangeData.customer['_id']);
    $('#customerType').change();
    $('#' + CUSTOMER_ADD_DIV_CONTAINER).show();
    $('#' + CUSTOMER_ADD_DIV_FOOTER).show();
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

var chooseCustomer = function (id) {
    $.get('/policy/customer/' + id + '/query', '', function (data, status) {
        policyChangeData.customer=data.customer;
        policyChangeData.customer.customerTypeName = data.customerTypeName;
        policyChangeData.customer.customerTitleName = data.customerTitleName;
        dust.render("_previewChangeCustomer", data, function (err, out) {
            $('#customerAddContainer').hide();
            $('#' + CUSTOMER_ADD_DIV_FOOTER).hide();
            $('#customerContainer').hide();
            $('#customerPreviewContainer').html(out);
            $('#customerPreviewContainer').show();
            $('#customerPreviewFooter').show();
            $('#previewChangeCustomerForm').validate({
                submitHandler: function () {
                    var policyId = policyData.policy._id;
                    var customerId = policyChangeData.customer._id;
                    policyChangeData.changeDatas=generateChangeCustomerChangeDatas(policyData.policy.customer._id,customerId);
                    policyChangeData.customer=policyData.policy.customer._id;
                    if( customerId==policyData.policy.customer._id){
                        alert('用户没有变更');
                        return false;
                    }
                    policyChangeData._csrf=$('[name="_csrf"]').val();
                    $.post('/policy/' + policyId + '/changeCustomer/' + customerId, policyChangeData, function (data, status) {
                        $('[name="_csrf"]').val(data._csrf);
                        alert('过户成功！');
                        window.location.reload();
                    });
                }
            });
        });
    });

    return false;
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

var showSearchCustomer = function () {
    $('#' + CUSTOMER_ADD_DIV_CONTAINER).hide();
    $('#' + CUSTOMER_ADD_DIV_FOOTER).hide();
    $('#' + CUSTOMER_DIV_PREVIEW_CONTAINER).hide();
    $('#' + CUSTOMER_DIV_PREVIEW_FOOTER).hide();
    $('#' + CUSTOMER_DIV_CONTAINER).show();
}

var addNewCustomer = function () {
    $('#' + CUSTOMER_CHANGE_FORM_ID)[0].reset();
    $('#showSearchCustomer').show();
}

var rechooseCustomer = function () {
    $('#' + CUSTOMER_CHANGE_FORM_ID)[0].reset();
    $('#' + CUSTOMER_DIV_PREVIEW_CONTAINER).hide();
    $('#' + CUSTOMER_DIV_PREVIEW_FOOTER).hide();
    $('#' + CUSTOMER_DIV_CONTAINER).hide();
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







