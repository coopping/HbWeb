jQuery.validator.addMethod("password", function(value, element) {
	return /^[A-Za-z]+[0-9]+[A-Za-z0-9]*|[0-9]+[A-Za-z]+[A-Za-z0-9]*$/g.test(value);
}, "密码必须由6-16个英文字母和数字的字符串组成");

jQuery.validator.addMethod("telNO", function(value, element) {
    return /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/g.test(value);
}, "电话号码格式不正确");

jQuery.validator.addMethod("mobile", function(value, element) {
    return /^0?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(value);
}, "移动电话号码格式不正确");

jQuery.validator.addMethod("zipCode", function(value, element) {
    return /[1-9]{1}(\d+){5}/.test(value);
}, "邮政编码格式不正确");