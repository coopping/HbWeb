(function(){dust.register("brandForm",body_0);function body_0(chk,ctx){return chk.write("<form  method=\"post\" id=\"brandForm\"  role=\"form\"><input type=\"hidden\" name=\"_csrf\" value=\"").reference(ctx.get("_csrf"),ctx,"h").write("\" /><div class=\"form-group\"><label for=\"postTitle\" class=\"control-label\">品牌<span class=\"required-indicator\">*</span></label><input type=\"text\" name=\"brand[value]\" class=\"form-control\" id=\"brandValue\" value=\"").reference(ctx.getPath(false,["brand","value"]),ctx,"h").write("\" required></div><div class=\"form-group\"><label for=\"postTitle\" class=\"control-label\">英文缩写<span class=\"required-indicator\">*</span></label><input type=\"text\" name=\"brand[key]\" class=\"form-control\" id=\"brandKey\" value=\"").reference(ctx.getPath(false,["brand","key"]),ctx,"h").write("\" required></div></form>");}return body_0;})();