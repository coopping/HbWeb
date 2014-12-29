function loadProvinces() {
    $.get("/address/provinces?" + new Date().getTime(), function (data, status, xhr) {
        if (status === 'success') {
            var provinces = data.provinces;
            var options = '<option  value="0">-省-</option>';
            for (var i = 0, l = provinces.length; i < l; i++) {
                for (var o in provinces[i]) {
                    if (o === 'key') {
                        options += '<option  value="' + provinces[i][o] + '">';
                    } else if (o === 'value') {
                        options += provinces[i][o] + '</option>'
                    }
                }
            }
            $('#provinceSlt').html(options);
        } else {
            var some_html = '<br><div class="alert alert-danger fade in">';
            some_html += '<label>调用后台出错：' + xhr.statusText + '</label>';
            some_html += '</div>';
            bootbox.alert(some_html);
        }
    });
}

var customerTypeChange=function () {
    var selected = $("#customerType").val();
    if (selected === '2') {
        $("#customerTitle").val('');
        $("#customerTitle").attr('disabled', '');
        $("#customerTitle").removeAttr('required');

        $("#customerName").val('');
        $("#customerName").attr('disabled', '');
        $("#customerName").removeAttr('required');

        $("#customerCompanyName").removeAttr('disabled');
        $("#customerCompanyName").attr('required', '');

        $("#identifyNo").val('');
        $("#identifyNo").attr('disabled', '');
    } else  if (selected === '1') {
        $("#customerCompanyName").val('');
        $("#customerCompanyName").attr('disabled', '');
        $("#customerCompanyName").removeAttr('required');

        $("#customerTitle").removeAttr('disabled');
        $("#customerTitle").attr('required', '');
        $("#customerName").removeAttr('disabled');
        $("#customerName").attr('required', '');

        $("#identifyNo").removeAttr('disabled');
    }else{
        $("#customerCompanyName").removeAttr('required');
        $("#customerName").removeAttr('required');
        $("#customerTitle").removeAttr('required');
    }
}

$(function () {
    loadProvinces();
    customerTypeChange();
    $("#customerType").change(function(){
        customerTypeChange();
    });
    $("#addCustomerForm").validate({
        submitHandler: function (form) {
            if ($.trim($('[name="customer[mobile]"]').val()) == '' && $.trim($('[name="customer[contactTel]"]').val()) == '') {
                alert('移动电话、联系电话至少填一个');
                return;
            }
            form.action = '/customer/new';
            var json=$(form).serializeJsonWithoutName();
            json._csrf=$('input[name="_csrf"]').val();
            if($('[name="customerId"]').val()==''){
                $.post('/customer/ajax/new',json,function(data,status){
                    $('input[name="_csrf"]').val(data._csrf);
                    chooseCustomer(data.customer._id);
                });
            }else{
                $.post('/customer/ajax/modify',json,function(data,status){
                    $('input[name="_csrf"]').val(data._csrf);
                    chooseCustomer(json.customerId);
                });
            }

        },
        focusCleanup: true
    });

    $('#provinceSlt').change(function () {
        var selected = $(this).val();
        var text = $('#provinceSlt option:selected').text();
        $.get("/address/citys?province=" + selected + '&' + new Date().getTime(), function (data, status, xhr) {
            if (status === 'success') {
                var citys = data.citys;
                var options = '<option  value="0">-市-</option>';
                for (var i = 0, l = citys.length; i < l; i++) {
                    for (var o in citys[i]) {
                        if (o === 'key') {
                            options += '<option  value="' + citys[i][o] + '">';
                        } else if (o === 'value') {
                            options += citys[i][o] + '</option>'
                        }
                    }
                }
                $('#citySlt').html(options);
                $('#countySlt').html('<option  value="0">-区县-</option>');
                $('#townSlt').html('<option  value="0">-乡镇-</option>');
                $('#addressInfoAddress').val('');
                if (selected != 0) {
                    $('[name="addressInfo[province]"]').val(text);
                }
            } else {
                var some_html = '<br><div class="alert alert-danger fade in">';
                some_html += '<label>调用后台出错：' + xhr.statusText + '</label>';
                some_html += '</div>';
                bootbox.alert(some_html);
            }
        });
    });
    $('#citySlt').change(function () {
        var selected = $(this).val();
        var text = $('#citySlt option:selected').text();
        $.get("/address/countys?city=" + selected + '&' + new Date().getTime(), function (data, status, xhr) {
            if (status === 'success') {
                var countys = data.countys;
                var options = '<option  value="0">-区县-</option>';
                for (var i = 0, l = countys.length; i < l; i++) {
                    for (var o in countys[i]) {
                        if (o === 'key') {
                            options += '<option  value="' + countys[i][o] + '">';
                        } else if (o === 'value') {
                            options += countys[i][o] + '</option>'
                        }
                    }
                }
                $('#countySlt').html(options);
                $('#townSlt').html('<option  value="0">-乡镇-</option>');
                $('#addressInfoAddress').val('');
                if (selected != 0) {
                    $('[name="addressInfo[city]"]').val(text);
                }
            } else {
                var some_html = '<br><div class="alert alert-danger fade in">';
                some_html += '<label>调用后台出错：' + xhr.statusText + '</label>';
                some_html += '</div>';
                bootbox.alert(some_html);
            }
        });
    });
    $('#countySlt').change(function () {
        var selected = $(this).val();
        var text = $('#countySlt option:selected').text();
        $.get("/address/towns?county=" + selected + '&' + new Date().getTime(), function (data, status, xhr) {
            if (status === 'success') {
                var towns = data.towns;
                var options = '<option  value="0">-乡镇-</option>';
                for (var i = 0, l = towns.length; i < l; i++) {
                    for (var o in towns[i]) {
                        if (o === 'key') {
                            options += '<option  value="' + towns[i][o] + '">';
                        } else if (o === 'value') {
                            options += towns[i][o] + '</option>'
                        }
                    }
                }
                $('#townSlt').html(options);
                $('#addressInfoAddress').val('');
                if (selected != 0) {
                    $('[name="addressInfo[county]"]').val(text);
                }
            } else {
                var some_html = '<br><div class="alert alert-danger fade in">';
                some_html += '<label>调用后台出错：' + xhr.statusText + '</label>';
                some_html += '</div>';
                bootbox.alert(some_html);
            }
        });
    });
    $('#townSlt').change(function () {
        var selected = $(this).val();
        var text = $('#townSlt option:selected').text();
        $('#addressInfoAddress').val('');
        if (selected != 0) {
            $('[name="addressInfo[town]"]').val(text);
        }
    });
});


