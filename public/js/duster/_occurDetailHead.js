(function(){dust.register("_occurDetailHead",body_0);function body_0(chk,ctx){return chk.write("<table width=\"100%\" class=\"table table-hover table-condensed table-striped display\"cellspacing=\"0\" cellpadding=\"0\"><thead><tr occurSystem=\"").reference(ctx.get(["occurSystem"], false),ctx,"h").write("\" occurModel=\"").reference(ctx.get(["occurModel"], false),ctx,"h").write("\"><th>索赔号码:<span>").reference(ctx.get(["claimCodeName"], false),ctx,"h").write("</span></th><th>故障代码:<span>").reference(ctx.get(["occurCode"], false),ctx,"h").write("</span></th><th>故障零件:<span>").reference(ctx.get(["occurSystemName"], false),ctx,"h").write("-").reference(ctx.get(["occurModelName"], false),ctx,"h").write("</span></th><th><button class=\"btn-default\" onclick=\"editOccur('").reference(ctx.get(["claimCode"], false),ctx,"h").write("');\">编辑</button>&nbsp;&nbsp;<button class=\"btn-default\" onclick=\"deleteOccur('").reference(ctx.get(["claimCode"], false),ctx,"h").write("');\">删除</button></th></tr></thead></table>");}return body_0;})();