var generatePartData = function (json) {
    json.partFare = (json.partQuantity * json.partPrice).toFixed(2);
    json.partDuty = (json.partFare * (json.partRate) / 100).toFixed(2);
    json.partTotal = (json.partFare * 1 + json.partDuty * 1).toFixed(2);

    json.laborFare = (json.laborQuantity * json.laborPrice).toFixed(2);
    json.laborDuty = (json.laborFare * (json.laborRate) / 100).toFixed(2);
    json.laborTotal = (json.laborFare * 1 + json.laborDuty * 1).toFixed(2);

    json.totalFare = (json.laborFare * 1 + json.partFare * 1).toFixed(2);
    json.totalDuty = (json.laborTotal * 1 + json.partTotal * 1).toFixed(2);
    json.total = (json.partTotal * 1 + json.laborTotal * 1).toFixed(2);
    return json;
};

var editOccur = function (claimCode) {

    $('#addOccurForm fieldset').show();
    $('#addOccurForm fieldset:last').hide();
    $('#addOccurTitle').text('编辑故障零件');
    $('#addOccurForm')[0].reset();
    $('#addOccurrence').modal('show');
    var occurData=generateOccurData(claimCode);
    assignFormData('addOccurForm',occurData);

};

var deleteOccur = function (code) {
    if(confirm("确定要删除这个索赔吗？删除此索赔时，零件详细信息也会一同删除")){
        $('#claimContainer' + code).remove();
        claimCodeName--;
        var claimContainers = $("[id^='claimContainer']");
        claimContainers.each(function(){
            var $span=$(this).find('th:first span:first');
            var realClaimCode=$span.text();
            if(realClaimCode*1>code*1){
                $span.text(realClaimCode*1-1);
                $(this).find('.panel-body:last table tr td:eq(2)').text(realClaimCode*1-1);
            }
        });
    }
};

var addPartDetail = function (claimCode) {
    $('#addOccurForm fieldset').show();
    $('#addOccurForm fieldset:first').hide();
    $('#addOccurTitle').text('添加详细零件');
    $('#addOccurForm')[0].reset();
    $('#addOccurForm [name="lineIndex"]').val('');
    $('#addOccurForm [name="claimCode"]').val(claimCode);
    $('#addOccurrence').modal('show');
};

var editPartDetail = function (btn) {
    $('#addOccurForm fieldset').show();
    $('#addOccurForm fieldset:first').hide();
    $('#addOccurTitle').text('编辑详细零件');
    $('#addOccurForm')[0].reset();
    $('#addOccurrence').modal('show');
    var index=$(btn).parent().parent().index();
    $('#addOccurForm [name="lineIndex"]').val(index);
    var json=generatePartDetailData($(btn).parents('[id^="claimContainer"]').attr('id').replace('claimContainer',''),index);
    assignFormData('addOccurForm',json);
};

var deletePartDetail = function (btn) {
    if(confirm("确定删除这个零件吗？")){
        var claimCode=$(btn).parents('[id^="claimContainer"]').attr('id').replace('claimContainer','');
        $(btn).parent().parent().remove();
        var claimTotal=generateClaimTotalData(claimCode);
        dust.render("_totalFoot",claimTotal,function(err,out){
            $('#claimContainer' + claimCode).find('.panel-body:first div:first').html(out);
        });
    }
};

var addComment=function(claimCode){
    $('#addCommentForm').find('[name="claimCode"]').val(claimCode);
    var claimCodeName=$('#claimContainer' + claimCode).find('.panel-heading  tr:first').find('th:first span').text();
    $('#addCommentForm').find('[name="claimCodeName"]').val(claimCodeName);
    $('#addCommentForm').validate({
        submitHandler:function(){
           var json=$('#addCommentForm').serializeJson();
            json.commentUser=$('#logedUserName').val();
            json.commentTime=(new Date()).format('yyyy-MM-dd hh:mm:ss');
            alert(JSON.stringify(json));

            dust.render('_occurCommentBodyTr',json,function(err,out){
                alert(out);
                $('#claimContainer' + json.claimCode).find('.panel-body:last table tbody').append(out);
            });
            $('#addComment').modal('hide');
        }
    });
    $('#addComment').modal('show');
};

var editComment=function(btn){
    alert('此功能未完成');
};

var deleteComment=function(btn){
    alert('此功能未完成');
};

var generateOccurData = function (claimCode) {
    var json={};
    var $tr=$('#claimContainer' + claimCode).find('.panel-heading table thead tr:first');
    json.occurSystem=$tr.attr('occurSystem');
    json.occurModel=$tr.attr('occurModel');
    json.claimCodeName=$tr.find('th:first span').text();
    json.claimCode=claimCode;
    json.occurCode=$tr.find('th:eq(1) span').text();
    return json;
};

var generatePartDetailData = function (claimCode,index) {
    var json={};
    var $tr= $('#claimContainer' + claimCode).find('.panel-body table:first tbody tr').eq(index);
    json.partCode=$tr.find('td').eq(0).text();
    json.partRemark=$tr.find('td').eq(1).text();
    json.partQuantity=$tr.find('td').eq(2).text();
    json.partPrice=$tr.find('td').eq(3).text();
    json.laborQuantity=$tr.find('td').eq(7).text();
    json.laborPrice=$tr.find('td').eq(8).text();
    json.partRate=$tr.find('td').eq(5).text();
    json.laborRate=$tr.find('td').eq(10).text();
    json.claimCode=claimCode;
    return json;
};

var generateOccurComment = function (claimCode,index) {
    var json={};
    var $tr= $('#claimContainer' + claimCode).find('.panel-body:last tbody tr').eq(index);
    json.commentTime=$tr.find('td').eq(0).text();
    json.commentUser=$tr.find('td').eq(1).text();
    json.claimCodeName=$tr.find('td').eq(2).text();
    json.noteTypeName=$tr.find('td').eq(3).text();
    json.noteText=$tr.find('td').eq(4).text();
    json.noteType=$tr.attr('noteType');
    return json;
};

var generateClaimTotalData = function (claimCode) {
    var json={};
    json.claimTotalFare=0;
    json.claimTotalDuty=0;
    json.claimTotal=0;
    json.claimOverrun='0.00';
    var trs= $('#claimContainer' + claimCode).find('.panel-body table:first tbody tr');
    trs.each(function(){
        json.claimTotalFare+=$(this).find('td:eq(12)').text()*1;
        json.claimTotalDuty+=$(this).find('td:eq(13)').text()*1;
        json.claimTotal+=$(this).find('td:eq(14)').text()*1;
    });
    return json;
};

var assignFormData=function(formId,json){
    for(var item in json){
        $('#'+formId).find('[name="'+item+'"]').val(json[item]);
    }
};

var initPopupForm = function(){
    $('#addOccurForm').validate({
        submitHandler: function () {
            var json = $('#addOccurForm').serializeJson();
            var partData = generatePartData(json);
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
        }
    });

    var options = {
                serviceUrl: '/baseData/service/brand/YQAD/parts',
                minChars: 3,
                delimiter: ',',
                maxHeight: 400,
                width: 600,
                zIndex: 9999,
                deferRequestBy: 300, 
                onSelect: function(suggestion) {
                    
                    alert(JSON.stringify(suggestion));
                    $('#partRemark').attr("value",suggestion.data.value);
                    $('#partPrice').attr("value",suggestion.data.price);
                    $('#partCode').attr("value",suggestion.data.key);
                }
            };
    $('#partCode').autocomplete(options);
}

