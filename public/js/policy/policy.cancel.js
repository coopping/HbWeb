var showCancelPolicy=function(){
    $('[name="surrenderType"]').change(function(){
        if($(this).val()=="2"){
            $('[name="surrenderAmount"]').removeAttr('disabled');
            $('[name="surrenderAmount"]').show();
            $('#surrenderAmountLabel').show();
        }else{
            $('[name="surrenderAmount"]').attr('disabled','disabeld');
            $('[name="surrenderAmount"]').val('');
            $('[name="surrenderAmount"]').hide();
            $('#surrenderAmountLabel').hide();

        }
    });
    $('#'+POLICY_PANEL_ID).hide();
    initBankInfo();
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

    $('#'+CANCEL_FORM_ID).validate({
        submitHandler:function(){
            var json=$('#'+CANCEL_FORM_ID).serializeJson();
            putDateToPolicy(json);
            policyChangeData.changeDatas=generateCancelChangeDatas();
            policyChangeData.policyId = policyData.policy._id;
            policyChangeData.policyNo = policyData.policy.policyNo;
            policyChangeData.sellingDealerOrg = policyData.policy.sellingDealerOrg;
            policyChangeData.customer = policyData.policy.customer._id;
            putDateToPolicy(json);
            policyChangeData._csrf=$('[name="_csrf"]').val();
            $.post('/policy/' + policyChangeData.policyId + '/cancel', policyChangeData, function (data, status) {
                if (data.data && data.data.reponseHeadDTO.status == "1") {
                    alert('提交取消保单成功！');
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

    $('#'+CANCEL_PANEL_ID).show();
}

var backSearch=function() {
    $('#'+POLICY_REVIEW_CONTAINER).html('');
    $('#'+POLICY_PANEL_ID).hide();
    $('#'+CANCEL_PANEL_ID).hide();
    $('#'+SEARCH_PANEL_ID).show();
}

$(function(){
    initCancelPolicyForm();
});

var initCancelPolicyForm=function(){
    $('#'+CANCEL_FORM_ID+' .baseInfo').each(function(){
        $(this).baseInfoFlash();
    });
}

var putDateToPolicy = function (json) {
    $.each(json, function (k, v) {
        policyChangeData[k] = v;
    });
}



