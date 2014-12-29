var checkClaim = function(claimNo){
	$.ajax({
            url: '/claim/check/confirm/' + claimNo,
            type: 'get',
            dataType: 'json'
        })
            .done(function (data, status) {
                if(data.success == true){
                    alert('审核成功');
                }else{
                    alert('审核失败,'+data.msg);
                }
            })
            .fail(function () {
                alert("error");
            });

};

