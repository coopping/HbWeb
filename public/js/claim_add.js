var claimCode = 1;
var claimCodeName = 1;
var tablePrefix = 'partDetailTable';

var initPolicyDetailForm = function () {
    $('#previewPolicy').show();
}

var initAddClaimForm = function () {
    claimCode = 1;
    $('#previewPolicy').hide();
    $('#claimPanelContainer').hide();
    $('#addOccurForm fieldset').show();
    $('#base').validate({
        submitHandler: function () {
            $('#claimPanelContainer').show();
            $('#baseContainer').hide();
        }
    });
    $('#claimAdd').show();
}

var initAddOccurForm = function () {
    $('#addOccurForm fieldset').show();
    $('#addOccurForm')[0].reset();
    $('#addOccurTitle').text('编辑故障零件');
    $('#addOccurForm').find('[name="claimCode"]').val(claimCode);
    $('#addOccurForm').find('[name="claimCodeName"]').val(claimCodeName);
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
};

var saveClaim=function(){
    alert("开始保存");
    var json={};
    json.base=$('#base').serializeJson();
    json.policyNo = policyData.policy.policyNo;
    var occur=[];
    $('[id^="claimContainer"]').each(function(i,item){
        alert($(this).attr('id'));
        var claimCode=$(this).attr('id').replace('claimContainer','');
        var occurData=generateOccurData(claimCode);
        var partDetails=[];
        var comments=[];
        $(this).find('.panel-body:first tbody tr').each(function(j,tr){
            var partDetailData=generatePartDetailData(claimCode,j);
            partDetails[j]=partDetailData;
        });
        $(this).find('.panel-body:last tbody tr').each(function(j,tr){
            var commentData=generateOccurComment(claimCode,j);
            comments[j]=commentData;
        });
        occur[i]={"occurData":occurData,"partDetails":partDetails,"comments":comments};
    });
    json.occur=occur;

    alert(JSON.stringify(json));
    $.post('/claim/add',{claim:json,_csrf:$('[name="_csrf"]').val()},function(data,status){
        $('#queryPolicyForm').find('[name="_csrf"]').val(data._csrf);
        if(status=="success"){
            alert("新增成功！");
            window.location.reload();
        }
    });
}