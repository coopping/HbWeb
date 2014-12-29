(function(){dust.register("baseInfo",body_0);function body_0(chk,ctx){return chk.write("<div class=\"panel-group\" id=\"baseInfoContent\"><div class=\"panel panel-default\"><div class=\"panel-heading\"><div class=\"btn-group\"><a class=\"btn btn-info\" data-toggle=\"collapse\" id=\"baseInfoBtn\" data-parent=\"#baseInfoContent\" href=\"#baseInfo\">基本信息维护</a><!-- <a class=\"btn btn-default\" id=\"showAllGearboxBtn\" href=\"#\" data-toggle=\"modal\" data-target=\"#addBaseInfoModel\">添加基本信息类型</a> --><a class=\"btn btn-default\" id=\"addBaseInfo\" href=\"#\" data-toggle=\"modal\" data-target=\"#addBaseInfoModel\">添加基本信息类型</a></div></div> <div id=\"baseInfo\" class=\"panel-collapse collapse\"><div class=\"panel-body\"><form class=\"form-inline\" role=\"form\" id=\"queryForm\" method=\"post\"><input type=\"hidden\" name=\"_csrf\" value=\"").reference(ctx.get("_csrf"),ctx,"h").write("\" /><div class=\"form-group\"><label class=\"sr-only\" for=\"qname\">品牌</label><div id=\"baseInfoDiv\"></div></div><div class=\"btn-group\"><a class=\"btn btn-default\" type=\"button\" id=\"editBaseInfoBtn\" class=\"btn btn-default\">维护基本信息</a><a class=\"btn btn-default\" type=\"button\" id=\"deleteBaseInfoBtn\" class=\"btn btn-default\">删除基本信息</a><a class=\"btn btn-default\" type=\"button\" id=\"clearBaseInfoBtn\" class=\"btn btn-default\">刷新缓存</a></div></form><div class=\"panel panel-default\"><div class=\"panel-heading\" ><div class=\"btn-group\"><a class=\"btn btn-info\" id=\"baseInfoTitle\" data-toggle=\"collapse\" data-parent=\"#baseInfo\" href=\"#valueInfos\">详细数据</a><a class=\"btn btn-default\" id=\"addValues\" href=\"#\" >添加数据</a></div></div><div id=\"valueInfos\" class=\"panel-collapse collapse in\"><div class=\"panel-body\" id=\"baseInfoListDiv\"></div></div></div></div></div></div></div><div class=\"modal fade\" id=\"addBaseInfoModel\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button><h4 class=\"modal-title\" id=\"myModalLabel\">新增基本数据信息</h4></div><div class=\"modal-body\"><form  method=\"post\" id=\"baseInfoForm\"  role=\"form\"><input type=\"hidden\" id=\"baseInfoCSRF\" name=\"_csrf\" value=\"").reference(ctx.get("_csrf"),ctx,"h").write("\" /><div class=\"form-group\"><label for=\"baseInfoCode\" class=\"control-label\">代码<span class=\"required-indicator\">*</span></label><input type=\"text\" name=\"baseInfo[code]\" class=\"form-control\" id=\"baseInfoCode\" value=\"").reference(ctx.getPath(false,["baseInfo","value"]),ctx,"h").write("\" required></div><div class=\"form-group\"><label for=\"baseInfoName\" class=\"control-label\">名称<span class=\"required-indicator\">*</span></label><input type=\"text\" name=\"baseInfo[name]\" class=\"form-control\" id=\"baseInfoName\" value=\"").reference(ctx.getPath(false,["baseInfo","name"]),ctx,"h").write("\" required></div></form></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">关闭</button><button type=\"button\" id=\"submitBaseInfoBtn\" class=\"btn btn-primary\">提交</button></div></div></div></div><div class=\"modal fade\" id=\"addBaseInfoValuesModel\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button><h4 class=\"modal-title\" id=\"myModalLabel\">新增基本数据信息</h4></div><div class=\"modal-body\" id=\"baseInfoValuesFormDiv\"></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">关闭</button><button type=\"button\" id=\"submitBaseInfoValuesBtn\" class=\"btn btn-primary\">提交</button></div></div></div></div><script type=\"text/javascript\" src=\"/js/duster/baseData/baseInfoList.js\"></script><script type=\"text/javascript\" src=\"/js/duster/baseData/baseInfoForm.js\"></script><script type=\"text/javascript\">function renderBaseInfos(datas) {var select = $('<select id=\"baseInfos\" class=\"selectpicker\"  title=\"该品牌下的基本信息\"><option></option></select>');for (var i = 0, l = datas.length; i < l; i ++) {select.append('<option value=\"' + datas[i].code + '\">' + datas[i].code + ' ' + datas[i].name + '</option>')}$(\"#baseInfoDiv\").html(select);$(\"div#baseInfoDiv .selectpicker\").selectpicker({style: 'btn-success'});}function renderBaseInfoValues(datas) {dust.render('baseInfoList', datas, function(err, out) {$(\"#baseInfoListDiv\").html(out);});    }$(function() {$(\"#baseInfoForm\").validate({submitHandler: function(form) {var brand = $(\"#selectedBrand\").val();$.post('/baseData/baseInfo/brand/' + brand + '/newInfo?' + new Date().getTime(), $(form).serialize(), function(data, status) {if (status === 'success') {if (data.err) {var some_html = '<br><div class=\"alert alert-warning fade in\">';some_html += '<label>错误</label>' + data.err;some_html += '</div>';var box = bootbox.alert(some_html);} else {var some_html = '<br><div class=\"alert alert-success fade in\">';some_html += '<label>成功添加</label>';some_html += '</div>'; var box = bootbox.alert(some_html);$(\"#currentCSRF\").val(data['_csrf']);box.on('hidden.bs.modal', function(e) {var baseInfos = data.baseInfos;renderBaseInfos(baseInfos);$(\"#baseInfo\").collapse('show');});}} else {var some_html = '<br><div class=\"alert alert-danger fade in\">';some_html += '<label>调用后台出错：' + xhr.statusText + '</label>';some_html += '</div>';bootbox.alert(some_html);}});},focusCleanup: true});$(\"#submitBaseInfoBtn\").click(function(event) {$(\"#baseInfoCSRF\").val($(\"#currentCSRF\").val());$(\"#baseInfoForm\").submit();});$(\"#submitBaseInfoValuesBtn\").click(function(event) {$(\"#baseInfoValuesCSRF\").val($(\"#currentCSRF\").val());$(\"#baseInfoValuesForm\").submit();});$(\"#baseInfoBtn\").click(function(event) {$(\"#gearbox\").collapse('hide');$(\"#displacement\").collapse('hide');});$(\"#editBaseInfoBtn\").click(function(event) {var code = $(\"#baseInfos\").val();var text = $('#baseInfos option:selected').html();if (code) {$(\"#baseInfoTitle\").text(text + '详细数据');var brand = $(\"#selectedBrand\").val(); $.get(\"/baseData/baseInfo/brand/\" + brand + \"/code/\" + code +\"/values?\" + new Date().getTime(), function(data, status) {if (status === 'success') {renderBaseInfoValues(data);} else {var some_html = '<br><div class=\"alert alert-danger fade in\">';some_html += '<label>调用后台出错：' + xhr.statusText + '</label>';some_html += '</div>';bootbox.alert(some_html);}});           }});$(\"#deleteBaseInfoBtn\").click(function(event) {var brand = $(\"#selectedBrand\").val();var code = $(\"#baseInfos\").val();bootbox.confirm(\"确定删除？\", function(result) {if (result) {$.get('/baseData/baseInfo/brand/' + brand + '/code/' +  code + '/remove?' + new Date().getTime(), function(data, status) {if (status === 'success') {var some_html = '<br><div class=\"alert alert-success fade in\">';some_html += '<label>成功删除</label>';some_html += '</div>';var box = bootbox.alert(some_html);box.on('hidden.bs.modal', function(e) {var baseInfos = data.baseInfos;renderBaseInfos(baseInfos);$(\"#baseInfoListDiv\").html('');});} else {var some_html = '<br><div class=\"alert alert-danger fade in\">';some_html += '<label>调用后台出错：' + xhr.statusText + '</label>';some_html += '</div>';bootbox.alert(some_html);}});}});});$(\"#clearBaseInfoBtn\").click(function(event) {var brand = $(\"#selectedBrand\").val();$.get('/baseData/service/baseInfo/brand/' + brand + '/clearCache?' + new Date().getTime(), function(data, status) {if (status === 'success') {var some_html = '<br><div class=\"alert alert-success fade in\">';some_html += '<label>成功刷新</label>';some_html += '</div>';var box = bootbox.alert(some_html);} });});$(\"#addValues\").click(function(event) {var formData = {};formData._csrf = $(\"#currentCSRF\").val();formData.style = 'new';dust.render('baseInfoForm', formData, function(err, out) {$(\"#baseInfoValuesFormDiv\").html(out);$(\"#addBaseInfoValuesModel\").modal('show');});         });$(\"[data-toggle='tooltip']\").tooltip();});    </script> ");}return body_0;})();