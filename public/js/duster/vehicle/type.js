(function(){dust.register("type",body_0);function body_0(chk,ctx){return chk.write("<div class=\"panel-group\" id=\"vehicleTypeContent\"><div class=\"panel panel-default\"><div class=\"panel-heading\"><div class=\"btn-group\"><a data-toggle=\"collapse\" class=\"btn btn-default\" data-toggle=\"collapse\" data-parent=\"#vehicleTypeContent\" href=\"#vehicleTypeCondition\">查询条件</a><a class=\"btn btn-default\" id=\"addVehicleTypeBtn\" href=\"#\" data-toggle=\"modal\" data-target=\"#addVehicleTypeModel\">新增").reference(ctx.get("category"),ctx,"h").write("下车型</a><a class=\"btn btn-default\" id=\"clearVehicleTypeBtn\" >清空车型缓存</a></div></div><div id=\"vehicleTypeCondition\" class=\"panel-collapse collapse\"><div class=\"panel-body\"><form class=\"form-inline\" role=\"form\" id=\"queryVehicleTypeForm\" method=\"post\"><input type=\"hidden\" id=\"queryVehicleTypeCSRF\" name=\"_csrf\"/><div class=\"form-group\"><label class=\"sr-only\" for=\"qname\">中文名称</label><input type=\"text\" class=\"form-control\" value=\"").reference(ctx.getPath(false,["condition","name"]),ctx,"h").write("\" name=\"condition[name]\" id=\"qname\" placeholder=\"中文名称\"></div><div class=\"form-group\"><label class=\"sr-only\" for=\"qcompany\">变速箱</label><select id=\"conditionGearbox\" name=\"condition[gearbox]\" value=\"").reference(ctx.getPath(false,["condition","gearbox"]),ctx,"h").write("\" class=\"form-control\"  title=\"请选择变速箱\"></select></div><div class=\"form-group\"> <label class=\"sr-only\" for=\"qcontactTel\">排量</label><select id=\"conditionDisplacement\" name=\"condition[displacement]\" value=\"").reference(ctx.getPath(false,["condition","displacement"]),ctx,"h").write("\" class=\"form-control\"  title=\"排量信息\"></select></div><button type=\"button\" id=\"submitQueryVehicleTypeBtn\" class=\"btn btn-default\">查询</button></form></div></div></div><div class=\"panel panel-primary\"><div class=\"panel-heading\">车型列表</div><div class=\"panel-body\" id=\"vehicleTypeListDiv\"></div></div></div><div class=\"modal fade\" id=\"addVehicleTypeModel\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\"><div class=\"modal-dialog modal-large\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button><h4 class=\"modal-title\" id=\"myModalLabel\">录入").reference(ctx.get("category"),ctx,"h").write("下车型</h4></div><div class=\"modal-body\" id=\"vehicleTypeFormDiv\"></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">关闭</button><button type=\"button\" id=\"submitVehicleTypeBtn\" class=\"btn btn-primary\">提交</button></div></div></div></div><script type=\"text/javascript\">$(function() {$(\"#clearVehicleTypeBtn\").click(function(event) {var brand = $(\"#selectedBrand\").val();var category = $(\"#selectedCategory\").val();$.get(\"/baseData/service/brand/\" + brand + \"/category/\" + category + \"/vehicleTypeClearCache?\" + new Date().getTime(), function(data, status) {if (status === 'success') {var some_html = '<br><div class=\"alert alert-success fade in\">';some_html += '<label>缓存已清空</label>';some_html += '</div>';var box = bootbox.alert(some_html);                    } else {var some_html = '<br><div class=\"alert alert-danger fade in\">';some_html += '<label>调用后台出错：' + xhr.statusText + '</label>';some_html += '</div>';bootbox.alert(some_html);}});});});    </script> ");}return body_0;})();