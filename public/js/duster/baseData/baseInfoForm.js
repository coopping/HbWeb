(function(){dust.register("baseInfoForm",body_0);function body_0(chk,ctx){return chk.write("<form  method=\"post\" id=\"baseInfoValuesForm\"  role=\"form\"><input type=\"hidden\" id=\"baseInfoValuesCSRF\" name=\"_csrf\" value=\"").reference(ctx.get("_csrf"),ctx,"h").write("\" /><div class=\"form-group\"><label for=\"valueKey\" class=\"control-label\">key<span class=\"required-indicator\">*</span></label><input type=\"text\" name=\"value[key]\" class=\"form-control\" id=\"valueKey\" value=\"").reference(ctx.getPath(false,["value","key"]),ctx,"h").write("\" required></div><div class=\"form-group\"><label for=\"valueValue\" class=\"control-label\">value<span class=\"required-indicator\">*</span></label><input type=\"text\" name=\"value[value]\" class=\"form-control\" id=\"valueValue\" value=\"").reference(ctx.getPath(false,["value","value"]),ctx,"h").write("\" required></div><div class=\"form-group\"><label class=\"checkbox-inline\"><input type=\"checkbox\" class=\"control-label\" id=\"dateFlag\" value=\"check\">起止有效日期</label><input class=\"form-control date-default\" name=\"value[startDate]\" size=\"16\" id=\"startDate\"  type=\"text\" value='").helper("formatDate",ctx,{},{"date":body_1,"format":"YYYY-MM-DD","required":"true"}).write("' readonly disabled><label for=\"baseInfoName\" class=\"control-label\">至</label><input class=\"form-control date-default\" name=\"value[endDate]\" size=\"16\" id=\"endDate\"  type=\"text\" value='").helper("formatDate",ctx,{},{"date":body_2,"format":"YYYY-MM-DD","required":"true"}).write("' readonly disabled></div></form><script type=\"text/javascript\">$(function() {var dataOptions = {format : \"yyyy-mm-dd\",autoclose : true,language : 'zh-CN',todayHighlight : true};$('.date-default').datepicker(dataOptions);   $(\"#dateFlag\").click(function(event) {if (this.checked) {$(\"#startDate\").removeAttr('disabled');$(\"#endDate\").removeAttr('disabled');} else {$(\"#startDate\").attr('disabled', '');$(\"#endDate\").attr('disabled', '');}}); $(\"#baseInfoValuesForm\").validate({submitHandler: function(form) {var brand = $(\"#selectedBrand\").val();var code = $(\"#baseInfos\").val();var text = $('#baseInfos option:selected').html();$.post('/baseData/baseInfo/brand/' + brand + '/code/' +  code + '/values/new?' + new Date().getTime(), $(form).serialize(), function(data, status) {if (status === 'success') {if (data.err) {var some_html = '<br><div class=\"alert alert-warning fade in\">';some_html += '<label>错误</label>' + data.err;some_html += '</div>';var box = bootbox.alert(some_html);} else {var some_html = '<br><div class=\"alert alert-success fade in\">';some_html += '<label>成功添加</label>';some_html += '</div>'; var box = bootbox.alert(some_html);$(\"#currentCSRF\").val(data['_csrf']);box.on('hidden.bs.modal', function(e) {renderBaseInfoValues(data);});}} else {var some_html = '<br><div class=\"alert alert-danger fade in\">';some_html += '<label>调用后台出错：' + xhr.statusText + '</label>';some_html += '</div>';bootbox.alert(some_html);}});},focusCleanup: true});$(\"[data-toggle='tooltip']\").tooltip();});</script>");}function body_1(chk,ctx){return chk.reference(ctx.getPath(false,["value","startDate"]),ctx,"h");}function body_2(chk,ctx){return chk.reference(ctx.getPath(false,["value","endDate"]),ctx,"h");}return body_0;})();