var saveEditClaim = function(claimNo){
	alert("保存修改");
    var json={};
    json.claimNo = claimNo
    json.base=$('#base').serializeJson();
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
    alert($('[name="_csrf"]').val());
    $.post('/claim/edit/update',{claim:json,_csrf:$('[name="_csrf"]').val()},function(data,status){
        $('#queryPolicyForm').find('[name="_csrf"]').val(data._csrf);
        if(status=="success"){
            alert("修改成功！");
            window.location.reload();
        }
    });
}