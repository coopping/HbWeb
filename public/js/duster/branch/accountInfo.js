(function(){dust.register("accountInfo",body_0);function body_0(chk,ctx){return chk.write("<div class=\"form-group\"><div class=\"col-sm-12\"><ul class=\"nav nav-tabs\" id=\"accoutInfoTab\"><li class=\"active\"><a href=\"#accoutInfo\" data-toggle=\"tab\" >收款帐号信息</a></li></ul></div></div><div class=\"form-group\"><div class=\"col-sm-12 tab-content\"><div class=\"tab-pane active\" id=\"accoutInfo\"><div class=\"form-group\"><label class=\"control-label col-sm-1\">银行卡折类型<span class=\"required-indicator\">*</span></label><div class=\"col-sm-2\"><select name=\"cardType\" class=\"form-control\" required></select></div><label class=\"control-label col-sm-1\">对公对私<span class=\"required-indicator\">*</span></label><div class=\"col-sm-2\"><select name=\"bankPayType\" class=\"form-control\" required></select></div><label class=\"control-label col-sm-1\">银行帐号<span class=\"required-indicator\">*</span></label><div class=\"col-sm-2\"><input type=\"text\" name=\"accountNo\" value=\"").reference(ctx.getPath(false, ["accountInfo","accountNo"]),ctx,"h").write("\" maxlength=\"30\" required class=\"form-control\"/></div><label class=\"control-label col-sm-1\">账户名称<span class=\"required-indicator\">*</span></label><div class=\"col-sm-2\"><input type=\"text\" name=\"payeeBankAccountName\" value=\"").reference(ctx.getPath(false, ["accountInfo","payeeBankAccountName"]),ctx,"h").write("\" required maxlength=\"30\" class=\"form-control\"/></div></div><div class=\"form-group\"><label class=\"control-label col-sm-1\">收款方银行<span class=\"required-indicator\">*</span></label><input type=\"hidden\" name=\"payeeBankCode\" value=\"").reference(ctx.getPath(false, ["accountInfo","payeeBankCode"]),ctx,"h").write("\"/><div class=\"col-sm-2\"><div class=\"input-group\"><input type=\"text\" name=\"bankBranchName\" value=\"").reference(ctx.getPath(false, ["accountInfo","bankBranchName"]),ctx,"h").write("\" required class=\"form-control\" readonly/><span class=\"input-group-btn\"><button type=\"button\" class=\"btn btn-default\" data-toggle=\"modal\" data-target=\"#chooseBankModal\">选择银行</button></span></div></div><label class=\"control-label col-sm-1\">收款方联行<span class=\"required-indicator\">*</span></label><input type=\"hidden\" name=\"payeeRelateCode\" value=\"").reference(ctx.getPath(false, ["accountInfo","payeeRelateCode"]),ctx,"h").write("\" /><input type=\"hidden\" name=\"payeeBankCityCode\" value=\"").reference(ctx.getPath(false, ["accountInfo","payeeBankCityCode"]),ctx,"h").write("\" /><input type=\"hidden\" name=\"payeeBankCityName\" value=\"").reference(ctx.getPath(false, ["accountInfo","payeeBankCityName"]),ctx,"h").write("\" /><div class=\"col-sm-4\"><div class=\"input-group\"><input type=\"text\" name=\"payeeBankName\" value=\"").reference(ctx.getPath(false, ["accountInfo","payeeBankName"]),ctx,"h").write("\"  required class=\"form-control\" readonly/><span class=\"input-group-btn\"><button type=\"button\" class=\"btn btn-default\" id=\"chooseRelateBankModalBtn\">选择开户联行</button></span></div></div><label class=\"control-label col-sm-1\">联系人电话<span class=\"required-indicator\">*</span></label><div class=\"col-sm-3\"><input type=\"text\" name=\"payeeMobile\" isTel=\"true\" number=\"true\" value=\"").reference(ctx.getPath(false, ["accountInfo","payeeMobile"]),ctx,"h").write("\" required class=\"form-control\"/></div></div></div></div></div><script type=\"text/javascript\" src=\"/js/policy/policy.bank.js\"></script>");}return body_0;})();