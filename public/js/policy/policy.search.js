$(function () {
    $('#previewPolicy').hide();
    $('#modifyCustomerInfo').hide();
    if (searchTable == null) {
        searchTable = $('#table-policy').dataTable({
            "bAutoWidth": true,
            "bProcessing": false,
            "aoColumns": [
                {"data": "policyNo", "defaultContent": ""},
                {"data": "receiptName", "defaultContent": ""},
                {"data": "customer.name", "defaultContent": ""},
                {"data": "customer.companyName", "defaultContent": ""},
                {"data": "vinNo", "defaultContent": ""},
                {"data": "policySoldDate", "defaultContent": "", "mRender": function (data, type, row) {
                    return new Date(data).format('yyyy-MM-dd');
                }
                },
                {"data": "status", "defaultContent": "", "mRender": function (data, type, row) {
                    return getBaseDataName(row.make, 'PS', data);
                }},
                {"data": "_id", "mRender": function (data, type, row) {
                    return '<a  data-toggle="tooltip" onclick="getPolicyDetail(\'' + data + '\');" data-placement="left" title="查看详细" href="#"><i class="icon-edit icon-large"></i></a>'
                }}
            ],
            "bServerSide": true,
            "bFilter": false,
            "bLengthChange": false,
            "iDisplayLength": 10,
            "sAjaxSource": '/policy/query',
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
        searchTable.fnDraw();
        return false;
    });
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

    jsonData._csrf=$('[name="_csrf"]').val();
    $.post(sSource, jsonData, function (data, status) {
        $('[name="_csrf"]').val(data._csrf);
        fnCallback(data);
    });
}


var backSearch = function () {
    $('#' + POLICY_REVIEW_CONTAINER).html('');
    $('#' + POLICY_PANEL_ID).hide();
    $('#' + SEARCH_PANEL_ID).show();
}

