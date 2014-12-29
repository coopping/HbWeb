var oTable = null;
var claimCode = 1;
var claimCodeName = 1;
var modeFlag;

var initClaimForm = function (flag) {
    // $('#previewPolicy').hide();
    // $('#accordion').hide();
    modeFlag = flag;
    $('.datepicker').datepicker({"format": "yyyy-mm-dd", "autoclose": true, "language": "zh-CN"});
    $('input[name="claimSubmitDate"]').datepicker("setDate", new Date());
    if (oTable == null) {
        oTable = $('#table-style').dataTable({
            "bAutoWidth": true,
            "bProcessing": true,
            "aoColumns": [
                {"data": "display.policyNo"},
                {"data": "display.status","defaultContent":""},
                {"data": "display.claimNo"},
                {"data": "display.occuredDate","defaultContent":""},
                {"data": "display.claimMileage","defaultContent":""},
                {"data": "display.occurCode","defaultContent":""},
                {"data": "display.total","defaultContent":""},
                {"data": "","defaultContent":""}
                // {"data": "occur[0].occurData.occurCode","defaultContent":""},
            ],
            "bServerSide": true,
            "bFilter": false,
            "bLengthChange": false,
            "iDisplayLength": 10,
            "sAjaxSource": '/claim/query',
            "fnServerData": retrieveData,
            "fnRowCallback": function (nRow, aData, iDisplayIndex) {
                // $('td:eq(-1)', nRow).html('<a class="btn btn-default" onclick="chooseCustomer(\'' + aData._id + '\')" data-toggle="tooltip" data-placement="left" title="选择" href="#"><i class="glyphicon glyphicon-ok-circle"></i></a>');
                $('td:eq(-1)', nRow).html('<a  data-toggle="tooltip" data-placement="left" title="查看详细" href="#"><i class="icon-edit icon-large"></i></a>');
            },
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

    $('#queryClaimForm').submit(function () {
        oTable.fnDraw();
        return false;
    });
};

var initPolicyDetailForm = function () {
    $('#previewPolicy').show();
}

var initAddClaimForm = function () {
    $('#previewPolicy').hide();
    $('#accordion').show();
    $('#claimPanelContainer').hide();
    $('#addOccurForm fieldset').show();
    $('#base').validate({
        submitHandler: function () {
            $('#claimPanelContainer').show();
            $('#baseContainer').hide();
        }
    });
}

var initAddOccurForm = function () {
    $('#addOccurForm fieldset').show();
    $('#addOccurForm')[0].reset();
    $('#addOccurTitle').text('编辑故障零件');
    $('#addOccurForm').find('[name="claimCode"]').val(claimCode);
    $('#addOccurForm').find('[name="claimCodeName"]').val(claimCodeName);
    $('#addOccurForm').validate({
        submitHandler: function () {
            alert(1111111111111111111);
            var json = $('#addOccurForm').serializeJson();
            var partData = getneratePartData(json);
            if(!$('#addOccurForm fieldset:last').is(":visible")){
                partData.claimCodeName=$('#addOccurForm [name="claimCodeName"]').val();
            }
//            alert(JSON.stringify(partData));

            if ($('#claimContainer' + partData.claimCode).length == 0) {
                dust.render("_occurDetail", partData, function (err, out) {
                    $('#collapseClaimDetails').append(out);
                    claimCode++;
                    claimCodeName++;
                });
            }
            dust.render("_occurDetailHead", partData, function (err, out) {
                if (!err&&$('#addOccurForm fieldset:first').is(":visible")) {
                    $('#claimContainer' + partData.claimCode).find('.panel-heading').html(out);
                }
            });
            dust.render("_occurDetailBodyTr", partData, function (err, out) {
                if (!err&&$('#addOccurForm fieldset:last').is(":visible")) {
                    if($('#addOccurForm fieldset:first').is(":visible")) {
                        $('#claimContainer' + partData.claimCode).find('.panel-body table:first tbody').append(out);
                    }else{
                        var index=$('#addOccurForm [name="lineIndex"]').val();
                        if(index==''){
                            $('#claimContainer' + partData.claimCode).find('.panel-body table:first tbody').append(out);
                        }else{
                            $('#claimContainer' + partData.claimCode).find('.panel-body table:first tbody tr').eq(index).replaceWith(out);
                        }
                    }
                }
            });
            var claimTotal=generateClaimTotalData(partData.claimCode);
            dust.render("_totalFoot",claimTotal,function(err,out){
                $('#claimContainer' + partData.claimCode).find('.panel-body div:first').html(out);
            });
            $('#addOccurrence').modal('hide');
            initMoveSelect();
        }
    });
}

function retrieveData(sSource, aoData, fnCallback) {
    var json = $('#queryClaimForm').serializeJson();
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
        $('#queryClaimForm').find('[name="_csrf"]').val(data._csrf);
        data = generateQueryListData(data);
        fnCallback(data);
        initButtonEvent();
    });
}

var generateQueryListData = function(claimDataList){
    var aaDataList = claimDataList.aaData;
    for(var key in aaDataList){
        var aaData = aaDataList[key];
        aaData.display = {};
        aaData.display.policyNo = aaData.policyNo;
        aaData.display.status = aaData.status;
        aaData.display.claimNo = aaData.claimNo;
        aaData.display.occuredDate = aaData.base.occuredDate;
        aaData.display.claimMileage = aaData.base.claimMileage;
        aaData.display.occurCode = '';
        aaData.display.total = 0;
        for(var okey in aaData.occur){
            var occur = aaData.occur[okey];
            aaData.display.occurCode += occur.occurData.occurCode + '>';
            for(var pkey in occur.partDetails){
                var partData = occur.partDetails[pkey];
                var partData = generatePartData(partData);
                aaData.display.total+=partData.total*1;
            }
        }
    }
    return claimDataList;

}

var initButtonEvent =function (){
    $('#table-style').on('click', '.icon-edit', function () {
        var claimNo = $(this).parents('tr').children('td').eq(2).text();
        $.ajax({
            url: '/claim/query/' + claimNo,
            type: 'get',
            dataType: 'json'
        })
            .done(function (data, status) {
                initPreviewClaim(data);
            })
            .fail(function () {
                alert("error");
            });
    });
}

//init a page display the claim preview
var initPreviewClaim = function (data){
    var claimJson = data.claimData;
    //claim info preview main frame
    $('#queryClaimForm').hide();
    var condition = {claimNo: claimJson.claimNo};
    dust.render("_previewClaim", condition, function (err, out) {
        if (!err&&$('#previewClaimContainer').is(":visible")) {
            $('#previewClaimContainer').html(out);
        }
    });

    //render base info
    dust.render("_previewClaimBase", claimJson.base, function (err, out) {
        if (!err&&$('#baseContainer').is(":visible")) {
            $('#baseContainer').html(out);
        }
    });

    //render claim list
    var occurList = claimJson.occur;
    if(occurList == undefined)occurList=[];
    for(var i=0; i<occurList.length; i++){
        var occur = occurList[i];
        dust.render("_occurDetail", {claimCode: occur.occurData.claimCode}, function (err, out) {
            if(!err){
                $('#collapseClaimDetails').append(out);    
            }
        });

        dust.render("_occurDetailHead", occur.occurData, function (err, out) {
            if (!err) {
                $('#claimContainer' + occur.occurData.claimCode).find('.panel-heading').html(out);
            }
        });


        var totalJson={};
        totalJson.claimTotalFare=0;
        totalJson.claimTotalDuty=0;
        totalJson.claimTotal=0;
        totalJson.claimOverrun='0.00';
        //render parts list
        var partList = occur.partDetails;
        if(partList == undefined)partList=[];
        for(var j=0; j<partList.length; j++){
            var partData = partList[j];
            var partData = generatePartData(partData);
            dust.render("_occurDetailBodyTr", partData, function (err, out) {
                if (!err){
                    $('#claimContainer' + partData.claimCode).find('.panel-body table:first tbody').append(out);
                }
            });

            totalJson.claimTotalFare+=partData.totalFare*1;
            totalJson.claimTotalDuty+=partData.totalDuty*1;
            totalJson.claimTotal+=partData.total*1;
        }

        //render claim total 
        
        dust.render("_totalFoot", totalJson, function(err, out){
            if(!err){
                $('#claimContainer' + occur.occurData.claimCode).find('.panel-body div:first').html(out);
            }
        });

        //render comments list
        var commentList = occur.comments;
        if(commentList == undefined)commentList=[];
        for(var j=0; j<commentList.length; j++){
            var comment = commentList[j];
            dust.render("_occurCommentBodyTr", comment, function(err, out){
                if(!err){
                    $('#claimContainer' + occur.occurData.claimCode).find('.panel-body:last table tbody').append(out);
                }
            });
        }
    }

    //init button according to modeFlag;
    $('#checkButton').hide();
    $('#disApproveButton').hide();
    $('#editClaimButton').hide();
    $('#saveEditClaimButton').hide();
    $("button[name$='CtrlButton']").hide();
    if(modeFlag == 'check'){
        $('#checkButton').show();
        $('#disApproveButton').show();
    }else if(modeFlag == 'edit'){
        $('#editClaimButton').show();
        $('#saveEditClaimButton').show();
        $("button[name$='CtrlButton']").show();
    }else if(modeFlag == 'preview'){
        
    }

}

var cancelPreview = function(){
    $('#previewClaimContainer').html(null);
    $('#queryClaimForm').show();
}